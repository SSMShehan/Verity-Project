import { useState, useEffect } from 'react';
import { Search, Trash2, Edit, AlertTriangle, Users, X, UserPlus, UserMinus, Save } from 'lucide-react';

export default function ManagerGroupDirectory() {
  const [groups, setGroups] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]); 
  const [addMembersList, setAddMembersList] = useState<string[]>([]);
  const [removeMembersList, setRemoveMembersList] = useState<string[]>([]);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
  
  // Searchable Dropdown state
  const [userSearchText, setUserSearchText] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/project/manager/groups');
      const data = await res.json();
      if (data.success) {
        setGroups(data.groups);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/manager/users');
      const data = await res.json();
      if (data.success) {
        setAllUsers(data.users.filter((u: any) => u.role === 'Student'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGroup = async (id: string) => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to completely delete this group? All data, repositories, and documents will be permanently wiped. This action cannot be undone.")) {
      try {
        const res = await fetch(`http://localhost:5000/api/project/manager/groups/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          setGroups(groups.filter(g => g.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Modal Logic ---
  const openEditModal = (group: any) => {
    setEditingGroup({ ...group, members: [...(group.members || [])] });
    setAddMembersList([]);
    setRemoveMembersList([]);
    setSelectedUserToAdd('');
    setUserSearchText('');
    setIsUserDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGroup(null);
  };

  const handleRemoveMember = (memberId: string) => {
    if (addMembersList.includes(memberId)) {
        setAddMembersList(prev => prev.filter(id => id !== memberId));
    } else {
        setRemoveMembersList(prev => [...prev, memberId]);
    }
    setEditingGroup((prev: any) => ({
        ...prev,
        members: prev.members.filter((m: any) => m.id !== memberId)
    }));
  };

  const handleAddMember = () => {
    if (!selectedUserToAdd) return;
    const user = allUsers.find(u => u.dbId === selectedUserToAdd);
    if (!user) return;
    
    if (removeMembersList.includes(user.dbId)) {
        setRemoveMembersList(prev => prev.filter(id => id !== user.dbId));
    } else {
        setAddMembersList(prev => [...prev, user.dbId]);
    }

    setEditingGroup((prev: any) => ({
        ...prev,
        members: [...prev.members, { id: user.dbId, name: user.name, indexNumber: user.id || user.indexNumber, role: 'MEMBER' }]
    }));
    setSelectedUserToAdd('');
    setUserSearchText('');
    setIsUserDropdownOpen(false);
  };

  const saveEditGroup = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/project/manager/groups/${editingGroup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editingGroup.title, 
          addMembers: addMembersList, 
          removeMembers: removeMembersList 
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchGroups(); 
        closeEditModal();
      } else {
        alert("Failed to update group: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving group.");
    }
  };

  const filteredGroups = groups.filter(g => 
     g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     g.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Available users to add (not already in the modal's current members list)
  const availableUsersToAdd = editingGroup 
     ? allUsers.filter(u => !editingGroup.members.some((m: any) => m.id === u.dbId))
     : [];

  return (
    <div className="animate-fade-up max-w-7xl mx-auto space-y-8 px-6">
      
      {/* Edit Modal Override */}
      {isEditModalOpen && editingGroup && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 pt-28 pb-12 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl animate-fade-up mt-2 sm:mt-6 mb-auto border border-white/20">
            
            {/* Pinned Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white rounded-t-3xl z-10 shadow-sm">
              <h2 className="text-xl font-black text-rose-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-rose-700" /> Modify Group: {editingGroup.title}
              </h2>
              <button onClick={closeEditModal} className="p-2 bg-slate-50 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Body Window */}
            <div className="p-6 space-y-8 overflow-y-auto bg-slate-50/50">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group Title</label>
                <input 
                  type="text" 
                  value={editingGroup.title}
                  onChange={e => setEditingGroup({...editingGroup, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-slate-700 transition-all focus:bg-white"
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Current Members ({editingGroup.members.length})</label>
                 <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {editingGroup.members.length === 0 ? (
                        <div className="p-4 text-center text-sm font-semibold text-slate-400">No members in this group.</div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                          {editingGroup.members.map((member: any) => (
                            <li key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-white transition-colors gap-3">
                               <div>
                                 <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                   {member.name}
                                   {member.role === 'LEADER' && <span className="badge badge-amber text-[10px]">LEADER</span>}
                                 </p>
                                 <p className="text-xs font-semibold text-slate-500">{member.indexNumber}</p>
                               </div>
                               <button 
                                 onClick={() => handleRemoveMember(member.id)}
                                 className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                               >
                                 <UserMinus className="w-3.5 h-3.5" /> Remove
                               </button>
                            </li>
                          ))}
                        </ul>
                    )}
                 </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                 <label className="block text-xs font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Add New Member
                 </label>
                 <div className="flex flex-col sm:flex-row gap-3 relative">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input 
                        type="text"
                        placeholder="Search IT Number or Name..."
                        value={userSearchText}
                        onChange={(e) => { 
                           setUserSearchText(e.target.value); 
                           setSelectedUserToAdd('');
                           setIsUserDropdownOpen(true); 
                        }}
                        onFocus={() => setIsUserDropdownOpen(true)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-semibold text-slate-700 text-sm focus:bg-white transition-all"
                      />
                      {isUserDropdownOpen && (
                         <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl max-h-48 overflow-y-auto shadow-2xl">
                            {availableUsersToAdd
                              .filter(u => u.name.toLowerCase().includes(userSearchText.toLowerCase()) || (u.id || '').toLowerCase().includes(userSearchText.toLowerCase()))
                              .map(u => (
                                <li 
                                  key={u.dbId} 
                                  onClick={() => { 
                                      setSelectedUserToAdd(u.dbId); 
                                      setUserSearchText(`${u.id} - ${u.name}`); 
                                      setIsUserDropdownOpen(false); 
                                  }}
                                  className="p-3 hover:bg-emerald-50 cursor-pointer text-sm font-semibold text-slate-700 transition-colors border-b border-slate-50 last:border-0"
                                >
                                  <span className="text-slate-400 mr-2">{u.id}</span> {u.name}
                                </li>
                            ))}
                            {availableUsersToAdd.filter(u => u.name.toLowerCase().includes(userSearchText.toLowerCase()) || (u.id || '').toLowerCase().includes(userSearchText.toLowerCase())).length === 0 && (
                               <li className="p-3 text-sm text-slate-400 font-medium">No completely unmatched students found.</li>
                            )}
                         </ul>
                      )}
                    </div>
                    <button 
                      onClick={handleAddMember}
                      disabled={!selectedUserToAdd}
                      className="px-6 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <UserPlus className="w-4 h-4" /> Add Member
                    </button>
                 </div>
              </div>

            </div>

            {/* Pinned Footer */}
            <div className="px-6 py-5 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0 rounded-b-3xl">
               <button onClick={closeEditModal} className="px-6 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-bold text-slate-600 transition-colors">
                 Cancel
               </button>
               <button onClick={saveEditGroup} className="px-6 py-2.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-900/20 transition-all">
                 <Save className="w-4 h-4" /> Save Changes
               </button>
            </div>
          </div>
        </div>
      )}
      {/* End Modal */}


      <div className="page-header border-b-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-rose-900 border-rose-200">Group Override Directory</h1>
          <p className="page-subtitle text-slate-500">Super Admin access. Modify memberships, manually override status, or terminate project groups.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Title or Module..." 
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <div key={group.id} className="card p-6 border-t-4 border-t-rose-900 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
             <div className="flex justify-between items-start mb-4">
               <span className="badge badge-slate flex items-center gap-1.5"><Users className="w-3 h-3" /> {group.membersCount} Members</span>
               {group.status === 'Flagged' ? (
                  <span className="badge bg-red-100/50 text-red-600 border-red-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Flagged</span>
               ) : (
                  <span className="badge badge-green">Active</span>
               )}
             </div>
             
             <h3 className="text-xl font-black text-slate-900 mb-1">{group.title}</h3>
             <p className="text-xs font-bold uppercase tracking-widest text-emerald-900">{group.module}</p>
             
             <div className="my-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Group Leader</p>
                <p className="font-bold text-slate-700 text-sm">{group.leader}</p>
             </div>

             <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100">
               <button onClick={() => openEditModal(group)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm">
                 <Edit className="w-4 h-4" /> Edit Details
               </button>
               <button onClick={() => deleteGroup(group.id)} className="bg-white border border-rose-200 hover:bg-red-50 text-rose-600 px-4 py-2.5 rounded-xl transition-colors shrink-0" title="Delete Group">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold">
            No groups found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
