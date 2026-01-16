import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Video,
  LogOut,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowUpCircle,
  Search,
  Filter,
  Users as UsersIcon,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Globe,
  Plus,
  Save,
  Key,
  Upload,
  Image as ImageIcon,
  Menu,
  ChevronRight,
  Eye,
  Copy,
  User as UserIcon,
  Loader2,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { adminAPI, categoriesAPI } from "@/services/api";
import defaultLogo from '../../logo.png';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface Submission {
  video_id: string;
  file_name: string;
  upload_status: string;
  uploaded_at: string;
  user_id: string;
  full_name: string;
  email: string;
  round_status: string;
  amount: number;
  payment_status: string;
  transaction_id: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  round_status: string;
  total_uploads: number;
  created_at: string;
}

interface Contest {
  id: string;
  name: string;
  current_stage: string;
  entry_fee: number;
  prize1: number;
  prize2: number;
  prize3: number;
  is_active: boolean;
  category_id?: string;
  category_name?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface SiteInfo {
  site_name: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
}

interface Contestant {
  user_id: string;
  full_name: string;
  email: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  video_id: string;
  file_name: string;
  file_path: string;
  upload_status: string;
  uploaded_at: string;
  paid_amount: number;
  payment_status: string;
  transaction_id: string;
  winner_position: number | null;
  is_promoted: boolean;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isContestantsLoading, setIsContestantsLoading] = useState(false);

  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    site_name: "GeniusWave",
    logo_url: "",
    contact_email: "",
    contact_phone: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal/Form states
  const [showContestForm, setShowContestForm] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [contestFormData, setContestFormData] = useState({
    name: "",
    entry_fee: 0,
    prize1: 0,
    max_contestants: 0,
    is_active: true,
    category_id: ""
  });

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: "", description: "" });

  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [subData, userData, contestData, infoData, categoriesData] = await Promise.all([
        adminAPI.getAllSubmissions().catch(() => []),
        adminAPI.getAllUsers().catch(() => []),
        adminAPI.getContests().catch(() => []),
        adminAPI.getSiteInfo().catch(() => null),
        categoriesAPI.getAll().catch(() => [])
      ]);
      setSubmissions(subData);
      setUsers(userData);
      setContests(contestData);
      setCategories(categoriesData);
      if (infoData) setSiteInfo(infoData);
    } catch (error) {
      toast.error("Error connecting to admin services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchContestants = async (contestId: string) => {
    setIsContestantsLoading(true);
    try {
      const data = await adminAPI.getContestants(contestId);
      setContestants(data);
      setSelectedContestId(contestId);
    } catch (error) {
      toast.error("Failed to fetch contestants");
    } finally {
      setIsContestantsLoading(false);
    }
  };

  const handleCreateOrUpdateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContest) {
        await adminAPI.updateContest(editingContest.id, contestFormData);
        toast.success("Contest updated successfully");
      } else {
        await adminAPI.createContest(contestFormData);
        toast.success("Contest created successfully");
      }
      setShowContestForm(false);
      setEditingContest(null);
      setContestFormData({ name: "", entry_fee: 0, prize1: 0, max_contestants: 0, is_active: true });
      fetchInitialData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User deleted successfully");
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleViewUser = async (userId: string) => {
    setIsLoadingUserDetails(true);
    setShowUserDetails(true);
    try {
      const data = await adminAPI.getUserDetails(userId);
      setSelectedUserDetails(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load user details");
      setShowUserDetails(false);
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm("Delete this submission? This will remove the video file from the server.")) return;
    try {
      await adminAPI.deleteSubmission(id);
      toast.success("Submission deleted");
      setSubmissions(submissions.filter(s => s.video_id !== id));
    } catch (error) {
      toast.error("Failed to delete submission");
    }
  };

  const handleUpdateContestantStatus = async (videoId: string, winnerPosition: number | null, isPromoted: boolean) => {
    // Check for next contest if promoting
    if (isPromoted && contests.length <= 1) {
      toast.warning("Note: No future contests are created yet. The promotion flag will still be set for when one becomes available.");
    }

    try {
      await adminAPI.updateContestantStatus({
        video_id: videoId,
        winner_position: winnerPosition,
        is_promoted: isPromoted
      });
      // Update local state
      setContestants(prev => prev.map(c => c.video_id === videoId ? { ...c, winner_position: winnerPosition, is_promoted: isPromoted } : c));
      toast.success("Contestant status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleBulkPromote = async (videoIds: string[], isPromoted: boolean) => {
    if (isPromoted && contests.length <= 1) {
      toast.warning("Note: No future contests are created yet. Promoted users will get their discount once a new contest is active.");
    }

    try {
      await adminAPI.bulkUpdateContestantStatus({ video_ids: videoIds, is_promoted: isPromoted });
      setContestants(prev => prev.map(c => videoIds.includes(c.video_id) ? { ...c, is_promoted: isPromoted } : c));
      toast.success(`${videoIds.length} contestants updated`);
    } catch (error) {
      toast.error("Bulk update failed");
    }
  };

  const handleUpdateSiteInfo = async () => {
    try {
      await adminAPI.updateSiteInfo(siteInfo);
      toast.success("Site info updated successfully");
    } catch (error) {
      toast.error("Failed to update site info");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const res = await adminAPI.uploadLogo(file);
      setSiteInfo((prev: SiteInfo) => ({ ...prev, logo_url: res.logoUrl }));
      toast.success("Logo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match");
    }
    try {
      await adminAPI.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };

  const handleUpdateContestStage = async (contestId: string, newStage: string) => {
    setProcessingId(contestId);
    try {
      await adminAPI.updateContestStage(contestId, newStage);
      toast.success("Contest stage updated");
      setContests(contests.map(c => c.id === contestId ? { ...c, current_stage: newStage } : c));
    } catch (error) {
      toast.error("Failed to update stage");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteContest = async (contestId: string) => {
    if (!confirm("Are you sure you want to delete this contest? This action cannot be undone.")) return;
    setProcessingId(contestId);
    try {
      await adminAPI.deleteContest(contestId);
      toast.success("Contest deleted successfully");
      setContests(contests.filter(c => c.id !== contestId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete contest");
    } finally {
      setProcessingId(null);
    }
  };

  // Category handlers
  const handleCreateOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, categoryFormData);
        toast.success("Category updated successfully");
      } else {
        await categoriesAPI.create(categoryFormData);
        toast.success("Category created successfully");
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryFormData({ name: "", description: "" });
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoriesAPI.delete(id);
      toast.success("Category deleted successfully");
      setCategories(categories.filter(c => c.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const filteredSubmissions = submissions.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLogoSrc = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const navItems = [
    { id: 'submissions', label: 'Submissions', icon: Video },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'contests', label: 'Contests', icon: Trophy },
    { id: 'categories', label: 'Categories', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen lg:z-20
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {siteInfo.logo_url ? (
              <img
                src={getLogoSrc(siteInfo.logo_url)}
                alt="Logo"
                className="h-8 w-8 object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== defaultLogo) {
                    target.src = defaultLogo;
                  }
                }}
              />
            ) : null}
            <div className={`w-8 h-8 bg-primary rounded flex items-center justify-center ${siteInfo.logo_url ? 'hidden' : ''}`}>
              <Video className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm text-slate-900 truncate">{siteInfo.site_name}</h1>
              <p className="text-[10px] text-slate-500">Admin Panel</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <XCircle className="w-5 h-5 text-slate-400" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedContestId(null);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${activeTab === item.id && !selectedContestId
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
              {activeTab === item.id && !selectedContestId && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-slate-600 hover:text-red-600 gap-3 px-3">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </aside >

      {/* Main Content */}
      < div className="flex-1 flex flex-col overflow-hidden" >
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            {selectedContestId ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <Button variant="ghost" size="sm" onClick={() => setSelectedContestId(null)} className="text-slate-500 hover:text-primary shrink-0 px-2 lg:px-4">
                  <span className="hidden sm:inline">&larr; Back</span>
                  <span className="sm:hidden">&larr;</span>
                </Button>
                <span className="text-slate-300">/</span>
                <h2 className="text-sm lg:text-lg font-semibold text-slate-800 truncate">Contestants</h2>
              </div>
            ) : (
              <h2 className="text-sm lg:text-lg font-semibold text-slate-800 capitalize truncate">{activeTab}</h2>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              </div>
              <span className="hidden sm:inline text-xs font-medium text-slate-600">Administrator</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {selectedContestId ? (
            <ContestantsListView
              contestants={contestants}
              loading={isContestantsLoading}
              contestName={contests.find(c => c.id === selectedContestId)?.name || "Contest"}
              onUpdateStatus={handleUpdateContestantStatus}
              onBulkPromote={handleBulkPromote}
            />
          ) : activeTab === "submissions" ? (
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div>
                  <CardTitle>All Submissions</CardTitle>
                  <CardDescription>View and manage all video uploads across all contests</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 h-9 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <SubmissionsTable submissions={filteredSubmissions} loading={isLoading} onDelete={handleDeleteSubmission} />
              </CardContent>
            </Card>
          ) : activeTab === "users" ? (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>Manage your participant database</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTable
                  users={users}
                  loading={isLoading}
                  onDelete={handleDeleteUser}
                  onView={handleViewUser}
                />
              </CardContent>
            </Card>
          ) : activeTab === "contests" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Managed Contests</h3>
                <Button onClick={() => setShowContestForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Create Contest
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contests.map(contest => (
                  <Card key={contest.id} className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleFetchContestants(contest.id)}>
                    <div className="absolute top-0 right-0 p-4">
                      <Badge className={`border-none px-2 py-0 ${contest.is_active ? "bg-green-500" : "bg-slate-400"}`}>
                        {contest.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="pr-12 text-base">{contest.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">Fee: ₦{contest.entry_fee?.toLocaleString() || "0"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-2 text-[10px] uppercase font-bold text-slate-400 text-center">
                        <div className="p-2 bg-slate-50 rounded">Prize: ₦{contest.prize1?.toLocaleString() || "0"}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-primary hover:bg-primary/5 h-8"
                        disabled={processingId === contest.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingContest(contest);
                          setContestFormData({
                            name: contest.name,
                            entry_fee: contest.entry_fee,
                            prize1: contest.prize1,
                            max_contestants: (contest as any).max_contestants || 0,
                            is_active: contest.is_active,
                            category_id: contest.category_id || ""
                          });
                          setShowContestForm(true);
                        }}
                      >
                        {processingId === contest.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Edit Details"}
                      </Button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContest(contest.id);
                        }}
                        disabled={processingId === contest.id}
                        className="absolute bottom-2 right-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title="Delete contest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : activeTab === "categories" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Manage Categories</h3>
                <Button onClick={() => setShowCategoryForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Category
                </Button>
              </div>
              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                            No categories yet. Create one to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        categories.map(category => (
                          <TableRow key={category.id}>
                            <TableCell className="font-semibold text-slate-900">{category.name}</TableCell>
                            <TableCell className="text-slate-500 text-sm">{category.description || "—"}</TableCell>
                            <TableCell className="text-slate-400 text-sm">{new Date(category.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCategory(category);
                                    setCategoryFormData({ name: category.name, description: category.description || "" });
                                    setShowCategoryForm(true);
                                  }}
                                  className="text-primary hover:text-primary/80"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Settings View - Same as before */
            <SettingsView
              siteInfo={siteInfo}
              setSiteInfo={setSiteInfo}
              handleUpdateSiteInfo={handleUpdateSiteInfo}
              handleLogoUpload={handleLogoUpload}
              isUploadingLogo={isUploadingLogo}
              fileInputRef={fileInputRef}
              getLogoSrc={getLogoSrc}
              passwords={passwords}
              setPasswords={setPasswords}
              handleChangePassword={handleChangePassword}
            />
          )}
        </main>
      </div >

      {/* Contest Form Modal */}
      {
        showContestForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>{editingContest ? 'Edit Contest' : 'Create Contest'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrUpdateContest} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Contest Name</Label>
                    <Input
                      value={contestFormData.name}
                      onChange={e => setContestFormData({ ...contestFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Entry Fee (₦)</Label>
                      <Input
                        type="number"
                        value={contestFormData.entry_fee}
                        onChange={e => setContestFormData({ ...contestFormData, entry_fee: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={contestFormData.is_active ? "active" : "inactive"}
                        onValueChange={(val) => setContestFormData({ ...contestFormData, is_active: val === 'active' })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Winner Prize (1st Place)</Label>
                      <Input
                        type="number" value={contestFormData.prize1}
                        onChange={e => setContestFormData({ ...contestFormData, prize1: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Number of Contestants (0 for unlimited)</Label>
                    <Input
                      type="number"
                      value={contestFormData.max_contestants}
                      onChange={e => setContestFormData({ ...contestFormData, max_contestants: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={contestFormData.category_id}
                      onValueChange={(val) => setContestFormData({ ...contestFormData, category_id: val })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={() => { setShowContestForm(false); setEditingContest(null); }}>Cancel</Button>
                    <Button type="submit">
                      {editingContest ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )
      }

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOrUpdateCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input
                    value={categoryFormData.name}
                    onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    required
                    placeholder="e.g., Music, Dance, Comedy"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input
                    value={categoryFormData.description}
                    onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    placeholder="Brief description of this category"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={() => { setShowCategoryForm(false); setEditingCategory(null); }}>Cancel</Button>
                  <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <UserDetailsModal
        open={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        data={selectedUserDetails}
        loading={isLoadingUserDetails}
      />
    </div >
  );
}

// Sub-components for better organization

function SubmissionsTable({ submissions, loading, onDelete }: { submissions: Submission[], loading: boolean, onDelete: (id: string) => void }) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Contestant</TableHead>
              <TableHead>Video Info</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20">Loading...</TableCell></TableRow>
            ) : submissions.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20">No data found</TableCell></TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.video_id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{sub.full_name}</span>
                      <span className="text-xs text-slate-500">{sub.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{sub.file_name}</div>
                    <div className="text-[10px] text-slate-400">{new Date(sub.uploaded_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={sub.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                      {sub.payment_status === 'completed'
                        ? `Paid ₦${sub.amount?.toLocaleString() || '0'}`
                        : (sub.payment_status ? sub.payment_status.toUpperCase() : 'UNPAID')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sub.round_status?.toUpperCase() || 'STAGE 1'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onDelete(sub.video_id)} className="text-red-400 hover:text-red-600">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function UsersTable({ users, loading, onDelete, onView }: { users: User[], loading: boolean, onDelete: (id: string) => void, onView: (id: string) => void }) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[600px] lg:min-w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>User Details</TableHead>
              <TableHead>Total Uploads</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20">Loading...</TableCell></TableRow>
            ) : users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium text-slate-900">{user.full_name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {user.total_uploads} Videos
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(user.id)} className="text-primary hover:text-primary/80 hover:bg-primary/5">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(user.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ContestantsListView({ contestants, loading, contestName, onUpdateStatus, onBulkPromote }: { contestants: Contestant[], loading: boolean, contestName: string, onUpdateStatus: (videoId: string, winnerPos: number | null, isPromoted: boolean) => void, onBulkPromote: (ids: string[], isPromoted: boolean) => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === contestants.length && contestants.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contestants.map(c => c.video_id));
    }
  };

  const handleBulkPromoteClick = async () => {
    if (selectedIds.length === 0) return;
    await onBulkPromote(selectedIds, true);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">{contestName} - Contestants</h3>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button size="sm" onClick={handleBulkPromoteClick} className="gap-2 bg-amber-500 hover:bg-amber-600">
              <ArrowUpCircle className="w-4 h-4" /> Promote {selectedIds.length} Selected
            </Button>
          )}
          <Badge variant="outline">{contestants.length} Participants</Badge>
        </div>
      </div>
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px] lg:min-w-full">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === contestants.length && contestants.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </TableHead>
                  <TableHead>Contestant</TableHead>
                  <TableHead>Video</TableHead>
                  <TableHead>Winner Status</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-20">Loading contestants...</TableCell></TableRow>
                ) : Array.isArray(contestants) && contestants.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400">No contestants found for this contest</TableCell></TableRow>
                ) : contestants.map(c => (
                  <TableRow key={c.user_id} className={selectedIds.includes(c.video_id) ? "bg-primary/5" : ""}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.video_id)}
                        onChange={() => toggleSelect(c.video_id)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900">{c.full_name}</div>
                      <div className="text-[10px] text-slate-500">{c.email}</div>
                    </TableCell>
                    <TableCell>
                      <a href={`${API_BASE_URL}${c.file_path}`} target="_blank" className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                        <Video className="w-3.5 h-3.5" /> View Video
                      </a>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={c.winner_position ? c.winner_position.toString() : "0"}
                        onValueChange={(val) => onUpdateStatus(c.video_id, val === "0" ? null : parseInt(val), c.is_promoted)}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="1">1st Place</SelectItem>
                          <SelectItem value="2">2nd Place</SelectItem>
                          <SelectItem value="3">3rd Place</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={c.is_promoted}
                          onChange={(e) => onUpdateStatus(c.video_id, c.winner_position, e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-[10px] text-slate-600">Promote</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={c.payment_status === 'completed' ? 'bg-green-100 text-green-700 border-none' : 'bg-orange-100 text-orange-700 border-none'}>
                        {c.payment_status === 'completed' ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsView({ siteInfo, setSiteInfo, handleUpdateSiteInfo, handleLogoUpload, isUploadingLogo, fileInputRef, getLogoSrc, passwords, setPasswords, handleChangePassword }: any) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="w-5 h-5 text-primary" /> Site Information
          </CardTitle>
          <CardDescription>Visual identity and contact branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Site Logo</Label>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50/50">
              <div className="w-16 h-16 rounded border bg-white flex items-center justify-center overflow-hidden">
                {siteInfo.logo_url ? (
                  <img src={getLogoSrc(siteInfo.logo_url)} alt="Current Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-200" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="h-8 gap-2 text-xs" disabled={isUploadingLogo}>
                  <Upload className="w-3 h-3" /> {isUploadingLogo ? "Uploading..." : "Upload New Logo"}
                </Button>
                <p className="text-[10px] text-slate-400">PNG, JPG recommended. Max 2MB.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Portal Name</Label>
              <Input value={siteInfo.site_name} onChange={e => setSiteInfo({ ...siteInfo, site_name: e.target.value })} />
            </div>
          </div>
          <Button className="w-full gap-2 h-10" onClick={handleUpdateSiteInfo}>
            <Save className="w-4 h-4" /> Save General Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="w-5 h-5 text-primary" /> Security
          </CardTitle>
          <CardDescription>Manage administrative access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Current Password</Label>
              <Input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-red-500">New Password</Label>
              <Input type="password" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Confirm Password</Label>
              <Input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} required />
            </div>
            <Button type="submit" variant="secondary" className="w-full gap-2 h-10 mt-2">
              <ShieldCheck className="w-4 h-4" /> Update Credentials
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function UserDetailsModal({ open, onClose, data, loading }: { open: boolean, onClose: () => void, data: any, loading: boolean }) {
  const [copying, setCopying] = useState(false);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopying(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopying(false), 2000);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" /> User Full Profile
          </DialogTitle>
          <DialogDescription>
            Detailed information and activity log for the contestant.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-20 flex flex-col gap-4 items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-slate-500 font-medium">Gathering user data...</p>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Card */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Personal Information</h3>
                <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="font-bold text-slate-900">{data.user.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="font-bold text-slate-900">{data.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Member Since</p>
                    <p className="font-medium">{new Date(data.user.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Bank Card */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Bank Payout Details</h3>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500">Bank Name</p>
                    <p className="font-bold text-primary">{data.user.bank_name || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Account Number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xl font-mono font-bold tracking-widest text-slate-900">{data.user.account_number || '----------'}</p>
                      {data.user.account_number && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(data.user.account_number)}
                          className="h-8 w-8 p-0 hover:bg-primary/10 text-primary"
                        >
                          <Copy className={`w-4 h-4 ${copying ? 'text-green-500' : ''}`} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Account Holder Name</p>
                    <p className="font-bold">{data.user.account_name || 'Not Provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Contact Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Social Media & Contact</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Facebook</p>
                    <p className="font-medium text-slate-900">{data.user.facebook || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Instagram</p>
                    <p className="font-medium text-slate-900">{data.user.instagram || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">TikTok</p>
                    <p className="font-medium text-slate-900">{data.user.tiktok || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">X (Twitter)</p>
                    <p className="font-medium text-slate-900">{data.user.twitter || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone Number</p>
                    <p className="font-medium text-slate-900">{data.user.phone_number || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">
                      {data.user.city && data.user.state
                        ? `${data.user.city}, ${data.user.state}`
                        : data.user.city || data.user.state || 'Not Provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submissions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Submission History</h3>
                <Badge variant="outline">{data.submissions.length} Total</Badge>
              </div>

              {data.submissions.length === 0 ? (
                <div className="border border-dashed rounded-xl py-8 text-center text-slate-400">
                  <Video className="w-10 h-10 mx-auto mb-2 opacity-10" />
                  <p className="text-xs font-medium uppercase">No video uploads found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.submissions.map((sub: any) => (
                    <div key={sub.id} className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-primary/30 transition-all flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Video className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{sub.contest_name || 'Unknown Contest'}</p>
                          <p className="text-xs text-slate-500">{sub.file_name} • {new Date(sub.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {sub.is_promoted && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            <Trophy className="w-3 h-3 mr-1" /> Promoted
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-slate-50">{sub.upload_status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">Data unavailable.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
