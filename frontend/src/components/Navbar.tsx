import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const Navbar = () => {
    const { scrollY } = useScroll();
    const navBackground = useTransform(scrollY, [0, 50], ['rgba(248, 250, 252, 0)', 'rgba(255, 255, 255, 0.7)']);
    const navBorder = useTransform(scrollY, [0, 50], ['rgba(226, 232, 240, 0)', 'rgba(255, 255, 255, 0.5)']);
    const navShadow = useTransform(scrollY, [0, 50], ['none', '0 10px 40px -10px rgba(0,0,0,0.05)']);
    const navBackdrop = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(20px)']);

    return (
        <motion.nav
            style={{
                backgroundColor: navBackground,
                borderColor: navBorder,
                boxShadow: navShadow,
                backdropFilter: navBackdrop
            }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 border-b lg:px-12"
        >
            <div className="flex items-center space-x-2">
                {/* Sleek Gradient Logo */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                    Verity
                </span>
            </div>

            <div className="hidden space-x-8 md:flex items-center px-6 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
                {['Product', 'Intelligence', 'Integration'].map((item) => (
                    <Link
                        key={item}
                        to={`#${item.toLowerCase()}`}
                        className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                        {item}
                    </Link>
                ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                    Sign In
                </Link>
                <Link to="/register" className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-slate-900 border border-transparent rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
            </div>
        </motion.nav>
    );
};

export default Navbar;
