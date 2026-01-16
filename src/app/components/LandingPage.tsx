import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import {
    Music,
    Trophy,
    Users,
    Star,
    ArrowRight,
    Music2,
    Mic2,
    Radio,
    PlayCircle
} from "lucide-react";
import BgImage from "../../bg.jpg";
import defaultLogo from "../../logo.png";

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={defaultLogo} alt="GeniusWave" className="w-10 h-10 rounded-xl object-contain" />
                        <span className="text-xl font-bold tracking-tight">Genius<span className="text-primary">Wave</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>

                    </div>
                    <Button onClick={() => navigate("/portal")} className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20">
                        Login
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 -z-20 select-none">
                    <div className="absolute inset-0 bg-slate-950/90 z-10" />
                    <img
                        src={BgImage}
                        alt=""
                        className="w-full h-full object-cover opacity-30 blur-md scale-110"
                    />
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[128px] rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 blur-[128px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Star className="w-4 h-4" /> Nigeria's Biggest Digital Music Contest
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        YOUR WAVE, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">YOUR LEGACY.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        The stage is set for the next superstar. Showcase your talent, win massive prizes, and get recognized by industry leaders across Nigeria.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <Button
                            size="lg"
                            onClick={() => navigate("/portal?mode=signup")}
                            className="w-full sm:w-auto rounded-full px-10 h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 group"
                        >
                            Join the Contest <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto rounded-full px-10 h-16 text-lg font-bold border-white/10 hover:bg-white/5 text-white"
                            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            How it works
                        </Button>
                    </div>
                </div>

                {/* Floating Visuals / Placeholders */}
                <div className="mt-20 max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 md:gap-8 opacity-50">
                    <div className="aspect-[4/5] bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center">
                        <Mic2 className="w-12 h-12 text-slate-700" />
                    </div>
                    <div className="aspect-[4/5] bg-slate-900 rounded-3xl border border-white/5 overflow-hidden transform translate-y-12 flex items-center justify-center">
                        <Music2 className="w-12 h-12 text-slate-700" />
                    </div>
                    <div className="aspect-[4/5] bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center">
                        <Radio className="w-12 h-12 text-slate-700" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white/5 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-3xl md:text-5xl font-black mb-2">₦5M+</p>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Prizes</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-5xl font-black mb-2">10k+</p>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Contestants</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-5xl font-black mb-2">24/7</p>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Voting</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-5xl font-black mb-2">50+</p>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Industry Judges</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="how-it-works" className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-3xl md:text-6xl font-black mb-6">HOW IT WORKS</h2>
                        <div className="w-20 h-2 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="relative group">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <PlayCircle className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Record Your Video</h3>
                            <p className="text-slate-400">Film a high-quality video of you performing your original music or a cover. Make sure we can hear your voice clearly!</p>
                            <span className="absolute -top-4 -left-4 text-8xl font-black text-white/5 pointer-events-none">01</span>
                        </div>

                        <div className="relative group">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Register & Upload</h3>
                            <p className="text-slate-400">Join the GeniusWave portal, pay your entry fee, and upload your video to enter the current active contest.</p>
                            <span className="absolute -top-4 -left-4 text-8xl font-black text-white/5 pointer-events-none">02</span>
                        </div>

                        <div className="relative group">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Trophy className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Win & Promote</h3>
                            <p className="text-slate-400">Get judged by experts. Winners get cash prizes, and top performers get promoted to future contests for free!</p>
                            <span className="absolute -top-4 -left-4 text-8xl font-black text-white/5 pointer-events-none">03</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-slate-950 to-primary/20">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="p-12 md:p-24 rounded-[3rem] bg-slate-900 border border-white/5 overflow-hidden relative shadow-2xl">
                        {/* Background blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] pointer-events-none" />

                        <h2 className="text-4xl md:text-6xl font-black mb-8 relative">READY TO BE THE NEXT <br /><span className="text-primary italic">BIG THING?</span></h2>
                        <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative underline underline-offset-8 decoration-primary/30">
                            Registration for the current contest ends in 5 days. Don't miss your chance to shine on the national stage.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate("/portal?mode=signup")}
                            className="rounded-full px-12 h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 relative"
                        >
                            Start My Journey
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3 grayscale opacity-60">
                        <img src={defaultLogo} alt="GeniusWave" className="w-8 h-8 rounded-lg object-contain" />
                        <span className="text-lg font-bold tracking-tight">GeniusWave</span>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-500 font-medium">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <p className="text-slate-600 text-xs">© 2026 GeniusWave Music. All artists reserved.</p>
                </div>
            </footer>
        </div>
    );
}
