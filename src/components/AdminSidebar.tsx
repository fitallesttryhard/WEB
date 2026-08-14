import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Tags, 
  FileText, Image as ImageIcon, Files, 
  MonitorPlay, Settings, HardHat, Layers, LogOut, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (id: string) => void;
}

const menuGroups = [
  {
    label: 'TỔNG QUAN',
    items: [
      { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard }
    ]
  },
  {
    label: 'QUẢN LÝ BÁN HÀNG',
    items: [
      { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
      { id: 'products', label: 'Sản phẩm', icon: Package },
      { id: 'categories', label: 'Danh mục', icon: Tags }
    ]
  },
  {
    label: 'QUẢN LÝ NỘI DUNG',
    items: [
      { id: 'posts', label: 'Bài viết', icon: FileText },
      { id: 'post_categories', label: 'Chuyên mục', icon: Tags },
      { id: 'media', label: 'Thư viện Media', icon: ImageIcon },
      { id: 'pages', label: 'Trang tĩnh', icon: Files }
    ]
  },
  {
    label: 'HỆ THỐNG',
    items: [
      { id: 'appearance', label: 'Giao diện', icon: MonitorPlay },
      { id: 'banners', label: 'Banner / Slider', icon: Layers },
      { id: 'settings', label: 'Cài đặt', icon: Settings }
    ]
  }
];

export default function AdminSidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded">
            <HardHat size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-red-600 uppercase">
            Sbuild
          </span>
        </div>
        <a 
          href="#" 
          className="text-slate-400 hover:text-slate-900 transition-colors p-1"
          title="Về trang chủ"
        >
          <ArrowLeft size={18} />
        </a>
      </div>

      {/* User Profile */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-100 shrink-0">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg">
          {user?.fullName?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName || 'Quản Trị Viên'}</p>
          <p className="text-xs text-gray-500 font-medium truncate">{user?.email || 'admin@sbuild.vn'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={groupIdx > 0 ? "mt-6" : ""}>
            <h3 className="px-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-4 ${
                        isActive 
                          ? 'bg-red-50 text-red-700 border-red-600 font-bold' 
                          : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900 font-medium'
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-red-600" : "text-gray-400"} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <button
          onClick={() => { logout(); window.location.hash = '#admin'; }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
        >
          <LogOut size={16} />
          <span>Đăng Xuất Admin</span>
        </button>
      </div>
    </aside>
  );
}
