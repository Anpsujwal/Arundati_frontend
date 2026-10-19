import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/format.utils';
import toast from 'react-hot-toast';
import MangoToran from '../../components/wedding-theme/MangoToran.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #380817 0%, #520F26 35%, #7B1D3A 75%, #4A0E22 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-10) var(--space-4)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 15%, rgba(196,147,42,0.14) 0%, transparent 60%), radial-gradient(circle at 80% 85%, rgba(160,34,89,0.12) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Top toran garland across page */}
      <div className="toran-wrap" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, pointerEvents: 'none' }}>
        <MangoToran density="medium" color="#2D6A3F" goldColor="#C4932A" style={{ opacity: 0.55 }} />
      </div>

      <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 2 }}>
        {/* Logo / Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            marginBottom: 'var(--space-3)',
            border: '1px solid rgba(196, 147, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}>
            <span style={{ fontSize: '1.65rem', fontFamily: 'serif', color: 'var(--color-gold-light)', lineHeight: 1 }}>ॐ</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: '#FFFFFF',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'rgba(255, 248, 238, 0.72)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.4px',
          }}>
            Sign in to Arundhati — Brahmin Alliance
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: '#FFFDF9',
          borderRadius: '16px',
          padding: '24px 26px',
          boxShadow: '0 20px 48px rgba(35, 6, 15, 0.38), 0 2px 6px rgba(196,147,42,0.12)',
          border: '1px solid rgba(196, 147, 42, 0.30)',
          borderTop: '3px solid var(--color-gold)',
          position: 'relative',
        }}>
          {/* Subtle symmetrical header ornament */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '18px',
            opacity: 0.75,
          }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--color-gold)' }} />
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-gold-deep)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              ✦ Sign In ✦
            </span>
            <div style={{ width: '28px', height: '1px', background: 'var(--color-gold)' }} />
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-xs)', padding: '8px 12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="email" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                autoComplete="email"
                style={{
                  fontSize: '13.5px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #DFCEB7',
                  background: '#FFFFFF',
                }}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>
                Password <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{
                    fontSize: '13.5px',
                    padding: '9px 36px 9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #DFCEB7',
                    background: '#FFFFFF',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                  }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{
                marginTop: '4px',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                border: '1px solid rgba(196, 147, 42, 0.40)',
                boxShadow: '0 3px 12px rgba(123, 29, 58, 0.25)',
              }}
            >
              {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : null}
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          {/* Symmetrical divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '18px 0 14px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)', opacity: 0.65 }} />
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-light)',
              letterSpacing: '0.4px',
              fontWeight: 500,
            }}>
              New to Arundhati?
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)', opacity: 0.65 }} />
          </div>

          <Link
            to="/register"
            className="btn btn-full"
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'var(--color-primary-faint)',
              border: '1px solid rgba(123, 29, 58, 0.35)',
              textAlign: 'center',
              display: 'block',
              transition: 'all var(--transition-fast)',
            }}
          >
            Create Your Profile
          </Link>
        </div>

        {/* Balanced bottom navigation link */}
        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: 'var(--text-xs)',
        }}>
          <Link
            to="/"
            style={{
              color: 'rgba(255, 248, 238, 0.70)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
          >
            ← Back to Home
          </Link>
        </p>


      </div>
    </div>
  );
}
