import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export default function ProjectSettings() {
  const { id } = useParams();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: 'Verity Web System',
      description: 'An AI-assisted project collaboration and fairness monitoring platform.',
      notifyOnCommit: true,
      notifyOnReport: true,
      repoUrl: 'https://github.com/team/verity-web',
    }
  });

  const onSave = (_data: any) => {
    alert('Project settings saved!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl shadow-sm">⚙️</div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Settings</h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Configure project #{id} preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-8">

        {/* General Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">📋</span>
            General
          </h3>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Project Title</label>
            <input {...register('title', { required: 'Title is required' })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" placeholder="Project title" />
            {errors.title && <p className="text-red-500 text-xs font-bold mt-2">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
            <textarea {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters' } })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium h-28 resize-none placeholder-slate-400" placeholder="Project goal and scope..." />
            {errors.description && <p className="text-red-500 text-xs font-bold mt-2">{errors.description.message as string}</p>}
          </div>
        </div>

        {/* Repository Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">🔗</span>
            Repository Integration
          </h3>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Repository URL</label>
            <input
              {...register('repoUrl', { pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL' } })}
              className="w-full bg-slate-50 border border-slate-200 text-emerald-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
              placeholder="https://github.com/org/repo"
            />
            {errors.repoUrl && <p className="text-red-500 text-xs font-bold mt-2">{errors.repoUrl.message as string}</p>}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
          <h3 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">🔔</span>
            Notification Preferences
          </h3>
          {[
            { key: 'notifyOnCommit', label: 'Notify on new commit', desc: 'Alert the team whenever a new commit is pushed.' },
            { key: 'notifyOnReport', label: 'Weekly report reminders', desc: 'Send reminders before the weekly report deadline.' },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer group transition-all">
              <div>
                <p className="font-black text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">{item.label}</p>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <input type="checkbox" {...register(item.key as any)} className="w-5 h-5 rounded accent-emerald-600 cursor-pointer" />
            </label>
          ))}
        </div>

        {/* Save Button */}
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/30">
          Save Settings
        </button>
      </form>
    </div>
  );
}
