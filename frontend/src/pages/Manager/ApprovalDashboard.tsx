import { useState, useEffect } from 'react';
import { ClipboardCheck, Clock, CheckCircle, XCircle, Users, BookOpen, Search } from 'lucide-react';

export default function ApprovalDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/project/manager/groups');
      const data = await res.json();
      if (data.success) {
        const mapped = data.groups.map((g: any) => ({
          id: g.id,
          module: g.module,
          groupLeader: { id: g.leaderObj?.indexNumber || 'Unknown', name: g.leaderObj?.name || 'Unknown' },
          projectTitle: g.title,
          membersCount: g.membersCount,
          dateRequested: new Date(g.createdAt).toLocaleDateString(),
          status: g.status
        }));
        setRequests(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id: string, action: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch(`http://localhost:5000/api/project/manager/approvals/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: action === 'Approved' ? 'Active' : 'Rejected' } : req));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.groupLeader.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.groupLeader.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(r => r.status === 'Pending');
  const actionedRequests = filteredRequests.filter(r => r.status !== 'Pending');
  
  const pendingCount = pendingRequests.length;

  return (
    <div className="animate-fade-up max-w-6xl mx-auto space-y-8 px-6">
      <div className="page-header border-b-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-rose-900 border-rose-200">Registration Approvals</h1>
          <p className="page-subtitle text-slate-500">Review and authorize new student group registrations for modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search IT number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-4">
             <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <Clock className="w-5 h-5 text-amber-500" /> Pending Requests ({pendingCount})
             </h2>
          </div>

          {pendingRequests.map(req => (
            <div key={req.id} className="card p-6 border-l-4 border-l-amber-500 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-amber uppercase tracking-widest text-[10px] font-black">{req.status} Review</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{req.id}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{req.projectTitle}</h3>
                <div className="flex items-center gap-6 mt-3 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-rose-700" /> {req.module}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-600" /> {req.membersCount} Members</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-1 min-w-[200px]">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Group Leader</div>
                <div className="font-bold text-slate-900">{req.groupLeader.name}</div>
                <div className="text-sm font-medium text-slate-500">{req.groupLeader.id}</div>
              </div>

              <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                <button 
                  onClick={() => handleAction(req.id, 'Approved')}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'Rejected')}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}

          {pendingCount === 0 && (
             <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
                <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-black text-slate-700">All Caught Up!</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">There are no pending group registration requests right now.</p>
             </div>
          )}

          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-4 mt-8">
             <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <CheckCircle className="w-5 h-5 text-emerald-500" /> Recently Actioned
             </h2>
          </div>

          {actionedRequests.map(req => (
            <div key={req.id} className="card p-4 border-l-4 border-l-slate-300 flex items-center justify-between opacity-75 grayscale-[0.3]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${req.status === 'Approved' || req.status === 'Active' ? 'badge-green' : 'badge-red'} uppercase tracking-widest text-[10px] font-black`}>{req.status}</span>
                  <span className="text-xs font-bold text-slate-400">{req.id}</span>
                </div>
                <h3 className="font-bold text-slate-900">{req.projectTitle} <span className="text-slate-400 font-medium">({req.module})</span></h3>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
           {/* Sidebar Stats */}
           <div className="card p-5 bg-rose-900 text-white border-rose-950">
             <h3 className="font-black text-lg mb-4 text-rose-100">System Overview</h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center pb-3 border-b border-rose-800">
                 <span className="text-rose-200/80 text-sm font-semibold">Total Active Groups</span>
                 <span className="font-black">{requests.filter(r => r.status === 'Active').length}</span>
               </div>
               <div className="flex justify-between items-center pb-3 border-b border-rose-800">
                 <span className="text-rose-200/80 text-sm font-semibold">Total Assessed Groups</span>
                 <span className="font-black">{requests.filter(r => r.status !== 'Pending').length}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-rose-200/80 text-sm font-semibold">Pending Approvals</span>
                 <span className="font-black text-amber-300">{requests.filter(r => r.status === 'Pending').length}</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
