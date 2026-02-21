import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import ParticleNetwork from '../components/ParticleNetwork';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200 text-slate-900 overflow-hidden">

            {/* Immersive Mesh Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <ParticleNetwork />
                {/* Top Right Cyan/Blue Glow */}
                <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-b from-cyan-300/40 to-blue-400/20 blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow object-cover" style={{ animationDuration: '10s' }} />

                {/* Center Left Fuchsia Glow */}
                <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[60vw] rounded-full bg-gradient-to-tr from-fuchsia-300/30 to-purple-400/20 blur-[140px] mix-blend-multiply opacity-60" />

                {/* Bottom Center Emerald Glow */}
                <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] rounded-full bg-gradient-to-t from-emerald-200/40 to-teal-300/20 blur-[120px] mix-blend-multiply opacity-50" />

                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-40"></div>
            </div>

            <Navbar />

            <main className="relative z-10 flex flex-col items-center w-full">
                <Hero />
                <Features />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
