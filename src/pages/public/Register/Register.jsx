import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { authApi } from '../../../api/auth.api';
import { getErrorMessage } from '../../../utils/format.utils';
import WizardProgress from '../../../components/wizard/WizardProgress';
import Step1Basic from './Step1_Basic';
import Step2Lineage from './Step2_Lineage';
import Step3Birth from './Step3_Birth';
import Step4Education from './Step4_Education';
import Step5Family from './Step5_Family';
import Step6Photos from './Step6_Photos';
import Step7Preferences from './Step7_Preferences';
import toast from 'react-hot-toast';

import MangoToran from '../../../components/wedding-theme/MangoToran.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register, user, isPending, isAdmin } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 is for account creation; steps 2-6 fill profile
  // If user already registered (page refresh), skip to profile steps
  const [registered, setRegistered] = useState(!!user);

  // Redirect already-approved or admin users away from the registration wizard.
  // Pending users stay here so they can finish filling out the wizard steps.
  if (user && !isPending && !isAdmin) {
    navigate('/dashboard', { replace: true });
    return null;
  }
  if (user && isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleStep1Complete = async (data) => {
    if (!registered) {
      try {
        await register({
          email: data.email,
          password: data.password,
          profile_managed_by: data.profile_managed_by,
        });
        setRegistered(true);
      } catch (err) {
        toast.error(getErrorMessage(err));
        return;
      }
    }
    setCurrentStep(2);
  };

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 7));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleComplete = () => {
    navigate('/register/complete');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Traditional top mango toran garland */}
      <div className="toran-wrap" style={{ width: '100%', overflow: 'hidden', background: 'var(--color-surface)', borderBottom: '1px solid rgba(196,147,42,0.15)' }}>
        <MangoToran density="medium" color="#2D6A3F" goldColor="#C4932A" style={{ opacity: 0.85, margin: '0 auto', maxWidth: '1000px' }} />
      </div>

      {/* Top brand bar */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-3) 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: '40px', height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--color-gold)',
              boxShadow: '0 2px 8px rgba(139,26,72,0.2)',
            }}>
              <span style={{ fontSize: '1.25rem', fontFamily: 'serif', color: 'var(--color-gold-light)', lineHeight: 1 }}>ॐ</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.3px' }}>
                Arundhati
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Brahmin Matrimonial Alliance
              </div>
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            Step {currentStep} of 7
          </div>
        </div>
      </div>

      <WizardProgress currentStep={currentStep} />

      <div className="container" style={{ maxWidth: '780px', paddingBottom: 'var(--space-16)' }}>
        <div className="card card-premium" style={{ 
          padding: 'clamp(var(--space-4), 4vw, var(--space-8))', 
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(196,147,42,0.25)',
          background: 'var(--color-surface)',
        }}>
          {currentStep === 1 && <Step1Basic onComplete={handleStep1Complete} alreadyRegistered={registered} />}
          {currentStep === 2 && <Step2Lineage onNext={goNext} onBack={goBack} />}
          {currentStep === 3 && <Step3Birth onNext={goNext} onBack={goBack} />}
          {currentStep === 4 && <Step4Education onNext={goNext} onBack={goBack} />}
          {currentStep === 5 && <Step5Family onNext={goNext} onBack={goBack} />}
          {currentStep === 6 && <Step6Photos onComplete={goNext} onBack={goBack} />}
          {currentStep === 7 && <Step7Preferences onComplete={handleComplete} onBack={goBack} />}
        </div>
      </div>
    </div>
  );
}
