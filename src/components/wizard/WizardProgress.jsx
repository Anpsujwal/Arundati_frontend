import { CheckCircle } from 'lucide-react';

const STEPS = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Lineage' },
  { num: 3, label: 'Birth' },
  { num: 4, label: 'Education' },
  { num: 5, label: 'Family' },
  { num: 6, label: 'Photos' },
  { num: 7, label: 'Preferences' },
];

export default function WizardProgress({ currentStep }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: 'var(--space-4) 0',
      marginBottom: 'var(--space-8)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          overflowX: 'auto',
          padding: 'var(--space-2) 0',
        }}>
          {STEPS.map((step, idx) => {
            const done = currentStep > step.num;
            const active = currentStep === step.num;
            return (
              <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    background: done ? 'var(--color-success)' : active ? 'var(--color-primary)' : 'var(--color-surface-2)',
                    color: done || active ? 'white' : 'var(--color-text-muted)',
                    border: active ? '2px solid var(--color-primary)' : done ? '2px solid var(--color-success)' : '2px solid var(--color-border)',
                    transition: 'all var(--transition-base)',
                    boxShadow: active ? 'var(--shadow-glow)' : 'none',
                  }}>
                    {done ? <CheckCircle size={18} /> : step.num}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--color-primary)' : done ? 'var(--color-success)' : 'var(--color-text-light)',
                    whiteSpace: 'nowrap',
                  }}>
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{
                    width: '48px', height: '2px',
                    background: done ? 'var(--color-success)' : 'var(--color-border)',
                    margin: '0 var(--space-1)',
                    marginBottom: 'var(--space-5)',
                    transition: 'background var(--transition-base)',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
