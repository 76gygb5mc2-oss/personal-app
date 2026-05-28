import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth services
export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getCurrentUser: () => api.get('/api/auth/me'),
  updateUser: (data) => api.put('/api/auth/me', data),
};

// Dashboard
export const dashboardService = {
  getDashboard: () => api.get('/api/dashboard'),
};

// Business
export const businessService = {
  getIdeas: () => api.get('/api/business/ideas'),
  createIdea: (data) => api.post('/api/business/ideas', data),
  updateIdea: (id, data) => api.put(`/api/business/ideas/${id}`, data),
  deleteIdea: (id) => api.delete(`/api/business/ideas/${id}`),
  getProjects: () => api.get('/api/business/projects'),
  createProject: (data) => api.post('/api/business/projects', data),
  updateProject: (id, data) => api.put(`/api/business/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/business/projects/${id}`),
  getTasks: (projectId) => api.get('/api/business/tasks', { params: { project_id: projectId } }),
  createTask: (data) => api.post('/api/business/tasks', data),
  updateTask: (id, data) => api.put(`/api/business/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/api/business/tasks/${id}`),
};

// Financial
export const financialService = {
  getTransactions: () => api.get('/api/financial/transactions'),
  createTransaction: (data) => api.post('/api/financial/transactions', data),
  updateTransaction: (id, data) => api.put(`/api/financial/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/api/financial/transactions/${id}`),
  getGoals: () => api.get('/api/financial/goals'),
  createGoal: (data) => api.post('/api/financial/goals', data),
  updateGoal: (id, data) => api.put(`/api/financial/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/api/financial/goals/${id}`),
  getSummary: (year, month) => api.get('/api/financial/summary', { params: { year, month } }),
};

// Check-ins
export const checkinService = {
  getDailyCheckins: () => api.get('/api/checkin/daily'),
  createDailyCheckin: (data) => api.post('/api/checkin/daily', data),
  updateDailyCheckin: (id, data) => api.put(`/api/checkin/daily/${id}`, data),
  getWeeklyReviews: () => api.get('/api/checkin/weekly'),
  createWeeklyReview: (data) => api.post('/api/checkin/weekly', data),
  updateWeeklyReview: (id, data) => api.put(`/api/checkin/weekly/${id}`, data),
};

// Reports
export const reportService = {
  getFinancialReport: (period) => api.get('/api/reports/financial', { params: { period } }),
  getProductivityReport: (days) => api.get('/api/reports/productivity', { params: { days } }),
  getLearningReport: () => api.get('/api/reports/learning'),
  getHealthReport: (days) => api.get('/api/reports/health', { params: { days } }),
};

// AI Advisor
export const aiService = {
  analyze: (message) => api.post('/api/ai/analyze', { message }),
  getRecommendations: () => api.get('/api/ai/recommendations'),
  getHistory: () => api.get('/api/ai/history'),
};
