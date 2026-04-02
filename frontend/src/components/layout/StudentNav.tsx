import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Bell, Calendar, UploadCloud } from 'lucide-react';

const studentNav = [
  { label: 'My Projects', path: '/student/projects', icon: Briefcase },
  { label: 'Assignments', path: '/student/assignments', icon: UploadCloud },
  { label: 'Announcements', path: '/student/announcements', icon: Bell },
  { label: 'Calendar', path: '/student/calendar', icon: Calendar },
];

export default function StudentNav() {
  const location = useLocation();

  const user = (() => {
    try { 
      const data = JSON.parse(sessionStorage.getItem('user') || '{}');
      return data.user || data;
    } catch { return {}; }
  })();
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'ST';

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* University Strip - Professional Blue for Student */}
      <div className="bg-emerald-900 text-white px-6 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase opacity-90">
          Sri Lanka Institute of Information Technology · Student Portal
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white shadow-sm">
          Undergraduate
        </span>
      </div>

      {/* Main Nav */}
      <div className="flex items-center justify-between px-6 h-16 max-w-screen-2xl mx-auto">
        
        {/* Logo */}
        <Link to="/student/projects" className="flex items-center gap-3 shrink-0 mr-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-700 flex items-center justify-center shadow-md border border-emerald-900">
            <span className="text-white font-black text-sm drop-shadow-sm">V</span>
          </div>
          <span className="text-emerald-900 font-black text-xl tracking-tight">Verity<span className="text-emerald-50">Sync</span></span>
        </Link>

        {/* Action-Oriented Nav Sections */}
        <nav className="hidden lg:flex items-center gap-2 h-full flex-1">
          {studentNav.map((item) => {
            const active = location.pathname.startsWith(item.path) && (item.path !== '/student/projects' || location.pathname === '/student/projects' || location.pathname.startsWith('/student/projects/'));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 h-full text-sm font-bold transition-all relative ${
                  active 
                    ? 'text-emerald-900' 
                    : 'text-slate-500 hover:text-emerald-900 hover:bg-emerald-50/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                {item.label}
                {/* Active Indicator Bar */}
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-900 rounded-t-full shadow-[0_-2px_8px_rgba(30,58,138,0.4)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-slate-200">
          <Link to="/student/profile" className="hidden sm:flex items-center gap-3 p-1.5 px-3 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer group border border-transparent hover:border-emerald-100">
            <div className="text-right">
              <p className="text-sm font-black text-slate-800 leading-none group-hover:text-emerald-700 transition-colors">{user?.name || 'Student'}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mt-1">SE Student</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-900 text-sm font-black shadow-sm group-hover:scale-105 transition-transform">
              {initials}
            </div>
          </Link>
          <button 
            onClick={handleSignOut}
            className="text-xs font-bold text-slate-400 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 ml-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>

  );
}
