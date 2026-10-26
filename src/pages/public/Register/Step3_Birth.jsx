import { useState, useEffect } from 'react';
import { profileApi } from '../../../api/profile.api';
import { getErrorMessage } from '../../../utils/format.utils';
import toast from 'react-hot-toast';

export default function Step3Birth({ onNext, onBack }) {
  const [form, setForm] = useState({
    birth_time: '', birth_place: '',
    latitude: '', longitude: '', timezone: 'Asia/Kolkata',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    profileApi.me().then((r) => {
      const a = r.data.data?.astro;
      if (a) {
        setForm((prev) => ({
          ...prev,
          birth_time: a.birth_time || '',
          birth_place: a.birth_place || '',
          latitude: a.latitude != null ? String(a.latitude) : '',
          longitude: a.longitude != null ? String(a.longitude) : '',
          timezone: a.timezone || 'Asia/Kolkata',
        }));
      }
    }).catch(() => {});
  }, []);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const err = (k) => errors[k] && <p className="input-error-msg">{errors[k]}</p>;

  const validate = () => {
    const e = {};
    if (!form.birth_time) e.birth_time = 'Time of birth is required for Kundali generation.';
    if (!form.birth_place || !form.birth_place.trim()) e.birth_place = 'Birth place is required.';
    if (!form.timezone) e.timezone = 'Timezone is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill all mandatory fields marked with *');
      return;
    }
    setLoading(true);
    try {
      await profileApi.step3({
        ...form,
        birth_place: form.birth_place.trim(),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      });
      toast.success('Birth information saved!');
      onNext();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  const TIMEZONES = [
    'Asia/Kolkata', 'Asia/Colombo', 'Asia/Kathmandu', 'Asia/Dhaka',
    'Asia/Karachi', 'Asia/Dubai', 'Europe/London', 'America/New_York',
  ];

  return (
    <div>
      <h2 className="section-title">Step 3 — Birth Information</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Birth details are used for Kundali (horoscope) and Guna Milan compatibility calculations. Fields marked with <span className="required">*</span> are mandatory.
      </p>

      <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
        <span>ℹ</span>
        <span>Enter your <strong>Time of Birth</strong> and <strong>Birth Place</strong> for accurate Kundali generation. Coordinates are auto-filled from your birth place.</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label" htmlFor="birth_time">Time of Birth <span className="required">*</span></label>
            <input id="birth_time" type="time" className={`input ${errors.birth_time ? 'error' : ''}`} value={form.birth_time}
              onChange={(e) => set('birth_time', e.target.value)} />
            {err('birth_time')}
            <p className="input-hint">24-hour format</p>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="timezone">Timezone <span className="required">*</span></label>
            <select id="timezone" className={`select ${errors.timezone ? 'error' : ''}`} value={form.timezone} onChange={(e) => set('timezone', e.target.value)}>
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
            {err('timezone')}
          </div>
          <div className="input-group col-span-2">
            <label className="input-label" htmlFor="birth_place">Birth Place <span className="required">*</span></label>
            <input id="birth_place" type="text" className={`input ${errors.birth_place ? 'error' : ''}`} value={form.birth_place}
              onChange={(e) => set('birth_place', e.target.value)}
              placeholder="e.g. Tirupati, Andhra Pradesh, India" />
            {err('birth_place')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="latitude">Latitude</label>
            <input id="latitude" type="number" step="any" className="input"
              value={form.latitude} onChange={(e) => set('latitude', e.target.value)}
              placeholder="e.g. 13.6288" />
            <p className="input-hint">Auto-detected from birth place or enter manually (optional)</p>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="longitude">Longitude</label>
            <input id="longitude" type="number" step="any" className="input"
              value={form.longitude} onChange={(e) => set('longitude', e.target.value)}
              placeholder="e.g. 79.4192" />
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'var(--space-8)' }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>← Back</button>
          <button id="step3-next" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" style={{ borderTopColor:'white' }} /> : null}
            {loading ? 'Saving…' : 'Continue to Education →'}
          </button>
        </div>
      </form>
    </div>
  );
}
