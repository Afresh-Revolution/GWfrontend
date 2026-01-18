import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Video, Upload, CreditCard, CheckCircle2, XCircle, LogOut,
  Trophy, Loader2, ArrowRight, Home, Settings, User, Lock, Banknote, Menu, X, Eye, EyeOff
} from "lucide-react";
import { PaymentModal } from "@/app/components/PaymentModal";
import { videosAPI, paymentsAPI, authAPI } from "@/services/api";
import { toast } from "sonner";
import defaultLogo from "../../logo.png";
import BgImage from "../../bg.jpg";

interface Submission {
  id: string;
  fileName: string;
  uploadedAt: string;
  paymentStatus: "pending" | "completed" | "failed";
  uploadStatus: string;
  contestId: string;
  contestName: string;
  amount: number;
}

interface Contest {
  id: string;
  name: string;
  current_stage: string;
  entry_fee: string;
  category_name?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  round_status: string;
  is_promoted: boolean;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  phone_number?: string | null;
  state?: string | null;
  city?: string | null;
}

interface UserDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function UserDashboard({ userEmail, onLogout }: UserDashboardProps) {
  const [activeView, setActiveView] = useState<"home" | "settings">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [availableContests, setAvailableContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const fetchData = async () => {
    try {
      const [statusData, contestsData, profileData] = await Promise.all([
        videosAPI.getStatus().catch(() => ({ submissions: [] })),
        videosAPI.getPublicContests().catch(() => []),
        authAPI.getProfile().catch(() => null)
      ]);

      // Map backend data to UI
      const mappedSubmissions = statusData.submissions.map((s: any) => ({
        id: s.id,
        fileName: s.file_name,
        uploadedAt: new Date(s.created_at).toLocaleDateString(),
        paymentStatus: s.payment_status || "pending",
        uploadStatus: s.upload_status,
        contestId: s.contest_id,
        contestName: s.contest_name || "Unknown Contest",
        amount: parseFloat(s.amount || "10000")
      }));

      setSubmissions(mappedSubmissions);
      setAvailableContests(contestsData);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmitVideo = async () => {
    if (!videoFile || !selectedContest) return;

    if (!profile?.bank_name || !profile?.account_number) {
      toast.error("Please add your bank details in settings before uploading.");
      setActiveView("settings");
      return;
    }

    // Show Terms & Conditions modal if not agreed
    if (!agreedToTerms) {
      setShowTermsModal(true);
      return;
    }

    // Proceed with upload (payment already done when entering contest)
    setUploading(true);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("contestId", selectedContest.id);

    try {
      await videosAPI.upload(formData);
      toast.success(`Video uploaded successfully for ${selectedContest.name}!`);
      setVideoFile(null);
      fetchData();
    } catch (error: any) {
      console.error("Upload error", error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</Badge>;
      case "completed":
        return <Badge className="bg-green-500 text-white">Approved / Ready</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Add close menu helper
  const handleViewChange = (view: "home" | "settings") => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter out contests already entered
  const enteredContestIds = submissions.map(s => s.contestId);
  const filteredAvailableContests = availableContests.filter(c => !enteredContestIds.includes(c.id));

  const isEligibleForNewContest = submissions.length === 0 || profile?.is_promoted;

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-20 select-none">
        <div className="absolute inset-0 bg-slate-950/95 z-10" />
        <img
          src={BgImage}
          alt=""
          className="w-full h-full object-cover opacity-20 blur-2xl scale-110"
        />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[128px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[128px] rounded-full animate-pulse delay-700" />
      </div>
      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src={defaultLogo} alt="GeniusWave" className="w-8 h-8 rounded object-contain" />
          <span className="font-bold text-white tracking-tight">GeniusWave</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900/90 backdrop-blur-md border-r border-white/10 flex flex-col z-50 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-20
      `}>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <img src={defaultLogo} alt="GeniusWave" className="w-9 h-9 rounded-lg object-contain" />
          <span className="font-bold text-white">GeniusWave</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={activeView === "home" ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 rounded-xl transition-all"
            onClick={() => handleViewChange("home")}
          >
            <Home className="w-4 h-4" /> Home
          </Button>
          <Button
            variant={activeView === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 rounded-xl transition-all"
            onClick={() => handleViewChange("settings")}
          >
            <Settings className="w-4 h-4" /> Profile Settings
          </Button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 mb-4 bg-white/5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase text-xs shrink-0">
              {profile?.full_name?.charAt(0) || userEmail.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout} className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 transition-all duration-300">
        {activeView === "home" ? (
          <div className="container mx-auto px-6 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">User Dashboard</h2>
              <div className="flex gap-2">
                {profile?.is_promoted && (
                  <Badge className="bg-amber-500 text-white animate-pulse border-none px-3 py-1">
                    <Trophy className="w-3 h-3 mr-1" /> Promoted: Next Entry Free!
                  </Badge>
                )}
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1">Overall Status: {profile?.round_status === 'none' ? 'Ready to Start' : profile?.round_status}</Badge>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-8">
                {/* Contest Selection Section */}
                {!selectedContest ? (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">Available Contests</h2>
                      <span className="text-sm text-slate-400">{filteredAvailableContests.length} Open</span>
                    </div>
                    {!isEligibleForNewContest ? (
                      <Card className="border-amber-500/30 bg-amber-500/10 py-10 text-center backdrop-blur-sm">
                        <div className="max-w-md mx-auto px-6">
                          <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-400 opacity-50" />
                          <h3 className="text-lg font-bold text-white mb-2">Promotion Required</h3>
                          <p className="text-sm text-slate-300 mb-6">
                            You've completed your current contest entry. To join a new contest, you must be
                            <strong> promoted</strong> by the administrators based on your performance.
                          </p>
                          <Badge variant="outline" className="bg-white/10 text-slate-300 border-white/20">
                            Check back later for results
                          </Badge>
                        </div>
                      </Card>
                    ) : filteredAvailableContests.length === 0 ? (
                      <Card className="border-dashed border-white/20 bg-slate-900/50 backdrop-blur-sm py-12 text-center text-slate-400">
                        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No new contests available at the moment.</p>
                      </Card>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {filteredAvailableContests.map(contest => (
                          <Card key={contest.id} className="hover:shadow-lg transition-all border-none bg-slate-900/80 backdrop-blur-sm group">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">{contest.name}</CardTitle>
                              <CardDescription className="text-slate-400">
                                {contest.category_name && (
                                  <span className="text-primary font-semibold">{contest.category_name}</span>
                                )}
                                {contest.category_name && " • "}
                                Entry Stage: Stage 1
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-2xl font-bold text-primary">₦{parseFloat(contest.entry_fee).toLocaleString()}</span>
                                <Button onClick={() => {
                                  // Check bank details first
                                  if (!profile?.bank_name || !profile?.account_number) {
                                    toast.error("Please add your bank details in settings before entering a contest.");
                                    setActiveView("settings");
                                    return;
                                  }

                                  // Set selected contest
                                  setSelectedContest(contest);

                                  // If promoted or free, go directly to upload
                                  const entryFee = parseFloat(contest.entry_fee || "0");
                                  if (profile?.is_promoted || entryFee === 0) {
                                    // Free entry or promoted - no payment needed
                                    return;
                                  }

                                  // Otherwise show payment modal first
                                  setShowPayment(true);
                                }} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                                  Enter Now <ArrowRight className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </section>
                ) : (
                  <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedContest(null)} className="text-primary hover:text-primary/80">
                        &larr; Back to Contests
                      </Button>
                      <h2 className="text-lg font-bold text-white">Submit for {selectedContest.name}</h2>
                    </div>

                    <Card className="border-2 border-dashed border-primary/30 bg-slate-900/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-white">
                          <Upload className="w-5 h-5 text-primary" />
                          Upload Your Entry
                        </CardTitle>
                        <CardDescription className="text-slate-400">Select your talent video (Max 500MB)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <label
                          htmlFor="video-upload"
                          className="block w-full p-12 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:bg-white/5 transition-colors"
                          style={{ pointerEvents: uploading ? 'none' : 'auto', opacity: uploading ? 0.5 : 1 }}
                        >
                          {videoFile ? (
                            <div className="space-y-2">
                              <Video className="w-12 h-12 mx-auto text-primary" />
                              <p className="font-semibold text-white">{videoFile.name}</p>
                              <p className="text-xs text-slate-400">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          ) : (
                            <div className="space-y-2 text-slate-400">
                              <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p className="font-semibold text-slate-300">Click to upload video</p>
                              <p className="text-sm">MP4, MOV supported</p>
                            </div>
                          )}
                          <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileSelect}
                            disabled={uploading}
                          />
                        </label>

                        {videoFile && (
                          <Button
                            onClick={handleSubmitVideo}
                            className="w-full text-lg h-12 bg-primary hover:bg-primary/90 text-white"
                            disabled={uploading || !profile?.bank_name || !profile?.account_number}
                          >
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : (profile?.is_promoted || parseFloat(selectedContest?.entry_fee || "0") === 0 ? <Trophy className="w-5 h-5 mr-2" /> : <Upload className="w-5 h-5 mr-2" />)}
                            {uploading ? "Uploading..." : (profile?.is_promoted || parseFloat(selectedContest?.entry_fee || "0") === 0 ? "Upload & Join (Free)" : `Upload & Pay ₦${parseFloat(selectedContest?.entry_fee || "0").toLocaleString()}`)}
                          </Button>
                        )}
                        {(!profile?.bank_name || !profile?.account_number) && (
                          <p className="text-xs text-center text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2 rounded">
                            * Please set your bank details in settings before uploading.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* My Entries List */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-white">My Submissions</h2>
                  <div className="space-y-3">
                    {submissions.length === 0 ? (
                      <Card className="py-8 bg-slate-900/50 backdrop-blur-sm border-white/20 border-dashed text-center">
                        <p className="text-slate-400">No entries yet.</p>
                      </Card>
                    ) : (
                      submissions.map(sub => (
                        <Card key={sub.id} className="overflow-hidden border-none bg-slate-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                              <Video className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-bold text-white truncate">{sub.contestName}</h3>
                                {getStatusBadge(sub.uploadStatus)}
                              </div>
                              <p className="text-xs text-slate-400 mb-2">{sub.fileName} • {sub.uploadedAt}</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => {
                                  if (sub.paymentStatus !== 'completed') {
                                    const contest = availableContests.find(c => c.id === sub.contestId) || { id: sub.contestId, name: sub.contestName, entry_fee: sub.amount.toString() };
                                    setSelectedContest(contest as any);

                                    if (profile?.is_promoted) {
                                      const processPromo = async () => {
                                        try {
                                          toast.info("Applying promotion...");
                                          await paymentsAPI.initialize({
                                            amount: sub.amount,
                                            payment_method: "promotion",
                                            contestId: sub.contestId
                                          });
                                          toast.success("Promotion applied!");
                                          fetchData();
                                        } catch (e) {
                                          setShowPayment(true);
                                        }
                                      };
                                      processPromo();
                                    } else {
                                      setShowPayment(true);
                                    }
                                  }
                                }}>
                                  {sub.paymentStatus === 'completed' ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                      <span className="text-[11px] font-bold text-green-600 uppercase">Paid</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3.5 h-3.5 text-orange-400" />
                                      <span className="text-[11px] font-bold text-orange-500 uppercase">Payment Pending</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium opacity-90">Contest Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-[10px] opacity-70 mb-1 font-medium uppercase tracking-wider">Entries</p>
                        <p className="text-2xl font-bold">{submissions.length}</p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-[10px] opacity-70 mb-1 font-medium uppercase tracking-wider">Payments</p>
                        <p className="text-2xl font-bold">{submissions.filter(s => s.paymentStatus === 'completed').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                      <Banknote className="w-4 h-4 text-secondary" /> Payout Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!profile?.bank_name ? (
                      <div className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg flex flex-col gap-2">
                        <p className="font-semibold flex items-center gap-1"><XCircle className="w-3 h-3" /> No Bank Details</p>
                        <p className="text-slate-300">Provide your bank details to be eligible for winner prizes.</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-orange-400 flex justify-start underline" onClick={() => setActiveView("settings")}>Go to Settings &rarr;</Button>
                      </div>
                    ) : (
                      <div className="text-xs space-y-2 border-l-2 border-green-500 pl-3">
                        <p className="text-slate-400">Bank: <span className="text-white font-semibold">{profile.bank_name}</span></p>
                        <p className="text-slate-400">Acc: <span className="text-white font-semibold">{profile.account_number}</span></p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <SettingsView profile={profile} fetchData={fetchData} />
        )}
      </main>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-slate-900/95 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <p className="text-sm text-slate-300 leading-relaxed">
                  By submitting your video, you agree that:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Your video may be <strong>edited by our company</strong> for promotional, marketing, or other purposes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>You grant us the right to use, modify, and distribute your content.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>You confirm that you own the rights to the submitted content.</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-slate-300 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    setShowTermsModal(false);
                    setAgreedToTerms(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => {
                    setAgreedToTerms(true);
                    setShowTermsModal(false);
                    // Trigger upload after agreement
                    handleSubmitVideo();
                  }}
                >
                  I Agree & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedContest && (
        <PaymentModal
          open={showPayment}
          onClose={() => {
            setShowPayment(false);
            setSelectedContest(null); // Reset to show available contests
            setActiveView("home"); // Ensure we're on home view
          }}
          amount={parseFloat(selectedContest.entry_fee)}
          contestId={selectedContest.id}
          onComplete={() => fetchData()}
        />
      )}
    </div>
  );
}

function SettingsView({ profile, fetchData }: { profile: UserProfile | null, fetchData: () => void }) {
  const [loading, setLoading] = useState(false);
  const [bankData, setBankData] = useState({
    bank_name: profile?.bank_name || "",
    account_number: profile?.account_number || "",
    account_name: profile?.account_name || "",
    full_name: profile?.full_name || "",
    facebook: profile?.facebook || "",
    instagram: profile?.instagram || "",
    tiktok: profile?.tiktok || "",
    twitter: profile?.twitter || "",
    phone_number: profile?.phone_number || "",
    state: profile?.state || "",
    city: profile?.city || ""
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (profile) {
      setBankData({
        bank_name: profile.bank_name || "",
        account_number: profile.account_number || "",
        account_name: profile.account_name || "",
        full_name: profile.full_name || "",
        facebook: profile.facebook || "",
        instagram: profile.instagram || "",
        tiktok: profile.tiktok || "",
        twitter: profile.twitter || "",
        phone_number: profile.phone_number || "",
        state: profile.state || "",
        city: profile.city || ""
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile(bankData);
      toast.success("Profile updated successfully!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authAPI.updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Settings & Profile</h2>
        <p className="text-slate-400">Manage your identity and payout information.</p>
      </div>

      <div className="grid gap-8">
        {/* Payout Details */}
        <Card className="border-none shadow-sm bg-slate-900/80 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Banknote className="w-5 h-5 text-primary" /> Bank Details
            </CardTitle>
            <CardDescription className="text-slate-400">We'll use these details to pay out prizes to winners.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Full Name</Label>
                  <Input
                    value={bankData.full_name}
                    onChange={e => setBankData({ ...bankData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Bank Name</Label>
                  <Input
                    value={bankData.bank_name}
                    onChange={e => setBankData({ ...bankData, bank_name: e.target.value })}
                    placeholder="e.g. GTBank, Zenith Bank"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Account Number</Label>
                  <Input
                    value={bankData.account_number}
                    onChange={e => setBankData({ ...bankData, account_number: e.target.value })}
                    placeholder="10-digit number"
                    maxLength={10}
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Account Name</Label>
                  <Input
                    value={bankData.account_name}
                    onChange={e => setBankData({ ...bankData, account_name: e.target.value })}
                    placeholder="Name on your account"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Save Bank Details
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Media & Contact */}
        <Card className="border-none shadow-sm bg-slate-900/80 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-primary" /> Social Media & Contact
            </CardTitle>
            <CardDescription className="text-slate-400">Your social media handles and contact information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Facebook</Label>
                  <Input
                    value={bankData.facebook}
                    onChange={e => setBankData({ ...bankData, facebook: e.target.value })}
                    placeholder="@username or profile URL"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Instagram</Label>
                  <Input
                    value={bankData.instagram}
                    onChange={e => setBankData({ ...bankData, instagram: e.target.value })}
                    placeholder="@username"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">TikTok</Label>
                  <Input
                    value={bankData.tiktok}
                    onChange={e => setBankData({ ...bankData, tiktok: e.target.value })}
                    placeholder="@username"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">X (Twitter)</Label>
                  <Input
                    value={bankData.twitter}
                    onChange={e => setBankData({ ...bankData, twitter: e.target.value })}
                    placeholder="@username"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Phone Number</Label>
                  <Input
                    value={bankData.phone_number}
                    onChange={e => setBankData({ ...bankData, phone_number: e.target.value })}
                    placeholder="e.g. 08012345678"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">State</Label>
                  <Input
                    value={bankData.state}
                    onChange={e => setBankData({ ...bankData, state: e.target.value })}
                    placeholder="e.g. Lagos"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-white">City</Label>
                  <Input
                    value={bankData.city}
                    onChange={e => setBankData({ ...bankData, city: e.target.value })}
                    placeholder="e.g. Ikeja"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Save Social Media Info
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-none shadow-sm bg-slate-900/80 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Lock className="w-5 h-5 text-red-400" /> Security
            </CardTitle>
            <CardDescription className="text-slate-400">Change your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label className="text-white">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pr-10 bg-slate-800/50 border-white/10 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">New Password</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="pr-10 bg-slate-800/50 border-white/10 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="pr-10 bg-slate-800/50 border-white/10 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} variant="secondary" className="bg-secondary hover:bg-secondary/90 text-white">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
