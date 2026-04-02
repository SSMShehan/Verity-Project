import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Pin, Trash2, Filter, Plus, X,
  Shield, Send, ToggleLeft, ToggleRight, Search
} from 'lucide-react';

/* ─── types ─── */
type TagType = 'Urgent' | 'Academic' | 'General';
type UserRole = 'student' | 'lecturer' | 'manager';

interface Announcement {
  id: number;
  author: string;
  role: 'Lecturer' | 'Manager' | 'Student';
  avatar: string;
  title: string;
  description: string;
  tag: TagType;
  module: string;
  timestamp: string;
  pinned: boolean;
}

// Removed dummy data to use API data

const TAG_STYLES: Record<TagType, string> = {
  Urgent:   'bg-red-50 text-red-700 border-red-200',
  Academic: 'bg-blue-50 text-blue-700 border-blue-200',
  General:  'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const TAG_DOT: Record<TagType, string> = {
  Urgent:   'bg-red-500',
  Academic: 'bg-blue-500',
  General:  'bg-emerald-500',
};

const AVATAR_COLORS: Record<string, string> = {
  Lecturer: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Manager:  'bg-rose-100 text-rose-700 border-rose-200',
  Student:  'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const ROLE_BADGE: Record<string, string> = {
  Lecturer: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  Manager:  'bg-rose-50 text-rose-600 border-rose-200',
  Student:  'bg-emerald-50 text-emerald-600 border-emerald-200',
};

/* ─── helpers ─── */
function getCurrentRole(): UserRole {
  const path = window.location.pathname;
  if (path.startsWith('/lecturer')) return 'lecturer';
  if (path.startsWith('/manager')) return 'manager';
  return 'student';
}

function getUserFromStorage() {
  try {
    const data = JSON.parse(sessionStorage.getItem('user') || '{}');
    return data.user || data;
  } catch { return {}; }
}

/* ─── sub-components ─── */

