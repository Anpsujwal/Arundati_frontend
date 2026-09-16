import { useState } from 'react';
import { Lock } from 'lucide-react';
import { profileApi } from '../../../api/profile.api';
import { getErrorMessage } from '../../../utils/format.utils';
import toast from 'react-hot-toast';

// Renders one elder reference block (1, 2, or 3)
function ElderRefBlock({ index, prefix, form, set }) {
  const label = `Reference ${index}`;
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      background: 'var(--color-surface-2)',
      marginBottom: 'var(--space-4)',
    }}>
      <h4 style={{
        fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)',
        color: 'var(--color-primary)', marginBottom: 'var(--space-3)',
        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        Elder {label}
      </h4>
      <div className="form-grid">
        <div className="input-group">
          <label className="input-label" htmlFor={`${prefix}_name`}>Name</label>
          <input id={`${prefix}_name`} type="text" className="input"
            value={form[`${prefix}_name`]}
            onChange={(e) => set(`${prefix}_name`, e.target.value)}
            placeholder="Full name" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor={`${prefix}_phone`}>
            Phone&nbsp;<Lock size={12} color="var(--color-text-light)" style={{ display:'inline', verticalAlign:'middle' }} />
          </label>
          <input id={`${prefix}_phone`} type="tel" className="input"
            value={form[`${prefix}_phone`]}
            onChange={(e) => set(`${prefix}_phone`, e.target.value)}
            placeholder="Private — not shown to others" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor={`${prefix}_occupation`}>Occupation</label>
          <input id={`${prefix}_occupation`} type="text" className="input"
            value={form[`${prefix}_occupation`]}
            onChange={(e) => set(`${prefix}_occupation`, e.target.value)}
            placeholder="e.g. Retired IAS Officer" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor={`${prefix}_address`}>Address</label>
          <input id={`${prefix}_address`} type="text" className="input"
            value={form[`${prefix}_address`]}
            onChange={(e) => set(`${prefix}_address`, e.target.value)}
            placeholder="City / Town" />
        </div>
      </div>
    </div>
  );
}

export default function Step5Family({ onNext, onBack }) {
  const [form, setForm] = useState({
    father_name: '', father_occupation: '',
    mother_name: '', mother_maiden_inti_peru: '',
    sibling_count: '',
    // Elder references (up to 3, all optional)
    elder_ref_1_name: '', elder_ref_1_phone: '', elder_ref_1_address: '', elder_ref_1_occupation: '',
    elder_ref_2_name: '', elder_ref_2_phone: '', elder_ref_2_address: '', elder_ref_2_occupation: '',
    elder_ref_3_name: '', elder_ref_3_phone: '', elder_ref_3_address: '', elder_ref_3_occupation: '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileApi.step5({ ...form, sibling_count: form.sibling_count ? parseInt(form.sibling_count, 10) : 0 });
      toast.success('Family information saved!');
      onNext();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="section-title">Step 5 — Family &amp; Elder References</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
        Family information and elder references are an important part of Brahmin matchmaking traditions.
      </p>

      <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)' }}>
        <Lock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>Phone numbers are <strong>private</strong> and will never be displayed to other users. They are used only for Vicharana reference purposes.</span>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-base)', color:'var(--color-text-muted)', marginBottom:'var(--space-4)' }}>
          Parents
        </h3>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label" htmlFor="father_name">Father's Name</label>
            <input id="father_name" type="text" className="input" value={form.father_name}
              onChange={(e) => set('father_name', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="father_occupation">Father's Occupation</label>
            <input id="father_occupation" type="text" className="input" value={form.father_occupation}
              onChange={(e) => set('father_occupation', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="mother_name">Mother's Name</label>
            <input id="mother_name" type="text" className="input" value={form.mother_name}
              onChange={(e) => set('mother_name', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="mother_maiden_inti_peru">Mother's Maiden Inti Peru</label>
            <input id="mother_maiden_inti_peru" type="text" className="input" value={form.mother_maiden_inti_peru}
              onChange={(e) => set('mother_maiden_inti_peru', e.target.value)} placeholder="Mother's maiden surname" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="sibling_count">Number of Siblings</label>
            <input id="sibling_count" type="number" className="input" value={form.sibling_count}
              min={0} max={20} onChange={(e) => set('sibling_count', e.target.value)} />
          </div>
        </div>

        <hr className="divider" />
        <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-base)', color:'var(--color-text-muted)', marginBottom:'var(--space-2)' }}>
          Elder References (Vicharana)
        </h3>
        <p style={{ color:'var(--color-text-light)', fontSize:'var(--text-xs)', marginBottom:'var(--space-4)' }}>
          Provide up to 3 elder references (e.g. uncle, family elder, community leader). All fields are optional.
        </p>

        <ElderRefBlock index={1} prefix="elder_ref_1" form={form} set={set} />
        <ElderRefBlock index={2} prefix="elder_ref_2" form={form} set={set} />
        <ElderRefBlock index={3} prefix="elder_ref_3" form={form} set={set} />

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'var(--space-8)' }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>← Back</button>
          <button id="step5-next" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving…' : 'Continue to Photos →'}
          </button>
        </div>
      </form>
    </div>
  );
}
