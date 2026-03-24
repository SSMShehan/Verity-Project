const prisma = require('../config/prisma');
const { findMemberForCommit, extractGithubLogin, buildGitByUserMap } = require('../lib/githubUserMatch');

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function relTime(date) {
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    const w = Math.floor(days / 7);
    return w === 1 ? '1 week ago' : `${w} weeks ago`;
}

function scoreColor(score) {
    if (score >= 70) return { key: 'emerald', color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'bg-emerald-500' };
    if (score >= 50) return { key: 'amber', color: 'text-amber-600', bg: 'bg-amber-100', bar: 'bg-amber-500' };
    return { key: 'red', color: 'text-red-600', bg: 'bg-red-100', bar: 'bg-red-500' };
}

function pickMilestone(project, tasks, sprints) {
    const now = new Date();
    let label = 'upcoming milestones';
    let deadline = project.endDate ? new Date(project.endDate) : null;

    const futureTasks = tasks
        .filter((t) => t.deadline && new Date(t.deadline) > now)
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    if (futureTasks[0]?.deadline) {
        deadline = new Date(futureTasks[0].deadline);
        label = `"${futureTasks[0].title}"`;
    }

    const futureSprint = sprints
        .filter((s) => new Date(s.endDate) > now)
        .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())[0];
    if (futureSprint && (!deadline || new Date(futureSprint.endDate) < deadline)) {
        deadline = new Date(futureSprint.endDate);
        label = `"${futureSprint.name}"`;
    }

    if (project.endDate && !futureTasks[0] && !futureSprint) {
        label = 'project deadline';
    }

    return { label, deadline };
}

function progressVsPlan(tasks) {
    const total = tasks.length;
    if (total === 0) return 55;
    const done = tasks.filter((t) => String(t.status).toLowerCase() === 'done').length;
    const now = Date.now();
    const overdue = tasks.filter(
        (t) =>
            t.deadline &&
            new Date(t.deadline).getTime() < now &&
            String(t.status).toLowerCase() !== 'done'
    ).length;
    const base = (done / total) * 100;
    const pen = Math.min(40, overdue * 12);
    return clamp(Math.round(base - pen), 0, 100);
}

function collaborationScore(memberUsers, tasks) {
    const doneByAssignee = new Map();
    memberUsers.forEach((u) => doneByAssignee.set(u.userId, 0));
    let totalDone = 0;
    for (const t of tasks) {
        if (String(t.status).toLowerCase() !== 'done' || !t.assigneeId) continue;
        if (!doneByAssignee.has(t.assigneeId)) continue;
        doneByAssignee.set(t.assigneeId, doneByAssignee.get(t.assigneeId) + 1);
        totalDone += 1;
    }
    if (totalDone === 0) {
        const assigned = new Map();
        memberUsers.forEach((u) => assigned.set(u.userId, 0));
        let ta = 0;
        for (const t of tasks) {
            if (!t.assigneeId || !assigned.has(t.assigneeId)) continue;
            assigned.set(t.assigneeId, assigned.get(t.assigneeId) + 1);
            ta += 1;
        }
        if (ta === 0) return 60;
        let hhi = 0;
        for (const n of assigned.values()) {
            const p = n / ta;
            hhi += p * p;
        }
        return clamp(Math.round(100 * (1 - hhi)), 0, 100);
    }
    let hhi = 0;
    for (const n of doneByAssignee.values()) {
        if (n === 0) continue;
        const p = n / totalDone;
        hhi += p * p;
    }
    return clamp(Math.round(100 * (1 - hhi)), 0, 100);
}

function consistencyScore(tasks, commitsByDay, reports, memberCount) {
    const thirtyAgo = Date.now() - 30 * 86400000;
    const daysWithCommit = new Set(
        commitsByDay.filter((d) => d >= thirtyAgo).map((d) => Math.floor(d / 86400000))
    ).size;
    const commitSpread = clamp(Math.round((daysWithCommit / 30) * 100), 0, 100);

    const uniqueSubmitters = new Set(reports.map((r) => r.submittedBy)).size;
    const reportParticipation =
        memberCount <= 0 || reports.length === 0
            ? 55
            : clamp(Math.round((uniqueSubmitters / memberCount) * 100), 0, 100);

    const last7 = commitsByDay.filter((d) => d >= Date.now() - 7 * 86400000);
    if (last7.length >= 5) {
        const byDay = new Map();
        for (const d of last7) {
            const k = Math.floor(d / 86400000);
            byDay.set(k, (byDay.get(k) || 0) + 1);
        }
        const maxShare = Math.max(...byDay.values()) / last7.length;
        const burstPenalty = maxShare > 0.65 ? 25 : 0;
        return clamp(Math.round(commitSpread * 0.45 + reportParticipation * 0.35 + (100 - burstPenalty) * 0.2), 0, 100);
    }

    const overdue = tasks.filter(
        (t) =>
            t.deadline &&
            new Date(t.deadline).getTime() < Date.now() &&
            String(t.status).toLowerCase() !== 'done'
    ).length;
    const steadiness = clamp(80 - overdue * 10, 20, 100);
    return clamp(Math.round(commitSpread * 0.4 + steadiness * 0.35 + reportParticipation * 0.25), 0, 100);
}

