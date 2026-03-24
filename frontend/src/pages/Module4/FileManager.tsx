import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function FileManager() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('files');
  
  const files = [
    { name: 'Database Schema.sql', size: '2.4 MB', type: 'sql', uploadedBy: 'Alex Smith', date: 'Oct 15, 2:30 PM', versions: 3 },
    { name: 'Frontend_Architecture.pdf', size: '1.1 MB', type: 'pdf', uploadedBy: 'John Doe', date: 'Oct 14, 10:15 AM', versions: 1 },
    { name: 'API_Documentation.docx', size: '540 KB', type: 'doc', uploadedBy: 'Maria Garcia', date: 'Oct 12, 4:45 PM', versions: 5 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header Container */}
      <div className="relative overflow-hidden rounded-2xl p-8 border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 shadow-sm text-teal-600">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Workspace Files</h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span>Centralized document management & version control</span>
            </p>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4">
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm shadow-teal-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         {/* File Browser */}
         <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex gap-6 border-b border-slate-200 mb-6 pb-px">
                <button 
                  className={`pb-3 px-2 text-sm font-semibold transition-colors relative ${activeTab === 'files' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setActiveTab('files')}
                >
                  All Documents
                  {activeTab === 'files' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-full"></span>}
                </button>
                <button 
                  className={`pb-3 px-2 text-sm font-semibold transition-colors relative ${activeTab === 'recent' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setActiveTab('recent')}
                >
                  Recent Uploads
                  {activeTab === 'recent' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-full"></span>}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {files.map((file, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm transition-all group cursor-pointer flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm border transition-transform group-hover:scale-105 ${
                          file.type === 'pdf' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          file.type === 'sql' ? 'bg-sky-50 text-sky-600 border-sky-100' : 
                          'bg-teal-50 text-teal-600 border-teal-100'
                        }`}>
                          {file.type.toUpperCase()}
                        </div>
                        <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-200 text-xs font-semibold text-slate-500">
                          v{file.versions}.0
                        </span>
                    </div>
                    
                    <h4 className="font-semibold text-slate-900 text-[15px] mb-1.5 truncate group-hover:text-teal-600 transition-colors">
                      {file.name}
                    </h4>
                    
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-5">
                        <span className="font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{file.size}</span>
                        <span>{file.uploadedBy.split(' ')[0]}</span>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
                        <span className="text-[11px] font-medium text-slate-400">{file.date}</span>
                        <div className="flex gap-2">
                          <Link
                            to={`/projects/${id}/files/${encodeURIComponent(file.name)}/history`}
                            className="text-teal-600 hover:text-teal-800 font-semibold text-xs px-2 py-1 rounded hover:bg-teal-50 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            History
                          </Link>
                          <Link
                            to={`/projects/${id}/files/${encodeURIComponent(file.name)}/comments`}
                            className="text-emerald-600 hover:text-emerald-800 font-semibold text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            Comments
                          </Link>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         </div>

         {/* Activity Sidebar */}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-[17px] font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Document Activity
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
               
               <div className="relative flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-teal-100 text-teal-600 shadow-sm shrink-0 z-10 transition-transform group-hover:scale-110">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-teal-100 group-hover:bg-teal-50/50 transition-colors">
                     <time className="text-[11px] font-semibold text-teal-600 mb-1 block">Oct 15, 2:30 PM</time>
                     <h4 className="text-sm font-semibold text-slate-900 mb-1">Database Schema v3.0</h4>
                     <p className="text-xs text-slate-500">Alex uploaded a new revision.</p>
                  </div>
               </div>

               <div className="relative flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow-sm shrink-0 z-10 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-emerald-100 group-hover:bg-emerald-50/50 transition-colors">
                     <time className="text-[11px] font-semibold text-slate-500 mb-1 block">Oct 14, 11:20 AM</time>
                     <h4 className="text-sm font-semibold text-slate-900 mb-1">Architecture Review</h4>
                     <p className="text-xs text-slate-500">Lecturer added 3 comments.</p>
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
}
