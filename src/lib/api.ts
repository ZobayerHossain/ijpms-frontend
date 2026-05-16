import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (fullName: string, email: string, password: string, role: string) =>
    api.post('/auth/register', { fullName, email, password, role: role.toLowerCase(), department: '' }),
};

export const positionsApi = {
  getAll: () => api.get('/positions'),
  getById: (id: string) => api.get(`/positions/${id}`),
  create: (data: object) => api.post('/positions', data),
  update: (id: string, data: object) => api.patch(`/positions/${id}`, data),
  delete: (id: string) => api.delete(`/positions/${id}`),
};

export const applicationsApi = {
  getAll: () => api.get('/applications'),
  getMyApplications: () => api.get('/applications/mine'),
  getByPosition: (positionId: string) =>
    api.get(`/applications/position/${positionId}`),
  apply: (positionId: string, coverLetter?: string) =>
    api.post('/applications', { positionId, coverLetter }),
  withdraw: (id: string) => api.delete(`/applications/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/applications/${id}/result`, { status }),
  updateScore: (id: string, interviewScore: number) =>
    api.patch(`/applications/${id}/result`, { interviewScore }),
};

export const triageApi = {
  getAll: () => api.get('/applications/triage'),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};