const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const getHeaders = () => {
    const headers = { 
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Verity-Integration-Node'
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
};

// Extractor helper to get username from "https://github.com/username"
const extractUsername = (githubUrl) => {
    if (!githubUrl) return null;
    try {
        const url = new URL(githubUrl);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        return pathSegments[0] || null; // e.g. /octocat -> octocat
    } catch {
        // If it's a raw string like "octocat", just return it
        return githubUrl.replace(/^@/, '');
    }
};

// POST /api/github/link
router.post('/link', async (req, res) => {
    try {
        console.log("POST /api/github/link Body:", req.body);
        let { projectId, owner, repoName, url } = req.body;

        // Trim 
        projectId = projectId?.trim();
        owner = owner?.trim();
        repoName = repoName?.trim();
        url = url?.trim();

        if (!projectId || !owner || !repoName) {
            return res.status(400).json({ success: false, message: 'projectId, owner, and repoName are required (ensure they are not empty spaces)' });
        }

        try {
            await axios.get(`https://api.github.com/repos/${owner}/${repoName}`, { headers: getHeaders() });
        } catch (e) {
            console.error('GitHub API Verification Error:', e.message, e.response?.data);
            return res.status(404).json({ success: false, message: `Repository not found or API Limit Reached: ${e.message}` });
        }

        const existing = await prisma.githubRepo.findFirst({ where: { projectId } });
        let repo;
        if (existing) {
            repo = await prisma.githubRepo.update({
                where: { id: existing.id },
                data: { owner, repoName, url: url || `https://github.com/${owner}/${repoName}` }
            });
        } else {
            repo = await prisma.githubRepo.create({
                data: {
                    projectId,
                    owner,
                    repoName,
                    url: url || `https://github.com/${owner}/${repoName}`
                }
            });
        }

        res.status(200).json({ success: true, repo });
    } catch (error) {
        console.error("Github Link Error:", error);
        res.status(500).json({ success: false, message: 'Server error linking repo', error: error.message });
    }
});

// POST /api/github/sync/:projectId
router.post('/sync/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const repo = await prisma.githubRepo.findFirst({ where: { projectId } });

        if (!repo) {
            return res.status(404).json({ success: false, message: 'No GitHub repository linked to this project' });
        }

        const { owner, repoName, id: githubRepoId } = repo;
        const headers = getHeaders();

        // 1. Fetch Branches
        let branches = [];
        try {
            const branchRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/branches`, { headers });
            branches = branchRes.data.map(b => b.name);
        } catch (e) {
            console.error("Failed to fetch branches:", e.message);
        }

        // 2. Fetch Commits from all branches
        const uniqueCommits = new Map();
        let targetBranches = branches.length > 0 ? branches : ['main'];
        
        for (const branch of targetBranches) {
            try {
                const commitsRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/commits`, {
                    headers,
                    params: { sha: branch, per_page: 50 }
                });
                
                commitsRes.data.forEach(c => {
                    uniqueCommits.set(c.sha, {
                        hash: c.sha,
                        authorName: c.commit.author.name || 'Unknown',
                        authorEmail: c.commit.author.email || 'unknown@none.com',
                        message: c.commit.message,
                        date: new Date(c.commit.author.date),
                        branch // mark which branch it was fetched from first
                    });
                });
            } catch (e) {
                console.error(`Failed to fetch commits for branch ${branch}:`, e.message);
            }
        }

        // 3. Save unique commits to Database
        let additionsCount = 0;
        const commitsArray = Array.from(uniqueCommits.values());
        for (const c of commitsArray) {
            try {
                await prisma.githubCommit.upsert({
                    where: { commitHash: c.hash },
                    update: {},
                    create: {
                        githubRepoId,
                        commitHash: c.hash,
                        authorName: c.authorName,
                        authorEmail: c.authorEmail,
                        message: c.message,
                        date: c.date
                    }
                });
                additionsCount++;
            } catch (err) {
                // Ignore unique constraint collisions if they happen concurrently
            }
        }

        // We no longer strictly need to save contributor stats to the DB right here 
        // because we can fetch it live in GET /repo for total accuracy, but caching is better.
        // Actually, for simplicity and perfect accuracy, let's keep GET /repo doing the calculation.

        res.status(200).json({ 
            success: true, 
            message: 'Synced successfully', 
            syncedCommits: additionsCount,
            branchesFetched: targetBranches.length 
        });

    } catch (error) {
        console.error("Github Sync Error:", error);
        res.status(500).json({ success: false, message: 'Server error syncing repo', error: error.message });
    }
});

