import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://gwbackend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  // Don't add token for login endpoints
  const isLoginRoute = config.url?.includes("/login");

  if (!isLoginRoute) {
    // Check if this is an admin route
    const isAdminRoute = config.url?.startsWith("/admin");
    const token = isAdminRoute
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: string }>) => {
    if (error.response?.status === 401) {
      // Check if this is an admin route
      const isAdminRoute = error.config?.url?.startsWith("/admin");

      if (isAdminRoute) {
        // Clear admin storage and redirect to admin login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
      } else {
        // Clear user storage and redirect to user login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const response = await api.post("/auth/signup", {
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },
};

export const videoAPI = {
  getStatus: async () => {
    const response = await api.get("/videos/status");
    return response.data;
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("video", file);
    const response = await api.post("/videos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const paymentAPI = {
  getStatus: async () => {
    const response = await api.get("/payments/status");
    return response.data;
  },

  initialize: async (
    amount: number,
    currency: string,
    paymentMethod: string,
    bankName?: string,
    accountNumber?: string,
    accountName?: string
  ) => {
    const response = await api.post("/payments/initialize", {
      amount,
      currency,
      payment_method: paymentMethod,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
    });
    return response.data;
  },

  verify: async (reference: string) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },

  charge: async (
    amount: number,
    currency: string,
    paymentMethod: string,
    authorizationCode?: string,
    pin?: string,
    otp?: string,
    bankName?: string,
    accountNumber?: string,
    accountName?: string
  ) => {
    const response = await api.post("/payments/charge", {
      amount,
      currency,
      payment_method: paymentMethod,
      authorization_code: authorizationCode,
      pin,
      otp,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
    });
    return response.data;
  },
};

export const adminAPI = {
  login: async (username: string, password: string) => {
    console.log("adminAPI.login called with:", {
      username,
      usernameLength: username.length,
      hasPassword: !!password,
      passwordLength: password.length,
    });

    try {
      const response = await api.post("/admin/login", {
        username: username.trim(),
        password: password,
      });
      console.log("adminAPI.login response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("adminAPI.login error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });
      throw error;
    }
  },

  getRound: async (roundNumber: number) => {
    const response = await api.get(`/admin/rounds/${roundNumber}`);
    return response.data;
  },

  acceptContestant: async (roundNumber: number, userId: string) => {
    const response = await api.post(
      `/admin/rounds/${roundNumber}/accept/${userId}`
    );
    return response.data;
  },

  getVideo: async (videoId: string) => {
    const response = await api.get(`/admin/videos/${videoId}`);
    return response.data;
  },

  downloadVideo: async (videoId: string) => {
    const response = await api.get(`/admin/videos/${videoId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

export default api;
