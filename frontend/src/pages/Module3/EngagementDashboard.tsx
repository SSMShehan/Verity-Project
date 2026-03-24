import { Activity, LogIn, Clock, Users, TrendingUp, TrendingDown, AlertCircle, Zap } from 'lucide-react';

const stats = [
  { label: 'Login Frequency', value: '4.2', unit: '/ week', icon: LogIn, trend: '+8%', up: true, color: 'emerald' },
  { label: 'Task Updates', value: '18', unit: 'this week', icon: Activity, trend: '+3', up: true, color: 'emerald' },
  { label: 'Avg. Response Time', value: '1.5', unit: 'hours', icon: Clock, trend: '-12%', up: true, color: 'teal' },
  { label: 'Group Rank', value: '#2', unit: 'of 12 groups', icon: Users, trend: '▲ 1', up: true, color: 'teal' },
];

const riskItems = [
  { level: 'high', title: 'Inactivity Alert', member: 'Alex K.', detail: '0 recorded activity in the last 5 days.', color: 'red' },
  { level: 'medium', title: 'Uneven Workload', member: 'John M.', detail: '75% of recent sprint tasks completed by one member.', color: 'amber' },
];

const colorMap: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  blue:    { bg: 'bg-emerald-50',    text: 'text-emerald-700',    border: 'border-emerald-100',   icon: 'text-emerald-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100',icon: 'text-emerald-500' },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-100',   icon: 'text-teal-500' },
  indigo:  { bg: 'bg-teal-50',  text: 'text-teal-700',  border: 'border-teal-100', icon: 'text-teal-500' },
};

import { useLocation } from 'react-router-dom';

export default function EngagementDashboard() {
  const location = useLocation();
  const isLecturer = location.pathname.includes('/lecturer');
  // Mock heatmap data
  const heatmapData = Array.from({ length: 35 }).map((_, _i) => {
    const r = Math.random();
    return r > 0.85 ? 4 : r > 0.65 ? 3 : r > 0.4 ? 2 : r > 0.2 ? 1 : 0;
  });

  const heatColors = [
    'bg-slate-100',
    'bg-emerald-100',
    'bg-emerald-300',
    'bg-emerald-500',
    'bg-emerald-900',
  ];

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
          <h1 className="page-title">Engagement Analytics</h1>
          <p className="page-subtitle">Track your activity levels, participation metrics, and group dynamics.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const c = colorMap[s.color];
          const Icon = s.icon;
          return (
            <div key={i} className={`stat-card animate-fade-up-delay-${i + 1}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${c.bg} ${c.border} border`}>
                  <Icon className={`w-4 h-4 ${c.icon}`} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {s.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {s.trend}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value} <span className="text-sm font-medium text-slate-400">{s.unit}</span></div>
              <div className="text-xs font-semibold text-slate-500 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Heatmap */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              30-Day Activity Heatmap
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Less</span>
              {heatColors.map((c, i) => (<div key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />))}
              <span>More</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map((level, i) => (
              <div
                key={i}
                title={`${level * 3} engagements`}
                className={`aspect-square rounded-md ${heatColors[level]} transition-transform hover:scale-110 cursor-default`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium mt-4">
            <span>5 weeks ago</span>
            <span>This week</span>
          </div>
        </div>

        {/* Risk Panel */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-5">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Active Alerts
          </h2>
          <div className="space-y-4">
            {riskItems.map((risk, i) => (
              <div key={i} className={`p-4 rounded-xl border-l-4 ${risk.color === 'red' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'}`}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold text-sm ${risk.color === 'red' ? 'text-red-800' : 'text-amber-800'}`}>{risk.title}</h4>
                  <span className={`badge ${risk.color === 'red' ? 'badge-red' : 'badge-amber'} text-[10px] py-0.5`}>
                    {risk.level === 'high' ? 'High' : 'Medium'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mb-1">{risk.member}</p>
                <p className={`text-xs leading-relaxed ${risk.color === 'red' ? 'text-red-700' : 'text-amber-700'}`}>{risk.detail}</p>
              </div>
            ))}
            <p className="text-center text-xs text-slate-400 font-medium pt-2">Displaying AI-detected anomalies only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
