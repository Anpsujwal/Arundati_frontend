import api from './axios.instance';

export const matchesApi = {
  feed:         (page = 1, limit = 12) => api.get(`/matches/feed?page=${page}&limit=${limit}`),
  profile:      (id) => api.get(`/matches/profile/${id}`),
  gradeProfile: (profile_id, grade) => api.post('/matches/grade', { profile_id, grade }),
  getGrades:    () => api.get('/matches/grades'),
};

export const interestsApi = {
  send:     (receiver_profile_id) => api.post('/interests/send', { receiver_profile_id }),
  respond:  (interest_id, action) => api.post('/interests/respond', { interest_id, action }),
  sent:     () => api.get('/interests/sent'),
  received: () => api.get('/interests/received'),
};
