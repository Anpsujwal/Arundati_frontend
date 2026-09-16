import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/format.utils';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, isAdmin } = useAuth();
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
      toast.success(`Welcome back!`);
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
      background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, #A02259 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-6)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo card */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-3)',
          }}>
            <Heart size={32} fill="white" color="white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', color: 'white' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
            Sign in to Arundhati — Brahmin Alliance
          </p>
        </div>

        {/* Form card */}
        <div className="card card-padded" style={{ boxShadow: 'var(--shadow-xl)' }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">
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
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">
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
                  style={{ paddingRight: 'var(--space-10)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)',
                    display: 'flex', padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: 'var(--space-2)' }}
            >
              {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : null}
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div className="divider-with-text" style={{ margin: 'var(--space-5) 0' }}>
            <span>New to Arundhati?</span>
          </div>

          <Link to="/register" className="btn btn-outline btn-full">
            Create Your Profile
          </Link>

          <p style={{
            textAlign: 'center', marginTop: 'var(--space-4)',
            fontSize: 'var(--text-xs)', color: 'var(--color-text-light)',
          }}>
            <Link to="/" style={{ color: 'var(--color-text-muted)' }}>← Back to Home</Link>
          </p>
        </div>

        {/* Dev credentials hint */}
        <div style={{
          marginTop: 'var(--space-4)',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3)',
          fontSize: 'var(--text-xs)',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
        }}>
          <strong style={{ color:'rgba(255,255,255,0.85)' }}>Dev accounts:</strong><br />
          Admin: admin@arundhati.local / Admin@1234<br />
          User: arjun@test.local / Test@1234
        </div>
      </div>
    </div>
  );
}
