import axios from './axios.instance';

// Get current user's own Kundali details (Lagna, Rashi, Nakshatra etc.)
// Backend wraps response as { success, data: { kundali_status, lagna, ... } }
export const getMyKundali = () =>
  axios.get('/kundali/me').then((r) => r.data.data ?? r.data);

// Get normalized chart data for the South Indian chart renderer
export const getMyChart = () =>
  axios.get('/kundali/me/chart').then((r) => r.data.data ?? r.data);

// Get compatibility breakdown between current user and a candidate
export const getCompatibility = (profileId) =>
  axios.get(`/matches/profile/${profileId}/compatibility`).then((r) => r.data);

// Admin: get Kundali status for a specific user
export const getAdminKundali = (userId) =>
  axios.get(`/kundali/admin/users/${userId}`).then((r) => r.data);

// Admin: retry failed Kundali generation
export const retryKundali = (userId) =>
  axios.post(`/kundali/admin/users/${userId}/retry`).then((r) => r.data);
