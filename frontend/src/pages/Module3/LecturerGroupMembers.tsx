import { Mail, CheckCircle, Clock, GitCommit, FileText, Activity, AlertTriangle } from 'lucide-react';

export default function LecturerGroupMembers() {
  const members = [
    {
      id: 'IT21012345',
      name: 'John Doe',
      role: 'Team Leader / Backend Dev',
      email: 'it21012345@my.sliit.lk',
      status: 'Healthy',
      metrics: {
        tasksAssigned: 12,
        tasksCompleted: 10,
        commits: 45,
        prMerges: 12,
        docUploads: 3,
        engagementScore: 92
      },
      recentActivity: 'Merged PR #42 "Auth Service Integration" 2 hours ago.'
    },
    {
      id: 'IT21098765',
      name: 'Alex Smith',
      role: 'Frontend Developer',
      email: 'it21098765@my.sliit.lk',
      status: 'At Risk',
      metrics: {
        tasksAssigned: 15,
        tasksCompleted: 4,
        commits: 8,
        prMerges: 2,
        docUploads: 0,
        engagementScore: 45
      },
      recentActivity: 'Closed task "Build Login UI" 5 days ago.'
    },
    {
      id: 'IT21045678',
      name: 'Maria Garcia',
      role: 'QA / DevOps Engineer',
      email: 'it21045678@my.sliit.lk',
      status: 'Healthy',
      metrics: {
        tasksAssigned: 9,
        tasksCompleted: 8,
        commits: 32,
        prMerges: 8,
        docUploads: 5,
        engagementScore: 88
      },
      recentActivity: 'Uploaded "Test Execution Report v2.pdf" yesterday.'
    },
    {
      id: 'IT21055555',
      name: 'Sam Taylor',
      role: 'Database Administrator',
      email: 'it21055555@my.sliit.lk',
      status: 'Healthy',
      metrics: {
        tasksAssigned: 10,
        tasksCompleted: 7,
        commits: 18,
        prMerges: 4,
        docUploads: 2,
        engagementScore: 78
      },
      recentActivity: 'Updated Database Schema PR #38 yesterday.'
    }
  ];

  return (
    <div className="animate-fade-up space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-black text-slate-800">Individual Member Tracking</h2>
        <span className="badge badge-amber py-0.5 px-2">Lecturer View Only</span>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {members.map(member => {
          const isAtRisk = member.status === 'At Risk';
          return (
            <div key={member.id} className={`card p-6 border-t-4 ${isAtRisk ? 'border-t-amber-500 bg-amber-50/20 shadow-amber-900/5' : 'border-t-emerald-900'}`}>
              
              {/* Profile Card Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${
                    isAtRisk ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-0.5">{member.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-500">{member.id}</span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{member.role}</span>
                    </div>
                  </div>
                </div>
                {isAtRisk && (
                  <div className="flex flex-col items-end">
                    <span className="badge badge-amber flex items-center gap-1.5 py-1 px-2.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Risk
                    </span>
                  </div>
                )}
              </div>

              {/* Email & Contact */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${member.email}`} className="hover:text-emerald-600 transition-colors">{member.email}</a>
              </div>

              {/* Core Individual Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {/* Tasks */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                  <div className="text-xl font-black text-slate-800">{member.metrics.tasksCompleted}<span className="text-xs text-slate-400">/{member.metrics.tasksAssigned}</span></div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Tasks
                  </div>
                </div>
                {/* Commits */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                  <div className="text-xl font-black text-slate-800">{member.metrics.commits}</div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    <GitCommit className="w-3 h-3 text-emerald-500" /> Commits
                  </div>
                </div>
                {/* Docs */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                  <div className="text-xl font-black text-slate-800">{member.metrics.docUploads}</div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    <FileText className="w-3 h-3 text-amber-500" /> Docs
                  </div>
                </div>
                {/* Score */}
                <div className={`bg-slate-50 border border-slate-100 p-3 rounded-xl text-center ${isAtRisk ? 'ring-1 ring-amber-200 bg-amber-50' : ''}`}>
                  <div className={`text-xl font-black ${isAtRisk ? 'text-amber-700' : 'text-emerald-900'}`}>{member.metrics.engagementScore}</div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    <Activity className={`w-3 h-3 ${isAtRisk ? 'text-amber-500' : 'text-teal-500'}`} /> Score
                  </div>
                </div>
              </div>

              {/* Latest Individual Context */}
              <div className="bg-white border text-sm border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-700 mb-0.5">Most Recent Individual Action</div>
                  <div className="font-medium text-slate-500">{member.recentActivity}</div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
