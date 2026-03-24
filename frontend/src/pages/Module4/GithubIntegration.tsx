import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Github, RefreshCw, GitBranch, X, Plus } from 'lucide-react';

export default function GithubIntegration() {
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [hoveredCommit, setHoveredCommit] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  const [repoData, setRepoData] = useState<any>(null);
  const [commits, setCommits] = useState<any[]>([]);
  const [impacts, setImpacts] = useState<any[]>([]);
  const [stats, setStats] = useState({ additions: 0, deletions: 0, total: 0 });

  // Link Form State
  const [linkForm, setLinkForm] = useState({ owner: '', repoName: '', url: '' });

  const fetchRepoData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`http://localhost:5000/api/github/repo/${id}`);
      if (resp.data.success && resp.data.linked) {
        setRepoData(resp.data.repo);
        setCommits(resp.data.commits || []);
        setImpacts(resp.data.impacts || []);
        setStats({
          additions: resp.data.totalAdditions || 0,
          deletions: resp.data.totalDeletions || 0,
          total: resp.data.totalCommitsCount || 0
        });
      } else {
        setRepoData(null);
        setCommits([]);
        setImpacts([]);
        setStats({ additions: 0, deletions: 0, total: 0 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRepoData();
  }, [id]);

  const handleSync = async () => {
    if (!id) return;
    try {
      setSyncing(true);
      const resp = await axios.post(`http://localhost:5000/api/github/sync/${id}`);
      if (resp.data.success) {
        alert(`Sync complete: Fetched ${resp.data.syncedCommits} commits across ${resp.data.branchesFetched} branches.`);
        await fetchRepoData();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to sync. Make sure GITHUB_TOKEN is set in backend or you have API limits left.');
    } finally {
      setSyncing(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await axios.post('http://localhost:5000/api/github/link', {
        projectId: id,
        ...linkForm
      });
      if (resp.data.success) {
        setShowLinkModal(false);
        setLinkForm({ owner: '', repoName: '', url: '' });
        setLoading(true);
        try {
          setSyncing(true);
          const syncResp = await axios.post(`http://localhost:5000/api/github/sync/${id}`);
          if (syncResp.data.success) {
            alert(`Repository linked. Synced ${syncResp.data.syncedCommits} commits across ${syncResp.data.branchesFetched} branches.`);
          }
        } catch (syncErr) {
          console.error(syncErr);
          alert('Repository linked, but the first sync failed. Press “Sync Now” after checking GITHUB_TOKEN and rate limits.');
        } finally {
          setSyncing(false);
        }
        await fetchRepoData();
      }
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to link repository. Ensure owner and repo name are correct.');
    }
  };

  const colorPalettes = [
    { color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-700' },
    { color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    { color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-700' },
    { color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', text: 'text-teal-700' },
  ];

  if (loading && !repoData) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!repoData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-slate-200 border-dashed rounded-3xl bg-white max-w-4xl mx-auto shadow-sm">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <Github className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">No Repository Linked</h2>
        <p className="text-slate-500 max-w-lg mx-auto mb-8 leading-relaxed">
          Connect a GitHub repository to this project to automatically track branches, commits, and calculate individual developer impact.
        </p>
        <button onClick={() => setShowLinkModal(true)} className="btn-primary px-8 py-3 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Link GitHub Repository
        </button>

        {showLinkModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-left">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                <h3 className="font-bold">Link Repository</h3>
                <button onClick={() => setShowLinkModal(false)}><X className="w-5 h-5 hover:text-red-400" /></button>
              </div>
              <form onSubmit={handleLinkSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm-semibold text-slate-700 mb-1">Owner / Organization</label>
                  <input required value={linkForm.owner} onChange={e => setLinkForm({...linkForm, owner: e.target.value})} placeholder="e.g. facebook" className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm-semibold text-slate-700 mb-1">Repository Name</label>
                  <input required value={linkForm.repoName} onChange={e => setLinkForm({...linkForm, repoName: e.target.value})} placeholder="e.g. react" className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm-semibold text-slate-700 mb-1">Repo URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input value={linkForm.url} onChange={e => setLinkForm({...linkForm, url: e.target.value})} placeholder="https://github.com/owner/repo" className="glass-input" />
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-2 font-bold">Connect Repository</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header Container */}
      <div className="relative overflow-hidden rounded-2xl p-8 border border-slate-200 bg-white shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm text-slate-700">
              <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                {repoData.owner} / {repoData.repoName}
              </h2>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <span>Manage and track all codebase contributions</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing Repo...' : 'Sync Now'}
            </button>
            <a 
              href={repoData.url}
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4 text-slate-500" />
              Open GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Main Activity Feed */}
         <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="flex justify-between items-end px-1">
               <div>
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                   <GitBranch className="w-5 h-5 text-teal-500" />
                   Recent Commit History
                 </h3>
                 <p className="text-sm text-slate-500 mt-1">Showing the latest {commits.length} commits synced from the repository</p>
               </div>
            </div>

            <div className="flex flex-col gap-3">
              {commits.length === 0 ? (
                <div className="text-center p-10 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <p className="text-slate-500 font-medium">No commits found. Try syncing the repository.</p>
                </div>
              ) : (
                commits.map((c, idx) => (
                  <div 
                    key={c.id} 
                    className={`group relative flex gap-4 sm:gap-5 p-5 rounded-xl bg-white border transition-all duration-200 overflow-hidden ${hoveredCommit === c.id ? 'border-slate-300 shadow-md shadow-slate-200/50' : 'border-slate-200 hover:border-slate-300'}`}
                    onMouseEnter={() => setHoveredCommit(c.id)}
                    onMouseLeave={() => setHoveredCommit(null)}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${colorPalettes[idx % colorPalettes.length].bg} ${colorPalettes[idx % colorPalettes.length].text}`}>
                        {c.authorName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-semibold text-slate-900 text-[15px] group-hover:text-teal-600 transition-colors truncate">
                          {c.message.split('\n')[0]}
                        </h4>
                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap shrink-0">
                          {new Date(c.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          {c.authorName}
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 font-mono ml-auto">
                          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                          {c.commitHash.substring(0, 7)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="flex flex-col gap-6">
           {/* Metric Cards */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Additions</span>
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-700 flex items-baseline gap-2">
                    {stats.additions.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deletions</span>
                  <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-rose-700 flex items-baseline gap-2">
                    {stats.deletions.toLocaleString()}
                  </span>
                </div>
              </div>
           </div>

           {/* Impact Chart */}
           <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">Developer Impact (Commits)</h3>
              </div>
              
              <div className="space-y-6">
                {impacts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No impact data available yet.</p>
                ) : (
                  impacts.map((impact, i) => {
                    const style = colorPalettes[i % colorPalettes.length];
                    return (
                      <div key={i} className="group cursor-pointer">
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-sm font-bold ${impact.isMatched ? 'text-slate-900' : 'text-slate-500 italic'}`}>
                              {impact.name}
                            </span>
                            {impact.isMatched && (
                              <svg className="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-800">{impact.commits} <span className="text-slate-400 font-medium">commits</span></span>
                            <span className="text-[10px] font-bold ml-2 text-slate-400">({impact.percentage}%)</span>
                          </div>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${style.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${impact.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 px-1">
                           <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">+{impact.additions}</span>
                           <span className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">-{impact.deletions}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}
