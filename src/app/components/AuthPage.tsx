import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Video, Loader2, ArrowLeft, Music, Star } from "lucide-react";
import { useAuth } from "@/app/context/AuthProvider";
import defaultLogo from "../../logo.png";

export function AuthPage() {
  const { login, signup } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup" || mode === "login") {
      setActiveTab(mode);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      return;
    }
    setIsLoading(true);
    try {
      await signup({
        full_name: signupName,
        email: signupEmail,
        password: signupPassword,
        confirm_password: signupConfirmPassword
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="mb-8 flex flex-col items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="self-start mb-6 text-slate-400 hover:text-white gap-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Landing
          </Button>

          <img src={defaultLogo} alt="GeniusWave" className="w-16 h-16 rounded-2xl object-contain mb-4 shadow-xl ring-4 ring-white/5" />
          <h1 className="text-3xl font-black text-white tracking-tight">GENIUS<span className="text-primary">WAVE</span></h1>
          <p className="text-slate-400 text-sm mt-1">Nigeria's Premier Music Contest Portal</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-white/5 h-12 p-1 rounded-xl">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-slate-900 border-white/5 shadow-2xl rounded-2xl overflow-hidden mt-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-white">Welcome Back</CardTitle>
                <CardDescription className="text-slate-400">Enter your credentials to access your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      className="bg-slate-950 border-white/10 text-white h-12 rounded-xl focus:ring-primary focus:border-primary transition-all"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      className="bg-slate-950 border-white/10 text-white h-12 rounded-xl focus:ring-primary focus:border-primary transition-all"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 mt-2" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Access Dashboard"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-slate-900 border-white/5 shadow-2xl rounded-2xl overflow-hidden mt-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" /> Start Your Journey
                </CardTitle>
                <CardDescription className="text-slate-400">Join the contest and showcase your talent</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      className="bg-slate-950 border-white/10 text-white h-11 rounded-xl focus:ring-primary focus:border-primary"
                      placeholder="e.g. Ebuka Chidima"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      className="bg-slate-950 border-white/10 text-white h-11 rounded-xl focus:ring-primary focus:border-primary"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        className="bg-slate-950 border-white/10 text-white h-11 rounded-xl focus:ring-primary focus:border-primary"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Confirm</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        className="bg-slate-950 border-white/10 text-white h-11 rounded-xl focus:ring-primary focus:border-primary"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 mt-2" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account & Enter"}
                  </Button>
                  <p className="text-[10px] text-slate-500 text-center mt-4 uppercase font-medium tracking-tighter">
                    By signing up, you agree to our terms and conditions.
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

