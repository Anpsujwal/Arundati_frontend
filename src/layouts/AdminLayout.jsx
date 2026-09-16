import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, LayoutDashboard, Users, Shield, LogOut } from 'lucide-react';

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
        background: 'var(--color-primary)',
        color: 'white',
        padding: '0 var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 'var(--navbar-height)',
        position: 'sticky', top:0, zIndex:100,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
          <Heart size={20} fill="white" color="white" />
          <div>
            <div style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-lg)', fontWeight:700 }}>Arundhati Admin</div>
            <div style={{ fontSize:'10px', opacity:0.75, letterSpacing:'0.5px' }}>ADMIN PORTAL</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ color:'white' }} onClick={handleLogout}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div style={{ display:'flex', flex:1 }}>
        {/* Sidebar */}
        <aside style={{
          width: 'var(--sidebar-width)',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          padding: 'var(--space-6) var(--space-4)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
          position: 'sticky', top: 'var(--navbar-height)',
          height: 'calc(100vh - var(--navbar-height))',
          overflowY: 'auto',
        }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: pathname === to || (to !== '/admin' && pathname.startsWith(to))
                ? 'var(--color-primary)'
                : 'var(--color-text-muted)',
              background: pathname === to || (to !== '/admin' && pathname.startsWith(to))
                ? 'var(--color-primary-faint)'
                : 'transparent',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
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
