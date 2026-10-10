import axios from 'axios';
import {
  Application,
  Interview,
  DashboardOverviewData,
  PaginatedResponse,
  ApiResponse,
  User,
  ApplicationStatus,
  WorkMode,
  Priority
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token from sessionStorage if present (supports fallback in addition to HTTP-only cookie)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('applytrack_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
        sessionStorage.removeItem('applytrack_token');
        // Do not force immediate reload if already on public pages
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  register: (data: any) => api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  login: (data: any) => api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),
  getCurrentUser: () => api.get<ApiResponse<User>>('/auth/me')
};

// Application Endpoints
export const applicationsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ApplicationStatus;
    workMode?: WorkMode;
    priority?: Priority;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get<PaginatedResponse<Application>>('/applications', { params }),
  
  getById: (id: string) => api.get<ApiResponse<Application>>(`/applications/${id}`),
  
  create: (data: Partial<Application>) => api.post<ApiResponse<Application>>('/applications', data),
  
  update: (id: string, data: Partial<Application>) => api.patch<ApiResponse<Application>>(`/applications/${id}`, data),
  
  updateStatus: (id: string, status: ApplicationStatus) =>
    api.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status }),
    
  delete: (id: string) => api.delete<ApiResponse<{ id: string; message: string }>>(`/applications/${id}`),

  exportData: () => api.get<ApiResponse<Application[]>>('/applications/export')
};

// Interview Endpoints
export const interviewsApi = {
  list: () => api.get<ApiResponse<Interview[]>>('/interviews'),
  getById: (id: string) => api.get<ApiResponse<Interview>>(`/interviews/${id}`),
  create: (data: Partial<Interview>) => api.post<ApiResponse<Interview>>('/interviews', data),
  update: (id: string, data: Partial<Interview>) => api.patch<ApiResponse<Interview>>(`/interviews/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<{ id: string; message: string }>>(`/interviews/${id}`)
};

// Analytics Endpoints
export const analyticsApi = {
  getOverview: () => api.get<ApiResponse<DashboardOverviewData>>('/analytics/overview'),
  getDetailed: () => api.get<ApiResponse<DashboardOverviewData>>('/analytics/applications')
};

// User Profile Endpoints
export const userApi = {
  getProfile: () => api.get<ApiResponse<User>>('/users/me'),
  updateProfile: (data: Partial<User>) => api.patch<ApiResponse<User>>('/users/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<ApiResponse<{ message: string }>>('/users/me/password', data)
};
