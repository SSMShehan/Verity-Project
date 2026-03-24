import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, CheckCircle, Clock, GitCommit, FileText, Activity, AlertTriangle, Loader2, Github } from 'lucide-react';

type Member = {
  userId: string;
  id: string;
  name: string;
  role: string;
  email: string;
  githubProfileLinked?: boolean;
  status: 'Healthy' | 'At Risk';
  metrics: {
    tasksAssigned: number;
    tasksCompleted: number;
    commits: number;
    prMerges: number;
    docUploads: number;
    engagementScore: number;
  };
  recentActivity: string;
};

const API = 'http://localhost:5000/api/project';

export default function LecturerGroupMembers() {
  const { id } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [membersMissingGithub, setMembersMissingGithub] = useState<{ userId: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/member-tracking/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load member tracking data');
        }
        if (!cancelled) {
          setMembers(data.members || []);
          setMembersMissingGithub(Array.isArray(data.membersMissingGithub) ? data.membersMissingGithub : []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load member tracking data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div className="animate-fade-up space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-black text-slate-800">Individual Member Tracking</h2>
        <span className="badge badge-amber py-0.5 px-2">Lecturer View Only</span>
      </div>

      {loading && (
        <div className="card p-10 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500">Loading member analytics...</p>
        </div>
      )}

      {!loading && !error && membersMissingGithub.length > 0 && (
        <div className="card p-4 border-blue-200 bg-blue-50/70 flex gap-3 text-sm text-slate-800">
          <div className="shrink-0 p-2 rounded-xl bg-white border border-blue-100">
            <Github className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <p className="font-bold text-slate-900 mb-1">GitHub profile not set for some members</p>
            <p className="text-slate-700 leading-relaxed">
              Ask these students to add their <strong>GitHub profile URL</strong> on their Verity account, then sync the repo on <strong>GitHub Sync</strong>:{' '}
              <span className="font-semibold text-slate-900">
                {membersMissingGithub.map((m) => m.name).join(', ')}
              </span>
              .
            </p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="card p-6 border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
          {error}
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <div className="card p-8 text-center text-sm font-semibold text-slate-500">
          No member analytics available yet for this group.
        </div>
      )}

      {/* Members Grid */}
      {!loading && !error && members.length > 0 && (
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
                <div className="flex flex-col items-end gap-1">
                  {member.githubProfileLinked === false && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      No GitHub URL
                    </span>
                  )}
                  {isAtRisk && (
                    <span className="badge badge-amber flex items-center gap-1.5 py-1 px-2.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Risk
                    </span>
                  )}
                </div>
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

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                  <div className="text-base font-black text-slate-800">{member.metrics.prMerges}</div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">PR Merges</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                  <div className="text-base font-black text-slate-800">
                    {member.metrics.tasksAssigned > 0
                      ? Math.round((member.metrics.tasksCompleted / member.metrics.tasksAssigned) * 100)
                      : 0}%
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Task Completion</div>
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
      )}
    </div>
  );
}
