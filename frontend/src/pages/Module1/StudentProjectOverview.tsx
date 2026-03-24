import { Target, CheckCircle, Github, FileText, AlertTriangle } from 'lucide-react';

export default function StudentProjectOverview() {
  return (
    <div className="animate-fade-up space-y-6">
      
      {/* Welcome & AI Insight */}
      <div className="card p-6 border-l-4 border-l-emerald-600 bg-gradient-to-r from-emerald-50 to-white flex items-start gap-4 shadow-sm">
        <div className="p-3 bg-emerald-100 rounded-xl shrink-0">
          <Target className="w-6 h-6 text-emerald-700" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-slate-900 mb-1">Project is on track!</h2>
          <p className="text-slate-600 font-medium">
            Your team is consistently meeting milestone targets. The PIE Engine recommends shifting focus to <b>Frontend Integration</b> tasks to maintain parallel development speed.
          </p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Open Tasks', value: 3, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Unmerged PRs', value: 2, icon: Github, color: 'text-teal-600', bg: 'bg-teal-100' },
          { label: 'New Files', value: 5, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Action Items', value: 1, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map(stat => (
          <div key={stat.label} className="card p-5 hover:-translate-y-1 transition-transform border-slate-200">
             <div className="flex items-center justify-between mb-3">
               <div className={`p-2 rounded-xl ${stat.bg}`}>
                 <stat.icon className={`w-5 h-5 ${stat.color}`} />
               </div>
               <div className="text-2xl font-black text-slate-800">{stat.value}</div>
             </div>
             <div className="text-sm font-bold text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
