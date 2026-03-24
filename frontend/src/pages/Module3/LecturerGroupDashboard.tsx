import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { LayoutDashboard, FileText, PieChart, Activity, Github, Users } from 'lucide-react';

export default function LecturerGroupDashboard() {
  const { id } = useParams();
  const location = useLocation();

  const tabs = [
    { name: 'Intelligence Overview', path: `/lecturer/projects/${id}`, icon: LayoutDashboard, exact: true },
    { name: 'Members', path: `/lecturer/projects/${id}/members`, icon: Users, exact: false },
    { name: 'Weekly Reports', path: `/lecturer/projects/${id}/reports`, icon: FileText, exact: false },
    { name: 'Fairness Analytics', path: `/lecturer/projects/${id}/fairness`, icon: PieChart, exact: false },
    { name: 'Engagement', path: `/lecturer/projects/${id}/engagement`, icon: Activity, exact: false },
    { name: 'GitHub Sync', path: `/lecturer/projects/${id}/github`, icon: Github, exact: false },
  ];

  return (
    <div className="animate-fade-up">
      {/* Group Header */}
      <div className="bg-white border flex flex-col sm:flex-row sm:items-center justify-between border-slate-200 rounded-2xl p-6 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-5 relative z-10 space-y-3 sm:space-y-0">
          <div className="w-14 h-14 bg-gradient-to-br from-[#78350f] to-amber-700 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg">
            G{id}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-amber text-[10px] py-0.5">Project #{id}</span>
              <span className="badge badge-green text-[10px] py-0.5">Healthy</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">E-Commerce AI Agent</h1>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">5 Students • Last active 2 hours ago</p>
          </div>
        </div>

        <div className="flex gap-4 sm:ml-auto">
          <div className="text-right">
             <div className="text-2xl font-black text-emerald-600">92/100</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Health Score</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        {tabs.map((tab) => {
          const isActive = tab.exact 
            ? location.pathname === tab.path 
            : location.pathname.startsWith(tab.path);
          
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-amber-50 text-[#78350f] shadow-sm ring-1 ring-amber-200' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Render the specific tab's component here */}
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}
