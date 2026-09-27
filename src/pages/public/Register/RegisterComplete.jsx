import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import MangoToran from '../../../components/wedding-theme/MangoToran.jsx';
import WeddingDivider from '../../../components/wedding-theme/WeddingDivider.jsx';

export default function RegisterComplete() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #3D0A1A 0%, var(--color-primary-dark) 40%, var(--color-primary) 80%, #8B1A48 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-6)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Toran garland */}
      <div className="toran-wrap" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
        <MangoToran density="medium" color="#2D6A3F" goldColor="#C4932A" style={{ opacity: 0.7 }} />
      </div>

      <div className="card card-padded" style={{
        maxWidth: '560px', width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(196,147,42,0.3)',
        background: 'rgba(255, 255, 255, 0.98)',
        overflow: 'hidden',
      }}>
        {/* Subtle gold top stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold), var(--color-primary))' }} />

        {/* Auspicious Om / Kalash Medallion */}
        <div style={{
          width: '76px', height: '76px',
          background: 'linear-gradient(135deg, #FFF8EE, #FFF0DB)',
          border: '2px solid var(--color-gold)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-4)',
          boxShadow: '0 4px 16px rgba(196,147,42,0.25)',
        }}>
          <span style={{ fontSize: '2rem', fontFamily: 'serif', color: 'var(--color-primary)' }}>ॐ</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)',
          color: 'var(--color-primary)', marginBottom: 'var(--space-2)',
        }}>
          Shubh Vivah Aarambh
        </h1>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
          Profile Successfully Submitted
        </div>

        <WeddingDivider size="sm" style={{ margin: 'var(--space-3) 0 var(--space-4)' }} />

        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
          Thank you for registering with Arundhati. Your profile and horoscope details have been received and are now awaiting verification by our administrative panel.
        </p>

        {/* Status card */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF9F0, #FFF5E6)',
          border: '1px solid rgba(196,147,42,0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-6)',
          textAlign: 'left',
          boxShadow: '0 2px 8px rgba(196,147,42,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Clock size={18} color="var(--color-gold)" />
            <strong style={{ color: 'var(--color-primary)' }}>Next Step: Identity Verification</strong>
          </div>
          <ul style={{ paddingLeft: 'var(--space-5)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 2 }}>
            <li>Our team will verify your submitted identity documentation</li>
            <li>Verification typically completes within 24–48 hours</li>
            <li>Kundali matching &amp; full profile browsing will unlock upon approval</li>
            <li>Your privacy and Gotra confidentiality are strictly protected</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Link to="/dashboard" className="btn btn-primary btn-full btn-lg" style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            border: '1px solid var(--color-gold)',
            boxShadow: '0 4px 16px rgba(139,26,72,0.25)',
          }}>
            Go to My Dashboard
          </Link>
          <Link to="/" className="btn btn-ghost btn-full">
            Return to Home
          </Link>
        </div>

        <p style={{
          marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)',
          color: 'var(--color-text-light)',
        }}>
          Questions? Contact our matrimonial support at{' '}
          <a href="mailto:support@arundhati.in" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            support@arundhati.in
          </a>
        </p>
      </div>
    </div>
  );
}
