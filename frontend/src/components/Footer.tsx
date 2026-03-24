import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full pt-20 pb-10 bg-white border-t border-slate-200 z-10 relative">
            <div className="max-w-[1200px] px-6 mx-auto lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="flex flex-col md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-sm">
                                <div className="w-2 h-2 bg-white rounded-sm rotate-45"></div>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">Verity</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                            The standard for verifiable academic intelligence. Eliminating the free-rider problem with irrefutable GitHub commit analysis.
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
                        <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-medium">
                            <li><a href="#features" className="hover:text-emerald-600 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-medium">
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Community Help</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-medium">
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm font-medium">
                        © {new Date().getFullYear()} Verity Academic Intelligence. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>All systems operational</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
