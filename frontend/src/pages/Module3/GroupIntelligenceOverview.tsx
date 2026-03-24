import { ShieldAlert, Activity, BrainCircuit, Users, Target, Clock } from 'lucide-react';

export default function GroupIntelligenceOverview() {
  return (
    <div className="animate-fade-up space-y-8">
      
      {/* Top AI Assessment Banner */}
      <div className="card p-6 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="w-32 h-32 text-amber-900" />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-amber-100 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-amber-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900 mb-1">AI Health Assessment: <span className="text-amber-600">At Risk</span></h2>
            <p className="text-slate-600 font-medium leading-relaxed max-w-3xl">
              The Project Intelligence Engine (PIE) has detected a high likelihood of missed deadlines 
              for "Iteration 2 Demo" due to a sudden drop in GitHub commit frequency and uneven task distribution. 
              Review the anomaly reports below.
            </p>
          </div>
        </div>
      </div>

      {/* PIE Dimension Scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Progress vs Plan', score: 65, icon: Target,  color: 'text-amber-600', bg: 'bg-amber-100', bar: 'bg-amber-500' },
          { label: 'Collaboration',    score: 82, icon: Users,   color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'bg-emerald-500' },
          { label: 'Consistency',      score: 45, icon: Clock,   color: 'text-red-600', bg: 'bg-red-100', bar: 'bg-red-500' },
          { label: 'Code Activity',    score: 90, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'bg-emerald-500' },
        ].map(dim => (
          <div key={dim.label} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${dim.bg}`}>
                <dim.icon className={`w-5 h-5 ${dim.color}`} />
              </div>
              <div className={`text-2xl font-black ${dim.color}`}>{dim.score}</div>
            </div>
            <div className="text-sm font-bold text-slate-700 mb-2">{dim.label}</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full rounded-full ${dim.bar}`} style={{ width: `${dim.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Cheating & Anomaly Detection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Identified Anomalies */}
        <div className="card border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-800 text-lg">Detected Anomalies</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-4 border border-red-100 bg-red-50/50 rounded-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-red py-0.5">High Severity</span>
                <span className="text-xs font-bold text-slate-500">2 days ago</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Task Inflation Detected</h4>
              <p className="text-sm text-slate-600 mt-1">Student <b>Alex Smith</b> closed 12 complex tasks within 15 minutes, which statistically deviates from historical completion rates.</p>
            </div>
            
            <div className="p-4 border border-amber-100 bg-amber-50/50 rounded-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-amber py-0.5">Warning</span>
                <span className="text-xs font-bold text-slate-500">1 week ago</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Last-Minute Activity Spike</h4>
              <p className="text-sm text-slate-600 mt-1">90% of GitHub commits for "Module 2" were pushed within 4 hours of the deadline by a single member.</p>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-800 text-lg">AI Guidance & Mitigation</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-bold bg-white shrink-0 shadow-sm mt-0.5">1</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Schedule a Intervention Meeting</h4>
                <p className="text-sm text-slate-600 mt-0.5">Discuss the rapid task completions with Alex Smith to ensure deep understanding of the work submitted.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-bold bg-white shrink-0 shadow-sm mt-0.5">2</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Redistribute Upcoming Workload</h4>
                <p className="text-sm text-slate-600 mt-0.5">The engine suggests assigning backend integration tasks to John Doe, as his code activity has significantly dropped.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-bold bg-white shrink-0 shadow-sm mt-0.5">3</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Require Staggered Commits</h4>
                <p className="text-sm text-slate-600 mt-0.5">Enable a requirement for the group to push code every 48 hours to prevent last-minute spikes.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
             <button className="bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
               Apply Automated Policy
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
