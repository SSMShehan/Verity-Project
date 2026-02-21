const prisma = require('../config/prisma');

// Get all Years
exports.getYears = async (req, res) => {
    try {
        const years = await prisma.year.findMany({
            include: {
                semesters: true
            },
            orderBy: { name: 'asc' }
        });
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching years', error: error.message });
    }
};

// Get Semesters by Year ID
exports.getSemestersByYear = async (req, res) => {
    try {
        const { yearId } = req.params;
        const semesters = await prisma.semester.findMany({
            where: { yearId },
            include: {
                modules: true
            },
            orderBy: { name: 'asc' }
        });
        res.json(semesters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching semesters', error: error.message });
    }
};

// Get all Modules (primarily for Lecturer registration)
exports.getAllModules = async (req, res) => {
    try {
        const modules = await prisma.module.findMany({
            include: {
                semester: {
                    include: {
                        year: true
                    }
                }
            },
            orderBy: { code: 'asc' }
        });
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching modules', error: error.message });
    }
};
