import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/app/context/AuthProvider";
import { AuthPage } from "@/app/components/AuthPage";
import { UserDashboard } from "@/app/components/UserDashboard";
import { AdminDashboard } from "@/app/components/AdminDashboard";
import { Toaster } from "@/app/components/ui/sonner";
import { PaymentCallbackPage } from "@/app/pages/PaymentCallbackPage";

import { LandingPage } from "@/app/components/LandingPage";

function AppContent() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/payment/callback"
        element={<PaymentCallbackPage />}
      />

      <Route
        path="/portal"
        element={
          !isAuthenticated ? (
            <AuthPage />
          ) : user?.role === "admin" ? (
            <AdminDashboard onLogout={logout} />
          ) : (
            // @ts-ignore - UserDashboard expects userEmail but user might be null if strictly typed, but isAuthenticated check ensures it.
            <UserDashboard userEmail={user?.email || ""} onLogout={logout} />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

