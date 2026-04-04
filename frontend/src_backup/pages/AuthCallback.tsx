import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFarmStore } from '../store/farmStore';
import { Loader2, AlertCircle, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * AuthCallback — handles the redirect from Google OAuth.
 * Backend redirects to: /auth/callback?token=<accessToken>
 *
 * This page:
 *  1. Reads ?token from URL
 *  2. Calls /api/auth/me to get user profile
 *  3. Stores auth state → navigates to dashboard
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const { setDemoMode } = useFarmStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setError('No token received from Google. Please try again.');
      return;
    }

    // Store token so checkAuth can use it
    localStorage.setItem('token', token);

    // Fetch the full user profile using the token
    checkAuth()
      .then(() => {
        setDemoMode(false);
        navigate('/app/dashboard', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('token');
        setError('Authentication failed. Please try again.');
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-10 max-w-md w-full text-center border border-white/10 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-text mb-3">Auth Failed</h2>
          <p className="text-text-muted font-bold text-sm mb-8">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-teal-500 text-bg font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-teal-400 transition-all"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-[28px] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-2xl shadow-teal-500/20">
            <Sprout size={36} className="text-teal-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <Loader2 size={16} className="text-bg animate-spin" />
          </div>
        </div>
        <div>
          <p className="text-text font-black text-xl">Signing you in with Google</p>
          <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-2">
            Setting up your farm dashboard...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
