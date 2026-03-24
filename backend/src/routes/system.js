const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/system/settings
router.get('/settings', async (req, res) => {
    try {
        let setting = await prisma.systemSetting.findUnique({ where: { id: "GLOBAL" } });
        if (!setting) {
            // Create default
            setting = await prisma.systemSetting.create({
                data: {
                    id: "GLOBAL",
                    data: {
                        activeSemester: "Year 3 - Semester 1",
                        maxGroupSize: 6,
                        requireManagerApproval: true
                    }
                }
            });
        }
        res.status(200).json({ success: true, settings: setting.data });
    } catch (error) {
        console.error("Fetch Settings Error:", error);
        res.status(500).json({ success: false, message: 'Server error parsing settings' });
    }
});

// PUT /api/system/settings
router.put('/settings', async (req, res) => {
    try {
        const { activeSemester, maxGroupSize, requireManagerApproval } = req.body;
        
        let setting = await prisma.systemSetting.findUnique({ where: { id: "GLOBAL" } });
        if (!setting) {
             setting = await prisma.systemSetting.create({
                 data: {
                     id: "GLOBAL",
                     data: { activeSemester, maxGroupSize, requireManagerApproval }
                 }
             });
        } else {
             setting = await prisma.systemSetting.update({
                 where: { id: "GLOBAL" },
                 data: {
                     data: { activeSemester, maxGroupSize, requireManagerApproval }
                 }
             });
        }

        res.status(200).json({ success: true, settings: setting.data });
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating settings' });
    }
});

module.exports = router;
