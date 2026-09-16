import { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import { profileApi } from '../../../api/profile.api';
import { refApi } from '../../../api/auth.api';
import { getErrorMessage } from '../../../utils/format.utils';
import toast from 'react-hot-toast';

export default function Step7Preferences({ onComplete, onBack }) {
  const [form, setForm] = useState({
    pref_sub_sect: '',
    pref_location: '',
    pref_age_diff_min: '',
    pref_age_diff_max: '',
  });
  const [subsects, setSubsects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refApi.subsects().then((r) => setSubsects(r.data.data));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save Step 6 (finalize) first, then preferences
      await profileApi.step6();
      await profileApi.step7({
        ...form,
        pref_age_diff_min: form.pref_age_diff_min !== '' ? parseInt(form.pref_age_diff_min, 10) : null,
        pref_age_diff_max: form.pref_age_diff_max !== '' ? parseInt(form.pref_age_diff_max, 10) : null,
      });
      toast.success('Profile submitted successfully!');
      onComplete();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="section-title">Step 7 — Matchmaking Preferences</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Optionally specify your partner preferences. These help us show you more relevant matches. All fields are optional.
      </p>

      <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <Sliders size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)' }} />
        <span style={{ fontSize: 'var(--text-sm)' }}>
          Preferences are used as soft filters and do not replace the core Gotra compatibility rules enforced by our system.
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Preferred Sub-Sect */}
          <div className="input-group">
            <label className="input-label" htmlFor="pref_sub_sect">Preferred Sub-Sect</label>
            <select id="pref_sub_sect" className="select" value={form.pref_sub_sect} onChange={(e) => set('pref_sub_sect', e.target.value)}>
              <option value="">No preference</option>
              {subsects.map((s) => <option key={s}>{s}</option>)}
            </select>
            <p className="input-hint">Leave as "No preference" to see all compatible matches.</p>
          </div>

          {/* Preferred Location */}
          <div className="input-group">
            <label className="input-label" htmlFor="pref_location">Preferred Place / Location</label>
            <input id="pref_location" type="text" className="input" value={form.pref_location}
              onChange={(e) => set('pref_location', e.target.value)}
              placeholder="e.g. Hyderabad, Andhra Pradesh" />
            <p className="input-hint">City, state, or region where you prefer your partner to be from.</p>
          </div>

          {/* Preferred Age Difference */}
          <div className="input-group">
            <label className="input-label" htmlFor="pref_age_diff_min">
              Preferred Age Difference — Minimum (years)
            </label>
            <input id="pref_age_diff_min" type="number" className="input"
              value={form.pref_age_diff_min} min={0} max={20}
              onChange={(e) => set('pref_age_diff_min', e.target.value)}
              placeholder="e.g. 0" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="pref_age_diff_max">
              Preferred Age Difference — Maximum (years)
            </label>
            <input id="pref_age_diff_max" type="number" className="input"
              value={form.pref_age_diff_max} min={0} max={20}
              onChange={(e) => set('pref_age_diff_max', e.target.value)}
              placeholder="e.g. 5" />
            <p className="input-hint">Acceptable age gap between you and your partner.</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>← Back</button>
          <button id="step7-submit" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : null}
            {loading ? 'Submitting…' : '🎉 Submit Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
