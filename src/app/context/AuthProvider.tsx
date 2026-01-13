import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/services/api";
// import { jwtDecode } from "jwt-decode"; // Requires installing jwt-decode. using simple parse for now if preferred, or ensure dependency installed. 
// Plan said install jwt-decode, so we assume it is/will be available.
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface User {
    id: string;
    email: string;
    role: "user" | "admin";
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Check expiration
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    // Backend token structure: { userId, email, role }
                    setUser({
                        id: decoded.userId,
                        email: decoded.email,
                        role: decoded.role || "user",
                        full_name: decoded.full_name
                    });
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setIsLoading(false);
    }, [token]);

    const login = async (credentials: any) => {
        try {
            // Determine if admin login or user login based on email or separate checkbox?
            // Backend has separate endpoints: /api/auth/login and /api/admin/login
            // For now, let's assume standard auth. If email 'admin', maybe try admin login?
            // Or simpler: The Backend Docs show /api/auth/login and /api/admin/login. 
            // The old UI didn't seem to differentiate much.
            // Let's try user login first.

            let data;
            // Heuristic: check if email contains "admin" or trying to hit admin endpoint?
            // The implementation plan didn't specify separate admin login flow, but AuthPage has a hint.
            // We will stick to standard user login for now as per AuthPage.tsx logic.

            data = await authAPI.login(credentials);

            localStorage.setItem("token", data.token);
            setToken(data.token);
            toast.success("Login successful");
        } catch (error: any) {
            console.error("Login failed", error);
            toast.error(error.message || "Login failed");
            throw error;
        }
    };

    const signup = async (userData: any) => {
        try {
            const data = await authAPI.signup(userData);
            localStorage.setItem("token", data.token);
            setToken(data.token);
            toast.success("Account created successfully");
        } catch (error: any) {
            console.error("Signup failed", error);
            toast.error(error.message || "Signup failed");
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.info("Logged out");
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