// GET /api/github/repo/:projectId
router.get('/repo/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const repo = await prisma.githubRepo.findFirst({ where: { projectId } });

        if (!repo) {
            return res.status(200).json({ success: true, linked: false });
        }

        // 1. Get recent commits from DB
        const recentCommits = await prisma.githubCommit.findMany({
            where: { githubRepoId: repo.id },
            orderBy: { date: 'desc' },
            take: 50
        });

        // 2. Fetch Project Members and extract their expected GitHub aliases
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { members: { include: { user: true } } }
        });

        const systemUsers = [];
        project?.members.forEach(m => {
            if (m.user) systemUsers.push(m.user);
        });

        // Map system users to their github logins
        const userGithubMap = systemUsers.map(user => {
            return {
                ...user,
                githubLogin: extractUsername(user.github)?.toLowerCase()
            };
        });

        // 3. Fetch Advanced Stats directly from GitHub for 100% accuracy on LOC
        let githubStats = [];
        try {
            const headers = getHeaders();
            let statsRes = await axios.get(`https://api.github.com/repos/${repo.owner}/${repo.repoName}/stats/contributors`, { headers });
            
            // Handle 202 Accepted calculation delay
            if (statsRes.status === 202) {
                await new Promise(r => setTimeout(r, 2000));
                statsRes = await axios.get(`https://api.github.com/repos/${repo.owner}/${repo.repoName}/stats/contributors`, { headers });
            }
            if (Array.isArray(statsRes.data)) {
                githubStats = statsRes.data;
            }
        } catch (e) {
            console.error("Failed to fetch advanced contributor stats:", e.message);
        }

        // 4. Calculate Impacts dynamically matching githubLogin to our Users
        let totalAdditions = 0;
        let totalDeletions = 0;
        let totalCommits = 0;

        const impacts = githubStats.map(stat => {
            const login = stat.author?.login || '';
            let userAdditions = 0;
            let userDeletions = 0;
            let userCommits = stat.total; // pre-calculated total commits

            // Sum up weekly additions/deletions
            stat.weeks.forEach(week => {
                userAdditions += week.a;
                userDeletions += week.d;
            });

            totalAdditions += userAdditions;
            totalDeletions += userDeletions;
            totalCommits += userCommits;

            // Find matching Verity Student
            const matchedUser = userGithubMap.find(u => u.githubLogin === login.toLowerCase());

            return {
                login,
                name: matchedUser ? matchedUser.name : login,
                isMatched: !!matchedUser,
                commits: userCommits,
                additions: userAdditions,
                deletions: userDeletions
            };
        });

        // Calculate dynamic percentages and colors
        const finalImpacts = impacts.map(imp => {
            const percentage = totalCommits > 0 ? Math.round((imp.commits / totalCommits) * 100) : 0;
            return {
                ...imp,
                percentage
            };
        }).sort((a, b) => b.commits - a.commits);

        // 5. Enhance Commits with branch info and match them to students
        const enhancedCommits = recentCommits.map(commit => {
            // Find the student by email if possible (as fallback) or if they matched login upstream
            return {
                ...commit
            };
        });

        res.status(200).json({
            success: true,
            linked: true,
            repo: {
                owner: repo.owner,
                repoName: repo.repoName,
                url: repo.url
            },
            totalCommitsCount: totalCommits,
            totalAdditions,
            totalDeletions,
            commits: enhancedCommits,
            impacts: finalImpacts
        });

    } catch (error) {
        console.error("Github Repo Info Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching repo details' });
    }
});

module.exports = router;
