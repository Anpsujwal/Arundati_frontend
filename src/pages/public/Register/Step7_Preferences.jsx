import { useState, useEffect } from 'react';
import { Sliders, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { profileApi } from '../../../api/profile.api';
import { refApi } from '../../../api/auth.api';
import { getErrorMessage } from '../../../utils/format.utils';
import toast from 'react-hot-toast';

export default function Step7Preferences({ onComplete, onBack, onGoToStep }) {
  const [form, setForm] = useState({
    pref_sub_sect: '',
    pref_location: '',
    pref_age_diff_min: '',
    pref_age_diff_max: '',
  });
  const [subsects, setSubsects] = useState([]);
  const [validation, setValidation] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refApi.subsects().then((r) => setSubsects(r.data.data)).catch(() => {});

    profileApi.me().then((r) => {
      const p = r.data.data?.profile;
      if (p) {
        setForm((prev) => ({
          ...prev,
          pref_sub_sect: p.pref_sub_sect || '',
          pref_location: p.pref_location || '',
          pref_age_diff_min: p.pref_age_diff_min != null ? String(p.pref_age_diff_min) : '',
          pref_age_diff_max: p.pref_age_diff_max != null ? String(p.pref_age_diff_max) : '',
        }));
      }
      if (r.data.data?.validation) {
        setValidation(r.data.data.validation);
      }
    }).catch(() => {}).finally(() => setLoadingProfile(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Helper to determine if all prior 6 steps are complete
  const allPriorComplete = validation ? validation.isComplete : false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allPriorComplete) {
      toast.error('Please complete all 7 steps and mandatory fields before submitting your application.');
      return;
    }

    setLoading(true);
    try {
      // Finalize Step 6 and save Step 7 preferences
      await profileApi.step6();
      await profileApi.step7({
        ...form,
        pref_age_diff_min: form.pref_age_diff_min !== '' ? parseInt(form.pref_age_diff_min, 10) : null,
        pref_age_diff_max: form.pref_age_diff_max !== '' ? parseInt(form.pref_age_diff_max, 10) : null,
      });
      toast.success('Application submitted successfully!');
      onComplete();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const stepList = [
    { num: 1, key: 'step1', label: 'Basic Information' },
    { num: 2, key: 'step2', label: 'Lineage & Gotra' },
    { num: 3, key: 'step3', label: 'Birth Details' },
    { num: 4, key: 'step4', label: 'Education & Profession' },
    { num: 5, key: 'step5', label: 'Family Information' },
    { num: 6, key: 'step6', label: 'Profile Photos' },
    { num: 7, key: 'step7', label: 'Matchmaking Preferences' },
  ];

  return (
    <div>
      <h2 className="section-title">Step 7 — Matchmaking Preferences &amp; Submission</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Specify your partner preferences. All 7 steps and mandatory fields must be completed before you can submit your application.
      </p>

      {/* ── 7-Step Validation Review Card ────────────────────────────────────── */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        border: allPriorComplete ? '1px solid rgba(45, 106, 63, 0.35)' : '1px solid rgba(196, 147, 42, 0.4)',
        background: allPriorComplete ? 'rgba(45, 106, 63, 0.04)' : 'rgba(255, 248, 238, 0.95)',
        padding: 'var(--space-5)',
        marginBottom: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {allPriorComplete ? (
              <CheckCircle2 size={22} color="var(--color-leaf)" />
            ) : (
              <AlertCircle size={22} color="#D97706" />
            )}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: allPriorComplete ? 'var(--color-leaf)' : 'var(--color-primary)',
              margin: 0,
            }}>
              {allPriorComplete
                ? 'All 7 Steps Verified & Ready for Submission'
                : 'Application Completion Checklist'}
            </h3>
          </div>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: allPriorComplete ? 'rgba(45, 106, 63, 0.15)' : 'rgba(217, 119, 6, 0.15)',
            color: allPriorComplete ? 'var(--color-leaf)' : '#B45309',
          }}>
            {validation
              ? `${Object.values(validation.steps).filter((s) => s.complete).length} / 7 Steps Complete`
              : 'Checking...'}
          </span>
        </div>

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          {allPriorComplete
            ? 'All required fields across all 7 steps have been filled. You can now submit your application for verification.'
            : 'You must fill all mandatory fields across all 7 steps. Click on any incomplete step below to quickly complete it.'}
        </p>

        {/* Step-by-step checklist breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {stepList.map((step) => {
            const stepInfo = validation?.steps?.[step.key];
            const isStepComplete = step.num === 7 ? true : (stepInfo ? stepInfo.complete : false);
            const missing = stepInfo?.missing || [];

            return (
              <div key={step.num} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                background: isStepComplete ? 'rgba(255, 255, 255, 0.7)' : '#FEF3C7',
                border: isStepComplete ? '1px solid rgba(45, 106, 63, 0.15)' : '1px solid #F59E0B',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700,
                    background: isStepComplete ? 'var(--color-leaf)' : '#F59E0B',
                    color: 'white', flexShrink: 0,
                  }}>
                    {isStepComplete ? '✓' : '!'}
                  </span>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                    <strong>Step {step.num}: {step.label}</strong>
                    {!isStepComplete && missing.length > 0 && (
                      <span style={{ color: '#B45309', fontSize: 'var(--text-xs)', marginLeft: 'var(--space-2)' }}>
                        (Missing: {missing.join(', ')})
                      </span>
                    )}
                  </div>
                </div>

                {!isStepComplete && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onGoToStep && onGoToStep(step.num)}
                    style={{
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      fontSize: 'var(--text-xs)',
                      padding: '2px 8px',
                      flexShrink: 0,
                    }}
                  >
                    Edit Step {step.num} →
                  </button>
                )}
                {isStepComplete && (
                  <span style={{ color: 'var(--color-leaf)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    Complete
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences Form */}
      <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <Sliders size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)' }} />
        <span style={{ fontSize: 'var(--text-sm)' }}>
          Preferences are used as soft ranking signals and do not replace the core Gotra restrictions enforced by our system.
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Preferred Sub-Sect */}
          <div className="input-group">
            <label className="input-label" htmlFor="pref_sub_sect">Preferred Sub-Sect</label>
            <select id="pref_sub_sect" className="select" value={form.pref_sub_sect} onChange={(e) => set('pref_sub_sect', e.target.value)}>
              <option value="">No preference (All compatible Brahmin sub-sects)</option>
              {subsects.map((s) => <option key={s}>{s}</option>)}
            </select>
            <p className="input-hint">Leave as "No preference" to see all compatible matches.</p>
          </div>

          {/* Preferred Location */}
          <div className="input-group">
            <label className="input-label" htmlFor="pref_location">Preferred Place / Location</label>
            <input id="pref_location" type="text" className="input" value={form.pref_location}
              onChange={(e) => set('pref_location', e.target.value)}
              placeholder="e.g. Hyderabad, Andhra Pradesh, Bangalore" />
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>
            ← Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {!allPriorComplete && (
              <span style={{ fontSize: 'var(--text-xs)', color: '#B45309', fontWeight: 600 }}>
                ⚠ Complete all 7 steps above to unlock submit
              </span>
            )}
            <button
              id="step7-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || loadingProfile || !allPriorComplete}
              title={!allPriorComplete ? 'Please complete all 7 steps before submitting' : 'Submit your complete application'}
              style={{
                opacity: (!allPriorComplete || loading) ? 0.65 : 1,
                cursor: !allPriorComplete ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : null}
              {loading ? 'Submitting Application…' : '🎉 Submit Application'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
