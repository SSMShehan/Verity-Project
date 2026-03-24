import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LecturerDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/project/list');
        if (response.data.success) {
          // Filter out pending groups; only show Approved/Active ones
          const activeProjects = response.data.projects.filter((p: any) => p.status === 'Active');
          
          const mapped = activeProjects.map((p: any) => ({
            id: p.id,
            title: p.title,
            health: 'On Track', // Mocked until feature built
            flags: 0, // Mocked
            reports: 'Pending' // Mocked
          }));
          setProjects(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch projects for lecturer", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const highRiskCount = projects.filter(p => p.health === 'At Risk' || p.flags > 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-4 hover:shadow-md transition">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lecturer Overview</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Monitor all student projects, health metrics, and active risk flags.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Active</span>
            <span className="text-2xl font-black text-slate-800 leading-none">{projects.length}</span>
          </div>
          <div className="bg-red-50/50 px-6 py-3 rounded-2xl border border-red-100 flex flex-col justify-center">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1">High Risk</span>
            <span className="text-2xl font-black text-red-600 leading-none">{highRiskCount}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold animate-pulse">Loading approved projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
           <h3 className="text-lg font-bold text-slate-400">No active projects to monitor right now.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
        {projects.map(proj => (
          <div key={proj.id} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all cursor-pointer group">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors mb-3">{proj.title}</h3>
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                  proj.health === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  proj.health === 'At Risk' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${proj.health === 'On Track' ? 'bg-emerald-500' : proj.health === 'At Risk' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`}></div>
                  Health: {proj.health}
                </span>
                <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${
                  proj.reports === 'Submitted' ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/10'
                }`}>
                  Weekly Report: {proj.reports}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <span className="block text-4xl font-black text-slate-800">{proj.flags}</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-1 block">Risk Flags</span>
              </div>
              <button className="px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/10">
                View Detail
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
