import { useState } from 'react';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { profileApi } from '../../../api/profile.api';
import { getErrorMessage } from '../../../utils/format.utils';
import toast from 'react-hot-toast';

export default function Step1Basic({ onComplete, alreadyRegistered }) {
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    first_name: '', surname: '',
    gender: '', date_of_birth: '',
    marital_status: 'Never Married',
    profile_managed_by: 'Self',
  });
  const [govIdFile, setGovIdFile] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const err = (k) => errors[k] && <p className="input-error-msg">{errors[k]}</p>;

  const validate = () => {
    const e = {};
    if (!alreadyRegistered) {
      if (!form.email) e.email = 'Email is required.';
      if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters.';
      if (!/[A-Z]/.test(form.password)) e.password = 'Password needs an uppercase letter.';
      if (!/[0-9]/.test(form.password)) e.password = 'Password needs a number.';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    }
    if (!form.first_name.trim()) e.first_name = 'First name is required.';
    if (!form.gender) e.gender = 'Please select gender.';
    if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required.';
    if (!govIdFile) e.gov_id = 'Government ID is required for verification.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onComplete(form); // Register account
      // Save profile data
      await profileApi.step1({
        first_name: form.first_name, surname: form.surname,
        gender: form.gender, date_of_birth: form.date_of_birth,
        marital_status: form.marital_status,
        profile_managed_by: form.profile_managed_by,
      });
      // Upload gov ID
      if (govIdFile) await profileApi.uploadDocument(govIdFile, 'gov_id');
      toast.success('Basic information saved!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="section-title">Step 1 — Basic Information</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Let's start with your account credentials and basic personal details.
      </p>

      <form onSubmit={handleSubmit}>
        {!alreadyRegistered && (
          <>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
              Account Credentials
            </h3>
            <div className="form-grid" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="input-group col-span-2">
                <label className="input-label" htmlFor="email">Email Address <span className="required">*</span></label>
                <input id="email" type="email" className={`input ${errors.email ? 'error' : ''}`}
                  value={form.email} onChange={(e) => set('email', e.target.value)}
                  placeholder="your@email.com" />
                {err('email')}
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="password">Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input id="password" type={showPw ? 'text' : 'password'}
                    className={`input ${errors.password ? 'error' : ''}`}
                    value={form.password} onChange={(e) => set('password', e.target.value)}
                    style={{ paddingRight: 'var(--space-10)' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{
                    position: 'absolute', right: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', display: 'flex', padding: 0,
                  }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {err('password')}
                <p className="input-hint">Min 8 chars, 1 uppercase, 1 number</p>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                <input id="confirmPassword" type={showPw ? 'text' : 'password'}
                  className={`input ${errors.confirmPassword ? 'error' : ''}`}
                  value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} />
                {err('confirmPassword')}
              </div>
            </div>
            <hr className="divider" />
          </>
        )}

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
          Personal Details
        </h3>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label" htmlFor="first_name">First Name <span className="required">*</span></label>
            <input id="first_name" type="text" className={`input ${errors.first_name ? 'error' : ''}`}
              value={form.first_name} onChange={(e) => set('first_name', e.target.value)} placeholder="e.g. Arjun" />
            {err('first_name')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="surname">Surname / Inti Peru</label>
            <input id="surname" type="text" className="input"
              value={form.surname} onChange={(e) => set('surname', e.target.value)} placeholder="e.g. Sharma" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="gender">Gender <span className="required">*</span></label>
            <select id="gender" className={`select ${errors.gender ? 'error' : ''}`}
              value={form.gender} onChange={(e) => set('gender', e.target.value)}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            {err('gender')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="date_of_birth">Date of Birth <span className="required">*</span></label>
            <input id="date_of_birth" type="date" className={`input ${errors.date_of_birth ? 'error' : ''}`}
              value={form.date_of_birth} onChange={(e) => set('date_of_birth', e.target.value)}
              max={new Date(Date.now() - 18 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0]} />
            {err('date_of_birth')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="marital_status">Marital Status <span className="required">*</span></label>
            <select id="marital_status" className="select"
              value={form.marital_status} onChange={(e) => set('marital_status', e.target.value)}>
              <option>Never Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="profile_managed_by">Profile Managed By <span className="required">*</span></label>
            <select id="profile_managed_by" className="select"
              value={form.profile_managed_by} onChange={(e) => set('profile_managed_by', e.target.value)}>
              <option>Self</option>
              <option>Parent</option>
              <option>Sibling</option>
              <option>Joint</option>
              <option>Relative</option>
            </select>
          </div>
        </div>

        {/* Gov ID Upload */}
        <div style={{ marginTop: 'var(--space-6)' }}>
          <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
            Government ID <span className="required">*</span>
          </label>
          <div style={{
            border: `2px dashed ${errors.gov_id ? 'var(--color-error)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
            textAlign: 'center',
            cursor: 'pointer',
            background: govIdFile ? 'var(--color-success-bg)' : 'var(--color-surface-2)',
            transition: 'all var(--transition-fast)',
          }}
            onClick={() => document.getElementById('gov-id-input').click()}
          >
            <Upload size={28} color={govIdFile ? 'var(--color-success)' : 'var(--color-text-light)'} style={{ margin: '0 auto var(--space-2)' }} />
            {govIdFile ? (
              <p style={{ color: 'var(--color-success)', fontWeight: 500 }}>✓ {govIdFile.name}</p>
            ) : (
              <>
                <p style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Click to upload Government ID</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 'var(--space-1)' }}>
                  Aadhar, PAN, Passport, or Driving License · JPG, PNG, PDF · Max 10 MB
                </p>
              </>
            )}
            <input
              id="gov-id-input" type="file"
              accept="image/jpeg,image/png,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => setGovIdFile(e.target.files[0] || null)}
            />
          </div>
          {err('gov_id')}
          <p className="input-hint" style={{ marginTop: 'var(--space-1)' }}>
            Your ID is encrypted and visible only to our verification team. It will never be publicly displayed.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
          <button id="step1-next" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : null}
            {loading ? 'Saving…' : 'Continue to Lineage →'}
          </button>
        </div>
      </form>
    </div>
  );
}
