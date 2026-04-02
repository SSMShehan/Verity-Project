const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middlewares/authMiddleware');

const prisma = new PrismaClient();

// POST /api/announcement
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, category, targetAudience, projectId } = req.body;
        const authorId = req.user.id;
        
        if (req.user.role === 'STUDENT') {
            return res.status(403).json({ message: 'Students are not allowed to post announcements' });
        }

        const announcement = await prisma.announcement.create({
            data: {
                projectId: projectId || null,
                title,
                content,
                category: category || 'General',
                targetAudience: targetAudience || 'All',
                authorId
            }
        });

        // Fetch back with author details if possible, but schema just stores authorId as String.
        // We'll return the announcement directly.
        res.status(201).json({ success: true, announcement });
    } catch (error) {
        console.error("Announcement Create Error:", error);
        res.status(500).json({ success: false, message: 'Server error creating announcement' });
    }
});

// GET /api/announcement
// Fetch global announcements (or all visible ones)
router.get('/', async (req, res) => {
    try {
        // Fetch all announcements in the system (for the new global feed)
        // In a real app we'd filter by role/permissions, but here we return all
        // to match the dummy content structure.
        const announcements = await prisma.announcement.findMany({
            orderBy: [
              { isPinned: 'desc' },
              { createdAt: 'desc' }
            ]
        });
        
        // Enhance with author data since we only store authorId
        const users = await prisma.user.findMany({
            where: { id: { in: announcements.map(a => a.authorId) } },
            select: { id: true, name: true, role: true }
        });
        
        const enhancedAnnouncements = announcements.map(a => {
             const user = users.find(u => u.id === a.authorId);
             
             // Map database schema fields to frontend expected fields
             return {
                 id: a.id,
                 author: user ? user.name : 'Unknown User',
                 role: user ? (user.role === 'LECTURER' ? 'Lecturer' : user.role === 'MANAGER' ? 'Manager' : 'Student') : 'Student',
                 avatar: user ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U',
                 title: a.title,
                 description: a.content,
                 tag: a.category,
                 module: a.targetAudience,
                 timestamp: new Date(a.createdAt).toLocaleString(),
                 pinned: a.isPinned
             };
        });

        res.status(200).json({ success: true, announcements: enhancedAnnouncements });
    } catch (error) {
        console.error("Announcement Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching announcements' });
    }
});

// GET /api/announcement/:projectId (legacy, kept for backwards compatibility)
router.get('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const announcements = await prisma.announcement.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, announcements });
    } catch (error) {
        console.error("Announcement Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching announcements' });
    }
});

module.exports = router;
