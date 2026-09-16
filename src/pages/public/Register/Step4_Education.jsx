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
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => { refApi.incomes().then((r) => setIncomes(r.data.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileApi.step4({
        ...form,
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
      <h2 className="section-title">Step 4 — Education & Profession</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Your professional background helps families understand your lifestyle.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group col-span-2">
            <label className="input-label" htmlFor="education">Highest Education</label>
            <input id="education" type="text" className="input" value={form.education}
              onChange={(e) => set('education', e.target.value)} placeholder="e.g. M.Tech Computer Science, IIT Madras" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="profession">Profession</label>
            <input id="profession" type="text" className="input" value={form.profession}
              onChange={(e) => set('profession', e.target.value)} placeholder="e.g. Software Engineer" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="employer">Employer</label>
            <input id="employer" type="text" className="input" value={form.employer}
              onChange={(e) => set('employer', e.target.value)} placeholder="e.g. Infosys, Self-employed" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="annual_income">Annual Income</label>
            <select id="annual_income" className="select" value={form.annual_income} onChange={(e) => set('annual_income', e.target.value)}>
              <option value="">Prefer not to say</option>
              {incomes.map((i) => <option key={i}>{i}</option>)}
            </select>
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
            <label className="input-label" htmlFor="dietary_habit">Dietary Preference</label>
            <select id="dietary_habit" className="select" value={form.dietary_habit} onChange={(e) => set('dietary_habit', e.target.value)}>
              <option>Strict Vegetarian</option>
              <option>Sattvic</option>
              <option>Vegan</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="city">Current City</label>
            <input id="city" type="text" className="input" value={form.city}
              onChange={(e) => set('city', e.target.value)} placeholder="e.g. Bangalore" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="height_cm">Height (cm)</label>
            <input id="height_cm" type="number" className="input" value={form.height_cm} min={120} max={220}
              onChange={(e) => set('height_cm', e.target.value)} placeholder="e.g. 170" />
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'var(--space-8)' }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>← Back</button>
          <button id="step4-next" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving…' : 'Continue to Family →'}
          </button>
        </div>
      </form>
    </div>
  );
}
