import api from './axios.instance';

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  recent: () => api.get('/admin/recent'),
  pending: () => api.get('/admin/pending'),
  users: (params) => api.get('/admin/users', { params }),
  profile: (id) => api.get(`/admin/profile/${id}`),
  verify: (data) => api.post('/admin/verify', data),
  documentUrl: (docId) => `/api/v1/files/document/${docId}`,
};
