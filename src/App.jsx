import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router/AppRouter';
import './styles/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              border: '1px solid #E8E0D4',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(26,18,8,0.08)',
            },
            success: {
              iconTheme: { primary: '#2E7D32', secondary: 'white' },
            },
            error: {
              iconTheme: { primary: '#C62828', secondary: 'white' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
