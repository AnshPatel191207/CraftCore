import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { type ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: '100vh',
      backgroundColor: 'var(--bg)', color: 'var(--text)'
    }}>
      <div className="animate-pulse font-display font-black uppercase tracking-widest">
        Syncing with Hub...
      </div>
    </div>
  );

  return user ? <>{children}</> : <Navigate to="/?login=true" replace />;
};