function codeActivityScore(commitDates) {
    if (!commitDates.length) return 38;
    const now = Date.now();
    const r14 = commitDates.filter((d) => d >= now - 14 * 86400000).length;
    const p14 = commitDates.filter(
        (d) => d >= now - 28 * 86400000 && d < now - 14 * 86400000
    ).length;
    if (r14 === 0 && p14 === 0) return 35;
    if (p14 === 0) return clamp(55 + r14 * 3, 0, 100);
    const ratio = r14 / p14;
    const momentum = clamp(Math.round(Math.min(100, ratio * 45 + Math.min(40, r14 * 4))), 0, 100);
    return momentum;
}

async function loadOverviewData(projectId) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { members: { include: { user: true } } }
    });
    if (!project) return null;

    const memberUsers = project.members
        .filter((m) => m.user)
        .map((m) => ({
            userId: m.user.id,
            name: m.user.name,
            email: (m.user.email || '').toLowerCase(),
            role: m.role,
            githubLogin: extractGithubLogin(m.user.github)
        }));

    const [tasks, sprints, githubRepo, reports, doneLogs] = await Promise.all([
        prisma.task.findMany({ where: { projectId } }),
        prisma.sprint.findMany({ where: { projectId }, orderBy: { endDate: 'desc' } }),
        prisma.githubRepo.findUnique({
            where: { projectId },
            select: {
                owner: true,
                repoName: true,
                commits: { select: { authorEmail: true, authorName: true, message: true, date: true } }
            }
        }),
        prisma.weeklyReport.findMany({
            where: { projectId },
            select: { submittedBy: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.taskStatusLog.findMany({
            where: {
                task: { projectId },
                newStatus: { equals: 'Done', mode: 'insensitive' }
            },
            include: { task: true },
            orderBy: { createdAt: 'asc' }
        })
    ]);

    const { gitByUser } = await buildGitByUserMap(memberUsers, githubRepo);
    const commitTimestamps = (githubRepo?.commits || []).map((c) => new Date(c.date).getTime());

    return {
        project,
        memberUsers,
        tasks,
        sprints,
        githubRepo,
        reports,
        doneLogs,
        gitByUser,
        commitTimestamps
    };
}

function detectTaskInflation(doneLogs, memberUsers) {
    const anomalies = [];
    const uuidLike = (s) => /^[0-9a-f-]{36}$/i.test(String(s || ''));
    const logs = doneLogs.map((l) => ({
        at: new Date(l.createdAt).getTime(),
        userId: uuidLike(l.changedBy) ? l.changedBy : l.task.assigneeId,
        taskId: l.taskId,
        priority: l.task.priority
    }));

    const byUser = new Map();
    for (const l of logs) {
        if (!l.userId) continue;
        if (!byUser.has(l.userId)) byUser.set(l.userId, []);
        byUser.get(l.userId).push(l);
    }

    for (const [uid, arr] of byUser.entries()) {
        if (arr.length < 3) continue;
        arr.sort((a, b) => a.at - b.at);
        let j = 0;
        let maxIn15 = 0;
        const WINDOW = 15 * 60 * 1000;
        for (let i = 0; i < arr.length; i++) {
            while (arr[j].at < arr[i].at - WINDOW) j += 1;
            maxIn15 = Math.max(maxIn15, i - j + 1);
        }
        const highBurst = arr.filter((x) => String(x.priority).toLowerCase() === 'high');
        let maxHigh = 0;
        if (highBurst.length >= 2) {
            j = 0;
            for (let i = 0; i < highBurst.length; i++) {
                while (highBurst[j].at < highBurst[i].at - WINDOW) j += 1;
                maxHigh = Math.max(maxHigh, i - j + 1);
            }
        }
        const threshold = maxHigh >= 3 ? 3 : 5;
        if (maxIn15 >= threshold) {
            const u = memberUsers.find((m) => m.userId === uid);
            const latest = arr[arr.length - 1].at;
            anomalies.push({
                severity: maxIn15 >= 8 || maxHigh >= 4 ? 'high' : 'medium',
                memberName: u ? u.name : 'A student',
                timestamp: new Date(latest),
                title: 'Task Inflation Detected',
                description: `${u ? u.name : 'A student'} closed ${maxIn15} tasks within 15 minutes${
                    maxHigh >= 3 ? ' (including high-priority items)' : ''
                }, which deviates from typical pacing. Review whether work was meaningfully completed.`
            });
        }
    }
    return anomalies;
}

function detectLastMinuteCommits(githubRepo, memberUsers, project, tasks) {
    if (!githubRepo?.commits?.length) return null;

    const now = Date.now();
    const deadlines = [
        project.endDate ? new Date(project.endDate).getTime() : null,
        ...tasks.map((t) => (t.deadline ? new Date(t.deadline).getTime() : null))
    ].filter(Boolean);

    const pastDeadlines = deadlines.filter((d) => d <= now && d >= now - 21 * 86400000).sort((a, b) => b - a);
    const ref = pastDeadlines[0] || deadlines.filter((d) => d > now).sort((a, b) => a - b)[0];
    if (!ref) return null;

    const windowStart = ref - 4 * 3600000;
    const windowCommits = githubRepo.commits.filter((c) => {
        const t = new Date(c.date).getTime();
        return t >= windowStart && t <= ref;
    });
    const weekBefore = githubRepo.commits.filter((c) => {
        const t = new Date(c.date).getTime();
        return t >= ref - 7 * 86400000 && t <= ref;
    });
    if (weekBefore.length < 4) return null;
    const shareInWindow = windowCommits.length / weekBefore.length;
    if (shareInWindow < 0.35) return null;

    const byAuthor = new Map();
    for (const c of windowCommits) {
        const key = `${c.authorEmail}|${c.authorName}`;
        byAuthor.set(key, (byAuthor.get(key) || 0) + 1);
    }
    let top = 0;
    for (const n of byAuthor.values()) top = Math.max(top, n);
    if (top / windowCommits.length < 0.65) return null;

    const topCommit = windowCommits.find((c) => {
        const k = `${c.authorEmail}|${c.authorName}`;
        return byAuthor.get(k) === top;
    });
    const m = topCommit ? findMemberForCommit(topCommit.authorEmail, topCommit.authorName, memberUsers) : null;

    const peakTs = Math.max(...windowCommits.map((c) => new Date(c.date).getTime()));
    return {
        severity: 'medium',
        dominantMember: m,
        timestamp: new Date(peakTs || ref),
        title: 'Last-Minute Activity Spike',
        description: `${Math.round(
            (windowCommits.length / weekBefore.length) * 100
        )}% of GitHub commits in the final days before a milestone were pushed in the last 4 hours${
            m ? `, heavily from ${m.name}` : ''
        }. Consider encouraging steady integration.`
    };
}

function buildGuidance(anomalies, memberUsers, gitByUser, milestoneLabel) {
    const g = [];
    const infl = anomalies.find((a) => a.title === 'Task Inflation Detected');
    if (infl) {
        const who = infl.memberName || 'the student';
        g.push({
            title: 'Schedule an intervention meeting',
            recommendationText: `Discuss rapid task completions with ${who} to ensure deep understanding of the work submitted.`
        });
    }

    let minGit = { id: null, n: Infinity };
    for (const u of memberUsers) {
        const n = gitByUser.get(u.userId) || 0;
        if (n < minGit.n) minGit = { id: u.userId, n, name: u.name };
    }
    let maxGit = { id: null, n: -1 };
    for (const u of memberUsers) {
        const n = gitByUser.get(u.userId) || 0;
        if (n > maxGit.n) maxGit = { id: u.userId, n, name: u.name };
    }
    if (maxGit.n > 2 && minGit.n === 0 && maxGit.id !== minGit.id) {
        g.push({
            title: 'Redistribute upcoming workload',
            recommendationText: `Code activity from ${minGit.name} is very low compared with ${maxGit.name}. Consider rebalancing tasks so everyone pushes regularly.`
        });
    }

    const spike = anomalies.find((a) => a.title === 'Last-Minute Activity Spike');
    if (spike) {
        g.push({
            title: 'Require staggered commits',
            recommendationText:
                'Agree as a team to integrate at least every 48 hours so reviews are not flooded at the deadline.'
        });
    }

    if (g.length === 0) {
        g.push({
            title: 'Keep monitoring',
            recommendationText: `Continue tracking fairness and GitHub sync for ${milestoneLabel}. No critical rule-based anomalies fired today.`
        });
    }

    return g.slice(0, 5);
}

function healthFromMetrics(metrics, anomalies) {
    const avg = metrics.reduce((s, m) => s + m.value, 0) / metrics.length;
    const hasHigh = anomalies.some((a) => a.severity === 'high');
    if (hasHigh || avg < 52 || metrics.some((m) => m.value < 38)) {
        return { status: 'At Risk', border: 'border-l-amber-500', badge: 'text-amber-600', banner: 'from-amber-50' };
    }
    if (avg < 68 || metrics.some((m) => m.value < 50) || anomalies.length) {
        return { status: 'Warning', border: 'border-l-amber-400', badge: 'text-amber-600', banner: 'from-amber-50' };
    }
    return { status: 'Healthy', border: 'border-l-emerald-500', badge: 'text-emerald-600', banner: 'from-emerald-50' };
}

function buildSummary(health, milestone, metrics, anomalies) {
    const worst = [...metrics].sort((a, b) => a.value - b.value)[0];
    const parts = [];
    if (health.status === 'Healthy') {
        return `The Project Intelligence Engine (PIE) sees balanced signals for ${milestone.label}. ${worst.label} is the lowest dimension at ${worst.value}/100 — still within an acceptable range.`;
    }
    if (worst.key === 'codeActivity') {
        parts.push('GitHub commit cadence has weakened compared with prior weeks');
    } else if (worst.key === 'consistency') {
        parts.push('work pacing looks uneven (commits or reporting bunched toward deadlines)');
    } else if (worst.key === 'collaboration') {
        parts.push('task completion is concentrated in a subset of members');
    } else {
        parts.push('progress is behind plan or has overdue work');
    }
    if (anomalies.length) {
        parts.push('see detected anomalies for specifics');
    }
    return `The Project Intelligence Engine (PIE) flags ${health.status.toLowerCase()} indicators for ${milestone.label}: ${parts.join(
        ', '
    )}.`;
}

/**
 * @param {string} projectId
 */
async function getIntelligenceOverview(projectId) {
    const data = await loadOverviewData(projectId);
    if (!data) return null;

    const { project, memberUsers, tasks, sprints, githubRepo, reports, doneLogs, gitByUser } = data;
    const commitTimes = (githubRepo?.commits || []).map((c) => new Date(c.date).getTime());

    const mProg = progressVsPlan(tasks);
    const mCollab = collaborationScore(memberUsers, tasks);
    const mCons = consistencyScore(tasks, commitTimes, reports, memberUsers.length);
    const mCode = codeActivityScore(commitTimes);

    const metricDefs = [
        { key: 'progressPlan', label: 'Progress vs Plan', value: mProg, icon: 'Target' },
        { key: 'collaboration', label: 'Collaboration', value: mCollab, icon: 'Users' },
        { key: 'consistency', label: 'Consistency', value: mCons, icon: 'Clock' },
        { key: 'codeActivity', label: 'Code Activity', value: mCode, icon: 'Activity' }
    ];

    const metrics = metricDefs.map((m) => {
        const st = scoreColor(m.value);
        return {
            key: m.key,
            label: m.label,
            value: m.value,
            icon: m.icon,
            statusColor: st.key,
            ...st
        };
    });

    const milestone = pickMilestone(project, tasks, sprints);

    const anomalies = [];
    for (const a of detectTaskInflation(doneLogs, memberUsers)) {
        anomalies.push({
            severity: a.severity,
            severityLabel: a.severity === 'high' ? 'High Severity' : 'Warning',
            memberName: a.memberName,
            timestamp: a.timestamp.toISOString(),
            timeLabel: relTime(a.timestamp),
            title: a.title,
            description: a.description
        });
    }
    const lm = detectLastMinuteCommits(githubRepo, memberUsers, project, tasks);
    if (lm) {
        anomalies.push({
            severity: lm.severity,
            severityLabel: 'Warning',
            memberName: lm.dominantMember?.name,
            timestamp: lm.timestamp.toISOString(),
            timeLabel: relTime(lm.timestamp),
            title: lm.title,
            description: lm.description
        });
    }

    anomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const gitMap = new Map();
    for (const u of memberUsers) gitMap.set(u.userId, gitByUser.get(u.userId) || 0);

    const guidance = buildGuidance(anomalies, memberUsers, gitMap, milestone.label);
    const health = healthFromMetrics(metrics, anomalies);
    const summary = buildSummary(health, milestone, metrics, anomalies);

    return {
        project: {
            id: project.id,
            title: project.title
        },
        health: {
            status: health.status,
            summary,
            targetMilestone: milestone.label,
            borderClass: health.border,
            badgeClass: health.badge,
            bannerGradient: health.banner
        },
        metrics,
        anomalies,
        guidance
    };
}

module.exports = { getIntelligenceOverview };
