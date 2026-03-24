import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, CheckSquare, Github, Folder, UploadCloud, Settings, Users, FileText } from 'lucide-react';

export default function StudentProjectDashboard() {
  const { id } = useParams();
  const location = useLocation();
  const [projectTitle, setProjectTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    axios
      .get('http://localhost:5000/api/project/list')
      .then((r) => {
        if (cancelled || !r.data?.success || !Array.isArray(r.data.projects)) return;
        const p = r.data.projects.find((x: { id: string }) => x.id === id);
        if (p?.title) setProjectTitle(p.title);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id]);

  const tabs = [
    { name: 'Overview', path: `/student/projects/${id}`, icon: LayoutDashboard, exact: true },
    { name: 'Task Board', path: `/student/projects/${id}/kanban`, icon: CheckSquare, exact: false },
    { name: 'Weekly Reports', path: `/student/projects/${id}/reports/weekly`, icon: FileText, exact: false },
    { name: 'Code Repo', path: `/student/projects/${id}/github`, icon: Github, exact: false },
    { name: 'Drive', path: `/student/projects/${id}/files`, icon: Folder, exact: false },
    { name: 'Team Hub', path: `/student/projects/${id}/team`, icon: Users, exact: false },
    { name: 'Submissions', path: `/student/projects/${id}/submissions`, icon: UploadCloud, exact: false },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-[calc(100vh-4rem)]">
      
      {/* Project Header Area */}
      <div className="bg-white border-b border-slate-200 shrink-0 shadow-sm z-10 relative">
        <div className="max-w-screen-2xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="badge bg-emerald-100 text-emerald-900 py-0.5 border-emerald-200">Active Project</span>
              <span className="text-xs font-bold text-slate-400">ID: {id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{projectTitle || 'Project'}</h1>
          </div>
          <div className="flex items-center gap-3">
             <Link to={`/student/projects/${id}/settings`} className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-colors border border-slate-200 bg-white shadow-sm flex items-center gap-2 font-bold text-sm">
               <Settings className="w-4 h-4" /> Settings
             </Link>
          </div>
        </div>
        
        {/* Scrollable Tabs */}
        <div className="max-w-screen-2xl mx-auto px-4 overflow-x-auto no-scrollbar border-t border-slate-100 mt-2">
          <div className="flex items-center gap-1 min-w-max py-1">
            {tabs.map(tab => {
              const active = tab.exact 
                ? location.pathname === tab.path 
                : location.pathname.startsWith(tab.path);
              
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    active 
                      ? 'bg-emerald-50 text-emerald-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Tab Content Area */}
      <div className="flex-1 max-w-screen-2xl w-full mx-auto p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
