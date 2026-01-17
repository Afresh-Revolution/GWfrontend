import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import defaultLogo from "../../logo.png";
import BgImage from "../../bg.jpg";

export function TermsPage() {
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
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Terms & Conditions</h1>
                    <p className="text-slate-400 mb-12 text-sm md:text-base">Last updated: January 2026</p>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                            <p className="mb-4">
                                By participating in the GeniusWav Music Contest ("Contest"), you agree to be bound by these Terms and Conditions. 
                                If you do not agree with any part of these terms, you must not participate in the Contest.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Video Content and Rights</h2>
                            <div className="space-y-3">
                                <p>
                                    <strong className="text-white">2.1 Video Submission:</strong> By submitting your video entry, you grant GeniusWav and its affiliates, partners, and licensees the following rights:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>The right to use, reproduce, distribute, display, and perform your video content in any media format, now known or hereafter developed, worldwide and in perpetuity.</li>
                                    <li>The right to create derivative works, remixes, edits, and adaptations of your video content.</li>
                                    <li>The right to use your video for promotional, marketing, advertising, and commercial purposes.</li>
                                    <li>The right to share your video across all social media platforms, including but not limited to Instagram, Facebook, Twitter, TikTok, YouTube, and any other platforms.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Viral Content and Full Consent</h2>
                            <div className="bg-white/5 border border-primary/20 rounded-xl p-6 mb-4">
                                <p className="font-bold text-white mb-3">⚠️ Important Notice:</p>
                                <p>
                                    You understand and acknowledge that if your video goes viral or gains significant public attention, you provide full and irrevocable consent for GeniusWav to:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-3 space-y-2">
                                    <li>Use your video content in any manner deemed appropriate by GeniusWav.</li>
                                    <li>Monetize your video content through advertising, sponsorships, partnerships, or any other commercial arrangements.</li>
                                    <li>License your video content to third parties for promotional, commercial, or entertainment purposes.</li>
                                    <li>Create and distribute remixes, edits, compilations, or other derivative works based on your video.</li>
                                    <li>Use your name, likeness, and biographical information in connection with the video content.</li>
                                </ul>
                            </div>
                            <p className="text-slate-400 italic">
                                This consent cannot be revoked, even if your video is removed from the Contest or you are disqualified.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Remixing and Derivative Works</h2>
                            <p className="mb-3">
                                You expressly authorize and consent to GeniusWav and its licensees creating remixes, mashups, edits, compilations, 
                                and any other derivative works based on your submitted video. This includes but is not limited to:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Creating promotional videos and advertisements featuring your content.</li>
                                <li>Combining your video with other contest entries or content.</li>
                                <li>Editing, cutting, or modifying your video for any purpose.</li>
                                <li>Adding music, graphics, text overlays, or other elements to your video.</li>
                            </ul>
                            <p className="mt-4 text-slate-400 italic">
                                You waive any moral rights or claims to attribution regarding derivative works created from your video.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Social Media Sharing</h2>
                            <p className="mb-3">
                                By entering the Contest, you consent to GeniusWav sharing your video across all social media platforms including:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                                <li>Instagram (including Instagram Stories, Reels, and IGTV)</li>
                                <li>Facebook (including Facebook Stories, Watch, and News Feed)</li>
                                <li>Twitter/X</li>
                                <li>TikTok</li>
                                <li>YouTube</li>
                                <li>LinkedIn</li>
                                <li>Any other current or future social media or digital platforms</li>
                            </ul>
                            <p>
                                You understand that once your video is shared on these platforms, it may be shared, reposted, or used by third parties, 
                                and GeniusWav is not responsible for such third-party use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Entry Fee - Non-Refundable</h2>
                            <div className="bg-white/5 border border-primary/20 rounded-xl p-6">
                                <p className="font-bold text-white mb-3">💰 Entry Fee Policy:</p>
                                <p>
                                    All entry fees paid to participate in the GeniusWav Music Contest are <strong className="text-white">NON-REFUNDABLE</strong> under any circumstances, including but not limited to:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-3 space-y-2">
                                    <li>Withdrawal from the Contest at any time.</li>
                                    <li>Disqualification from the Contest for any reason.</li>
                                    <li>Rejection of your video submission.</li>
                                    <li>Cancellation or postponement of the Contest.</li>
                                    <li>Technical issues or errors in submission.</li>
                                    <li>Change of mind or personal circumstances.</li>
                                </ul>
                                <p className="mt-4 text-slate-400 italic">
                                    By paying the entry fee, you acknowledge that you have read, understood, and agree to this non-refundable policy.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Eligibility and Requirements</h2>
                            <p className="mb-3">
                                To participate in the Contest, you must:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Be at least 18 years of age or have parental/guardian consent.</li>
                                <li>Be a resident of Nigeria or meet other eligibility requirements as specified.</li>
                                <li>Submit original content that you own or have the right to use.</li>
                                <li>Pay the non-refundable entry fee as specified.</li>
                                <li>Comply with all Contest rules and guidelines.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>
                            <p>
                                While you retain ownership of the original copyright in your video content, you grant GeniusWav the comprehensive 
                                rights outlined in these Terms. GeniusWav may claim copyright in derivative works, compilations, and promotional 
                                materials created using your content.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Disqualification</h2>
                            <p>
                                GeniusWav reserves the right to disqualify any participant who violates these Terms, submits inappropriate content, 
                                engages in fraudulent activity, or otherwise fails to comply with Contest rules. Disqualified participants forfeit 
                                any entry fees paid and rights to prizes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
                            <p>
                                GeniusWav and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive 
                                damages arising from your participation in the Contest, including but not limited to loss of profits, data, or 
                                business opportunities.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
                            <p>
                                GeniusWav reserves the right to modify these Terms and Conditions at any time. Continued participation in the 
                                Contest after changes are posted constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Contact</h2>
                            <p>
                                If you have any questions about these Terms and Conditions, please contact us at:
                            </p>
                            <ul className="list-none ml-4 mt-3 space-y-2">
                                <li>📞 Phone: <a href="tel:+2349060911811" className="text-primary hover:underline">+234 906 091 1811</a></li>
                                <li>📱 Instagram: <a href="https://www.instagram.com/geniuswav?igsh=MXkwMjlwdDFkMnVzeQ==" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@geniuswav</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
