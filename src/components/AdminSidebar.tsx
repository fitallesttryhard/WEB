import React, { useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Tags,
  FileText, Image as ImageIcon, Files, Building2,
  MonitorPlay, Settings, ShieldCheck, Download, Layers, LogOut, ArrowLeft, Sparkles, ChevronDown, ChevronRight, Store, CreditCard, Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (id: string) => void;
}

export default function AdminSidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isSaasOpen, setIsSaasOpen] = useState(
    activeMenu.startsWith('saas-') || activeMenu === 'superadmin'
  );

  const isSaasActive = activeMenu.startsWith('saas-') || activeMenu === 'superadmin';

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-10 shadow-xl text-slate-100 font-sans select-none">
      {/* Logo Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
              Fi.tallest
            </span>
            <span className="block text-[9px] text-slate-400 font-semibold tracking-widest uppercase">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">

        {/* TỔNG QUAN */}
        <div>
          <h3 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            TỔNG QUAN HỆ THỐNG
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'dashboard'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <LayoutDashboard size={18} className={activeMenu === 'dashboard' ? 'text-white' : 'text-indigo-400'} />
                <span>Bảng điều khiển</span>
              </button>
            </li>

            {/* ACCORDION SUPER ADMIN SAAS */}
            <li>
              <button
                onClick={() => {
                  setIsSaasOpen(!isSaasOpen);
                  if (!activeMenu.startsWith('saas-')) {
                    setActiveMenu('saas-tenants');
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${isSaasActive
                    ? 'bg-indigo-950/80 text-indigo-200 border border-indigo-500/40 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-indigo-400" />
                  <span>Super Admin SaaS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                    SAAS
                  </span>
                  {isSaasOpen ? <ChevronDown size={15} className="text-indigo-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                </div>
              </button>

              {/* XỔ RA CÁC MỤC CON GỌN GÀNG */}
              {isSaasOpen && (
                <ul className="mt-1 ml-4 pl-3 border-l-2 border-indigo-500/30 space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveMenu('saas-overview')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${activeMenu === 'saas-overview'
                          ? 'bg-indigo-600 text-white font-bold shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                      <Activity size={14} />
                      <span>Tổng quan chỉ số</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveMenu('saas-tenants')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${activeMenu === 'saas-tenants' || activeMenu === 'superadmin'
                          ? 'bg-indigo-600 text-white font-bold shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                      <Store size={14} />
                      <span>Danh sách Cửa hàng</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveMenu('saas-plans')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${activeMenu === 'saas-plans'
                          ? 'bg-indigo-600 text-white font-bold shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                      <CreditCard size={14} />
                      <span>Quản lý Gói cước</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveMenu('saas-settings')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${activeMenu === 'saas-settings'
                          ? 'bg-indigo-600 text-white font-bold shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                      <Settings size={14} />
                      <span>Cài đặt Máy chủ SaaS</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* QUẢN LÝ BÁN HÀNG */}
        <div>
          <h3 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            QUẢN LÝ BÁN HÀNG
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveMenu('orders')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'orders' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <ShoppingCart size={18} className="text-indigo-400" />
                <span>Yêu cầu Báo giá</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('products')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'products' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Package size={18} className="text-indigo-400" />
                <span>Dịch Vụ & Sản Phẩm</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('categories')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'categories' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Tags size={18} className="text-indigo-400" />
                <span>Danh mục Dịch vụ</span>
              </button>
            </li>
          </ul>
        </div>

        {/* QUẢN LÝ NỘI DUNG */}
        <div>
          <h3 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            QUẢN LÝ NỘI DUNG
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveMenu('projects')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'projects' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Building2 size={18} className="text-indigo-400" />
                <span>Kho Dự án mẫu</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('posts')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'posts' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <FileText size={18} className="text-indigo-400" />
                <span>Bài viết Công nghệ</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('post_categories')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'post_categories' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Tags size={18} className="text-indigo-400" />
                <span>Chuyên mục Bài viết</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('media')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'media' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <ImageIcon size={18} className="text-indigo-400" />
                <span>Thư viện Media</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('banners')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'banners' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Layers size={18} className="text-indigo-400" />
                <span>Banner / Slider</span>
              </button>
            </li>
          </ul>
        </div>

        {/* HỆ THỐNG */}
        <div>
          <h3 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            HỆ THỐNG
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveMenu('appearance')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'appearance' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <MonitorPlay size={18} className="text-indigo-400" />
                <span>Giao diện</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${activeMenu === 'settings' || activeMenu === 'company_info' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Building2 size={18} className="text-indigo-400" />
                <span>Thông tin Doanh nghiệp</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Profile & Logout Footer */}
      <div className="p-3.5 border-t border-slate-800 shrink-0 bg-slate-900/90 space-y-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
            {user?.fullName?.charAt(0).toUpperCase() || 'Q'}
          </div>
          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Quản Trị Viên Fi.tallest'}</p>
            <p className="text-[10px] text-indigo-400 font-medium truncate">{user?.email || 'admin@fitallest.com'}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); window.location.hash = '#admin'; }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-700/80 active:scale-95 cursor-pointer"
        >
          <LogOut size={15} />
          <span>Đăng Xuất Admin</span>
        </button>
      </div>
    </aside>
  );
}
