import { useState, useEffect } from 'react';
import { BookOpen, Users, User, LayoutGrid, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ManagerModules() {
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<any | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<any | null>(null);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [moduleDetails, setModuleDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/academic/years');
      const data = await res.json();
      setHierarchy(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModuleDetails = async (id: string) => {
    setLoadingDetails(true);
    setModuleDetails(null);
    try {
      const res = await fetch(`http://localhost:5000/api/academic/modules/${id}`);
      const data = await res.json();
      setModuleDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleYearClick = (year: any) => {
    setSelectedYear(year);
    setSelectedSemester(null);
    setSelectedModule(null);
    setModuleDetails(null);
  };

  const handleSemesterClick = (semester: any) => {
    setSelectedSemester(semester);
    setSelectedModule(null);
    setModuleDetails(null);
  };

  const handleModuleClick = (module: any) => {
    setSelectedModule(module);
    fetchModuleDetails(module.id);
  };

  return (
    <div className="animate-fade-up max-w-7xl mx-auto space-y-8 px-6">
      <div className="page-header border-b-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-rose-900 border-rose-200">Module Directory</h1>
          <p className="page-subtitle text-slate-500">Browse academic hierarchy, manage modules, and view student enrollment details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Browser */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Years */}
          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Academic Years
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {hierarchy.map(year => (
                <button
                  key={year.id}
                  onClick={() => handleYearClick(year)}
                  className={`p-4 rounded-2xl border-2 transition-all font-bold text-left ${
                    selectedYear?.id === year.id
                      ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-rose-200 text-slate-700 hover:bg-rose-50/30'
                  }`}
                >
                  {year.name}
                </button>
              ))}
              {hierarchy.length === 0 && (
                <div className="col-span-4 text-sm font-medium text-slate-400 p-4 text-center rounded-2xl border-2 border-dashed border-slate-200">
                  Loading academic structure...
                </div>
              )}
            </div>
          </section>

          {/* Semesters */}
          {selectedYear && (
            <section className="animate-fade-up">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-rose-300" />
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                  Semesters ({selectedYear.name})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedYear.semesters?.map((sem: any) => (
                  <button
                    key={sem.id}
                    onClick={() => handleSemesterClick(sem)}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-left flex justify-between items-center ${
                      selectedSemester?.id === sem.id
                        ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-rose-200 text-slate-700 hover:bg-rose-50/30'
                    }`}
                  >
                    <span>{sem.name}</span>
                    <span className="text-xs font-bold bg-white/60 px-2 py-1 rounded-lg">
                      {sem.modules?.length || 0} Modules
                    </span>
                  </button>
                ))}
                {!selectedYear.semesters?.length && (
                  <div className="col-span-2 text-sm font-medium text-slate-400 p-4 text-center rounded-2xl border-2 border-dashed border-slate-200">
                    No semesters defined for this year.
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Modules */}
          {selectedSemester && (
            <section className="animate-fade-up">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-4 h-4 text-rose-300" />
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                  Modules ({selectedSemester.name})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSemester.modules?.map((mod: any) => (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                      selectedModule?.id === mod.id
                        ? 'border-rose-600 bg-rose-50 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-rose-200 hover:bg-rose-50/30'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${selectedModule?.id === mod.id ? 'bg-rose-200 text-rose-900' : 'bg-slate-100 text-slate-500'}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-black ${selectedModule?.id === mod.id ? 'text-rose-900' : 'text-slate-800'}`}>
                        {mod.code}
                      </div>
                      <div className="text-sm font-bold text-slate-500 mt-0.5 line-clamp-2">
                        {mod.name}
                      </div>
                    </div>
                  </button>
                ))}
                {!selectedSemester.modules?.length && (
                  <div className="col-span-2 text-sm font-medium text-slate-400 p-4 text-center rounded-2xl border-2 border-dashed border-slate-200">
                    No modules available in this semester.
                  </div>
                )}
              </div>
            </section>
          )}

        </div>

        {/* Right Side: Module Details */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {!selectedModule ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-[400px]">
                <LayoutGrid className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-sm font-black text-slate-400 tracking-wider">NO MODULE SELECTED</h3>
                <p className="text-xs font-bold text-slate-400 mt-2 max-w-[200px]">Select a year, semester, and module to view details.</p>
              </div>
            ) : (
              <div className="card shadow-md animate-fade-left">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-rose-900 to-rose-950 text-white rounded-t-3xl relative overflow-hidden">
                  <BookOpen className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4 transform -rotate-12" />
                  <span className="text-xs font-black tracking-widest text-rose-300 uppercase block mb-1">
                    {selectedYear?.name} • {selectedSemester?.name}
                  </span>
                  <h2 className="text-3xl font-black mb-1">{selectedModule.code}</h2>
                  <p className="text-sm font-medium text-white/80">{selectedModule.name}</p>
                </div>

                <div className="p-6 space-y-6">
                  {loadingDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                    </div>
                  ) : moduleDetails ? (
                    <>
                      {/* Lecturers */}
                      <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <User className="w-4 h-4" /> Assigned Lecturers
                        </h3>
                        {moduleDetails.lecturers?.length > 0 ? (
                          <div className="space-y-3">
                            {moduleDetails.lecturers.map((lec: any) => (
                              <div key={lec.id} className="flex items-center gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center font-black text-sm shrink-0">
                                  {lec.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-slate-800">{lec.name}</div>
                                  <div className="text-xs font-medium text-slate-500">{lec.email}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            No lecturers assigned yet.
                          </div>
                        )}
                      </div>

                      {/* Students */}
                      <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Enrolled Students
                        </h3>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-slate-700">
                          <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                            <Users className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <div className="text-2xl font-black leading-none">{moduleDetails.semester?.users?.length || 0}</div>
                            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Total Enrolled</div>
                          </div>
                        </div>

                        {moduleDetails.semester?.users?.length > 0 && (
                          <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {moduleDetails.semester.users.map((student: any) => (
                              <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div className="max-w-[150px]">
                                    <div className="text-xs font-bold text-slate-800 truncate" title={student.name}>{student.name}</div>
                                    <div className="text-[10px] font-medium text-slate-400">{student.indexNumber || 'No ID'}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-sm font-medium text-red-500 py-8">
                      Failed to load details.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
