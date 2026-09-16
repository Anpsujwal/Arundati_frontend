import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 'var(--navbar-height)',
      }}>
        {/* Logo */}
        <Link to={user ? (isAdmin ? '/admin' : '/dashboard') : '/'} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          textDecoration: 'none',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            display: 'flex', alignItems: 'center',
          }}>
            <Heart size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              lineHeight: 1.1,
            }}>Arundhati</div>
            <div style={{ fontSize: '10px', color: 'var(--color-gold)', fontWeight: 500, letterSpacing: '0.5px' }}>
              BRAHMIN ALLIANCE
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {user && !isAdmin && (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
              <Link to="/matches" className="btn btn-ghost btn-sm">Find Matches</Link>
              <Link to="/interests" className="btn btn-ghost btn-sm">Interests</Link>
              <Link to="/profile/me" className="btn btn-ghost btn-sm">My Profile</Link>
            </>
          )}
          {user && isAdmin && (
            <>
              <Link to="/admin" className="btn btn-ghost btn-sm">Dashboard</Link>
              <Link to="/admin/pending" className="btn btn-ghost btn-sm">Pending</Link>
            </>
          )}
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ display:'flex', gap:'var(--space-1)' }}>
              <LogOut size={14} /> Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
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
          padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
        }}>
          {user && !isAdmin && (
            <>
              <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
              <Link to="/matches" className="btn btn-ghost">Find Matches</Link>
              <Link to="/interests" className="btn btn-ghost">Interests</Link>
              <Link to="/profile/me" className="btn btn-ghost">My Profile</Link>
            </>
          )}
          {user ? (
            <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
