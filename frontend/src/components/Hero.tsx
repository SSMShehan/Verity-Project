import { ArrowRight, Activity, ShieldCheck, Github, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion, type Variants } from 'framer-motion';

const Hero = () => {
    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
    };

    return (
        <section className="relative flex flex-col items-center justify-center w-full max-w-[1400px] px-6 mx-auto pt-32 pb-20 lg:px-8">

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center text-center max-w-4xl z-10"
            >
                <motion.div variants={fadeInUp} className="group cursor-pointer inline-flex items-center space-x-2 px-3 py-1.5 mb-8 rounded-full border border-emerald-200/50 bg-emerald-50/50 backdrop-blur-md hover:bg-white hover:border-emerald-300 transition-all shadow-sm">
                    <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold tracking-wide text-emerald-700">Verity Intelligence Engine 2.0</span>
                    <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-[-0.04em] text-slate-900 leading-[0.95] mb-6"
                >
                    The standard for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">
                        academic fairness.
                    </span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="max-w-2xl text-[1.3rem] text-slate-600 font-medium leading-relaxed mb-10">
                    Eliminate the free-rider problem. Verity triangulates GitHub commits, time logs, and task completion into one irrefutable contribution score.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link to="/register" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-emerald-600 rounded-2xl hover:bg-emerald-700 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10 flex items-center">
                            Start Building Teams
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    <Link to="#demo" className="flex items-center px-8 py-4 space-x-2 text-base font-bold transition-all bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-full text-slate-700 hover:bg-white hover:shadow-lg shadow-sm active:scale-95">
                        <span>View Dashboard Matrix</span>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Epic 3D Floating UI Composition */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 25, delay: 0.6 }}
                className="relative w-full max-w-6xl mt-24 aspect-[16/9] lg:aspect-[21/9]"
            >
                <Tilt
                    tiltMaxAngleX={4}
                    tiltMaxAngleY={4}
                    perspective={2000}
                    scale={1.02}
                    transitionSpeed={2500}
                    className="w-full h-full"
                >
                    {/* Main Glass Dashboard */}
                    <div className="absolute inset-0 rounded-[2rem] bg-white/60 backdrop-blur-3xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)] overflow-hidden flex flex-col transform-gpu">

                        {/* Top Chrome */}
                        <div className="h-14 flex items-center px-6 border-b border-slate-200/50 bg-white/40">
                            <div className="flex space-x-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                            </div>
                            <div className="mx-auto flex items-center px-6 py-1.5 text-xs font-semibold text-slate-500 bg-white/50 rounded-full border border-slate-200/50 shadow-sm">
                                app.verity.edu / workspace / group-alpha
                            </div>
                        </div>

                        {/* Dashboard Mock Interior */}
                        <div className="flex-1 p-8 grid grid-cols-12 gap-6 opacity-90">
                            {/* Left Column (Sidebar) */}
                            <div className="col-span-3 h-full rounded-2xl bg-white/50 border border-slate-100 flex flex-col p-4 space-y-4">
                                <div className="h-8 w-2/3 bg-slate-200/50 rounded-lg"></div>
                                <div className="flex-1 space-y-3 pt-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-full bg-slate-100 rounded-md"></div>)}
                                </div>
                            </div>

                            {/* Middle Metrics */}
                            <div className="col-span-9 grid grid-cols-3 gap-6 h-32">
                                <div className="col-span-1 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-white shadow-sm p-6 flex flex-col justify-between">
                                    <div className="flex items-center space-x-2 text-slate-500"><Github className="w-4 h-4 text-emerald-600" /><span className="text-sm font-bold">Commits</span></div>
                                    <div className="text-4xl font-black text-slate-800 tracking-tight">248</div>
                                </div>
                                <div className="col-span-1 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-white shadow-sm p-6 flex flex-col justify-between">
                                    <div className="flex items-center space-x-2 text-slate-500"><ShieldCheck className="w-4 h-4 text-emerald-600" /><span className="text-sm font-bold">Risk Status</span></div>
                                    <div className="text-4xl font-black text-slate-800 tracking-tight">Safe</div>
                                </div>
                                <div className="col-span-1 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-white shadow-sm p-6 flex flex-col justify-between">
                                    <div className="flex items-center space-x-2 text-slate-500"><Activity className="w-4 h-4 text-emerald-600" /><span className="text-sm font-bold">Health Score</span></div>
                                    <div className="text-4xl font-black text-slate-800 tracking-tight">96<span className="text-lg text-slate-400">/100</span></div>
                                </div>

                                {/* Big Graph Panel */}
                                <div className="col-span-3 h-full min-h-[160px] rounded-2xl bg-white/80 border border-white shadow-sm p-6 relative overflow-hidden">
                                    <div className="text-sm font-bold text-slate-800 mb-6">Contribution Velocity (Sprint 4)</div>
                                    <div className="flex items-baseline space-x-2 h-full px-2 w-full justify-between">
                                        {/* Fake Bars */}
                                        {[20, 40, 30, 70, 50, 90, 80, 100, 60].map((h, i) => (
                                            <div key={i} className="w-12 bg-emerald-100 rounded-t-lg relative group overflow-hidden" style={{ height: `${h}%` }}>
                                                <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all" style={{ height: `${h * 0.7}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tilt>
            </motion.div>
        </section>
    );
};

export default Hero;
