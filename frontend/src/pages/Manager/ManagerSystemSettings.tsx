import { useState, useEffect } from 'react';
import { Save, Plus, Database, Settings } from 'lucide-react';

export default function ManagerSystemSettings() {
  const [activeSemester, setActiveSemester] = useState('Year 3 - Semester 1');
  const [maxGroupSize, setMaxGroupSize] = useState(6);
  const [requireManagerApproval, setRequireManagerApproval] = useState(true);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/academic/modules');
      const data = await res.json();
      // the endpoint currently sends the array directly instead of {success: true, modules: [...] }
      if (Array.isArray(data)) {
        setModules(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/system/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        if (data.settings.activeSemester) setActiveSemester(data.settings.activeSemester);
        if (data.settings.maxGroupSize !== undefined) setMaxGroupSize(data.settings.maxGroupSize);
        if (data.settings.requireManagerApproval !== undefined) setRequireManagerApproval(data.settings.requireManagerApproval);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitAlert = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeSemester, maxGroupSize, requireManagerApproval })
      });
      const data = await res.json();
      if (data.success) {
        alert("System settings updated securely.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addModule = async () => {
    const code = window.prompt("Enter new module code (e.g., IT4000):");
    if (!code) return;
    const name = window.prompt("Enter new module name (e.g., Cloud Computing):");
    if (!name) return;

    try {
      const res = await fetch('http://localhost:5000/api/academic/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name })
      });
      const data = await res.json();
      if (data.success) {
        setModules(prev => [...prev, data.module]);
      } else {
        alert("Failed to create module: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating module");
    }
  };

  return (
    <div className="animate-fade-up max-w-5xl mx-auto space-y-8 px-6 pb-12">
      <div className="page-header border-b-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-rose-900 border-rose-200">System Configuration</h1>
          <p className="page-subtitle text-slate-500">Configure global platform logic, academic timelines, and module integrations.</p>
        </div>
        <button onClick={submitAlert} className="bg-rose-900 hover:bg-rose-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-900/20 transition-all">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Modules Config */}
        <div className="card p-6 border-slate-200">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-rose-100 rounded-xl"><Database className="w-5 h-5 text-rose-700" /></div>
             <div>
               <h2 className="text-xl font-black text-slate-900">Academic Modules</h2>
               <p className="text-xs font-semibold text-slate-500">Add or manage system modules.</p>
             </div>
           </div>

           <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2">
             {modules.map(mod => (
                <div key={mod.id || mod.code} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-700 text-sm">{mod.code} - {mod.name}</span>
                  <span className="badge badge-green">Active</span>
                </div>
             ))}
             {modules.length === 0 && <span className="text-sm text-slate-500 font-semibold">No modules found.</span>}
           </div>

           <button onClick={addModule} className="w-full bg-white border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:text-emerald-600 text-slate-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
             <Plus className="w-4 h-4" /> Add New Module
           </button>
        </div>

        {/* Global Semesters Config */}
        <div className="card p-6 border-slate-200">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-rose-100 rounded-xl"><Settings className="w-5 h-5 text-rose-700" /></div>
             <div>
               <h2 className="text-xl font-black text-slate-900">Platform Rules</h2>
               <p className="text-xs font-semibold text-slate-500">Global auto-enrollment triggers.</p>
             </div>
           </div>

           <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Active Semester (Global)</label>
                <select 
                  value={activeSemester}
                  onChange={(e) => setActiveSemester(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-slate-700 appearance-none"
                >
                  <option>Year 3 - Semester 1</option>
                  <option>Year 3 - Semester 2</option>
                  <option>Year 4 - Semester 1</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Max Group Size Limit</span> <span className="text-rose-600">{maxGroupSize} Members</span>
                </label>
                <input 
                  type="range" min="2" max="10" 
                  value={maxGroupSize} 
                  onChange={(e) => setMaxGroupSize(parseInt(e.target.value))}
                  className="w-full accent-rose-600" 
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                 <label className="flex items-start gap-3 cursor-pointer">
                   <input 
                     type="checkbox" 
                     checked={requireManagerApproval} 
                     onChange={(e) => setRequireManagerApproval(e.target.checked)}
                     className="mt-1 w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500" 
                   />
                   <div>
                     <span className="text-sm font-black text-amber-900 block mb-0.5">Require Manager Approval for Groups</span>
                     <span className="text-xs font-semibold text-amber-700/70">If unchecked, groups will auto-activate without waiting for Admin authorization.</span>
                   </div>
                 </label>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
