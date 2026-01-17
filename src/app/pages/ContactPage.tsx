import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Phone, Instagram, Mail } from "lucide-react";
import defaultLogo from "../../logo.png";
import BgImage from "../../bg.jpg";

export function ContactPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={defaultLogo} alt="GeniusWav" className="w-10 h-10 rounded-xl object-contain" />
                        <span className="text-xl font-bold tracking-tight">Genius<span className="text-primary">Wav</span></span>
                    </div>
                    <Button 
                        onClick={() => navigate("/")} 
                        variant="outline"
                        className="rounded-full px-6 border-white/10 hover:bg-white/5 text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </nav>

            {/* Background */}
            <div className="fixed inset-0 -z-20 select-none">
                <div className="absolute inset-0 bg-slate-950/95 z-10" />
                <img
                    src={BgImage}
                    alt=""
                    className="w-full h-full object-cover opacity-20 blur-2xl scale-110"
                />
            </div>

            {/* Content */}
            <div className="relative pt-32 pb-20 md:pt-40 md:pb-32">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-slate-400 mb-12 text-sm md:text-base">
                        Have questions about the GeniusWav Music Contest? We're here to help!
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Phone Contact */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                                <Phone className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Phone</h2>
                            <p className="text-slate-400 mb-4">Call us for immediate assistance</p>
                            <a 
                                href="tel:+2349060911811" 
                                className="text-primary text-lg font-semibold hover:underline inline-flex items-center gap-2"
                            >
                                +12027718304
                            </a>
                            <p className="text-slate-500 text-sm mt-2">Available Monday - Friday, 9 AM - 5 PM WAT</p>
                        </div>

                        {/* Instagram Contact */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                                <Instagram className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Instagram</h2>
                            <p className="text-slate-400 mb-4">Follow us and send us a DM</p>
                            <a 
                                href="https://www.instagram.com/geniuswav?igsh=MXkwMjlwdDFkMnVzeQ==" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary text-lg font-semibold hover:underline inline-flex items-center gap-2"
                            >
                                @geniuswav
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <p className="text-slate-500 text-sm mt-2">We respond within 24 hours</p>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                            Whether you have questions about registration, contest rules, technical issues, or anything else related 
                            to the GeniusWav Music Contest, we're here to help. Choose the contact method that's most convenient for you.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                <div>
                                    <p className="font-semibold text-white mb-1">Registration & Entry Questions</p>
                                    <p className="text-slate-400 text-sm">Have questions about how to register or submit your video? We can guide you through the process.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                <div>
                                    <p className="font-semibold text-white mb-1">Payment & Entry Fees</p>
                                    <p className="text-slate-400 text-sm">Need help with payment processing or have questions about entry fees? We're here to assist.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                <div>
                                    <p className="font-semibold text-white mb-1">Technical Support</p>
                                    <p className="text-slate-400 text-sm">Experiencing issues with video upload, account access, or platform functionality? Contact us for technical assistance.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                <div>
                                    <p className="font-semibold text-white mb-1">Contest Rules & Guidelines</p>
                                    <p className="text-slate-400 text-sm">Need clarification on contest rules, terms, or eligibility requirements? We're happy to explain.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="border-t border-white/10 pt-8">
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={() => navigate("/terms")}
                                variant="outline"
                                className="rounded-full border-white/10 hover:bg-white/5 text-white"
                            >
                                Terms & Conditions
                            </Button>
                            <Button
                                onClick={() => navigate("/privacy")}
                                variant="outline"
                                className="rounded-full border-white/10 hover:bg-white/5 text-white"
                            >
                                Privacy Policy
                            </Button>
                            <Button
                                onClick={() => navigate("/")}
                                variant="outline"
                                className="rounded-full border-white/10 hover:bg-white/5 text-white"
                            >
                                Home
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
