import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import defaultLogo from "../../logo.png";
import BgImage from "../../bg.jpg";

export function PrivacyPage() {
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
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-400 mb-12 text-sm md:text-base">Last updated: January 2026</p>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p className="mb-4">
                                GeniusWav is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                                use, disclose, and safeguard your information when you participate in the GeniusWav Music Contest and use our platform.
                            </p>
                            <p>
                                By using our services and participating in the Contest, you consent to the collection and use of your information 
                                as described in this Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">2.1 Personal Information</h3>
                                    <p className="mb-2">We collect personal information that you provide directly to us, including:</p>
                                    <ul className="list-disc list-inside ml-4 space-y-2">
                                        <li>Full name</li>
                                        <li>Email address</li>
                                        <li>Phone number</li>
                                        <li>Bank account details (for prize payments)</li>
                                        <li>Payment information (processed securely through our payment partners)</li>
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">2.2 Video Content</h3>
                                    <p className="mb-2">We collect and store the video content you submit to the Contest, including:</p>
                                    <ul className="list-disc list-inside ml-4 space-y-2">
                                        <li>Video files and associated metadata</li>
                                        <li>Audio content</li>
                                        <li>Thumbnails and preview images</li>
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">2.3 Usage Information</h3>
                                    <p className="mb-2">We automatically collect certain information when you use our platform:</p>
                                    <ul className="list-disc list-inside ml-4 space-y-2">
                                        <li>IP address and device information</li>
                                        <li>Browser type and version</li>
                                        <li>Pages visited and time spent on pages</li>
                                        <li>Date and time of access</li>
                                        <li>Referring website addresses</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="mb-3">We use the information we collect for various purposes, including:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Processing your Contest registration and entry</li>
                                <li>Managing and administering the Contest</li>
                                <li>Displaying, promoting, and sharing your video content as described in our Terms and Conditions</li>
                                <li>Communicating with you about the Contest, updates, and important information</li>
                                <li>Processing payments and prize distributions</li>
                                <li>Improving our platform and services</li>
                                <li>Detecting and preventing fraud, abuse, or illegal activity</li>
                                <li>Complying with legal obligations</li>
                                <li>Marketing and promotional purposes (with your consent where required)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
                            <div className="space-y-3">
                                <p>We may share your information in the following circumstances:</p>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">4.1 Video Content</h3>
                                    <p className="mb-2">
                                        Your video content may be shared publicly on our platform and across social media platforms as described 
                                        in our Terms and Conditions. This includes:
                                    </p>
                                    <ul className="list-disc list-inside ml-4 space-y-2">
                                        <li>Public display on the GeniusWav website</li>
                                        <li>Sharing on social media platforms (Instagram, Facebook, Twitter, TikTok, YouTube, etc.)</li>
                                        <li>Inclusion in promotional materials and advertisements</li>
                                        <li>Licensing to third-party partners and media outlets</li>
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">4.2 Service Providers</h3>
                                    <p>
                                        We may share your information with third-party service providers who perform services on our behalf, 
                                        such as payment processing, cloud storage, analytics, and marketing services.
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">4.3 Legal Requirements</h3>
                                    <p>
                                        We may disclose your information if required by law, court order, or governmental authority, 
                                        or to protect our rights, property, or safety, or that of others.
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">4.4 Business Transfers</h3>
                                    <p>
                                        In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                                        to the acquiring entity.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                            <p className="mb-3">
                                We implement appropriate technical and organizational measures to protect your personal information against 
                                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
                                Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                            </p>
                            <p>
                                We use encryption, secure servers, and other security measures to protect your data. Payment information 
                                is processed through secure, PCI-compliant payment processors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
                            <p>
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                                Privacy Policy, unless a longer retention period is required or permitted by law. Video content may be 
                                retained indefinitely for promotional and archival purposes as described in our Terms and Conditions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
                            <div className="space-y-3">
                                <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>The right to access your personal information</li>
                                    <li>The right to correct inaccurate information</li>
                                    <li>The right to request deletion of your personal information (subject to legal and contractual obligations)</li>
                                    <li>The right to object to processing of your personal information</li>
                                    <li>The right to data portability</li>
                                    <li>The right to withdraw consent (where processing is based on consent)</li>
                                </ul>
                                <p className="mt-4 text-slate-400 italic">
                                    Please note that exercising certain rights may affect your ability to participate in the Contest or 
                                    use certain features of our platform.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
                            <p className="mb-3">
                                We use cookies and similar tracking technologies to collect information about your use of our platform. 
                                You can control cookies through your browser settings; however, disabling cookies may limit your ability 
                                to use certain features of our platform.
                            </p>
                            <p>We use cookies for:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                                <li>Authentication and session management</li>
                                <li>Remembering your preferences</li>
                                <li>Analyzing platform usage and performance</li>
                                <li>Delivering personalized content and advertisements</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links</h2>
                            <p>
                                Our platform may contain links to third-party websites, services, or social media platforms. We are not 
                                responsible for the privacy practices of these third parties. We encourage you to review the privacy 
                                policies of any third-party sites you visit.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
                            <p>
                                Our Contest is open to participants aged 18 and above, or those with parental/guardian consent. We do not 
                                knowingly collect personal information from children under 18 without appropriate consent. If we become aware 
                                that we have collected information from a child without consent, we will take steps to delete such information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. International Data Transfers</h2>
                            <p>
                                Your information may be transferred to and processed in countries other than your country of residence. 
                                These countries may have data protection laws that differ from those in your country. By using our services, 
                                you consent to such transfers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
                                the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services 
                                after such changes constitutes acceptance of the updated Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
                            <p className="mb-3">
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                                please contact us at:
                            </p>
                            <ul className="list-none ml-4 space-y-2">
                                <li>Phone: <a href="tel:+12027718304" className="text-primary hover:underline">+12027718304</a></li>
                                <li>Instagram: <a href="https://www.instagram.com/geniuswav?igsh=MXkwMjlwdDFkMnVzeQ==" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@geniuswav</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
