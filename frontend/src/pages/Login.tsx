import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, LogIn, Github, Chrome, AlertCircle } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import api from '../lib/api';

export default function Login() {
  const { setActivePage } = useFarmStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response: any = await api.post('/auth/login', { email, password });
      
      if (response && response.data) {
        const user = response.data.user;
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Update store
        useFarmStore.getState().setFarmerName(user.name);
        useFarmStore.getState().setFarmData({
          farmerName: user.name,
          avatar: user.avatar || '',
          farmName: user.farmName,
          totalAcres: user.totalAcres
        });

        // Sync for Topbar
        localStorage.setItem('krishi_user_profile', JSON.stringify({
          name: user.name,
          email: user.email,
          avatar: user.avatar || ''
        }));
        window.dispatchEvent(new Event('profileUpdate'));

        setActivePage('dashboard');
      } else {
        throw new Error('Connection failed. Please check your network.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg">
      {/* ── 1. CINEMATIC BACKGROUND IMAGE (LEFT-TO-RIGHT REVEAL) ── */}
      <motion.img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop"
        alt="Cinematic Farm"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── 2. DYNAMIC OVERLAY (FADE OVERLAY) ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-green-950 via-green-950/40 to-transparent z-10 pointer-events-none"
      />

      {/* ── 3. DARK LAYER + BLUR (APPLIED AFTER LOAD) ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute inset-0 bg-green-950/20 backdrop-blur-[2px] z-20 pointer-events-none"
      />

      {/* ── 4. CONTENT WRAPPER ── */}
      <div className="relative z-30 flex flex-col md:flex-row w-full h-full">
        
        {/* Left Side: Welcome Text */}
        <div className="hidden md:flex w-1/2 flex-col justify-end p-20 pb-32">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="space-y-4 max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Premium Agri-Intel
            </div>
            <h1 className="text-7xl font-display font-black text-white leading-[0.9] tracking-tighter">
              Welcome to <br /> <span className="text-green-500 underline decoration-green-500/30">KrishiSetu</span>
            </h1>
            <p className="text-white/70 font-medium text-lg pt-4 leading-relaxed">
              Smart Farming Starts Here. Join our community of farmers using AI to protect their crops and optimize their soil.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Login Form (SLIDE-IN ANIMATION) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Back to Home */}
            <button 
              onClick={() => setActivePage('landing')}
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-xs font-black uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>

            {/* Login Card */}
            <div className="bg-green-900/40 backdrop-blur-xl border border-green-700/30 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-black text-white tracking-tight">Sign In</h2>
                  <p className="text-white/40 font-bold mt-2 text-sm uppercase tracking-widest">Access your farming dashboard</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-green-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-4 bg-green-950/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all font-bold focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-green-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-12 pr-4 py-4 bg-green-950/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all font-bold focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-green-500 focus:ring-green-500 focus:ring-offset-bg" />
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">Keep me active</span>
                    </label>
                    <button type="button" className="text-[10px] font-black text-green-500 hover:text-green-400 transition-colors uppercase tracking-widest">
                      Lost Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-bg font-black rounded-2xl transition-all shadow-xl shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                  >
                    <LogIn size={20} />
                    {isLoading ? 'SIGNING IN...' : 'LAUNCH DASHBOARD'}
                  </button>
                </form>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                    <span className="px-4 bg-transparent text-white/20">Third-party access</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
                    className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-bold text-[10px] uppercase tracking-widest"
                  >
                    <Chrome size={18} className="text-green-500" />
                    GOOGLE
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-bold text-[10px] uppercase tracking-widest">
                    <Github size={18} />
                    GITHUB
                  </button>
                </div>

                <p className="text-center text-xs font-bold text-white/40">
                  New to KrishiSetu? {' '}
                  <button 
                    onClick={() => setActivePage('signup')}
                    className="text-green-500 hover:underline transition-all"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
