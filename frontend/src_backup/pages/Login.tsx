import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, Lock, LogIn, Github, Chrome, AlertCircle, Sprout, Loader2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFarmStore } from '../store/farmStore';
import { useAuthStore } from '../store/authStore';
import { getApiError } from '../lib/axios';
import { fadeUp, staggerContainer } from '../lib/animations';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});


// ─── Login Page ───────────────────────────────────────────────────────────────

export default function Login() {
  const { setDemoMode } = useFarmStore();
  const { login, isLoading }  = useAuthStore();
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await login(email, password);
      setDemoMode(false);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg">

      {/* ── 1. CINEMATIC BACKGROUND IMAGE (LEFT-TO-RIGHT REVEAL) ── */}
      <motion.img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop"
        alt="Cinematic Farm"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── 2. GRADIENT OVERLAY ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent z-10 pointer-events-none"
      />

      {/* ── 3. BLUR LAYER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute inset-0 backdrop-blur-[2px] z-20 pointer-events-none"
        style={{ background: 'rgba(var(--bg-rgb, 10 20 14) / 0.15)' }}
      />

      {/* ── 4. CONTENT WRAPPER ── */}
      <div className="relative z-30 flex flex-col md:flex-row w-full h-full">

        {/* ── LEFT: Welcome text ── */}
        <div className="hidden md:flex w-1/2 flex-col justify-end p-20 pb-32">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="space-y-4 max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--teal-500)' }}>
              Premium Agri-Intel
            </div>
            <h1 className="text-7xl font-display font-black text-text leading-[0.9] tracking-tighter">
              Welcome to <br />
              <span style={{ color: 'var(--teal-500)' }} className="underline decoration-teal-500/30">KrishiSetu</span>
            </h1>
            <p className="text-text-muted font-medium text-lg pt-4 leading-relaxed">
              Smart Farming Starts Here. Join our community of farmers using AI to protect their crops and optimize their soil.
            </p>
          </motion.div>
        </div>

        {/* ── RIGHT: Login Form ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >

            {/* Back to Home */}
            <motion.button
              variants={fadeUp}
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-8 text-xs font-black uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </motion.button>

            {/* Logo mark */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center"
                style={{ boxShadow: '0 0 24px rgba(var(--teal-rgb, 20 184 166) / 0.15)' }}>
                <Sprout size={24} style={{ color: 'var(--teal-500)' }} />
              </div>
              <div>
                <p className="font-display font-black text-text leading-none">KrishiSetu</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mt-0.5">AgriSense Portal</p>
              </div>
            </motion.div>

            {/* Card */}
            <motion.div
              variants={fadeUp}
              className="glass rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl shadow-black/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer opacity-5 pointer-events-none" />

              <div className="space-y-8 relative z-10">
                <div>
                  <h2 className="text-3xl font-display font-black text-text tracking-tight">Sign In</h2>
                  <p className="text-text-muted font-bold mt-2 text-[10px] uppercase tracking-widest">Access your farming dashboard</p>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y:  0 }}
                      exit={{  opacity: 0, y: -10 }}
                      className="p-4 rounded-xl border flex items-center gap-3 text-sm font-bold"
                      style={{ background: 'rgba(var(--error-rgb, 239 68 68) / 0.10)', borderColor: 'rgba(var(--error-rgb, 239 68 68) / 0.20)', color: 'var(--error, #ef4444)' }}
                    >
                      <AlertCircle size={18} className="flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-faint group-focus-within:text-teal-500 transition-colors">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@farm.com"
                          className="w-full pl-12 pr-4 py-4 bg-surface-2 border border-border rounded-xl text-text font-bold placeholder-text-faint/50 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                          Password
                        </label>
                        <button
                          type="button"
                          className="text-[10px] font-black uppercase tracking-widest hover:underline transition-all"
                          style={{ color: 'var(--teal-500)' }}
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-faint group-focus-within:text-teal-500 transition-colors">
                          <Lock size={18} />
                        </div>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-4 bg-surface-2 border border-border rounded-xl text-text font-bold placeholder-text-faint/50 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border bg-surface-2 accent-teal-500 focus:ring-teal-500 focus:ring-offset-bg"
                      />
                      <span className="text-[10px] font-black text-text-muted group-hover:text-text transition-colors uppercase tracking-widest">
                        Keep me active
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 mt-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:  'var(--teal-500)',
                      color:       'var(--bg)',
                      boxShadow:   '0 8px 32px rgba(var(--teal-rgb, 20 184 166) / 0.25)',
                    }}
                    onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <LogIn size={20} />
                        Launch Dashboard
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                       setDemoMode(true);
                       navigate('/app/dashboard');
                    }}
                    className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                  >
                    <Sparkles size={18} className="text-amber-500" />
                    Try Demo Mode
                  </button>
                </form>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                    <span className="px-4 bg-transparent text-text-muted">Third-party access</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-surface-2 border border-border rounded-xl hover:border-teal-500/30 hover:bg-teal-500/5 transition-all text-text font-bold text-[10px] uppercase tracking-widest"
                  >
                    <Chrome size={18} style={{ color: 'var(--teal-500)' }} />
                    Google
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 py-3 bg-surface-2 border border-border rounded-xl opacity-40 cursor-not-allowed text-text font-bold text-[10px] uppercase tracking-widest"
                  >
                    <Github size={18} className="text-text-muted" />
                    GitHub
                  </button>
                </div>

                {/* Sign up link */}
                <p className="text-center text-xs font-bold text-text-muted">
                  New to KrishiSetu?{' '}
                  <Link
                    to="/register"
                    className="hover:underline transition-all"
                    style={{ color: 'var(--teal-500)' }}
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}