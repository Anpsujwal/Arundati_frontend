import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Shield, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => { await logout(); navigate('/'); };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/pending', label: 'Pending Verification', icon: Shield },
    { to: '/admin/users', label: 'All Users', icon: Users },
  ];

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {/* Admin top bar */}
      <div style={{
        background: 'linear-gradient(135deg, #3D0A1A, var(--color-primary-dark), var(--color-primary))',
        color: 'white',
        padding: '0 var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 'var(--navbar-height)',
        position: 'sticky', top:0, zIndex:100,
        boxShadow: '0 2px 12px rgba(74,14,34,0.30)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
          <span style={{ fontSize:'1.6rem', fontFamily:'serif' }}>ॐ</span>
          <div>
            <div style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-lg)', fontWeight:700 }}>Arundhati Admin</div>
            <div style={{ fontSize:'10px', opacity:0.75, letterSpacing:'2px', textTransform:'uppercase' }}>Admin Portal</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ color:'rgba(255,255,255,0.80)' }} onClick={handleLogout}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div style={{ display:'flex', flex:1 }}>
        {/* Sidebar */}
        <aside style={{
          width: 'var(--sidebar-width)',
          background: 'linear-gradient(to bottom, var(--color-surface), var(--color-surface-2))',
          borderRight: '1px solid var(--color-border)',
          padding: 'var(--space-6) var(--space-4)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
          position: 'sticky', top: 'var(--navbar-height)',
          height: 'calc(100vh - var(--navbar-height))',
          overflowY: 'auto',
        }}>
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to || (to !== '/admin' && pathname.startsWith(to));
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))'
                  : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </aside>

        {/* Main content */}
        <main style={{ flex:1, padding: 'var(--space-8)', overflowX:'auto' }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
