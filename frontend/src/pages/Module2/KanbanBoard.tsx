import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function KanbanBoard() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const columns = ['To Do', 'In Progress', 'Review', 'Done'];
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const fetchTasks = async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/task/list/${id}`);
      if (resp.data.success) {
        setTasks(resp.data.tasks.map((t: any) => ({
          ...t,
          assignee: t.assignee?.name?.substring(0, 2).toUpperCase() || 'UN'
        })));
      }
    } catch (e) { console.error("Error fetching tasks", e); }
  };

  useEffect(() => {
    if (id) fetchTasks();
  }, [id]);

  const moveTask = async (task: any, newStatus: string) => {
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    // Server sync
    try {
      await axios.put(`http://localhost:5000/api/task/${task.id}/status`, { status: newStatus });
    } catch (e) {
      console.error("Error updating status", e);
      fetchTasks(); // rollback on error
    }
  };

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Kanban Workflow</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage task executions interactively.</p>
        </div>
        <Link to={`/student/projects/${id}/tasks/new`} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
          <span className="text-xl leading-none">+</span> New Task
        </Link>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {columns.map(col => (
          <div key={col} className="w-[340px] flex-shrink-0 flex flex-col bg-slate-100/60 rounded-3xl p-5 border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-5 px-2 uppercase tracking-wider text-sm flex justify-between items-center">
              {col}
              <span className="bg-slate-200/80 text-slate-500 px-2.5 py-1 rounded-md text-xs border border-slate-300/50 shadow-sm">
                {tasks.filter(t => t.status === col).length}
              </span>
            </h3>

            <div className="flex-1 space-y-4 overflow-y-auto min-h-[200px]">
              {tasks.filter(t => t.status === col).map(task => (
                <div 
                  key={task.id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-widest border ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {task.priority}
                    </span>
                    <div className="h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                      {task.assignee}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-[15px] leading-snug group-hover:text-emerald-600 transition-colors">{task.title}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <h3 className="text-2xl font-black mb-1">{selectedTask.title}</h3>
            <p className="text-sm font-bold text-slate-500 mb-6 border-b border-slate-100 pb-4">Assigned to: {selectedTask.assignee}</p>

            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Move to Status</label>
            <select 
              className="w-full p-4 border border-slate-200 bg-slate-50 rounded-xl mb-6 font-black text-slate-800 outline-none focus:ring-4 focus:ring-emerald-500/10"
              value={selectedTask.status}
              onChange={(e) => {
                moveTask(selectedTask, e.target.value);
                setSelectedTask(null);
              }}
            >
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Status History View</h4>
            <div className="space-y-3">
              <div className="flex gap-4 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                <div className="flex-1 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Created Task</span> <br/><span className="text-xs font-bold text-slate-400">Oct 12, 10:00 AM</span>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedTask(null)} className="w-full mt-8 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-colors">
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
