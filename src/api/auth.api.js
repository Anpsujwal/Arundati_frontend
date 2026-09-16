import api from './axios.instance';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const refApi = {
  gotras: () => api.get('/ref/gotras'),
  subsects: () => api.get('/ref/subsects'),
  incomes: () => api.get('/ref/incomes'),
};
