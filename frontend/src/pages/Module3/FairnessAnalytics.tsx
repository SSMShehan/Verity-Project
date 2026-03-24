import { ShieldCheck, CheckCircle, GitCommit, Clock } from 'lucide-react';


const members = [
  { name: 'John Doe',     role: 'Leader', score: 92, taskRate: 100, gitRate: 85, timeSync: 90 },
  { name: 'Alex Smith',   role: 'Member', score: 45, taskRate: 40,  gitRate: 30, timeSync: 65 },
  { name: 'Maria Garcia', role: 'Member', score: 88, taskRate: 90,  gitRate: 95, timeSync: 80 },
];

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';
  const text = score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-red-700';


  return (
    <div className="relative w-32 h-32 mx-auto my-4">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${text} tabular-nums`}>{score}</span>
        <span className="text-xs font-semibold text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%`, transition: 'width 1s ease' }}
      />
    </div>
  );
}

import { useLocation } from 'react-router-dom';

export default function FairnessAnalytics() {
  const location = useLocation();
  const isLecturer = location.pathname.includes('/lecturer');
  const teamAvg = Math.round(members.reduce((s, m) => s + m.score, 0) / members.length);
  const flagged = members.filter(m => m.score < 60);

  return (
    <div className="animate-fade-up space-y-8">
      {/* Page Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${isLecturer ? 'badge-amber' : 'badge-sage'}`}>
              {isLecturer ? 'Lecturer View' : 'Student Portal'}
            </span>
            <span className="text-slate-400 text-sm font-medium">SE3040 · Group 07</span>
          </div>
          <h1 className="page-title">Contribution Fairness</h1>
          <p className="page-subtitle">AI-assisted analysis of equitable workload distribution within the group.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="card p-4 text-center min-w-[100px]">
            <div className="text-2xl font-black text-emerald-900">{teamAvg}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Team Average</div>
          </div>
          <div className={`card p-4 text-center min-w-[100px] ${flagged.length > 0 ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <div className={`text-2xl font-black ${flagged.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{flagged.length}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Flagged</div>
          </div>
        </div>
      </div>

      {/* Member Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((m, idx) => {
          const isLow = m.score < 60;
          const isMid = m.score >= 60 && m.score < 80;
          return (
            <div key={m.name} className={`card p-6 animate-fade-up-delay-${idx + 1} ${isLow ? 'border-red-200' : isMid ? 'border-amber-200' : 'border-emerald-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">{m.name}</h4>
                  <span className={`badge ${m.role === 'Leader' ? 'badge-amber' : 'badge-slate'} mt-1`}>{m.role}</span>
                </div>
                <span className={`badge ${isLow ? 'badge-red' : isMid ? 'badge-amber' : 'badge-green'}`}>
                  {isLow ? 'At Risk' : isMid ? 'Average' : 'Strong'}
                </span>
              </div>

              <ScoreRing score={m.score} />

              <div className="space-y-4 mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                {[
                  { label: 'Task Completion', val: m.taskRate, icon: CheckCircle, color: 'bg-emerald-500' },
                  { label: 'Git Commits',     val: m.gitRate,  icon: GitCommit,   color: 'bg-emerald-500' },
                  { label: 'Time Consistency',val: m.timeSync, icon: Clock,        color: 'bg-teal-500' },
                ].map(row => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          {row.label}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{row.val}%</span>
                      </div>
                      <Bar value={row.val} color={row.color} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Finding Panel (for lecturers) */}
      {flagged.length > 0 && (
        <div className="card p-6 border-l-4 border-l-red-500 bg-red-50/50">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-red-100 border border-red-200 rounded-xl mt-0.5">
              <ShieldCheck className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-base mb-1">Automated Fairness Finding</h3>
              <p className="text-sm text-red-700 leading-relaxed">
                The system has detected a significant contribution imbalance for{' '}
                {flagged.map(m => <strong key={m.name}>{m.name}</strong>).reduce((prev, curr) => <>{prev}, {curr}</>)}.
                {' '}Their task completion and participation rates are critically below the group baseline.
                A formal review by the assigned lecturer is recommended.
              </p>
              <div className="flex gap-3 mt-4">
                <button className="btn-danger text-sm py-2 px-4">Issue Formal Warning</button>
                <button className="btn-secondary text-sm py-2 px-4">Schedule Meeting</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
