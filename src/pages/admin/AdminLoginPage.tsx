import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Key, ArrowLeft, Globe } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Logo } from '../../components/common/Logo';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Super Admin credentials. Please check email and password.');
    }
    setLoading(false);
  };

  const handleAutoFill = () => {
    setEmail('admin@sumitdigitech.com');
    setPassword('SuperAdmin@2025');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#061329] text-white flex items-center justify-center font-sans p-4 relative overflow-hidden">
      
      {/* Ambient Radial Background Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(19,82,208,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,82,208,0.12)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_80%,transparent_100%)] opacity-70" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(19,82,208,0.25),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(217,18,18,0.18),transparent_70%)] pointer-events-none" />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#091736]/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 space-y-7"
      >
        {/* BACK ARROW BUTTON INSIDE CARD TOP LEFT */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
          title="Back to Main Website"
        >
          <ArrowLeft className="w-5 h-5 text-[#F4B400] group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-4 pt-2">
          <div className="flex justify-center">
            <Logo size="lg" variant="dark" />
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-[#F4B400] text-xs font-black">
            <ShieldCheck className="w-4 h-4 text-[#1352D0]" />
            <span className="uppercase tracking-widest">Super Admin Control Portal</span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            Sign in with RBAC credentials to manage dynamic sections, permissions, and lead inquiries.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@sumitdigitech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-[#1352D0] focus:ring-4 focus:ring-[#1352D0]/20 text-sm font-bold text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-[#1352D0] focus:ring-4 focus:ring-[#1352D0]/20 text-sm font-bold text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1352D0] hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Super Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Auto-Fill & Back Links */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-3">
          <button
            onClick={handleAutoFill}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-black text-[#F4B400] rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Auto-Fill Super Admin Credentials</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-4 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#1352D0]" />
            <span>Return to Public Website</span>
          </button>

          <div className="text-[11px] text-slate-500 font-semibold">
            Default: <span className="text-white">admin@sumitdigitech.com</span> • Pass: <span className="text-white">SuperAdmin@2025</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
