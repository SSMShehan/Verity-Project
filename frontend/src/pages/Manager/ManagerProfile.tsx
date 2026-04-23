import { Mail, Phone, Shield, Activity, Users, BookOpen, Clock, Settings, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ManagerProfile = () => {
  const localUser = (() => {
    try { 
      const data = JSON.parse(sessionStorage.getItem('user') || '{}');
      return data.user || data;
    } catch { return {}; }
  })();
  
  const [user, setUser] = useState<any>(localUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: 'onChange'
  });

  const fetchProfile = async () => {
    if (!localUser.id) return;
    try {
      const resp = await axios.get(`http://localhost:5000/api/user/${localUser.id}`);
      if (resp.data.success) {
        setUser(resp.data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openEditModal = () => {
    reset({
      name: user?.name,
      email: user?.email,
      phone: user?.phone || '',
      bio: user?.bio || '',
      designation: user?.designation || '',
      emergencyPhone: user?.emergencyPhone || '',
      workEmail: user?.workEmail || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      skills: user?.skills || ''
    });
    setIsEditing(true);
  };

  const onUpdateProfile = async (data: any) => {
    setLoading(true);
    try {
      const resp = await axios.put(`http://localhost:5000/api/user/${user.id}`, {
        name: data.name,
        // email intentionally omitted — login email is read-only for managers
        phone: data.phone,
        bio: data.bio,
        designation: data.designation,
        emergencyPhone: data.emergencyPhone,
        workEmail: data.workEmail,
        github: data.github,
        linkedin: data.linkedin,
        skills: data.skills
      });
      if (resp.data.success) {
        setUser(resp.data.user);
        const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
        stored.user = resp.data.user;
        sessionStorage.setItem('user', JSON.stringify(stored));
        window.dispatchEvent(new Event('profileUpdate'));
        setIsEditing(false);
      }
    } catch (e: any) {
      console.error("Update error", e);
      alert(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'MG';
  const name = user?.name || 'Platform Manager';
  
  const profileSignals = [
    { label: 'Platform Governance', value: 'Level 5', tone: 'from-indigo-600 to-indigo-700' },
    { label: 'User Oversight', value: 'High', tone: 'from-amber-500 to-orange-500' },
    { label: 'System Health', value: '99.9%', tone: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20 animate-fade-up">
        
        {/* Hero Section - Manager Command Center */}
        <div className="relative rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-200/35 blur-3xl" />
          <div className="absolute -bottom-28 right-1/4 w-80 h-80 rounded-full bg-amber-200/25 blur-3xl" />

          <div className="relative z-10 p-6 md:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-3 rounded-[1.5rem] border border-indigo-100 bg-gradient-to-br from-indigo-900 via-indigo-800 to-amber-700 p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-8 w-40 h-40 bg-amber-300/20 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0">
                      <span className="text-3xl md:text-4xl font-black tracking-tight">{initials}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100 mb-1">Identity Deck</p>
                      <h1 className="text-3xl md:text-4xl font-black leading-tight">{name}</h1>
                      <p className="text-xs md:text-sm text-indigo-100 font-semibold mt-1 uppercase tracking-[0.16em]">{user?.designation || 'System Administration · Governance'}</p>
                      <p className="text-sm text-indigo-100/90 mt-2">Verity Operations Center · Platform Manager</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-amber-200" /> Verified Administrator
                  </div>
                </div>

                <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
                  {profileSignals.map((signal) => (
                    <div key={signal.label} className="rounded-xl bg-white/10 border border-white/20 p-3 backdrop-blur-sm">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{signal.label}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xl font-black text-white">{signal.value}</p>
                        <div className={`h-2.5 w-10 rounded-full bg-gradient-to-r ${signal.tone}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-2 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Command Console</p>
                  <p className="text-2xl font-black text-slate-900 leading-tight">System Authority Control.</p>
                  <p className="text-sm text-slate-500 mt-2 font-medium">{user?.bio || 'Manage platform permissions, audit system logs, and oversee user activity across all modules.'}</p>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Security Clearance</span>
                    <span className="text-sm font-bold text-indigo-700">Level 0 (Root)</span>
                  </div>
                  <button onClick={openEditModal} className="w-full h-12 rounded-xl bg-slate-900 text-white font-black uppercase tracking-wider text-xs hover:bg-slate-800 transition">
                    Edit Admin Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up-delay-1">
          {[
            { label: 'Total Users Managed', value: '450+', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending Approvals', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Active Modules', value: '8', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'System Logs Analyzed', value: '1.2k', icon: Activity, color: 'text-slate-600', bg: 'bg-slate-50' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-default shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 shadow-inner border border-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Security */}
          <div className="space-y-8 animate-fade-up-delay-2">
            
            {/* Contact Information */}
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 relative overflow-hidden shadow-sm">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/50 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                <Settings className="w-5 h-5 text-indigo-500" /> Administrative Access
              </h3>
              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-4 text-sm font-medium text-slate-600 group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 group-hover:border-indigo-200 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Work Email</p>
                    <p className="text-slate-800 font-bold">{user?.workEmail || user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-600 group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 group-hover:border-indigo-200 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Emergency Phone</p>
                    <p className="text-slate-800 font-bold">{user?.emergencyPhone || user?.phone || 'Not Set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Governance Timeline */}
          <div className="lg:col-span-2 space-y-8 animate-fade-up-delay-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" /> Platform Audit Log
                </h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline">
                  View Full Audit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 bg-white">
                <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8">
                  {[
                    { title: 'User Permissions Updated (Batch)', date: '3 hours ago', type: 'security' },
                    { title: 'New Semester Configuration Finalized', date: 'Yesterday', type: 'system' },
                    { title: 'System Patch v2.4.1 Applied', date: '3 days ago', type: 'maintenance' },
                  ].map((item, i) => (
                    <div key={i} className="relative pl-8 group">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm group-hover:scale-125 transition-transform" />
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-indigo-100 transition-all">
                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                        <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal - rendered via portal directly to document.body to escape stacking contexts */}
      {isEditing && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl relative border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
            
            <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-700 transition-all hover:rotate-90 z-20">
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-1.5 tracking-tight">Edit Admin Profile</h2>
              <p className="text-sm text-slate-500 font-semibold tracking-wide">Refine your professional identity deck.</p>
            </div>
            
            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6 relative z-10 overflow-y-auto px-1 pr-4 -mr-4 scroll-smooth">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-500 transition-colors">Full Name</label>
                  <input {...register('name', { required: 'Name is required' })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" />
                  {errors.name && <p className="text-rose-500 text-[10px] mt-1.5 font-black uppercase tracking-wider">{errors.name.message as string}</p>}
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-500 transition-colors">Designation</label>
                  <input {...register('designation')} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" placeholder="e.g. Senior Platform Manager" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-500 transition-colors">Login Email</label>
                  <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl font-bold text-slate-400 outline-none cursor-not-allowed" readOnly />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-500 transition-colors">Work Email</label>
                  <input type="email" {...register('workEmail', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format"
                    }
                  })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" placeholder="admin@verity.edu" />
                  {errors.workEmail && <p className="text-rose-500 text-[10px] mt-1.5 font-black uppercase tracking-wider">{errors.workEmail.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-500 transition-colors">Primary Phone</label>
                  <input {...register('phone', {
                    pattern: {
                      value: /^(0\d{9}|\+94\d{9})$/,
                      message: 'Must be 0XXXXXXXXX or +94XXXXXXXXX'
                    }
                  })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" placeholder="0XXXXXXXXX" />
                  {errors.phone && <p className="text-rose-500 text-[10px] mt-1.5 font-black uppercase tracking-wider">{errors.phone.message as string}</p>}
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-500 transition-colors">Emergency Line</label>
                  <input {...register('emergencyPhone', {
                    pattern: {
                      value: /^(0\d{9}|\+94\d{9})$/,
                      message: 'Must be 0XXXXXXXXX or +94XXXXXXXXX'
                    }
                  })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" placeholder="+94XXXXXXXXX" />
                  {errors.emergencyPhone && <p className="text-rose-500 text-[10px] mt-1.5 font-black uppercase tracking-wider">{errors.emergencyPhone.message as string}</p>}
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-500 transition-colors">Administrative Bio</label>
                <textarea {...register('bio', { 
                  minLength: { value: 20, message: 'Bio requires at least 20 characters' }
                })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-bold text-slate-800 outline-none transition-all h-28 resize-none placeholder:text-slate-300" placeholder="Summarize your professional scope..." />
                {errors.bio && <p className="text-rose-500 text-[10px] mt-1.5 font-black uppercase tracking-wider">{errors.bio.message as string}</p>}
              </div>

              <div className="pt-6 flex justify-end gap-4 sticky bottom-0 bg-white/90 backdrop-blur-md pb-4 mt-8 border-t border-slate-100 -mx-1 px-1">
                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 font-black text-slate-400 hover:text-slate-800 transition-all text-xs uppercase tracking-widest">Cancel</button>
                <button type="submit" disabled={loading} className="px-12 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.3)] hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all flex items-center gap-3">
                  {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {loading ? 'Committing...' : 'Confirm Authority Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ManagerProfile;
