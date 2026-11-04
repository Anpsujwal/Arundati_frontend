import { useState, useEffect } from 'react';
import { profileApi } from '../../../api/profile.api';
import { refApi } from '../../../api/auth.api';
import { getErrorMessage } from '../../../utils/format.utils';
import CommunitySelector from '../../../components/ui/CommunitySelector';
import toast from 'react-hot-toast';

export default function Step2Lineage({ onNext, onBack }) {
  const [form, setForm] = useState({
    // Community fields (two-level)
    primary_sect: '',
    primary_sect_id: null,
    primary_sect_slug: '',
    sub_sect: '',
    sub_sect_id: null,
    sub_sect_slug: '',
    community_custom: '',
    // Lineage fields
    gotra: '', pravara: '', maternal_gotra: '',
    maternal_inti_peru: '', veda: '', shakha: '', native_place: '',
  });
  const [gotras, setGotras] = useState([]);
  const [gotraSearch, setGotraSearch] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refApi.gotras().then((r) => setGotras(r.data.data)).catch(() => {});
    profileApi.me().then((r) => {
      const p = r.data.data?.profile;
      if (p) {
        setForm((prev) => ({
          ...prev,
          primary_sect: p.primary_sect || '',
          sub_sect: p.sub_sect || '',
          community_custom: p.community_custom_name || '',
          gotra: p.gotra || '',
          pravara: p.pravara || '',
          maternal_gotra: p.maternal_gotra || '',
          maternal_inti_peru: p.maternal_inti_peru || '',
          veda: p.veda || '',
          shakha: p.shakha || '',
          native_place: p.native_place || '',
        }));
      }
    }).catch(() => {});
  }, []);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const filteredGotras = gotraSearch
    ? gotras.filter((g) => g.toLowerCase().includes(gotraSearch.toLowerCase()))
    : gotras;

  const validate = () => {
    const e = {};
    const isOtherPrimary = form.primary_sect === 'Other / Not Listed';
    const isOtherSubSect = form.sub_sect === 'Other / Not Listed';

    if (!form.primary_sect) {
      e.community = 'Primary Sect is required.';
    } else if (isOtherPrimary && !form.community_custom.trim()) {
      e.community = 'Please describe your community.';
    } else if (!isOtherPrimary && !form.sub_sect) {
      e.community = 'Sub-Sect / Local Lineage is required.';
    } else if (isOtherSubSect && !form.community_custom.trim()) {
      e.community = 'Please describe your Sub-Sect / Local Lineage.';
    }

    if (!form.gotra) e.gotra = 'Gotra is required — it is essential for Gotra compatibility.';
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
      const isOtherPrimary = form.primary_sect === 'Other / Not Listed';
      const isOtherSubSect = form.sub_sect === 'Other / Not Listed';

      await profileApi.step2({
        primary_sect: isOtherPrimary ? null : (form.primary_sect || null),
        sub_sect: isOtherSubSect ? null : (form.sub_sect || null),
        community_custom_name: (isOtherPrimary || isOtherSubSect) ? form.community_custom : null,
        community_custom_pending: isOtherPrimary || isOtherSubSect,
        gotra: form.gotra,
        pravara: form.pravara,
        maternal_gotra: form.maternal_gotra,
        maternal_inti_peru: form.maternal_inti_peru,
        veda: form.veda,
        shakha: form.shakha,
        native_place: form.native_place,
      });
      toast.success('Lineage information saved!');
      onNext();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="section-title">Step 2 — Lineage &amp; Ancestry</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Your lineage details are at the heart of Brahmin matchmaking. Fields marked with <span className="required">*</span> are mandatory.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* ── Community Selection — Two-Level Cascading ── */}
          <div className="input-group col-span-2">
            <CommunitySelector
              primarySect={form.primary_sect}
              subSect={form.sub_sect}
              primarySectId={form.primary_sect_id}
              subSectId={form.sub_sect_id}
              required={true}
              error={errors.community}
              onChangePrimary={(id, name, slug) => {
                setForm((f) => ({
                  ...f,
                  primary_sect: name,
                  primary_sect_id: id,
                  primary_sect_slug: slug,
                  // Clear sub-sect when primary changes
                  sub_sect: '',
                  sub_sect_id: null,
                  sub_sect_slug: '',
                  community_custom: '',
                }));
                if (errors.community) setErrors((e) => ({ ...e, community: null }));
              }}
              onChangeSubSect={(id, name, slug) => {
                setForm((f) => ({
                  ...f,
                  sub_sect: name,
                  sub_sect_id: id,
                  sub_sect_slug: slug,
                  community_custom: '',
                }));
                if (errors.community) setErrors((e) => ({ ...e, community: null }));
              }}
              customValue={form.community_custom}
              onCustomChange={(v) => set('community_custom', v)}
            />
          </div>

          {/* Gotra — searchable dropdown */}
          <div className="input-group">
            <label className="input-label" htmlFor="gotra-search">Gotra <span className="required">*</span></label>
            <input
              id="gotra-search" type="text" className="input"
              placeholder="Search Gotra…"
              value={gotraSearch || form.gotra}
              onChange={(e) => { setGotraSearch(e.target.value); set('gotra', ''); }}
              onFocus={() => setGotraSearch(form.gotra)}
            />
            {gotraSearch && filteredGotras.length > 0 && (
              <div style={{
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface)', maxHeight: '180px', overflowY: 'auto',
                boxShadow: 'var(--shadow-md)', zIndex: 10, position: 'relative',
              }}>
                {filteredGotras.slice(0, 15).map((g) => (
                  <div key={g} onClick={() => { set('gotra', g); setGotraSearch(''); }}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      cursor: 'pointer', fontSize: 'var(--text-sm)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--color-primary-faint)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >{g}</div>
                ))}
              </div>
            )}
            {form.gotra && !gotraSearch && (
              <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginTop:'var(--space-1)' }}>
                <span className="badge badge-gold">{form.gotra}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { set('gotra',''); setGotraSearch(''); }}>
                  Change
                </button>
              </div>
            )}
            {errors.gotra && <p className="input-error-msg">{errors.gotra}</p>}
          </div>

          {/* Pravara — optional */}
          <div className="input-group col-span-2">
            <label className="input-label" htmlFor="pravara">Pravara <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>(optional)</span></label>
            <input id="pravara" type="text" className="input" value={form.pravara}
              onChange={(e) => set('pravara', e.target.value)}
              placeholder="e.g. Angirasa, Barhaspatya, Bharadwaja" />
            <p className="input-hint">List the pravara rishis separated by commas. Leave blank if unknown.</p>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="maternal_gotra">Maternal Gotra</label>
            <input id="maternal_gotra" type="text" className="input" value={form.maternal_gotra}
              onChange={(e) => set('maternal_gotra', e.target.value)} placeholder="Mother's Gotra" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="maternal_inti_peru">Maternal Inti Peru</label>
            <input id="maternal_inti_peru" type="text" className="input" value={form.maternal_inti_peru}
              onChange={(e) => set('maternal_inti_peru', e.target.value)} placeholder="Mother's maiden surname" />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="veda">Veda</label>
            <select id="veda" className="select" value={form.veda} onChange={(e) => set('veda', e.target.value)}>
              <option value="">Select Veda</option>
              {['Rigveda', 'Yajurveda', 'Samaveda', 'Atharvaveda'].map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          {/* shakha field — relabelled as "Sect / Shakha" (no new column needed) */}
          <div className="input-group">
            <label className="input-label" htmlFor="shakha">Sect / Shakha</label>
            <input id="shakha" type="text" className="input" value={form.shakha}
              onChange={(e) => set('shakha', e.target.value)} placeholder="e.g. Apastamba, Ashvalayana" />
            <p className="input-hint">Your sect branch or tradition</p>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="native_place">Native Place</label>
            <input id="native_place" type="text" className="input" value={form.native_place}
              onChange={(e) => set('native_place', e.target.value)} placeholder="e.g. Tirupati" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>← Back</button>
          <button id="step2-next" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" style={{ borderTopColor:'white' }} /> : null}
            {loading ? 'Saving…' : 'Continue to Birth Info →'}
          </button>
        </div>
      </form>
    </div>
  );
}
