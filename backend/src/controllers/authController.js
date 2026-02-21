const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// Register Student
exports.registerStudent = async (req, res) => {
    try {
        const { name, email, password, indexNumber, semesterId } = req.body;

        // Check if user exists
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { indexNumber }]
            }
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with email or index number already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User and Semester Registration in a transaction
        const user = await prisma.$transaction(async (prisma) => {
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    indexNumber,
                    role: 'STUDENT',
                },
            });

            if (semesterId) {
                await prisma.studentSemesterRegistration.create({
                    data: {
                        studentId: newUser.id,
                        semesterId,
                    }
                });
            }

            return newUser;
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during student registration', error: error.message });
    }
};

// Register Lecturer
exports.registerLecturer = async (req, res) => {
    try {
        const { name, email, password, moduleIds } = req.body;

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.$transaction(async (prisma) => {
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'LECTURER',
                },
            });

            if (moduleIds && moduleIds.length > 0) {
                const registrations = moduleIds.map(moduleId => ({
                    lecturerId: newUser.id,
                    moduleId
                }));
                await prisma.lecturerModuleRegistration.createMany({
                    data: registrations
                });
            }

            return newUser;
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during lecturer registration', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// Get Current User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                indexNumber: true,
                studentRegistrations: {
                    include: {
                        semester: {
                            include: {
                                modules: true,
                                year: true
                            }
                        }
                    }
                },
                lecturerModules: {
                    include: {
                        module: {
                            include: {
                                semester: {
                                    include: {
                                        year: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
};
