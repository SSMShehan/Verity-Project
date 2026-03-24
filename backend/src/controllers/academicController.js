const prisma = require('../config/prisma');

// Get all Years
exports.getYears = async (req, res) => {
    try {
        const years = await prisma.year.findMany({
            include: {
                semesters: {
                    include: {
                        modules: true
                    }
                }
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
        const { lecturerId } = req.query;
        const whereClause = lecturerId ? { lecturers: { some: { id: lecturerId } } } : {};

        const modules = await prisma.module.findMany({
            where: whereClause,
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

// Create a new Module (Manager action)
exports.createModule = async (req, res) => {
    try {
        const { code, name, semesterId } = req.body;
        
        let targetSemesterId = semesterId;
        if (!targetSemesterId) {
            const firstSemester = await prisma.semester.findFirst();
            if (!firstSemester) {
                return res.status(400).json({ success: false, message: 'No semester available to map module to.' });
            }
            targetSemesterId = firstSemester.id;
        }

        const newModule = await prisma.module.create({
            data: { code, name, semesterId: targetSemesterId },
            include: { semester: { include: { year: true } } }
        });
        res.status(201).json({ success: true, module: newModule });
    } catch (error) {
        console.error("Error creating module:", error);
        res.status(500).json({ success: false, message: 'Error creating module', error: error.message });
    }
};

// Get Module Details (with Lecturers and Enrolled Students)
exports.getModuleDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const moduleDetails = await prisma.module.findUnique({
            where: { id },
            include: {
                lecturers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        skills: true
                    }
                },
                semester: {
                    include: {
                        users: {
                            where: { role: 'STUDENT' },
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                indexNumber: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });
        
        if (!moduleDetails) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.json(moduleDetails);
    } catch (error) {
        console.error("Error fetching module details:", error);
        res.status(500).json({ message: 'Error fetching module details', error: error.message });
    }
};
