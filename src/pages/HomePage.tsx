import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Code, Globe, Smartphone, Server, ShieldCheck,
  ArrowRight, CheckCircle2, Zap, Users, Send, Check,
  Search, Bot, BookOpen, TrendingUp, Play, ChevronRight,
  Star
} from 'lucide-react';
import { projectsData } from '../data/projectsData';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
}

// Gradient style helper
const gt = (from: string, to: string) => ({
  background: `linear-gradient(135deg, ${from}, ${to})`,
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
});

// Services data
const svcs = [
  {
    icon: <Code className="w-6 h-6" />,
    label: 'Thiết Kế Website',
    desc: 'Website doanh nghiệp, bán hàng, landing page độc bản với giao diện sang trọng, tốc độ siêu nhanh và chuẩn SEO.',
    color: '#06b6d4',
    tab: 'services',
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    label: 'Ứng Dụng Mobile',
    desc: 'App iOS & Android đa nền tảng mượt mà, tích hợp thông báo push, thanh toán VNPAY/Momo và quản trị tập trung.',
    color: '#a78bfa',
    tab: 'services',
  },
  {
    icon: <Search className="w-6 h-6" />,
    label: 'SEO Google Top 1',
    desc: 'Đưa hàng trăm từ khóa kinh doanh lên Top 1 Google ổn định, kéo hàng nghìn truy cập tự nhiên mỗi tháng.',
    color: '#34d399',
    tab: 'seo',
  },
  {
    icon: <Server className="w-6 h-6" />,
    label: 'Cloud Hosting NVMe',
    desc: 'Hạ tầng máy chủ đám mây ổ cứng NVMe tốc độ gấp 10 lần SSD thông thường, backup hàng ngày và SSL miễn phí.',
    color: '#60a5fa',
    tab: 'hosting',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    label: 'Tên Miền (.VN, .COM)',
    desc: 'Tra cứu và đăng ký tên miền đẹp bảo vệ thương hiệu doanh nghiệp với thủ tục nhanh gọn, quản trị DNS tự động.',
    color: '#fbbf24',
    tab: 'domain',
  },
  {
    icon: <Bot className="w-6 h-6" />,
    label: 'Thiết Kế AI Sáng Tạo',
    desc: 'Ứng dụng AI phân tích hành vi người dùng, tự động cá nhân hóa trải nghiệm và tối ưu điểm giữ chân khách hàng.',
    color: '#f472b6',
    tab: 'services',
  },
];

