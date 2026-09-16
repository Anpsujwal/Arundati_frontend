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
      {/* Top brand bar */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-4) 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)', padding: '6px 10px',
            display: 'flex', alignItems: 'center',
          }}>
            <Heart size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-primary)', fontWeight: 700 }}>
              Arundhati
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-gold)', fontWeight: 500, letterSpacing: '0.5px' }}>
              CREATE YOUR PROFILE
            </div>
          </div>
        </div>
      </div>

      <WizardProgress currentStep={currentStep} />

      <div className="container" style={{ maxWidth: '760px', paddingBottom: 'var(--space-16)' }}>
        <div className="card" style={{ padding: 'var(--space-8)', boxShadow: 'var(--shadow-lg)' }}>
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
