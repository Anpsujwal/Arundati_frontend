import { useState, useEffect } from 'react';
import { profileApi } from '../../../api/profile.api';
import { refApi } from '../../../api/auth.api';
import { getErrorMessage } from '../../../utils/format.utils';
import toast from 'react-hot-toast';

export default function Step4Education({ onNext, onBack }) {
  const [form, setForm] = useState({
    education: '', profession: '', employer: '', city: '',
    annual_income: '', hide_income: false,
    dietary_habit: 'Strict Vegetarian', height_cm: '',
  });
  const [incomes, setIncomes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refApi.incomes().then((r) => setIncomes(r.data.data)).catch(() => {});
    profileApi.me().then((r) => {
      const p = r.data.data?.profile;
      if (p) {
        setForm((prev) => ({
          ...prev,
          education: p.education || '',
          profession: p.profession || '',
          employer: p.employer || '',
          city: p.city || '',
          annual_income: p.annual_income || '',
          hide_income: Boolean(p.hide_income),
          dietary_habit: p.dietary_habit || 'Strict Vegetarian',
          height_cm: p.height_cm != null ? String(p.height_cm) : '',
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
    if (!form.education || !form.education.trim()) e.education = 'Highest education is required.';
    if (!form.profession || !form.profession.trim()) e.profession = 'Profession is required.';
    if (!form.city || !form.city.trim()) e.city = 'Current city is required.';
    if (!form.height_cm) {
      e.height_cm = 'Height is required.';
    } else {
      const h = parseInt(form.height_cm, 10);
      if (isNaN(h) || h < 100 || h > 250) e.height_cm = 'Please enter a valid height in cm (100–250).';
    }
    if (!form.annual_income) e.annual_income = 'Please select annual income.';
    if (!form.dietary_habit) e.dietary_habit = 'Dietary preference is required.';

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
      await profileApi.step4({
        ...form,
        education: form.education.trim(),
        profession: form.profession.trim(),
        employer: form.employer ? form.employer.trim() : '',
        city: form.city.trim(),
        height_cm: form.height_cm ? parseInt(form.height_cm, 10) : null,
        hide_income: form.hide_income ? 1 : 0,
      });
      toast.success('Education & profession saved!');
      onNext();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="section-title">Step 4 — Education &amp; Profession</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Your professional background helps families understand your lifestyle. Fields marked with <span className="required">*</span> are mandatory.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group col-span-2">
            <label className="input-label" htmlFor="education">Highest Education <span className="required">*</span></label>
            <input id="education" type="text" className={`input ${errors.education ? 'error' : ''}`} value={form.education}
              onChange={(e) => set('education', e.target.value)} placeholder="e.g. M.Tech Computer Science, IIT Madras" />
            {err('education')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="profession">Profession <span className="required">*</span></label>
            <input id="profession" type="text" className={`input ${errors.profession ? 'error' : ''}`} value={form.profession}
              onChange={(e) => set('profession', e.target.value)} placeholder="e.g. Software Engineer" />
            {err('profession')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="employer">Employer / Company</label>
            <input id="employer" type="text" className="input" value={form.employer}
              onChange={(e) => set('employer', e.target.value)} placeholder="e.g. Infosys, TCS, Self-employed" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="annual_income">Annual Income <span className="required">*</span></label>
            <select id="annual_income" className={`select ${errors.annual_income ? 'error' : ''}`} value={form.annual_income} onChange={(e) => set('annual_income', e.target.value)}>
              <option value="">Select Annual Income</option>
              {incomes.map((i) => <option key={i}>{i}</option>)}
            </select>
            {err('annual_income')}
          </div>
          <div className="input-group" style={{ justifyContent: 'center' }}>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)' }}>Income Privacy</label>
            <label style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', cursor:'pointer', fontSize:'var(--text-sm)' }}>
              <input type="checkbox" checked={form.hide_income}
                onChange={(e) => set('hide_income', e.target.checked)}
                style={{ width:'16px', height:'16px', cursor:'pointer', accentColor:'var(--color-primary)' }} />
              Hide income from matches
            </label>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="dietary_habit">Dietary Preference <span className="required">*</span></label>
            <select id="dietary_habit" className={`select ${errors.dietary_habit ? 'error' : ''}`} value={form.dietary_habit} onChange={(e) => set('dietary_habit', e.target.value)}>
              <option>Strict Vegetarian</option>
              <option>Sattvic</option>
              <option>Vegan</option>
            </select>
            {err('dietary_habit')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="city">Current City <span className="required">*</span></label>
            <input id="city" type="text" className={`input ${errors.city ? 'error' : ''}`} value={form.city}
              onChange={(e) => set('city', e.target.value)} placeholder="e.g. Bangalore" />
            {err('city')}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="height_cm">Height (cm) <span className="required">*</span></label>
            <input id="height_cm" type="number" className={`input ${errors.height_cm ? 'error' : ''}`} value={form.height_cm} min={100} max={250}
              onChange={(e) => set('height_cm', e.target.value)} placeholder="e.g. 172" />
            {err('height_cm')}
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'var(--space-8)' }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>← Back</button>
          <button id="step4-next" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" style={{ borderTopColor:'white' }} /> : null}
            {loading ? 'Saving…' : 'Continue to Family →'}
          </button>
        </div>
      </form>
    </div>
  );
}
