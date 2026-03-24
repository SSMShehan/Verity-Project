import { BrainCircuit, Fingerprint, FolderSync, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
    return (
        <section id="features" className="w-full max-w-[1200px] px-6 mx-auto lg:px-8 py-32 z-10">

            <div className="text-center mb-20 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
                    Everything you need to <span className="text-emerald-600">verify.</span>
                </h2>
                <p className="text-xl text-slate-600 font-medium">
                    A suite of academic tools designed to seamlessly integrate into student workflows while providing lecturers with absolute visibility.
                </p>
            </div>

            {/* Bento Box Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                {/* Large Feature 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="md:col-span-2 relative p-10 bg-white border border-slate-200/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col md:flex-row items-center justify-between"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col h-full justify-between w-full max-w-sm mb-8 md:mb-0">
                        <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                            <BrainCircuit className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">AI Fairness Intelligence</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Proprietary rule engine detects unequal contributions, flags last-minute work, and calculates irrefutable contribution matrices.
                            </p>
                        </div>
                    </div>

                    {/* Custom Animated UI Representation */}
                    <div className="relative z-10 w-full max-w-[280px] h-[200px] flex items-center justify-center">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {/* Outer dashed ring spinning */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-[2px] border-dashed border-emerald-200 rounded-full"
                            />
                            {/* Inner dashed ring spinning opposite */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-6 border border-dashed border-teal-300 rounded-full"
                            />

                            {/* Pulsing Core */}
                            <motion.div
                                animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center"
                            >
                                <div className="w-6 h-6 bg-white rounded-full blur-[2px] opacity-80" />
                            </motion.div>

                            {/* Orbiting data node */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="w-4 h-4 bg-white border border-emerald-100 rounded-full absolute -top-2 left-1/2 -translate-x-1/2 shadow-lg shadow-emerald-200 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Small Feature 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="md:col-span-1 relative p-8 bg-white border border-slate-200/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-xl hover:border-emerald-200 transition-all"
                >
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-emerald-100 to-fuchsia-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity" />

                    {/* Git Sync Visual */}
                    <div className="absolute top-6 right-4 lg:right-8 z-0 w-32 h-32 flex items-center justify-center pointer-events-none opacity-80 scale-90 sm:scale-100">
                        <div className="relative w-full h-full max-w-[160px] flex items-center">
                            <svg className="absolute w-full h-full text-emerald-200" preserveAspectRatio="none">
                                <path d="M 0 64 L 120 64" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                                <path d="M 60 64 Q 80 64 80 30" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                            </svg>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute left-[0px] top-[56px] w-4 h-4 bg-emerald-500 rounded-full border-2 border-white z-10 shadow-sm"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.25, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                className="absolute left-[60px] top-[54px] w-5 h-5 bg-fuchsia-500 rounded-full border-2 border-white z-10 shadow-sm"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                className="absolute left-[120px] top-[56px] w-4 h-4 bg-emerald-500 rounded-full border-2 border-white z-10 shadow-sm"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                                className="absolute left-[72px] top-[22px] w-4 h-4 bg-fuchsia-400 rounded-full border-2 border-white z-10 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                            <FolderSync className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Native Git Sync</h3>
                            <p className="text-sm text-slate-600 font-medium">
                                Live GitHub API integration maps commits directly to academic modules.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Small Feature 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:col-span-1 relative p-8 bg-white border border-slate-200/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-xl hover:border-emerald-200 transition-all"
                >
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity" />

                    {/* Group Formation Visual */}
                    <div className="absolute top-4 right-4 lg:right-8 z-0 w-32 h-32 flex items-center justify-center pointer-events-none opacity-90 scale-90 sm:scale-100">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-[1.5px] border-dashed border-emerald-200 rounded-full"
                            >
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-sm" />
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-400 rounded-full shadow-sm" />
                                <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-emerald-300 rounded-full shadow-sm" />
                            </motion.div>

                            {/* Pulsing connections */}
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.05, 0.9] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-4 rounded-full bg-emerald-50"
                            />

                            <div className="relative w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center z-10 border-2 border-white">
                                <div className="w-4 h-4 bg-white rounded-full opacity-90 blur-[1px]" />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                            <Network className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Group Formation</h3>
                            <p className="text-sm text-slate-600 font-medium">
                                Find peers, send invites, and auto-generate grading IDs securely.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Large Feature 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="md:col-span-2 relative p-10 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.12)] overflow-hidden group hover:shadow-2xl hover:border-slate-700 transition-all flex flex-col md:flex-row items-center justify-between"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/20 to-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col h-full justify-between mb-8 md:mb-0">
                        <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-6">
                            <Fingerprint className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold tracking-tight text-white mb-3">Academic Hierarchy</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Built strictly for universities. Enroll via Years and Semesters, and match with Modules effortlessly.
                            </p>
                        </div>
                    </div>

                    {/* Network Nodes Animation */}
                    <div className="relative z-10 w-full max-w-[280px] h-[200px] flex items-center justify-center">
                        <div className="relative w-40 h-32">
                            {/* Top Node */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 z-10"
                            >
                                <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-pulse" />
                            </motion.div>

                            {/* Connecting Lines */}
                            <svg className="absolute top-6 left-0 w-full h-full text-slate-700" preserveAspectRatio="none">
                                <path d="M 80 0 L 30 60 M 80 0 L 130 60" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-50" strokeDasharray="4 4" />
                            </svg>

                            {/* Bottom Left Node */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-4 left-[5%] w-10 h-10 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center z-10"
                            >
                                <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                            </motion.div>

                            {/* Bottom Right Node */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                className="absolute bottom-4 right-[5%] w-10 h-10 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center z-10"
                            >
                                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Features;
