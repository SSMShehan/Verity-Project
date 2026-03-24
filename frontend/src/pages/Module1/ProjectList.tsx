import { Link } from 'react-router-dom';
import { Clock, Plus, ExternalLink, Lock, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/project/list');
        if (response.data.success) {
          const mappedProjects = response.data.projects.map((p: any) => {
            const moduleMatch = p.description?.match(/^\[(.*?)\]/);
            const moduleName = moduleMatch ? moduleMatch[1] : 'IT3022 - Software Engineering';
            
            return {
              id: p.id,
              title: p.title,
              module: moduleName,
              members: p.members?.length || 0,
              role: p.members?.[0]?.role || 'Member',
              progress: 0,
              status: p.status
            };
          });
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-20 animate-pulse text-emerald-600 font-bold">Loading Projects...</div>;
  }

  return (
    <div className="animate-fade-up max-w-7xl mx-auto space-y-12 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 page-header border-none mb-0 pb-0">
        <div>
          <h1 className="page-title text-emerald-900">Your Projects</h1>
          <p className="page-subtitle text-slate-500">Manage your active workspaces and monitor pending group registrations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <Link
            to="/student/projects/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Request New Group
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProjects.map(proj => {
          const isPending = proj.status === 'Pending' || proj.status === 'Pending Approval';

          return (
            <div key={proj.id} className="block group relative">
              {/* Card Container */}
              <div className={`card p-6 h-full flex flex-col hover:-translate-y-1 transition-transform shadow-sm hover:shadow-xl ${isPending
                ? 'border-t-4 border-t-amber-500 bg-amber-50/30'
                : 'border-t-4 border-t-emerald-600 group-hover:border-emerald-400'
                }`}>

                {/* Header Badges */}
                <div className="flex justify-between items-start mb-6">
                  <span className={`badge ${isPending ? 'badge-amber animate-pulse' : proj.role === 'Leader' ? 'badge-amber' : 'badge-sage'
                    }`}>
                    {proj.role}
                  </span>

                  {isPending ? (
                    <span className="badge bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  ) : (
                    <span className="badge badge-slate">{proj.members} Members</span>
                  )}
                </div>

                {/* Content */}
                <h3 className={`text-xl font-black mb-1 transition-colors ${isPending ? 'text-slate-700' : 'text-slate-900 group-hover:text-emerald-700'
                  }`}>
                  {proj.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
                  {proj.module}
                </p>

                {/* Footer Status */}
                <div className="mt-auto">
                  {isPending ? (
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-200 text-amber-700 text-sm font-bold">
                      <Lock className="w-4 h-4 shrink-0" />
                      Workspace locked until Manager approval.
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Progress</span>
                        <span>{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <Link
                        to={`/student/projects/${proj.id}`}
                        className="w-full py-2.5 bg-slate-50 hover:bg-emerald-50 text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                      >
                        Enter Workspace <ExternalLink className="w-4 h-4" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {!isPending && (
                <Link to={`/student/projects/${proj.id}`} className="absolute inset-0 z-10" aria-label={`View ${proj.title}`} />
              )}
            </div>
          );
        })}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold">
            No projects found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
