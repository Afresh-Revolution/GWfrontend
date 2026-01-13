import axios from 'axios';

// Use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return a standardized error object
    const customError = {
      message: error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export const authAPI = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  signup: async (userData: any) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

export const videosAPI = {
  upload: async (formData: FormData) => {
    const response = await api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getPublicContests: async () => {
    const response = await api.get('/videos/contests');
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get('/videos/status');
    return response.data;
  },
  getDownloadUrl: async () => {
    const response = await api.get('/videos/download');
    return response.data;
  }
};

export const paymentsAPI = {
  getStatus: async () => {
    const response = await api.get('/payments/status');
    return response.data;
  },
  initialize: async (data: any) => {
    const response = await api.post('/payments/initialize', data);
    return response.data;
  },
  verify: async (reference: string) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },
};

export const adminAPI = {
  getSiteInfo: async () => {
    const response = await api.get('/admin/site-info');
    return response.data;
  },
  updateSiteInfo: async (data: any) => {
    const response = await api.put('/admin/site-info', data);
    return response.data;
  },
  changePassword: async (data: any) => {
    const response = await api.post('/admin/change-password', data);
    return response.data;
  },
  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post('/admin/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getContests: async () => {
    const response = await api.get('/admin/contests');
    return response.data;
  },
  createContest: async (data: any) => {
    const response = await api.post('/admin/contests', data);
    return response.data;
  },
  updateContestStage: async (id: string, stage: string) => {
    const response = await api.put(`/admin/contests/${id}/stage`, { current_stage: stage });
    return response.data;
  },
  updateContest: async (id: string, data: any) => {
    const response = await api.put(`/admin/contests/${id}`, data);
    return response.data;
  },
  deleteSubmission: async (id: string) => {
    const response = await api.delete(`/admin/submissions/${id}`);
    return response.data;
  },
  updateContestantStatus: async (data: { video_id: string; winner_position?: number | null; is_promoted?: boolean }) => {
    const response = await api.put('/admin/contestants/status', data);
    return response.data;
  },
  bulkUpdateContestantStatus: async (data: { video_ids: string[]; is_promoted: boolean }) => {
    const response = await api.put('/admin/contestants/bulk-status', data);
    return response.data;
  },
  getContestants: async (id: string) => {
    const response = await api.get(`/admin/contests/${id}/contestants`);
    return response.data;
  },
  getAllSubmissions: async () => {
    const response = await api.get('/admin/all-submissions');
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/admin/all-users');
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  getUserDetails: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
};

export default api;
