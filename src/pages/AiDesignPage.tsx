import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  Wand2
} from 'lucide-react';

interface AiDesignPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AiDesignPage: React.FC<AiDesignPageProps> = ({ setCurrentTab }) => {
  return (
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" /> Trí Tuệ Nhân Tạo Trong Thiết Kế
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Giao Diện Thông Minh Tự Động Hóa AI
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Tích hợp công nghệ AI tiên tiến giúp phân tích hành vi người dùng, tối ưu bố cục tương tác và tự động cá nhân hóa trải nghiệm khách hàng.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="tech-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Phân Tích UX Bằng AI</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Theo dõi luồng di chuyển của người dùng, dự đoán điểm nghẽn và tự động gợi ý cải tiến tỷ lệ chuyển đổi.
            </p>
          </div>

          <div className="tech-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tự Động Hóa Chatbot AI</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Trợ lý ảo thông minh trả lời thắc mắc của khách hàng 24/7 theo kịch bản tư vấn doanh nghiệp chuẩn xác.
            </p>
          </div>

          <div className="tech-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tối Ưu Bài Viết AI SEO</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tạo nội dung hấp dẫn, tự động phân bổ từ khóa chuẩn SEO giúp website lên Top nhanh gấp 3 lần.
            </p>
          </div>

        </div>

        {/* BANNER CTA */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold">Trải Nghiệm Công Nghệ Thiết Kế AI Ngay Hôm Nay</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Liên hệ với Fi.tallest để nhận demo các giải pháp giao diện thông minh cho doanh nghiệp của bạn.
          </p>
          <button 
            onClick={() => setCurrentTab('quote')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-purple-500/30 hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <span>Đăng Ký Tư Vấn AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