// Workflow steps
const wfSteps = [
  { num: '01', title: 'Khảo Sát & Tư Vấn', desc: 'Phân tích mục tiêu doanh nghiệp, hành vi khách hàng và định hướng chiến lược số phù hợp.' },
  { num: '02', title: 'Thiết Kế UI/UX', desc: 'Phác thảo Wireframe và thiết kế giao diện độc bản, trải nghiệm người dùng tối ưu.' },
  { num: '03', title: 'Lập Trình & Tích Hợp', desc: 'Phát triển frontend & backend bảo mật cao, tích hợp API thanh toán, CRM, ERP.' },
  { num: '04', title: 'Kiểm Thử QA Toàn Diện', desc: 'Đo tốc độ PageSpeed, kiểm tra đa thiết bị, bảo mật penetration test.' },
  { num: '05', title: 'Bàn Giao & Hỗ Trợ', desc: 'Đào tạo quản trị hệ thống và hỗ trợ kỹ thuật trọn đời không giới hạn.' },
];

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab }) => {
  const [formData, setFormData] = useState({ fullname: '', phone: '', email: '', services: [] as string[], note: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hoveredSvc, setHoveredSvc] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const statsRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic projects from Admin
  const [dynamicProjects, setDynamicProjects] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('fitallest_admin_projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return projectsData;
  });

  // Dynamic posts from Admin
  const [dynamicPosts, setDynamicPosts] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('fitallest_admin_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      { id: '1', title: 'Xu Hướng Thiết Kế Website 2026: Trí Tuệ Nhân Tạo & Trải Nghiệm Cá Nhân Hóa', cat: 'Công nghệ', date: '2026', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
      { id: '2', title: 'Bí Quyết Tối Ưu SEO Local Giúp Doanh Nghiệp Thống Trị Top 1 Google', cat: 'SEO & Growth', date: '2026', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop' },
      { id: '3', title: 'So Sánh Chi Tiết: Cloud Hosting NVMe vs Hosting Truyền Thống', cat: 'Hạ tầng Cloud', date: '2026', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop' },
    ];
  });

  // Listen for admin changes in real time
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedProj = localStorage.getItem('fitallest_admin_projects');
        if (storedProj) {
          const parsed = JSON.parse(storedProj);
          if (Array.isArray(parsed) && parsed.length > 0) setDynamicProjects(parsed);
        }
      } catch (e) {}

      try {
        const storedPosts = localStorage.getItem('fitallest_admin_posts');
        if (storedPosts) {
          const parsed = JSON.parse(storedPosts);
          if (Array.isArray(parsed) && parsed.length > 0) setDynamicPosts(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('fitallest_projects_updated', handleSync);
    window.addEventListener('fitallest_posts_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('fitallest_projects_updated', handleSync);
      window.removeEventListener('fitallest_posts_updated', handleSync);
    };
  }, []);

  // Photon Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 550);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 50;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      alpha: number;
      orbitRadius: number;
      angle: number;
      speed: number;
    }> = [];

    const colors = ['#06b6d4', '#38bdf8', '#818cf8', '#a855f7', '#34d399'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const orbitRadius = 40 + Math.random() * 180;
      particles.push({
        x: width / 2 + Math.cos(angle) * orbitRadius,
        y: height / 2 + Math.sin(angle) * orbitRadius,
        size: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        orbitRadius,
        angle,
        speed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    let mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      // Soft Volumetric Radial Glow drawn on canvas
      const glow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 150);
      glow.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
      glow.addColorStop(0.4, 'rgba(56, 189, 248, 0.1)');
      glow.addColorStop(0.7, 'rgba(124, 58, 237, 0.04)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 80) * 0.22;
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.angle += p.speed;
        const targetX = centerX + Math.cos(p.angle) * p.orbitRadius;
        const targetY = centerY + Math.sin(p.angle) * p.orbitRadius * 0.7;
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 120) {
            p.x += mdx * 0.02;
            p.y += mdy * 0.02;
          } else {
            p.x += (targetX - p.x) * 0.05;
            p.y += (targetY - p.y) * 0.05;
          }
        } else {
          p.x += (targetX - p.x) * 0.05;
          p.y += (targetY - p.y) * 0.05;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const fp = dynamicProjects.slice(0, 3);
  const recentArticles = dynamicPosts.slice(0, 3);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    let start = 0;
    const timer = setInterval(() => {
      start += 3;
      setC1(Math.min(start, 150));
      setC2(Math.min(Math.round(start * 0.66), 99));
      if (start >= 150) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [statsVisible]);

  // Auto-play workflow steps every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % wfSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [resetTimer]);

  // Service toggle
  const toggleSvc = (svc: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(svc)
        ? prev.services.filter(s => s !== svc)
        : [...prev.services, svc],
    }));
  };

  // Form submit - sync to admin leads
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newLead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: formData.fullname,
      fullname: formData.fullname,
      customer: formData.fullname,
      phone: formData.phone,
      email: formData.email || '',
      services: formData.services,
      service: formData.services.join(', ') || 'Chưa chọn',
      note: formData.note || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      source: 'Trang chủ (Hero / Contact Form)'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('admin_leads') || localStorage.getItem('leads') || '[]');
      const updated = [newLead, ...existing];
      localStorage.setItem('admin_leads', JSON.stringify(updated));
      localStorage.setItem('leads', JSON.stringify(updated));
      window.dispatchEvent(new Event('admin_leads_updated'));
    } catch (e) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ fullname: '', phone: '', email: '', services: [], note: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="overflow-x-hidden relative text-[#e2e8f0]">

      {/* ─── HERO: DEEP TECH COSMIC ORB ─── */}
      <section className="relative min-h-[92vh] flex items-center pt-8 pb-20 overflow-hidden z-10">
        <div className="laser-beam-h top-[15%] left-0" />
        <div className="laser-beam-purple top-[45%] right-0" />
        <div className="laser-beam-h bottom-[20%] left-[20%]" />

        <div className="absolute top-[-15%] left-[-10%] w-[750px] h-[750px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #06b6d4, #0891b2 40%, transparent 70%)', filter: 'blur(100px)', animation: 'auroraFloat 14s ease-in-out infinite' }} />
        <div className="absolute top-[30%] right-[-10%] w-[650px] h-[650px] rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #8b5cf6, #6366f1 40%, transparent 70%)', filter: 'blur(100px)', animation: 'auroraFloat 18s ease-in-out infinite 3s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[11px] font-mono font-black text-cyan-300 tracking-widest uppercase">[ SYS // 2026 ARCHITECTURE ]</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] font-bold text-slate-300">REALTIME AI CORE</span>
              </div>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black leading-[1.04] tracking-tight text-white text-balance">
                BIẾN DỮ LIỆU & Ý&nbsp;TƯỞNG THÀNH<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                  LỢI THẾ CẠNH&nbsp;TRANH
                </span><br />
                ĐỘT&nbsp;PHÁ
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-[54ch] font-normal">
                Fi.tallest xây dựng hạ tầng số cao cấp — thiết kế website độc bản, ứng dụng di động chuẩn UX/UI và chiến lược SEO Top 1 Google giúp doanh nghiệp bứt phá doanh số.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button onClick={() => setCurrentTab('quote')}
                  className="group relative px-8 py-4 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4,#38bdf8)' }}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Khởi Tạo Dự Án Ngay
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </button>
                <button onClick={() => setCurrentTab('projects')}
                  className="group px-8 py-4 rounded-2xl font-bold text-sm text-slate-200 border border-white/10 hover:border-cyan-500/50 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                  <Play className="w-4 h-4 text-cyan-400" />
                  Khám Phá 50+ Case Studies
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.08] max-w-lg">
                <div className="space-y-0.5"><div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Tốc độ tải trang</div><div className="text-base font-black text-cyan-400 font-mono">&lt; 1.2s avg</div></div>
                <div className="space-y-0.5 border-l border-white/10 pl-3"><div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Cam kết Uptime</div><div className="text-base font-black text-emerald-400 font-mono">99.9% SLA</div></div>
                <div className="space-y-0.5 border-l border-white/10 pl-3"><div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Hỗ trợ kỹ thuật</div><div className="text-base font-black text-purple-400 font-mono">24/7 Live</div></div>
              </div>
            </div>

            {/* RIGHT: TRANSLUCENT CRYSTAL GLASS COSMIC SPHERE */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-10 cursor-crosshair" />
              
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center z-20 pointer-events-none select-none">
                {/* Soft Volumetric Background Aurora Flare */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500/15 via-sky-400/20 to-purple-600/15 blur-2xl animate-pulse" />

                {/* 3D Concentric Gyro Orbital Rings */}
                <div className="cosmic-ring-1 absolute w-[92%] h-[92%] rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]" />
                <div className="cosmic-ring-2 absolute w-[78%] h-[78%] rounded-full border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]" />
                <div className="absolute w-[105%] h-[105%] rounded-full border border-dashed border-cyan-500/15 animate-spin-slow" />

                {/* Translucent Crystal Glass Sphere with Radial Fade */}
                <div 
                  className="cosmic-core relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center p-6 text-center overflow-hidden"
                  style={{ 
                    background: 'radial-gradient(circle at 35% 30%, rgba(56,189,248,0.35) 0%, rgba(6,182,212,0.18) 35%, rgba(124,58,237,0.06) 65%, transparent 95%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 0 50px rgba(6,182,212,0.25), inset 0 0 35px rgba(56,189,248,0.2), inset 0 2px 8px rgba(255,255,255,0.45)'
                  }}
                >
                  {/* Top-left Specular Crescent Glint */}
                  <div 
                    className="crystal-glint absolute -top-4 -left-4 w-32 h-20 rounded-full pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 40%, transparent 80%)',
                      filter: 'blur(3px)'
                    }}
                  />

                  {/* Floating Holographic Core Emblem */}
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md mb-1">
                      <Sparkles className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    </div>
                    <div className="text-[11px] font-black text-white tracking-widest font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                      FI.TALLEST
                    </div>
                    <div className="text-[9px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      AI CORE 2026
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 right-0 sm:right-4 z-30 p-3.5 rounded-2xl bg-[#080E1E]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-float flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"><TrendingUp className="w-4 h-4" /></div>
                <div><div className="text-[10px] font-mono text-slate-400 uppercase">Tăng Trưởng Traffic</div><div className="text-sm font-black text-white font-mono flex items-center gap-1"><span className="text-cyan-400">+340%</span> ROI</div></div>
              </div>
              <div className="absolute -bottom-4 left-0 sm:left-2 z-30 p-3.5 rounded-2xl bg-[#080E1E]/90 backdrop-blur-xl border border-purple-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-float-slow flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40"><Zap className="w-4 h-4" /></div>
                <div><div className="text-[10px] font-mono text-slate-400 uppercase">Tối Ưu Tốc Độ</div><div className="text-sm font-black text-white font-mono flex items-center gap-1"><span className="text-purple-400">100/100</span> PageSpeed</div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050A14] to-transparent pointer-events-none" />
      </section>

      {/* ─── MARQUEE ─── */}
      <section className="py-5 border-y border-white/[0.06] overflow-hidden">
        <div className="relative flex overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg,#050A14,transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(-90deg,#050A14,transparent)' }} />
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
            {['🚀 React 19 & Next.js 15','⚡ TypeScript Strict','🛡️ Supabase Realtime','🤖 AI Powered UI','☁️ NVMe Cloud Hosting','🔍 SEO Top 1 Google','🔒 SSL 256-bit Security','📱 iOS & Android App','💯 PageSpeed 95+',
              '🚀 React 19 & Next.js 15','⚡ TypeScript Strict','🛡️ Supabase Realtime','🤖 AI Powered UI','☁️ NVMe Cloud Hosting','🔍 SEO Top 1 Google','🔒 SSL 256-bit Security','📱 iOS & Android App','💯 PageSpeed 95+']
              .map((item, i) => (
                <span key={i} className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-400">{item}</span>
              ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section ref={statsRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: statsVisible ? `${c1}+` : '0+', label: 'Dự Án Hoàn Thành', desc: 'Từ startup đến doanh nghiệp lớn', color: '#06b6d4' },
              { val: statsVisible ? `${c2}%` : '0%', label: 'Khách Hàng Hài Lòng', desc: 'Tỷ lệ quay lại & giới thiệu', color: '#a78bfa' },
              { val: '24/7', label: 'Hỗ Trợ Kỹ Thuật', desc: 'Phản hồi trong 30 phút', color: '#34d399' },
              { val: '< 1.5s', label: 'Tốc Độ Tải Trang', desc: 'Trung bình toàn dự án', color: '#fbbf24' }
            ].map((s, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-400 hover:-translate-y-1">
                <div className="text-4xl font-black mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="font-bold text-white text-sm mb-1">{s.label}</div>
                <div className="text-xs text-slate-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-24 relative overflow-hidden">
        {/* Ambient Halo & Laser */}
        <div className="laser-beam-purple top-[10%] right-0" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center,#06b6d4,transparent 70%)', filter: 'blur(90px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300">Giải Pháp Công Nghệ Toàn Diện</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              <span className="text-white">Dịch Vụ </span>
              <span style={gt('#06b6d4','#38bdf8')}>Cốt Lõi</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">Trọn bộ giải pháp số từ thiết kế, phát triển đến quảng bá — đồng hành cùng sự phát triển của doanh nghiệp bạn.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {svcs.map((svc, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredSvc(i)}
                onMouseLeave={() => setHoveredSvc(null)}
                onClick={() => setCurrentTab(svc.tab)}
                className="group relative p-7 rounded-2xl border border-white/[0.08] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40"
                style={{ 
                  background: hoveredSvc === i ? 'linear-gradient(145deg,rgba(15,23,42,0.9),rgba(6,182,212,0.08))' : 'rgba(15,23,42,0.6)', 
                  backdropFilter: 'blur(16px)',
                  boxShadow: hoveredSvc === i ? `0 20px 60px ${svc.color}25, 0 0 25px ${svc.color}15` : '0 10px 30px rgba(0,0,0,0.3)' 
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 shadow-lg"
                  style={{ background: `${svc.color}20`, color: svc.color, border: `1px solid ${svc.color}40` }}>
                  {svc.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-300 transition-colors">{svc.label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{svc.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: svc.color }}>
                  <span>Khám phá</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                {hoveredSvc === i && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 100% 0%,${svc.color}25,transparent 65%)` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="laser-beam-h top-[5%] left-[25%]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[550px] h-[550px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center,#8b5cf6,transparent 70%)', filter: 'blur(90px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-purple-300">Portfolio & Case Studies</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                Dự Án <span style={gt('#06b6d4','#38bdf8')}>Tiêu Biểu</span>
              </h2>
              <p className="text-slate-400 mt-3 text-sm">Sản phẩm thực tế đã triển khai thành công cho khách hàng toàn quốc.</p>
            </div>
            <button onClick={() => setCurrentTab('projects')}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-500/40 text-cyan-400 text-sm font-bold hover:bg-cyan-500/15 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all self-start md:self-auto backdrop-blur-md">
              Xem Tất Cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fp.length > 0 ? fp.map((project) => (
              <div key={project.id}
                className="group rounded-2xl overflow-hidden border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <img src={project.imageUrl || project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'} alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/30 shadow-lg">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-5">{project.description}</p>
                  <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-cyan-500/20 border border-white/[0.08] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2">
                    Xem Live Website <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )) : [
              { title: 'Nền Tảng TMĐT Luxury Central', cat: 'E-Commerce', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop' },
              { title: 'Web App Quản Trị Doanh Nghiệp', cat: 'Enterprise', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop' },
              { title: 'Cổng Tài Chính Quốc Tế', cat: 'Fintech', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop' }
            ].map((p, i) => (
              <div key={i} onClick={() => setCurrentTab('projects')}
                className="group rounded-2xl overflow-hidden border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-400 cursor-pointer hover:-translate-y-2">
                <div className="aspect-video relative overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/20">{p.cat}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-base mb-5 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                  <div className="w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
                    Xem Dự Án <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="laser-beam-purple top-[15%] left-0" />
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#7c3aed,transparent 70%)', filter: 'blur(100px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-4 backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold text-violet-300">Tiêu Chuẩn Triển Khai Quốc Tế</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
                Quy Trình{' '}<span style={gt('#a78bfa','#818cf8')}>5 Bước</span><br />Kiến Tạo Sản Phẩm
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-[45ch]">
                Từ khảo sát đến bàn giao — quy trình chuẩn quốc tế đảm bảo sản phẩm hoàn chỉnh, đúng hạn và vượt kỳ vọng.
              </p>
              <button onClick={() => setCurrentTab('quote')}
                className="group px-7 py-3.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}>
                Bắt Đầu Dự Án <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-3">
              {wfSteps.map((step, i) => (
                <div key={i} onClick={() => {
                  setActiveStep(i);
                  setResetTimer(prev => prev + 1);
                }}
                  className={`group flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 backdrop-blur-xl ${activeStep === i ? 'border-violet-500/50 bg-violet-500/15 shadow-[0_10px_30px_rgba(124,58,237,0.2)]' : 'border-white/[0.08] bg-slate-900/40 hover:bg-slate-900/70 hover:border-white/15'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-all duration-300 ${activeStep === i ? 'bg-violet-500 text-white shadow-md shadow-violet-500/40' : 'bg-white/[0.05] text-slate-500'}`}>
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm mb-1 transition-colors ${activeStep === i ? 'text-white' : 'text-slate-300'}`}>{step.title}</h3>
                    <p className={`text-xs leading-relaxed transition-colors ${activeStep === i ? 'text-slate-300' : 'text-slate-500'}`}>{step.desc}</p>
                  </div>
                  {activeStep === i && <div className="flex-shrink-0 mt-1"><div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_10px_#a78bfa]" /></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="laser-beam-h top-[5%] right-[10%]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center,#f43f5e,transparent 70%)', filter: 'blur(100px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 mb-4 backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs font-bold text-pink-300">Kiến thức & Xu hướng</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Bài Viết <span style={gt('#f472b6','#fb7185')}>Mới Nhất</span>
              </h2>
            </div>
            <button onClick={() => { setCurrentTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group flex items-center gap-2 text-sm font-bold text-pink-400 border border-pink-500/40 px-5 py-2.5 rounded-xl hover:bg-pink-500/15 hover:shadow-[0_0_20px_rgba(244,114,182,0.3)] transition-all self-start md:self-auto backdrop-blur-md">
              Tất cả bài viết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((art, i) => (
              <article key={art.id || i} onClick={() => {
                sessionStorage.setItem('active_article_id', String(art.id));
                setCurrentTab('blog');
                window.scrollTo(0, 0);
              }}
                className="group rounded-2xl overflow-hidden border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl hover:border-pink-500/40 transition-all duration-400 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <img src={art.image || art.imageUrl || art.img || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-pink-400 border border-pink-500/30 shadow-lg">{art.category || art.cat || 'Công nghệ'}</div>
                </div>
                <div className="p-6">
                  <span className="text-[10px] text-slate-500 font-medium">{art.date || 'Mới cập nhật'}</span>
                  <h3 className="font-bold text-white text-sm mt-2 mb-4 line-clamp-2 group-hover:text-pink-400 transition-colors leading-relaxed">{art.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                    <span>Đọc bài</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section className="py-24 relative overflow-hidden">
        {/* Artistic Aurora & Glow Spotlight */}
        <div className="laser-beam-h top-[5%] left-0" />
        <div className="laser-beam-purple bottom-[10%] right-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#06b6d4,#7c3aed 50%,transparent 75%)', filter: 'blur(110px)' }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300">Nhận Tư Vấn Chuyên Sâu</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Đăng Ký Báo Giá &<br />
              <span style={gt('#06b6d4','#38bdf8')}>Demo Miễn Phí</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">Điền thông tin — chuyên viên Fi.tallest sẽ liên hệ tư vấn trong vòng 15 phút.</p>
          </div>
          <div className="rounded-3xl border border-white/[0.12] p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
            style={{ background: 'linear-gradient(145deg,rgba(15,23,42,0.92),rgba(5,10,20,0.96))', backdropFilter: 'blur(24px)' }}>
            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Cảm ơn bạn! Thông tin đã được ghi nhận. Chúng tôi sẽ liên hệ ngay!</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" required placeholder="Họ và tên *" value={formData.fullname}
                  onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.07] transition-all" />
                <input type="tel" required placeholder="Số điện thoại / Zalo *" value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.07] transition-all" />
              </div>
              <input type="email" placeholder="Email liên hệ (tùy chọn)" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.07] transition-all" />
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dịch vụ quan tâm</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['Thiết kế Website', 'Ứng dụng Mobile', 'SEO Google', 'Hosting & Domain', 'Thiết kế AI', 'Khác'].map(svc => {
                    const sel = formData.services.includes(svc);
                    return (
                      <div key={svc} onClick={() => toggleSvc(svc)}
                        className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center justify-between transition-all duration-200 ${sel ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-white/[0.08] bg-white/[0.03] text-slate-500 hover:border-white/[0.15] hover:text-slate-300'}`}>
                        <span>{svc}</span>
                        {sel && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <textarea rows={3} placeholder="Ghi chú thêm về yêu cầu (ngân sách, thời hạn, v.v.)..." value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.07] transition-all resize-none" />
              <button type="submit" disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4,#38bdf8)' }}>
                {isSubmitting ? (
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                ) : <><Send className="w-4 h-4" />Gửi Yêu Cầu Tư Vấn</>}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
