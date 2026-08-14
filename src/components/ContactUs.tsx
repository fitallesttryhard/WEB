import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function ContactUs() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request to send email
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-0 selection:bg-gray-200 selection:text-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 min-h-[calc(100vh-112px)]">
          
          {/* Cột trái: Thông tin & Bản đồ (50%) */}
          <div className="flex flex-col h-full py-12 lg:py-20 lg:pl-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-lg text-gray-500 font-medium mb-12 max-w-lg">
              Sbuild luôn sẵn sàng lắng nghe và cung cấp giải pháp vật tư tối ưu nhất cho dự án của bạn.
            </p>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-1">Văn phòng chính</h3>
                  <p className="text-gray-600 text-base">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-1">Hotline tư vấn</h3>
                  <p className="text-gray-600 text-base">{settings.hotline}</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-1">Email liên hệ</h3>
                  <p className="text-gray-600 text-base">{settings.email}</p>
                </div>
              </div>
            </div>

            {/* Iframe Google Maps */}
            <div className="flex-1 w-full min-h-[350px] rounded-2xl overflow-hidden bg-gray-100 mt-auto">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1711234567890!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale opacity-90 contrast-125"
              ></iframe>
            </div>
          </div>

          {/* Cột phải: Form yêu cầu (50%) */}
          <div className="bg-gray-50/50 flex flex-col justify-center h-full p-8 lg:p-20 relative lg:-mr-8">
            <div className="max-w-xl w-full mx-auto relative z-10">
              <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Gửi yêu cầu báo giá</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-gray-900 uppercase tracking-widest">Họ và tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên của bạn"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold text-gray-900 uppercase tracking-widest">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-gray-900 uppercase tracking-widest">Nội dung tư vấn</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Bạn cần hỗ trợ về sản phẩm hay dự án nào?"
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors text-gray-900 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Gửi Yêu Cầu
                    </>
                  )}
                </button>
              </form>

              {/* Success State */}
              {isSuccess && (
                <div className="absolute inset-0 bg-gray-50/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 rounded-2xl">
                  <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Đã gửi thành công</h4>
                  <p className="text-gray-500 font-medium max-w-sm">
                    Cảm ơn bạn. Đội ngũ chuyên gia của chúng tôi sẽ liên hệ lại qua số điện thoại đã cung cấp trong thời gian sớm nhất.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
