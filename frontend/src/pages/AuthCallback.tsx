import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { initSocket } from '../lib/socket';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      authService.getMe()
        .then(res => {
          setUser(res.data.data.user);
          initSocket(token);
          // Standard state behavior: land on dashboard
          navigate('/?page=dashboard');
        })
        .catch(() => navigate('/?error=oauth_failed'));
    } else {
      navigate('/?error=oauth_failed');
    }
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100vh', gap: '1rem',
      backgroundColor: 'var(--bg)', color: 'var(--text)'
    }}>
      <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <p className="font-display font-black uppercase tracking-[0.2em]">Authenticating...</p>
    </div>
  );
}
