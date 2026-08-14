import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../supabaseClient';
import { useSettings } from '../contexts/SettingsContext';

export default function AboutUs() {
  const { settings } = useSettings();
  const [stats, setStats] = useState({ categoriesCount: 0, productsCount: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [{ count: catCount }, { count: prodCount }] = await Promise.all([
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true })
        ]);
        setStats({
          categoriesCount: catCount || 0,
          productsCount: prodCount || 0
        });
      } catch (err) {
        console.warn('Lỗi lấy thống kê số liệu:', err);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="bg-white py-24 shrink-0 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column - Portrait Image (40%) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative h-[500px] md:h-[600px] w-full rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop" 
                alt="Công nhân xây dựng thi công"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
            </div>
            
            {/* Decorative Accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-100 rounded-full -z-10 blur-2xl"></div>
          </motion.div>

          {/* Right Column - Content (60%) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Về {settings.companyName || 'Sbuild'}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 uppercase tracking-tighter">
              Không Chỉ Là Vật Tư.<br/> 
              <span className="text-red-600">Chúng Tôi Xây Dựng Niềm Tin.</span>
            </h2>
            
            <p className="text-lg text-slate-600 font-medium mb-12 max-w-2xl leading-relaxed">
              Tốc độ và chất lượng là nền tảng của mọi công trình vĩ đại. Chúng tôi cung cấp giải pháp vật tư toàn diện, đảm bảo sự chính xác tuyệt đối để tiến độ thi công của bạn không bao giờ gián đoạn.
            </p>

            {/* Hook: Realtime Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-slate-100 relative">
              {/* Realtime blinking indicator */}
              <div className="absolute -top-[9px] left-0 flex items-center gap-2 bg-white pr-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Live Data</span>
              </div>

              <div className="flex flex-col group">
                <span className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter mb-1 transition-transform group-hover:-translate-y-1">
                  {stats.productsCount}<span className="text-slate-300">+</span>
                </span>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">Sản phẩm</span>
              </div>
              
              <div className="flex flex-col group">
                <span className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter mb-1 transition-transform group-hover:-translate-y-1">
                  {stats.categoriesCount}<span className="text-slate-300">+</span>
                </span>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">Danh mục</span>
              </div>
              
              <div className="flex flex-col group">
                <span className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter mb-1 transition-transform group-hover:-translate-y-1">
                  24<span className="text-slate-300">h</span>
                </span>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">Giao hàng</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
