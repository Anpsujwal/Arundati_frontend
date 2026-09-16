import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function UserLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: 'var(--space-8) 0' }}>
        <div className="container page-enter">
          <Outlet />
        </div>
      </main>
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-4) 0',
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
      }}>
        © {new Date().getFullYear()} Arundhati — Brahmin Alliance Matrimony · All rights reserved
      </footer>
    </div>
  );
}