function ComposerCard({ onClose, onPostSuccess }: { onClose: () => void, onPostSuccess: (announcement: Announcement) => void }) {
  const role = getCurrentRole();
  const [isSystemWide, setIsSystemWide] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<TagType>('General');
  const [module, setModule] = useState('All Modules');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const user = getUserFromStorage();
      const res = await axios.post('http://localhost:5000/api/announcement', {
        title,
        content,
        category: tag,
        targetAudience: isSystemWide ? 'System' : module,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        // Build the frontend object since ID and basic fields are returned
        const newAnnouncement: Announcement = {
          id: res.data.announcement.id,
          author: user.name || 'Current User',
          role: role === 'lecturer' ? 'Lecturer' : 'Manager',
          avatar: (user.name || 'Current User').split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase(),
          title: res.data.announcement.title,
          description: res.data.announcement.content,
          tag: res.data.announcement.category as TagType,
          module: res.data.announcement.targetAudience,
          timestamp: 'Just now',
          pinned: res.data.announcement.isPinned
        };
        onPostSuccess(newAnnouncement);
        // Form clears via unmouting since we close on success
        onClose();
      }
    } catch (error) {
      console.error('Failed to post announcement:', error);
      alert('Failed to post announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md">
            {getUserFromStorage()?.name?.charAt(0) || 'Y'}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Create Announcement</p>
            <p className="text-[11px] text-slate-400 font-semibold">Visible to all members</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <input
        type="text"
        placeholder="Announcement title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all mb-3 text-sm"
      />
      <textarea
        placeholder="What would you like to announce?"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-sm font-medium resize-none"
      />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tag selector */}
          <select 
            value={tag}
            onChange={(e) => setTag(e.target.value as TagType)}
            className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 cursor-pointer"
          >
            <option value="Urgent">🔴 Urgent</option>
            <option value="Academic">🔵 Academic</option>
            <option value="General">🟢 General</option>
          </select>

          {/* Module selector */}
          <select 
            value={module}
            onChange={(e) => setModule(e.target.value)}
            disabled={isSystemWide}
            className={`text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 cursor-pointer ${isSystemWide ? 'opacity-50 text-slate-400' : 'text-slate-600'}`}
          >
            <option value="All Modules">All Modules</option>
            <option value="SE3050">SE3050</option>
            <option value="SE3060">SE3060</option>
            <option value="IT3040">IT3040</option>
          </select>

          {/* System-wide toggle — Manager only */}
          {role === 'manager' && (
            <button
              onClick={() => setIsSystemWide(!isSystemWide)}
              className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border transition-all ${
                isSystemWide
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-rose-200'
              }`}
            >
              {isSystemWide ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <Shield className="w-3.5 h-3.5" />
              System-Wide
            </button>
          )}
        </div>

        <button 
          onClick={handlePost} 
          disabled={!title.trim() || !content.trim() || isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-slate-900/10"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </motion.div>
  );
}

function AnnouncementCard({
  announcement: a, index, role,
}: { announcement: Announcement; index: number; role: UserRole }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 260, damping: 24 }}
      className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all group relative"
    >
      {/* Pinned indicator */}
      {a.pinned && (
        <div className="absolute -top-2.5 left-6 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Pin className="w-3 h-3" />
          Pinned
        </div>
      )}

      <div className="p-6">
        {/* ── Card Header ── */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-black text-sm shadow-sm ${AVATAR_COLORS[a.role]}`}>
              {a.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-800">{a.author}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${ROLE_BADGE[a.role]}`}>
                  {a.role}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{a.timestamp}</span>
            </div>
          </div>

          {/* Manager actions */}
          {role === 'manager' && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Pin">
                <Pin className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Card Body ── */}
        <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug group-hover:text-indigo-700 transition-colors">
          {a.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
          {a.description}
        </p>

        {/* ── Card Footer ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${TAG_STYLES[a.tag]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${TAG_DOT[a.tag]}`} />
              {a.tag}
            </span>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              {a.module}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function Announcements() {
  const role = getCurrentRole();
  const [showComposer, setShowComposer] = useState(false);
  const [filterModule, setFilterModule] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch announcements on mount
  useEffect(() => {
    // Log the current user ID to the console
    const currentUser = getUserFromStorage();
    console.log('Current User ID:', currentUser.id || currentUser._id);

    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/announcement');
        if (res.data.success) {
          setAnnouncementsList(res.data.announcements);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handlePostSuccess = (newAnnouncement: Announcement) => {
    setAnnouncementsList(prev => [newAnnouncement, ...prev]);
  };

  const modules = useMemo(() => {
    const set = new Set(announcementsList.map(a => a.module));
    return ['All', ...Array.from(set)];
  }, [announcementsList]);

  const filtered = useMemo(() => {
    let list = [...announcementsList];
    if (filterModule !== 'All') list = list.filter(a => a.module === filterModule);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.description.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
      );
    }
    // pinned first
    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return list;
  }, [filterModule, searchQuery, announcementsList]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              Announcements
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-2 ml-[52px]">
              Stay informed with the latest updates from your lecturers and administration.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:ml-auto w-full sm:w-auto mt-4 sm:mt-0">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={filterModule}
                onChange={e => setFilterModule(e.target.value)}
                className="w-full sm:w-auto text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 cursor-pointer shadow-sm"
              >
                {modules.map(m => (
                  <option key={m} value={m}>{m === 'All' ? 'All Modules' : m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Composer (Lecturer / Manager) ── */}
      <AnimatePresence>
        {(role === 'lecturer' || role === 'manager') && showComposer && (
          <ComposerCard 
            onClose={() => setShowComposer(false)} 
            onPostSuccess={handlePostSuccess} 
          />
        )}
      </AnimatePresence>

      {/* ── Feed ── */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            <h3 className="text-lg font-bold text-slate-400">Loading announcements...</h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-400">No announcements found.</h3>
            <p className="text-sm text-slate-400 mt-1">Try changing the module filter.</p>
          </div>
        ) : (
          filtered.map((a, i) => (
            <AnnouncementCard key={a.id} announcement={a} index={i} role={role} />
          ))
        )}
      </div>

      {/* ── FAB for Lecturer / Manager ── */}
      {(role === 'lecturer' || role === 'manager') && !showComposer && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
          onClick={() => setShowComposer(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center hover:scale-110 hover:shadow-indigo-500/40 transition-all z-40"
          title="Create Announcement"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
