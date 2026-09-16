/**
 * Calculate age from date_of_birth string (YYYY-MM-DD)
 */
export function calcAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/**
 * Format height from cm to ft/in display
 */
export function formatHeight(cm) {
  if (!cm) return null;
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}" (${cm} cm)`;
}

/**
 * Format date to readable string
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Get initials from a name for avatar fallback
 */
export function getInitials(firstName, surname) {
  const f = (firstName || '').charAt(0).toUpperCase();
  const s = (surname || '').charAt(0).toUpperCase();
  return `${f}${s}` || '?';
}

/**
 * Build URL for serving a profile photo via the secure endpoint.
 * Appends JWT token as query param so <img src> tags (which cannot set
 * Authorization headers) are still authenticated by the backend.
 */
export function photoUrl(filename) {
  if (!filename) return null;
  const token = localStorage.getItem('token');
  const qs = token ? `?token=${encodeURIComponent(token)}` : '';
  return `/api/v1/files/photo/${filename}${qs}`;
}

/**
 * Extract readable error message from Axios error
 */
export function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
}

/**
 * Get a status badge class name
 */
export function statusClass(status) {
  const map = {
    Approved: 'badge-approved',
    Pending_ID: 'badge-pending',
    Rejected: 'badge-rejected',
    Suspended: 'badge-suspended',
  };
  return map[status] || 'badge-pending';
}

/**
 * Get human-readable status label
 */
export function statusLabel(status) {
  const map = {
    Approved: 'Verified',
    Pending_ID: 'Pending Verification',
    Rejected: 'Rejected',
    Suspended: 'Suspended',
  };
  return map[status] || status;
}
