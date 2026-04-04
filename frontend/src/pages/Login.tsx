import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sprout, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getApiError } from '../lib/axios';
import { fadeUp, staggerContainer } from '../lib/animations';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
            <Sprout size={32} className="text-teal-500" />
          </div>
          <h1 className="text-4xl font-display font-black text-text tracking-tight mb-3">Welcome Back</h1>
          <p className="text-text-muted font-bold uppercase tracking-[0.2em] text-[10px]">AgriSense Intelligence Portal</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer opacity-5 pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                  placeholder="name@farm.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-teal-500 uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-teal-500 text-bg font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.p variants={fadeUp} className="text-center mt-8 text-sm font-bold text-text-muted">
          New to the platform?{' '}
          <Link to="/register" className="text-teal-500 hover:underline">Create a farm account</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
