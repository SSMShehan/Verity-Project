import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';


const submissions = [
  {
    id: 1, type: 'Progress 1', team: 'Verity Web System', submittedBy: 'John Doe', avatar: 'JD', date: 'Sep 30, 2:00 PM',
    branch: 'main', notes: 'All Sprint 1 tasks completed. Database schema finalised. UI fully responsive.',
    status: 'Pending Review', members: ['John Doe', 'Alex Smith', 'Maria Garcia'],
    preflight: { commits: true, reports: true, fairness: false },
  },
  {
    id: 2, type: 'Project Proposal', team: 'Verity Web System', submittedBy: 'John Doe', avatar: 'JD', date: 'Aug 15, 10:00 AM',
    branch: 'develop', notes: 'Initial project proposal covering scope, timeline and tech stack.',
    status: 'Approved', grade: 'A', score: '90/100', feedback: 'Excellent proposal. Clear goals and feasible timeline.',
    members: ['John Doe', 'Alex Smith', 'Maria Garcia'],
    preflight: { commits: true, reports: true, fairness: true },
  },
];

const preflightLabels: Record<string, string> = {
  commits: '🔀 Commits Synced',
  reports: '📄 Reports Submitted',
  fairness: '⚖️ Fairness Verified',
};

export default function SubmissionReview() {
  const { id } = useParams();

  const [selected, setSelected] = useState<any>(submissions[0]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onGrade = (data: any) => {
    alert(`Submission "${selected?.type}" graded with ${data.grade}!`);
    reset();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="glass-panel p-8 border-l-4 border-l-indigo-500 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">📋</div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Submission Review</h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Project #{id} — Lecturer Grading Panel</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-500/10 border border-amber-500/30 px-6 py-3 rounded-2xl text-center">
            <span className="block text-2xl font-black text-amber-400">{submissions.filter(s => s.status === 'Pending Review').length}</span>
            <span className="block text-[10px] font-black uppercase tracking-widest text-amber-300/60 mt-1">Pending</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-2xl text-center">
            <span className="block text-2xl font-black text-emerald-400">{submissions.filter(s => s.status === 'Approved').length}</span>
            <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-300/60 mt-1">Graded</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Submission List */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Submissions</h3>
          {submissions.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelected(sub)}
              className={`w-full text-left glass-panel p-6 transition-all ${selected?.id === sub.id ? 'border-indigo-500/50 bg-indigo-500/5' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-black text-white">{sub.type}</h4>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 ml-2 ${
                  sub.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                }`}>
                  {sub.status === 'Approved' ? 'Graded' : 'Pending'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400">{sub.team}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">{sub.date}</p>
              <div className="flex gap-2 mt-3">
                {Object.entries(sub.preflight).map(([key, val]) => (
                  <span key={key} className={`text-[10px] w-5 h-5 rounded-full flex items-center justify-center ${val ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {val ? '✓' : '✗'}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Detail & Grading */}
        <div className="xl:col-span-2 space-y-6">
          {selected && (
            <>
              {/* Submission Info */}
              <div className="glass-panel p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">{selected.type}</h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">Submitted by {selected.submittedBy} · {selected.date}</p>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border ${
                    selected.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>{selected.status}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Branch</span>
                    <p className="font-black text-emerald-400 font-mono">{selected.branch}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Team Members</span>
                    <p className="text-sm font-bold text-white">{selected.members.join(', ')}</p>
                  </div>
                </div>

                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Submission Notes</span>
                  <p className="text-sm font-medium text-slate-200 leading-relaxed">{selected.notes}</p>
                </div>

                {/* Pre-flight checklist */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Pre-flight Status</span>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selected.preflight).map(([key, val]) => (
                      <div key={key} className={`p-4 rounded-2xl border text-center ${val ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                        <p className={`text-lg font-black mb-1 ${val ? 'text-emerald-400' : 'text-red-400'}`}>{val ? '✓' : '✗'}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{preflightLabels[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Already Graded */}
              {selected.status === 'Approved' && selected.grade ? (
                <div className="glass-panel p-8 border-t-4 border-t-emerald-500 bg-emerald-950/10">
                  <h3 className="text-xl font-black text-emerald-400 mb-6 flex items-center gap-3">
                    <span>✅</span> Already Graded
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-center">
                      <p className="text-4xl font-black text-white">{selected.grade}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Grade</p>
                    </div>
                    <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-center">
                      <p className="text-4xl font-black text-white">{selected.score}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Score</p>
                    </div>
                  </div>
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Feedback Given</span>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">{selected.feedback}</p>
                  </div>
                </div>
              ) : (
                /* Grading Form */
                <div className="glass-panel p-8 border-t-4 border-t-indigo-500">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm">✍️</span>
                    Grade this Submission
                  </h3>
                  <form onSubmit={handleSubmit(onGrade)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Grade</label>
                        <select {...register('grade', { required: 'Grade is required' })} className="glass-input font-black">
                          <option value="" className="text-slate-900">-- Select Grade --</option>
                          <option value="A+" className="text-slate-900">A+ (90–100)</option>
                          <option value="A" className="text-slate-900">A  (85–89)</option>
                          <option value="B+" className="text-slate-900">B+ (75–84)</option>
                          <option value="B" className="text-slate-900">B  (65–74)</option>
                          <option value="C" className="text-slate-900">C  (50–64)</option>
                          <option value="F" className="text-slate-900">F  (Below 50)</option>
                        </select>
                        {errors.grade && <p className="text-red-400 text-xs font-bold mt-2">{errors.grade.message as string}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Numeric Score</label>
                        <input
                          type="number"
                          {...register('score', { required: 'Score is required', min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } })}
                          className="glass-input"
                          placeholder="e.g. 87"
                        />
                        {errors.score && <p className="text-red-400 text-xs font-bold mt-2">{errors.score.message as string}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Feedback</label>
                      <textarea
                        {...register('feedback', { required: 'Feedback is required', minLength: { value: 15, message: 'At least 15 characters' } })}
                        className="glass-input h-32"
                        placeholder="Provide detailed grading feedback for the team..."
                      />
                      {errors.feedback && <p className="text-red-400 text-xs font-bold mt-2">{errors.feedback.message as string}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Decision</label>
                      <select {...register('decision', { required: true })} className="glass-input font-black">
                        <option value="approve" className="text-slate-900">✅ Approve &amp; Grade</option>
                        <option value="revision" className="text-slate-900">🔄 Request Revision</option>
                        <option value="reject" className="text-slate-900">❌ Reject Submission</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full btn-primary !py-5 text-lg shadow-[0_0_25px_rgba(225,29,72,0.4)] !from-indigo-600 !to-pink-600">
                      Submit Evaluation
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
