const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// POST /api/project/create
router.post('/create', async (req, res) => {
    try {
        const { module, title, members, abstract } = req.body;
        
        // 1. Resolve users from the provided IT numbers
        // The submitted members are IT numbers like ['IT21012345', 'IT21056789']
        // We also need to map the current logged-in user as the LEADER. For this endpoint without auth middleware yet, we'll assume the request has a 'leaderIndex' or we just pick the first member as leader.
        // Wait, the frontend doesn't send the leader's ID. Let's just create the members.
        
        const allMemberIndexes = [...(members || [])];
        // We'll optionally find these users in the DB. If they don't exist, we'll create placeholders so the relation works.
        const resolvedUsers = [];
        for (const indexNum of allMemberIndexes) {
            let user = await prisma.user.findUnique({ where: { indexNumber: indexNum } });
            if (!user) {
                // Create a dummy user for the demo
                user = await prisma.user.create({
                    data: {
                        name: `Student ${indexNum}`,
                        email: `${indexNum.toLowerCase()}@my.sliit.lk`,
                        password: 'hashed_dummy_password', // Mock
                        indexNumber: indexNum,
                        role: 'STUDENT'
                    }
                });
            }
            resolvedUsers.push(user);
        }

        // Check system settings for approval requirement
        const setting = await prisma.systemSetting.findUnique({ where: { id: "GLOBAL" } });
        const requireApproval = setting?.data?.requireManagerApproval !== false; // defaults to true if not set
        const initialStatus = requireApproval ? 'Pending' : 'Active';

        // 2. Create the Project
        const newProject = await prisma.project.create({
            data: {
                title: title,
                description: `[${module}] ${abstract}`,
                startDate: new Date(),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // +90 days
                status: initialStatus,
                members: {
                    create: resolvedUsers.map((u, idx) => ({
                        userId: u.id,
                        role: idx === 0 ? 'LEADER' : 'MEMBER' // Make the first one we process the leader
                    }))
                }
            },
            include: {
                members: {
                    include: { user: true }
                }
            }
        });

        res.status(201).json({ success: true, project: newProject });
    } catch (error) {
        console.error("Project Create Error:", error);
        res.status(500).json({ success: false, message: 'Server error creating project', error: error.message });
    }
});

// GET /api/project/list
router.get('/list', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                members: {
                    include: { user: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error("Project List Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching projects' });
    }
});

// MANAGER: GET /api/project/manager/groups (List all groups)
// Include approvals ("Pending") or "Active", etc.
router.get('/manager/groups', async (req, res) => {
    try {
        const groups = await prisma.project.findMany({
            include: {
                members: { include: { user: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format for frontend mapping
        const formattedGroups = groups.map(group => {
            const leader = group.members.find(m => m.role === 'LEADER')?.user;
            const moduleName = group.description.match(/\[(.*?)\]/)?.[1] || 'Unknown Module';
            return {
                id: group.id,
                title: group.title,
                module: moduleName,
                leader: leader ? `${leader.indexNumber || leader.id} (${leader.name})` : 'No Leader',
                leaderObj: leader,
                membersCount: group.members.length,
                members: group.members.map(m => ({ 
                    id: m.userId, 
                    name: m.user.name, 
                    indexNumber: m.user.indexNumber || m.user.email, 
                    role: m.role 
                })),
                status: group.status, // Active, Pending, Flagged, Rejected
                createdAt: group.createdAt
            };
        });

        res.status(200).json({ success: true, groups: formattedGroups });
    } catch (error) {
        console.error("Manager Group List Error:", error);
        res.status(500).json({ success: false, message: 'Server error retrieving groups' });
    }
});

// MANAGER: DELETE /api/project/manager/groups/:id (Delete Group)
router.delete('/manager/groups/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.project.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Group permanently wiped.' });
    } catch (error) {
        console.error("Manager Group Delete Error:", error);
        res.status(500).json({ success: false, message: 'Server error deleting group' });
    }
});

// MANAGER: PUT /api/project/manager/approvals/:id (Approve/Reject)
router.put('/manager/approvals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Approved' ('Active') or 'Rejected'

        const dbStatus = status === 'Approved' ? 'Active' : 'Rejected';

        const updatedProject = await prisma.project.update({
            where: { id },
            data: { status: dbStatus }
        });

        res.status(200).json({ success: true, project: updatedProject });
    } catch (error) {
        console.error("Manager Approval Update Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating approval' });
    }
});

// MANAGER: PUT /api/project/manager/groups/:id (Edit Group)
router.put('/manager/groups/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, addMembers, removeMembers } = req.body;

        await prisma.$transaction(async (tx) => {
            if (title) {
                await tx.project.update({ where: { id }, data: { title } });
            }

            if (removeMembers && removeMembers.length > 0) {
                await tx.projectMember.deleteMany({
                    where: {
                        projectId: id,
                        userId: { in: removeMembers }
                    }
                });
            }

            if (addMembers && addMembers.length > 0) {
                const membersToCreate = addMembers.map(userId => ({
                    projectId: id,
                    userId,
                    role: 'MEMBER'
                }));
                await tx.projectMember.createMany({
                    data: membersToCreate,
                    skipDuplicates: true
                });
            }
        });

        res.status(200).json({ success: true, message: 'Group updated successfully.' });
    } catch (error) {
        console.error("Manager Group Update Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating group' });
    }
});

module.exports = router;
