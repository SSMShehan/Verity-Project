const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// POST /api/task/create
router.post('/create', async (req, res) => {
    try {
        const { projectId, title, description, assigneeEmail, priority, deadline } = req.body;

        let assigneeId = null;
        if (assigneeEmail) {
            const user = await prisma.user.findUnique({ where: { email: assigneeEmail } });
            if (user) {
                assigneeId = user.id;
            } else {
                // For MVP, create a dummy user
                const dummy = await prisma.user.create({
                    data: { name: assigneeEmail.split('@')[0], email: assigneeEmail, password: 'dummy_password', role: 'STUDENT' }
                });
                assigneeId = dummy.id;
            }
        }

        const task = await prisma.task.create({
            data: {
                projectId,
                title,
                description,
                assigneeId,
                priority: priority || 'Medium',
                deadline: deadline ? new Date(deadline) : null,
                status: 'To Do'
            },
            include: { assignee: true }
        });

        res.status(201).json({ success: true, task });
    } catch (error) {
        console.error("Task Create Error:", error);
        res.status(500).json({ success: false, message: 'Server error creating task' });
    }
});

// GET /api/task/list/:projectId
router.get('/list/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await prisma.task.findMany({
            where: { projectId },
            include: { assignee: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error("Task Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching tasks' });
    }
});

// PUT /api/task/:taskId/status
router.put('/:taskId/status', async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        
        const task = await prisma.task.update({
            where: { id: taskId },
            data: { status }
        });

        // Optionally, log the status change into TaskStatusLog here.
        
        res.status(200).json({ success: true, task });
    } catch (error) {
        console.error("Task Status Update Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating task status' });
    }
});

// POST /api/task/log-time
router.post('/log-time', async (req, res) => {
    try {
        const { taskId, hours } = req.body;
        // Mocking user ID for now since we don't have login module fully passing JWT
        const defaultUser = await prisma.user.findFirst();
        
        if (!defaultUser) {
           return res.status(400).json({ success: false, message: "No users found" });
        }

        const log = await prisma.timeLog.create({
            data: {
                taskId,
                hours: parseFloat(hours),
                userId: defaultUser.id,
            }
        });

        res.status(201).json({ success: true, log });
    } catch (error) {
        console.error("Time Log Error:", error);
        res.status(500).json({ success: false, message: 'Server error logging time' });
    }
});

module.exports = router;
