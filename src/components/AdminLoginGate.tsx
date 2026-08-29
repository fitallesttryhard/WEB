import React, { useState } from 'react';
import { HardHat, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLoginGate() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập Email/Tên đăng nhập và Mật khẩu.');
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Tài khoản hoặc mật khẩu quản trị viên không chính xác.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100">
      
      {/* Background Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back to Website Link */}
      <a
        href="#"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Về trang chủ S-BUILD</span>
      </a>

      {/* Main Admin Card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center rounded-2xl shadow-xl shadow-red-600/25 mb-4">
            <HardHat size={28} className="stroke-[2.2]" />
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span>FITALLEST ADMIN</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </h1>

          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            Hệ Thống Quản Trị Trung Tâm
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/80 text-red-300 rounded-2xl text-xs font-bold flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Tài Khoản Quản Trị (Email / ID)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fitallest.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Mật Khẩu Đăng Nhập
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-[0.18em] rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck size={18} />
            <span>XÁC NHẬN ĐĂNG NHẬP ADMIN</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <ShieldCheck size={14} />
            <span>Xác thực Quản trị viên:</span>
          </div>
          Email: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">admin@fitallest.com</code><br/>
          Mật khẩu: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">admin123</code>
        </div>

      </div>

      <div className="mt-8 text-center text-xs text-slate-500 font-semibold">
        S-BUILD Multi-Tenant B2B Platform &copy; 2026
      </div>

    </div>
  );
}
