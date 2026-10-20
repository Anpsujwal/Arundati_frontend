import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import MangoToran from '../wedding-theme/MangoToran.jsx';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav>
      {/* Thin rainbow top strip */}
      <div className="navbar-toran" />

      {/* Mango toran — hidden on mobile via CSS */}
      <div className="toran-wrap" style={{
        overflow: 'hidden',
        maxHeight: '52px',
        background: 'linear-gradient(to bottom, #FFF9F0, transparent)',
        padding: '4px 0 0',
      }}>
        <MangoToran density="full" style={{ marginTop: '-8px' }} />
      </div>

      {/* Main nav bar */}
      <div
        className="navbar-wedding"
        style={{ borderTop: 'none' }}
      >
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 'var(--navbar-height)',
        }}>
          {/* Logo */}
          <Link to={user ? (isAdmin ? '/admin' : '/dashboard') : '/'} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            textDecoration: 'none',
          }}>
            {/* OM symbol icon box */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              borderRadius: 'var(--radius-md)',
              width: '42px', height: '42px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(74,14,34,0.25)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '22px', color: 'white', lineHeight: 1, fontFamily: 'serif' }}>ॐ</span>
            </div>

            <div style={{ lineHeight: 1.1 }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.3px',
              }}>
                Arundhati
              </div>
              <div style={{
                fontSize: '9.5px',
                color: 'var(--color-gold-deep)',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: '1px',
              }}>
                Brahmin Alliance
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {user && !isAdmin && (
              <>
                <Link to="/dashboard"  className="btn btn-ghost btn-sm">Dashboard</Link>
                <Link to="/matches"    className="btn btn-ghost btn-sm">Find Matches</Link>
                <Link to="/interests"  className="btn btn-ghost btn-sm">Interests</Link>
                <Link to="/profile/me" className="btn btn-ghost btn-sm">My Profile</Link>
              </>
            )}
            {user && isAdmin && (
              <>
                <Link to="/admin"         className="btn btn-ghost btn-sm">Dashboard</Link>
                <Link to="/admin/pending" className="btn btn-ghost btn-sm">Pending</Link>
              </>
            )}
            {user ? (
              <button className="btn btn-outline btn-sm" onClick={handleLogout}
                style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <LogOut size={14} /> Sign Out
              </button>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="hide-desktop btn btn-ghost btn-sm"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            style={{ padding: '8px 10px' }}
          >
            {menuOpen ? <X size={22} color="var(--color-primary)" /> : <Menu size={22} color="var(--color-primary)" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div className="hide-desktop mobile-nav-drawer" style={{
            padding: 'var(--space-3) var(--space-4) var(--space-5)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
            background: 'var(--color-surface)',
            boxShadow: '0 8px 24px rgba(74,14,34,0.12)',
          }}>
            {user && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)', textDecoration: 'none',
                    fontWeight: 500, fontSize: 'var(--text-sm)',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontSize: '18px' }}>🏠</span> Dashboard
                </Link>
                <Link
                  to="/matches"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)', textDecoration: 'none',
                    fontWeight: 500, fontSize: 'var(--text-sm)',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontSize: '18px' }}>🔮</span> Find Matches
                </Link>
                <Link
                  to="/interests"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)', textDecoration: 'none',
                    fontWeight: 500, fontSize: 'var(--text-sm)',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontSize: '18px' }}>💌</span> Interests
                </Link>
                <Link
                  to="/profile/me"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)', textDecoration: 'none',
                    fontWeight: 500, fontSize: 'var(--text-sm)',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontSize: '18px' }}>👤</span> My Profile
                </Link>
              </>
            )}
            {user && isAdmin && (
              <>
                <Link
                  to="/admin"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)', textDecoration: 'none',
                    fontWeight: 500, fontSize: 'var(--text-sm)',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontSize: '18px' }}>📊</span> Dashboard
                </Link>
                <Link
                  to="/admin/pending"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)', textDecoration: 'none',
                    fontWeight: 500, fontSize: 'var(--text-sm)',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontSize: '18px' }}>🛡️</span> Pending Verifications
                </Link>
              </>
            )}

            <div style={{ height: '1px', background: 'var(--color-border)', margin: 'var(--space-2) 0' }} />

            {user ? (
              <button
                className="btn btn-outline"
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 'var(--space-2)', padding: '12px', width: '100%',
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link
                  to="/login"
                  className="btn btn-outline"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: '12px', textAlign: 'center' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: '12px', textAlign: 'center' }}
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
