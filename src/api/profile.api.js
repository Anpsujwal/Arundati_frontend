import api from './axios.instance';

export const profileApi = {
  me: () => api.get('/profile/me'),
  step1: (data) => api.post('/profile/step/1', data),
  step2: (data) => api.post('/profile/step/2', data),
  step3: (data) => api.post('/profile/step/3', data),
  step4: (data) => api.post('/profile/step/4', data),
  step5: (data) => api.post('/profile/step/5', data),
  step6: () => api.post('/profile/step/6'),
  step7: (data) => api.post('/profile/step/7', data),
  uploadPhoto: (file) => {
    const form = new FormData();
    form.append('photo', file);
    return api.post('/profile/photo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deletePhoto: (id) => api.delete(`/profile/photo/${id}`),
  uploadDocument: (file, doc_type = 'gov_id') => {
    const form = new FormData();
    form.append('document', file);
    form.append('doc_type', doc_type);
    return api.post('/profile/document', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateProfile: (data) => api.put('/profile/me', data),
  deleteAccount: () => api.delete('/profile/account'),
};
