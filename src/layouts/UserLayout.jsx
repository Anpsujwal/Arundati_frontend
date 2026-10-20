import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import FloralDecoration from '../components/wedding-theme/FloralDecoration.jsx';

export default function UserLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'clamp(var(--space-4), 3vw, var(--space-8)) 0' }}>
        <div className="container page-enter">
          <Outlet />
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-5) 0',
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
        background: 'linear-gradient(to bottom, var(--color-bg), var(--color-surface))',
        position: 'relative',
      }}>
        {/* Subtle gold top line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(196,147,42,0.35), transparent)',
        }} />

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1rem', fontFamily: 'serif', color: 'var(--color-primary)', opacity: 0.6 }}>ॐ</span>
          <span>
            &copy; {new Date().getFullYear()} Arundhati — Brahmin Alliance Matrimony &middot; All rights reserved
          </span>
          <span style={{ fontSize: '1rem', fontFamily: 'serif', color: 'var(--color-primary)', opacity: 0.6 }}>ॐ</span>
        </div>
      </footer>
    </div>
  );
}
