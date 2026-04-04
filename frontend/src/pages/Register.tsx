import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, MapPin, ArrowRight, Sprout, Loader2, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getApiError } from '../lib/axios';
import { fadeUp, staggerContainer } from '../lib/animations';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    farmName: '',
    totalAcres: '',
    location: ''
  });
  const [error, setError] = useState<string | null>(null);
  
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        ...formData,
        totalAcres: Number(formData.totalAcres),
        location: { city: formData.location } // Backend expects city or geo object
      };
      await register(payload);
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
        className="w-full max-w-2xl z-10"
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
            <Sprout size={32} className="text-teal-500" />
          </div>
          <h1 className="text-4xl font-display font-black text-text tracking-tight mb-3">Join AgriSense</h1>
          <p className="text-text-muted font-bold uppercase tracking-[0.2em] text-[10px]">Create your professional farm ecosystem</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer opacity-5 pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Essential Auth */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                    placeholder="Rajesh Kumar"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                    placeholder="rajesh@farm.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Create Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Farm Profile */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Farm Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Sprout size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="farmName"
                    required
                    value={formData.farmName}
                    onChange={handleChange}
                    className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                    placeholder="Green Valley Farms"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Total Area (Acres)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="number"
                    name="totalAcres"
                    required
                    value={formData.totalAcres}
                    onChange={handleChange}
                    className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Farm Location</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-text-faint group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-surface-2 border border-border rounded-xl py-4 pl-12 pr-4 text-text font-bold focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-text-faint/50"
                    placeholder="Ahmedabad, Gujarat"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 pt-4 border-t border-border mt-2">
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
                className="w-full py-4 rounded-xl bg-teal-500 text-bg font-black text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-teal-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Initialize Farm Ecosystem
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <motion.p variants={fadeUp} className="text-center mt-8 text-sm font-bold text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-500 hover:underline">Log in to dashboard</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
