import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, UserPlus, Github, Chrome, AlertCircle } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { useLanguage } from '../components/ui/LanguageSwitcher';

export default function Signup() {
  const { setActivePage } = useFarmStore();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newUser = {
      name,
      email,
      password
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('isLoggedIn', 'true');
    setActivePage('soil');
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
      <div className="relative z-30 flex flex-col md:flex-row w-full h-full overflow-y-auto">
        
        {/* Left Side: Welcome Text */}
        <div className="hidden md:flex w-1/2 flex-col justify-end p-20 pb-32">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="space-y-4 max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Join the Future
            </div>
            <h1 className="text-7xl font-display font-black text-white leading-[0.9] tracking-tighter">
              Create <br /> <span className="text-teal-500 underline decoration-teal-500/30">Account</span>
            </h1>
            <p className="text-white/70 font-medium text-lg pt-4 leading-relaxed">
              Start your journey to smarter farming today. Build a sustainable future for your land with KrishiSetu.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Signup Form (SLIDE-IN ANIMATION) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md my-auto pt-20 pb-10"
          >
            {/* Back to Home */}
            <button 
              onClick={() => setActivePage('landing')}
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-xs font-black uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>

            {/* Signup Card */}
            <div className="bg-green-900/40 backdrop-blur-xl border border-green-700/30 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-black text-white tracking-tight">Register</h2>
                  <p className="text-white/40 font-bold mt-2 text-sm uppercase tracking-widest">Join the smart farming network</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-teal-500 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('fullName') || 'Full Name'}
                        className="w-full pl-12 pr-4 py-3.5 bg-green-950/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all font-bold focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-teal-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('emailAddress') || 'Email Address'}
                        className="w-full pl-12 pr-4 py-3.5 bg-green-950/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all font-bold focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-teal-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('password') || 'Password'}
                        className="w-full pl-12 pr-4 py-3.5 bg-green-950/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all font-bold focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-teal-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('confirmPassword') || 'Confirm Password'}
                        className="w-full pl-12 pr-4 py-3.5 bg-green-950/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all font-bold focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-bg font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                  >
                    <UserPlus size={20} />
                    {t('createAccountBtn') || 'CREATE YOUR FARM ACCOUNT'}
                  </button>
                </form>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                    <span className="px-4 bg-transparent text-white/20">Third-party register</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-bold text-[10px] uppercase tracking-widest">
                    <Chrome size={18} className="text-teal-500" />
                    GOOGLE
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-bold text-[10px] uppercase tracking-widest">
                    <Github size={18} />
                    GITHUB
                  </button>
                </div>

                <p className="text-center text-xs font-bold text-white/40">
                  Already have an account? {' '}
                  <button 
                    onClick={() => setActivePage('login')}
                    className="text-teal-500 hover:underline transition-all"
                  >
                    Login
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
