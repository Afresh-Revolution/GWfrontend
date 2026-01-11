import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/ToastContainer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PaymentCallback from "./pages/PaymentCallback";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/callback"
              element={
                <ProtectedRoute>
                  <PaymentCallback />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/panel"
              element={
                <AdminProtectedRoute>
                  <AdminPanel />
                </AdminProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
