import { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, ShieldAlert, Mail } from 'lucide-react';

export default function ManagerUserDirectory() {
  const [users, setUsers] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/manager/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleStatus = async (dbId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/manager/users/${dbId}/status`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => {
          if ((u.dbId || u.id) === dbId) {
            return { ...u, status: data.user.status };
          }
          return u;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-up max-w-7xl mx-auto space-y-8 px-6">
      <div className="page-header border-b-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-rose-900 border-rose-200">User Directory</h1>
          <p className="page-subtitle text-slate-500">Manage all registered students and lecturers. Suspend or modify accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filterRole} 
            onChange={e => setFilterRole(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-rose-500/20 outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Student">Students Only</option>
            <option value="Lecturer">Lecturers Only</option>
          </select>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">User Identity</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-center">Role</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-sm font-semibold text-slate-500 mt-0.5">{user.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Mail className="w-4 h-4 text-slate-400" /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`badge ${user.role === 'Lecturer' ? 'badge-amber' : 'badge-sage'}`}>
                      {user.role} {user.role === 'Student' && `(${user.enrolled})`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.status === 'Active' ? (
                      <span className="badge badge-green font-black">Active</span>
                    ) : (
                      <span className="badge bg-red-100/50 text-red-600 border-red-200 font-black flex items-center gap-1 justify-center">
                        <ShieldAlert className="w-3 h-3" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {user.status === 'Active' ? (
                       <button onClick={() => toggleStatus(user.dbId || user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Suspend User">
                         <UserX className="w-5 h-5" />
                       </button>
                    ) : (
                       <button onClick={() => toggleStatus(user.dbId || user.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100" title="Reactivate User">
                         <UserCheck className="w-5 h-5" />
                       </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">No users found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
