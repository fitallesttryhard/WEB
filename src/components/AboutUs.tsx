import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Truck, CheckCircle2, ArrowRight, HardHat, Target } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useSettings } from '../contexts/SettingsContext';

interface AboutUsProps {
  isFullPage?: boolean;
}

export default function AboutUs({ isFullPage = false }: AboutUsProps) {
  const { settings } = useSettings();
  const [stats, setStats] = useState({ categoriesCount: 0, productsCount: 0 });
  const [customPage, setCustomPage] = useState<any>(null);

  useEffect(() => {
    async function fetchStatsAndPage() {
      try {
        const [{ count: catCount }, { count: prodCount }, { data: pageData }] = await Promise.all([
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('pages').select('*').or('slug.eq.gioi-thieu,slug.eq.about').maybeSingle()
        ]);

        setStats({
          categoriesCount: catCount || 0,
          productsCount: prodCount || 0
        });

        if (pageData && pageData.status === 'published') {
          setCustomPage(pageData);
        }
      } catch (err) {
        console.warn('Lỗi lấy thống kê số liệu & trang giới thiệu:', err);
      }
    }
    fetchStatsAndPage();
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Full Page Header if accessed via #about */}
      {isFullPage && (
        <div className="bg-slate-900 text-white pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-950 z-0 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-extrabold uppercase tracking-widest mb-4">
              <HardHat size={15} /> {customPage?.title || 'Giới Thiệu Về Chúng Tôi'}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-4 drop-shadow-md">
              {settings.companyName || 'Công Ty TNHH Đầu Tư Xây Dựng Sbuild'}
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Nhà cung cấp giải pháp vật tư xây dựng, nẹp trang trí cao cấp và phụ kiện công trình uy tín hàng đầu tại Việt Nam.
            </p>
          </div>
        </div>
      )}

      {/* Main Story & Overview Section */}
      <section className="py-20 lg:py-24 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Column - Image Container */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative h-[450px] md:h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop" 
                  alt="Vật tư công trình xây dựng Sbuild"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-red-400 mb-1">Đồng hành cùng công trình</p>
                  <p className="text-sm font-bold leading-snug">Cam kết chất lượng chuẩn kiểm định CO/CQ trên từng sản phẩm.</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Overview Text */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600"></span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Về {settings.companyName || 'Sbuild'}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] mb-6 uppercase tracking-tight">
                Không Chỉ Là Vật Tư.<br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">Chúng Tôi Xây Dựng Niềm Tin.</span>
              </h2>
              
              {customPage?.content ? (
                <div 
                  className="prose prose-slate max-w-none mb-8 text-base text-slate-600 font-medium leading-relaxed prose-headings:font-black prose-headings:text-slate-900 prose-a:text-red-600"
                  dangerouslySetInnerHTML={{ __html: customPage.content }}
                />
              ) : (
                <p className="text-base md:text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                  Tốc độ và chất lượng là nền tảng của mọi công trình vĩ đại. Chúng tôi cung cấp giải pháp vật tư toàn diện, từ các loại nẹp trang trí nhôm, inox, nhựa uPVC đến phụ kiện thi công chuyên dụng, đảm bảo sự chính xác tuyệt đối để tiến độ của bạn không bao giờ gián đoạn.
                </p>
              )}

              {/* Realtime Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 relative">
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 tracking-tight mb-1">
                    {stats.productsCount > 0 ? stats.productsCount : 50}+
                  </span>
                  <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Sản phẩm</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 tracking-tight mb-1">
                    {stats.categoriesCount > 0 ? stats.categoriesCount : 10}+
                  </span>
                  <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Danh mục</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 tracking-tight mb-1">
                    24h
                  </span>
                  <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Giao hàng</span>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-[0.2em] block mb-2">
              GIÁ TRỊ CỐT LÕI
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Tại Sao Chọn Sbuild?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-start hover:border-red-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6 shadow-xs font-bold">
                <Award size={24} />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2 uppercase">Chuẩn CO/CQ Kiểm Định</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Mọi lô sản phẩm vật tư đều có chứng nhận xuất xứ CO và chứng chỉ chất lượng CQ đầy đủ cho công trình.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-start hover:border-red-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-xs font-bold">
                <Truck size={24} />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2 uppercase">Giao Hàng Tận Công Trình</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Hệ thống vận tải linh hoạt sẵn sàng đáp ứng tiến độ công trình 24/7 trên khắp toàn quốc.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-start hover:border-red-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 shadow-xs font-bold">
                <Target size={24} />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2 uppercase">Tối Ưu Chi Phí</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Giá gốc tận xưởng sản xuất, chính sách chiết khấu tốt cho nhà thầu và đại lý xây dựng.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-start hover:border-red-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-xs font-bold">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2 uppercase">Tư Vấn Kỹ Thuật 24/7</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Đội ngũ kỹ sư giàu kinh nghiệm sẵn sàng tư vấn bản vẽ, giải pháp thi công nẹp và vật tư tối ưu nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 -mb-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 md:p-12 shadow-[0_20px_50px_rgba(225,29,72,0.3)] border border-red-500/30">
            {/* Background ambient glow shapes */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-1/3 -top-12 w-56 h-56 bg-black/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-md border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Tư Vấn Kỹ Thuật & Báo Giá Nhanh
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">
                  Bạn Cần Tư Vấn Giải Pháp Vật Tư?
                </h3>
                <p className="text-red-100 text-sm font-medium max-w-xl">
                  Liên hệ ngay để nhận báo giá chi tiết, catalogue 2026 và mẫu thử vật tư tận công trình hoàn toàn miễn phí.
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 bg-white text-red-600 hover:bg-slate-950 hover:text-white px-8 py-4 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Gửi Yêu Cầu Báo Giá</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
