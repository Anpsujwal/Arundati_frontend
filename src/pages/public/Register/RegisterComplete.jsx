import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

export default function RegisterComplete() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-6)',
    }}>
      <div className="card card-padded" style={{
        maxWidth: '560px', width: '100%',
        boxShadow: 'var(--shadow-xl)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '72px', height: '72px',
          background: 'var(--color-success-bg)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-5)',
        }}>
          <CheckCircle size={36} color="var(--color-success)" />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)',
          color: 'var(--color-primary)', marginBottom: 'var(--space-3)',
        }}>
          Profile Submitted!
        </h1>

        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
          Thank you for registering with Arundhati. Your profile has been received and is now awaiting identity verification.
        </p>

        {/* Status card */}
        <div style={{
          background: 'var(--color-warning-bg)',
          border: '1px solid rgba(230,81,0,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-6)',
          textAlign: 'left',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-3)' }}>
            <Clock size={18} color="var(--color-warning)" />
            <strong style={{ color: 'var(--color-warning)' }}>Pending ID Verification</strong>
          </div>
          <ul style={{ paddingLeft: 'var(--space-5)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 2 }}>
            <li>Our team will review your Government ID</li>
            <li>Verification typically takes 24–48 hours</li>
            <li>You will be able to browse matches once approved</li>
            <li>Your profile will not appear in match feeds until verified</li>
          </ul>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          <Link to="/dashboard" className="btn btn-primary btn-full btn-lg">
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
          Questions? Contact us at{' '}
          <a href="mailto:support@arundhati.in" style={{ color: 'var(--color-primary)' }}>
            support@arundhati.in
          </a>
        </p>
      </div>
    </div>
  );
}
