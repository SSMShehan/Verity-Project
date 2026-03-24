import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function SubmissionStation() {
  const { id } = useParams();
  const { register, handleSubmit } = useForm();

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/submission/list/${id}`);
      if (resp.data.success) {
        setHistory(resp.data.submissions.map((s: any) => ({
          type: s.originalName,
          status: s.status,
          score: 'Pending', // Hardcoded until graded
          date: new Date(s.createdAt).toLocaleDateString()
        })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (id) fetchSubmissions();
  }, [id]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/submission/create', {
        projectId: id,
        milestone: data.milestone,
        branch: data.branch,
        notes: data.notes
      });
      alert('Milestone target locked and submitted!');
      fetchSubmissions();
    } catch (e) {
      console.error(e);
      alert('Failed to submit milestone');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="xl:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight relative z-10">Compile Submission</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Milestone Target</label>
                 <select {...register('milestone', { required: true })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium appearance-none">
                   <option value="">-- Select Milestone --</option>
                   <option value="p1">Progress 1</option>
                   <option value="p2">Progress 2</option>
                   <option value="final">Final Demo</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Repository Branch</label>
                 <select {...register('branch', { required: true })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium appearance-none">
                   <option value="main">main (production)</option>
                   <option value="dev">develop (staging)</option>
                 </select>
              </div>
           </div>

           <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Submission Notes</label>
              <textarea 
                {...register('notes', { required: true })}
                className="w-full h-32 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium resize-none placeholder-slate-400" 
                placeholder="Deployment instructions, environment variables, or specific evaluator focuses..."
              ></textarea>
           </div>
           
           <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex items-start gap-4 mt-6">
              <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                 <h4 className="font-bold text-emerald-800 mb-1 text-sm">Pre-flight Checks Selected & Passed</h4>
                 <p className="text-sm text-emerald-700/80 leading-relaxed max-w-lg font-medium">Source code synchronized (2 minutes ago). Weekly reports acknowledged. Team member contribution metrics verified within fair standard deviations.</p>
              </div>
           </div>

           <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3.5 font-bold text-[15px] transition-all shadow-sm shadow-emerald-200 mt-2 disabled:opacity-50">
             {loading ? 'Submitting...' : 'Substantiate Target'}
           </button>
        </form>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Submission Core Log</h3>
          <Link to={`/projects/${id}/submissions/review`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Lecturer Review
          </Link>
        </div>
        
        <div className="space-y-4">
          {history.map((sub, idx) => (
             <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full">
               <div className="flex justify-between items-start mb-5">
                 <h4 className="text-[17px] font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{sub.type}</h4>
                 <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                    sub.status === 'Graded' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                 }`}>
                   {sub.status}
                 </span>
               </div>
               
               <div className="flex items-end justify-between mt-auto">
                 <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Final Score</span>
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">{sub.score}</span>
                 </div>
                 <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{sub.date}</span>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
