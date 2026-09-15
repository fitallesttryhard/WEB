"use client";
﻿import React from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Tags,
  FileText, Image as ImageIcon, Building2,
  MonitorPlay, Settings, Layers, LogOut, HardHat
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (id: string) => void;
}

export default function AdminSidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-10 shadow-xl text-slate-100 font-sans select-none">
      {/* Logo Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-600/30 shrink-0">
            <HardHat size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white uppercase flex items-center gap-1.5">
              <span>S-BUILD</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </span>
            <span className="block text-[9px] text-slate-400 font-bold tracking-widest uppercase">Hệ Thống Quản Trị</span>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'dashboard'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg shadow-red-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard size={18} className={activeMenu === 'dashboard' ? 'text-white' : 'text-red-400'} />
                <span>Bảng điều khiển</span>
              </button>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'orders' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShoppingCart size={18} className={activeMenu === 'orders' ? 'text-white' : 'text-red-400'} />
                <span>Yêu cầu Báo giá</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('products')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'products' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Package size={18} className={activeMenu === 'products' ? 'text-white' : 'text-red-400'} />
                <span>Sản phẩm & Vật tư</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('categories')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'categories' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Tags size={18} className={activeMenu === 'categories' ? 'text-white' : 'text-red-400'} />
                <span>Danh mục Sản phẩm</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('construction_categories')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'construction_categories' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers size={18} className={activeMenu === 'construction_categories' ? 'text-white' : 'text-red-400'} />
                <span>Hạng mục Thi công</span>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'projects' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Building2 size={18} className={activeMenu === 'projects' ? 'text-white' : 'text-red-400'} />
                <span>Công trình & Dự án</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('posts')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'posts' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileText size={18} className={activeMenu === 'posts' ? 'text-white' : 'text-red-400'} />
                <span>Bài viết & Tin tức</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('post_categories')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'post_categories' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Tags size={18} className={activeMenu === 'post_categories' ? 'text-white' : 'text-red-400'} />
                <span>Chuyên mục Bài viết</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('media')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'media' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ImageIcon size={18} className={activeMenu === 'media' ? 'text-white' : 'text-red-400'} />
                <span>Thư viện Media</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('banners')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'banners' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers size={18} className={activeMenu === 'banners' ? 'text-white' : 'text-red-400'} />
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'appearance' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <MonitorPlay size={18} className={activeMenu === 'appearance' ? 'text-white' : 'text-red-400'} />
                <span>Giao diện Website</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'settings' || activeMenu === 'company_info' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Building2 size={18} className={activeMenu === 'settings' || activeMenu === 'company_info' ? 'text-white' : 'text-red-400'} />
                <span>Thông tin Doanh nghiệp</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('change_password')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium cursor-pointer ${
                  activeMenu === 'change_password' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings size={18} className={activeMenu === 'change_password' ? 'text-white' : 'text-red-400'} />
                <span>Đổi mật khẩu</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Profile & Logout Footer */}
      <div className="p-3.5 border-t border-slate-800 shrink-0 bg-slate-900/90 space-y-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
            {user?.fullName?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Quản Trị Viên S-BUILD'}</p>
            <p className="text-[10px] text-red-400 font-medium truncate">{user?.email || 'admin@sbuild.vn'}</p>
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
