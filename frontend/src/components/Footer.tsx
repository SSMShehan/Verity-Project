import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
    theme?: 'student' | 'lecturer' | 'manager' | 'landing';
}

const Footer = ({ theme = 'landing' }: FooterProps) => {
    // Theme-based style maps
    const themes = {
        landing: {
            brandGradient: 'from-emerald-600 to-teal-500',
            hoverText: 'hover:text-emerald-600',
            dotColor: 'bg-emerald-500',
            bg: 'bg-white',
            border: 'border-slate-200'
        },
        student: {
            brandGradient: 'from-emerald-800 to-emerald-600',
            hoverText: 'hover:text-emerald-700',
            dotColor: 'bg-emerald-600',
            bg: 'bg-white',
            border: 'border-emerald-100'
        },
        lecturer: {
            brandGradient: 'from-indigo-800 to-indigo-600',
            hoverText: 'hover:text-indigo-700',
            dotColor: 'bg-indigo-600',
            bg: 'bg-white',
            border: 'border-indigo-100'
        },
        manager: {
            brandGradient: 'from-rose-800 to-rose-600',
            hoverText: 'hover:text-rose-700',
            dotColor: 'bg-rose-600',
            bg: 'bg-white',
            border: 'border-rose-100'
        }
    };

    const currentTheme = themes[theme];

    return (
        <footer className={`w-full pt-16 pb-10 ${currentTheme.bg} border-t ${currentTheme.border} z-10 relative`}>
            <div className="max-w-screen-2xl px-6 mx-auto lg:px-12">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="flex flex-col md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTheme.brandGradient} flex items-center justify-center shadow-md`}>
                                <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                                Verity<span className={theme === 'manager' ? 'text-rose-600' : theme === 'lecturer' ? 'text-indigo-600' : 'text-emerald-600'}>Sync</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                            The standard for verifiable academic intelligence. Eliminating the free-rider problem with irrefutable project governance.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-emerald-700 transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-rose-500 transition-colors"><Mail className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-bold">
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Project Tracking</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Contribution Scores</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Risk Analysis</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Integrations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Resources</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-bold">
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Documentation</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Academic Guides</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Help Center</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>API Status</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Platform</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-bold">
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>About Verity</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Privacy Policy</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Terms of Service</a></li>
                            <li><a href="#" className={`${currentTheme.hoverText} transition-colors`}>Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Verity Sync · SLIIT Academic Intelligence Portal
                    </p>
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <div className={`w-2 h-2 rounded-full ${currentTheme.dotColor} animate-pulse`}></div>
                        <span>Security Verified</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
