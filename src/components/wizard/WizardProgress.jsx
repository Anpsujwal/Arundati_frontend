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
  const currentStepData = STEPS.find((s) => s.num === currentStep) || STEPS[0];
  const percentComplete = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: 'var(--space-3) 0',
      marginBottom: 'var(--space-6)',
      boxShadow: '0 2px 10px rgba(139,26,74,0.04)',
    }}>
      <div className="container">
        {/* Mobile & Tablet Compact View (<= 768px) */}
        <div className="hide-desktop" style={{ padding: 'var(--space-1) 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-gold-deep)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step {currentStep} of {STEPS.length}
              </span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {currentStepData.label}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-leaf)',
                background: 'rgba(45, 106, 63, 0.10)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                {percentComplete}% Done
              </span>
            </div>
          </div>

          {/* Progress bar track */}
          <div style={{ height: '6px', background: 'var(--color-surface-3)', borderRadius: '99px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{
              width: `${Math.max(8, percentComplete)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold))',
              borderRadius: '99px',
              transition: 'width 0.4s ease',
            }} />
          </div>

          {/* Compact step indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
            {STEPS.map((step) => {
              const done = currentStep > step.num;
              const active = currentStep === step.num;
              return (
                <div
                  key={step.num}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: done
                      ? 'var(--color-leaf)'
                      : active
                      ? 'var(--color-gold)'
                      : 'var(--color-border)',
                    transition: 'all var(--transition-fast)',
                  }}
                  title={`Step ${step.num}: ${step.label}`}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop Full View (> 768px) */}
        <div className="hide-mobile" style={{
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
