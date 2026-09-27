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
      boxShadow: '0 2px 10px rgba(139,26,72,0.04)',
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
                    width: '38px', height: '38px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    background: done 
                      ? 'linear-gradient(135deg, #2D6A3F, #1F4E2D)' 
                      : active 
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' 
                      : 'var(--color-surface-2)',
                    color: done || active ? '#FFF8EE' : 'var(--color-text-muted)',
                    border: active 
                      ? '2px solid var(--color-gold)' 
                      : done 
                      ? '2px solid #52B788' 
                      : '2px solid var(--color-border)',
                    transition: 'all var(--transition-base)',
                    boxShadow: active 
                      ? '0 0 0 3px rgba(196,147,42,0.25), var(--shadow-md)' 
                      : done 
                      ? '0 2px 6px rgba(45,106,63,0.2)' 
                      : 'none',
                  }}>
                    {done ? <CheckCircle size={18} /> : step.num}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--color-primary)' : done ? '#2D6A3F' : 'var(--color-text-light)',
                    whiteSpace: 'nowrap',
                    letterSpacing: active ? '0.3px' : 'normal',
                  }}>
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{
                    width: '44px', height: '2px',
                    background: done 
                      ? 'linear-gradient(90deg, #2D6A3F, var(--color-gold))' 
                      : 'var(--color-border)',
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
