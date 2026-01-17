import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
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
import HeroImage from "../../hero-image.jpg";
import defaultLogo from "../../logo.png";
import WizkidImage from "../../Wizkid.jpg";
import TemsImage from "../../Tems.jpg";
import JebizImage from "../../Jebiz.jpeg";

export function LandingPage() {
    const navigate = useNavigate();
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [clickedImage, setClickedImage] = useState<string | null>(null);

    const handleImageInteraction = (imageName: string) => {
        setHoveredImage(imageName);
        setClickedImage(imageName);
        // Reset clicked after animation completes
        setTimeout(() => setClickedImage(null), 300);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={defaultLogo} alt="GeniusWav" className="w-10 h-10 rounded-xl object-contain" />
                        <span className="text-xl font-bold tracking-tight">Genius<span className="text-primary">Wav</span></span>
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
            <section className="relative pt-[50px] pb-20 md:pt-[82px] md:pb-32 overflow-hidden">
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

                <div className="max-w-7xl mx-auto px-4 text-center relative py-16 md:py-24 min-h-[600px] md:min-h-[800px]">
                    {/* Hero Image Background */}
                    <div 
                        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-30 blur-sm"
                        style={{
                            backgroundImage: `url(${HeroImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                        <Star className="w-4 h-4" /> Nigeria's Biggest Digital Contest
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 relative z-10">
                        YOUR WAV, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">YOUR LEGACY.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 relative z-10">
                        The stage is set for the next superstar. Showcase your talent, win massive prizes, and get recognized by industry leaders across Nigeria.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 relative z-10">
                        <Button
                            size="lg"
                            onClick={() => navigate("/portal?mode=signup")}
                            className="w-full sm:w-auto rounded-full px-10 h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 group"
                        >
                            Join the Contest <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* Floating Visuals */}
                <div className="mt-20 max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 md:gap-8 opacity-50">
                    {/* Wizkid Image */}
                    <div 
                        className="relative group"
                        onMouseEnter={() => setHoveredImage("wizkid")}
                        onMouseLeave={() => setHoveredImage(null)}
                        onClick={() => handleImageInteraction("wizkid")}
                    >
                        <div className="aspect-[4/5] bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105">
                            <img src={WizkidImage} alt="Wizkid" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <Badge 
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-lg transition-all duration-300 ${
                                hoveredImage === "wizkid" || clickedImage === "wizkid" 
                                    ? "opacity-100 translate-y-2 animate-in slide-in-from-bottom-2 fade-in" 
                                    : "opacity-0 translate-y-0 pointer-events-none"
                            }`}
                        >
                            Wizkid
                        </Badge>
                    </div>

                    {/* Tems Image */}
                    <div 
                        className="relative group transform translate-y-12"
                        onMouseEnter={() => setHoveredImage("tems")}
                        onMouseLeave={() => setHoveredImage(null)}
                        onClick={() => handleImageInteraction("tems")}
                    >
                        <div className="aspect-[4/5] bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105">
                            <img src={TemsImage} alt="Tems" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <Badge 
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-lg transition-all duration-300 ${
                                hoveredImage === "tems" || clickedImage === "tems" 
                                    ? "opacity-100 translate-y-2 animate-in slide-in-from-bottom-2 fade-in" 
                                    : "opacity-0 translate-y-0 pointer-events-none"
                            }`}
                        >
                            Tems
                        </Badge>
                    </div>

                    {/* Jebiz Image */}
                    <div 
                        className="relative group"
                        onMouseEnter={() => setHoveredImage("jebiz")}
                        onMouseLeave={() => setHoveredImage(null)}
                        onClick={() => handleImageInteraction("jebiz")}
                    >
                        <div className="aspect-[4/5] bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105">
                            <img src={JebizImage} alt="Jebiz" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <Badge 
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-lg transition-all duration-300 ${
                                hoveredImage === "jebiz" || clickedImage === "jebiz" 
                                    ? "opacity-100 translate-y-2 animate-in slide-in-from-bottom-2 fade-in" 
                                    : "opacity-0 translate-y-0 pointer-events-none"
                            }`}
                        >
                            Jebiz
                        </Badge>
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
                            <p className="text-3xl md:text-5xl font-black mb-2">1k+</p>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Contestants</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-5xl font-black mb-2">24/7</p>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Voting</p>
                        </div>
                        <div>
                            <p className="text-3xl md:text-5xl font-black mb-2">5+</p>
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
                            <p className="text-slate-400">Film a high-quality video showcasing your original talent or a cover. Make sure we can hear your voice clearly!</p>
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
                            Registration for the current contest ends on the 16th of February 2026. Don't miss your chance to shine on the national stage.
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
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                        <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <p className="text-slate-600 text-xs">© 2026 GeniusWav Talent. All artists reserved.</p>
                </div>
            </footer>
        </div>
    );
}
