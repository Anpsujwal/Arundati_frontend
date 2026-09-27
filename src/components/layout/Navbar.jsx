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
          <button className="hide-desktop btn btn-ghost btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="hide-desktop" style={{
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
            background: 'var(--color-surface)',
          }}>
            {user && !isAdmin && (
              <>
                <Link to="/dashboard"  className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/matches"    className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Find Matches</Link>
                <Link to="/interests"  className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Interests</Link>
                <Link to="/profile/me" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>My Profile</Link>
              </>
            )}
            {user && isAdmin && (
              <>
                <Link to="/admin"         className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/admin/pending" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Pending</Link>
              </>
            )}
            {user ? (
              <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost"   onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Register Free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
