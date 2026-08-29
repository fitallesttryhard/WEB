import React, { useState } from 'react';
import {
  Download,
  LayoutDashboard,
  Store,
  CreditCard,
  Settings,
  TrendingUp,
  Users,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  ShieldCheck,
  Building2,
  Activity,
  Server,
  Database,
  Globe,
  Bell,
  LogOut,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Edit,
  Trash2,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- TYPES & INTERFACES ---

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  plan: 'Starter' | 'Professional' | 'Enterprise' | 'Scale';
  paymentStatus: 'Paid' | 'Overdue' | 'Trialing';
  status: 'active' | 'locked';
  createdAt: string;
  mrr: number;
  productsCount: number;
}

interface PlanConfig {
  id: string;
  name: 'Starter' | 'Professional' | 'Enterprise' | 'Scale';
  price: number;
  description: string;
  maxProducts: number;
  maxAdmins: number;
  hasCustomDomain: boolean;
  hasAiFeatures: boolean;
  badge?: string;
}

// --- INITIAL MOCK DATA ---

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'ten-1',
    name: 'Cửa Hàng Vật Tư Fi.tallest',
    subdomain: 'fitallest',
    ownerName: 'Nguyễn Văn Hùng',
    ownerEmail: 'hung.fitallest@gmail.com',
    plan: 'Enterprise',
    paymentStatus: 'Paid',
    status: 'active',
    createdAt: '2025-01-15',
    mrr: 12500000,
    productsCount: 1450
  },
  {
    id: 'ten-2',
    name: 'Công Ty Vật Liệu ABC',
    subdomain: 'abc-corp',
    ownerName: 'Trần Thị Mai',
    ownerEmail: 'mai.tran@abc-corp.vn',
    plan: 'Professional',
    paymentStatus: 'Paid',
    status: 'active',
    createdAt: '2025-03-10',
    mrr: 4500000,
    productsCount: 680
  },
  {
    id: 'ten-3',
    name: 'Showroom Nội Thất Minh An',
    subdomain: 'minhan-decor',
    ownerName: 'Lê Hoàng Nam',
    ownerEmail: 'nam@minhan.com.vn',
    plan: 'Starter',
    paymentStatus: 'Overdue',
    status: 'locked',
    createdAt: '2025-04-02',
    mrr: 1500000,
    productsCount: 220
  },
  {
    id: 'ten-4',
    name: 'Tập Đoàn Xây Dựng Đông Á',
    subdomain: 'donga-const',
    ownerName: 'Phạm Đức Anh',
    ownerEmail: 'ducanh@donga.vn',
    plan: 'Scale',
    paymentStatus: 'Paid',
    status: 'active',
    createdAt: '2025-05-18',
    mrr: 28000000,
    productsCount: 3200
  },
  {
    id: 'ten-5',
    name: 'Công Ty Công Nghệ Fi.tallest',
    subdomain: 'kientrucviet',
    ownerName: 'Vũ Thanh Sơn',
    ownerEmail: 'son.vu@kientrucviet.vn',
    plan: 'Professional',
    paymentStatus: 'Trialing',
    status: 'active',
    createdAt: '2025-08-01',
    mrr: 0,
    productsCount: 190
  },
  {
    id: 'ten-6',
    name: 'Giàn Giáo & Phụ Kiện Hưng Phát',
    subdomain: 'hungphat-steel',
    ownerName: 'Đặng Tuấn Kiệt',
    ownerEmail: 'kiet.dang@hungphat.com',
    plan: 'Professional',
    paymentStatus: 'Paid',
    status: 'active',
    createdAt: '2025-06-12',
    mrr: 4500000,
    productsCount: 510
  },
  {
    id: 'ten-7',
    name: 'Vật Tư Chống Thấm Tân Phát',
    subdomain: 'tanphat-waterproof',
    ownerName: 'Hoàng Quốc Việt',
    ownerEmail: 'viet.hoang@tanphat.vn',
    plan: 'Starter',
    paymentStatus: 'Overdue',
    status: 'locked',
    createdAt: '2025-07-20',
    mrr: 1500000,
    productsCount: 140
  }
];

const INITIAL_PLANS: PlanConfig[] = [
  {
    id: 'plan-1',
    name: 'Starter',
    price: 1500000,
    description: 'Cho cửa hàng nhỏ mới khởi chạy kinh doanh.',
    maxProducts: 500,
    maxAdmins: 2,
    hasCustomDomain: false,
    hasAiFeatures: false
  },
  {
    id: 'plan-2',
    name: 'Professional',
    price: 4500000,
    description: 'Cho nhà phân phối vật tư vừa & lớn.',
    maxProducts: 3000,
    maxAdmins: 10,
    hasCustomDomain: true,
    hasAiFeatures: false,
    badge: 'Phổ biến nhất'
  },
  {
    id: 'plan-3',
    name: 'Enterprise',
    price: 12500000,
    description: 'Doanh nghiệp vật tư & chuỗi đại lý lớn.',
    maxProducts: 999999,
    maxAdmins: 999,
    hasCustomDomain: true,
    hasAiFeatures: true
  },
  {
    id: 'plan-4',
    name: 'Scale',
    price: 28000000,
    description: 'Hạ tầng riêng biệt & SLA 99.99% cho tập đoàn.',
    maxProducts: 999999,
    maxAdmins: 999,
    hasCustomDomain: true,
    hasAiFeatures: true,
    badge: 'Dedicated VIP'
  }
];

const MRR_GROWTH_DATA = [
  { month: 'T9/25', mrr: 185, activeStores: 82, newTenants: 8 },
  { month: 'T10/25', mrr: 210, activeStores: 90, newTenants: 10 },
  { month: 'T11/25', mrr: 245, activeStores: 98, newTenants: 11 },
  { month: 'T12/25', mrr: 290, activeStores: 106, newTenants: 9 },
  { month: 'T1/26', mrr: 330, activeStores: 114, newTenants: 12 },
  { month: 'T2/26', mrr: 375, activeStores: 122, newTenants: 10 },
  { month: 'T3/26', mrr: 410, activeStores: 128, newTenants: 8 },
  { month: 'T4/26', mrr: 460, activeStores: 135, newTenants: 11 },
  { month: 'T5/26', mrr: 505, activeStores: 139, newTenants: 7 },
  { month: 'T6/26', mrr: 540, activeStores: 142, newTenants: 6 },
  { month: 'T7/26', mrr: 590, activeStores: 146, newTenants: 9 },
  { month: 'T8/26', mrr: 645, activeStores: 152, newTenants: 10 }
];

const PLAN_DISTRIBUTION = [
  { name: 'Starter', value: 42, color: '#64748b' },
  { name: 'Professional', value: 74, color: '#2563eb' },
  { name: 'Enterprise', value: 28, color: '#7c3aed' },
  { name: 'Scale', value: 8, color: '#059669' }
];

const RECENT_ACTIVITIES = [
  { id: 'act-1', type: 'signup', text: 'Cửa hàng "Công Ty Công Nghệ Fi.tallest" vừa đăng ký tài khoản (Trialing).', time: '10 phút trước' },
  { id: 'act-2', type: 'payment', text: 'Cửa hàng "Công Ty Vật Liệu ABC" đã thanh toán phí duy trì gói Professional.', time: '2 giờ trước' },
  { id: 'act-3', type: 'lock', text: 'Tự động khóa tài khoản "Showroom Nội Thất Minh An" do quá hạn 15 ngày.', time: '5 giờ trước' },
  { id: 'act-4', type: 'security', text: 'Đã cập nhật chính sách Supabase Row Level Security (RLS) v2.4 toàn nền tảng.', time: '1 ngày trước' }
];

export default function SuperAdminDashboard({ activeSubTab = "saas-tenants" }: { activeSubTab?: string }) {

  const handleExportTenantData = (tenant: Tenant) => {
    const exportData = {
      tenantId: tenant.id,
      tenantName: tenant.name,
      subdomain: tenant.subdomain,
      owner: { name: tenant.ownerName, email: tenant.ownerEmail },
      plan: tenant.plan,
      exportedAt: new Date().toISOString(),
      schema: 'https://fitallest.com/schemas/v1.json',
      database: {
        productsCount: tenant.productsCount,
        tables: ['products', 'categories', 'posts', 'orders', 'settings', 'media']
      },
      instructions: 'Dữ liệu này có thể nạp thẳng vào bất kỳ Database Supabase / Postgres độc lập nào khi chuyển sang mua đứt.'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EXPORT_TENANT_${tenant.subdomain.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

    const [activeTab, setActiveTab] = useState<'analytics' | 'tenants' | 'plans' | 'settings'>(() => {
    if (activeSubTab === 'saas-overview') return 'analytics';
    if (activeSubTab === 'saas-plans') return 'plans';
    if (activeSubTab === 'saas-settings') return 'settings';
    return 'tenants';
  });

  React.useEffect(() => {
    if (activeSubTab === 'saas-overview') setActiveTab('analytics');
    else if (activeSubTab === 'saas-plans') setActiveTab('plans');
    else if (activeSubTab === 'saas-settings') setActiveTab('settings');
    else if (activeSubTab === 'saas-tenants' || activeSubTab === 'superadmin') setActiveTab('tenants');
  }, [activeSubTab]);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [plans, setPlans] = useState<PlanConfig[]>(INITIAL_PLANS);
  const [mrrPeriod, setMrrPeriod] = useState<3 | 6 | 12>(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Form state for new tenant
  const [newTenant, setNewTenant] = useState({
    name: '',
    subdomain: '',
    ownerName: '',
    ownerEmail: '',
    plan: 'Professional' as Tenant['plan']
  });

  // Persistence & Real-time Sync
  React.useEffect(() => {
    const savedTenants = localStorage.getItem('saas_tenants_data');
    if (savedTenants) {
      try {
        setTenants(JSON.parse(savedTenants));
      } catch (e) {}
    } else {
      localStorage.setItem('saas_tenants_data', JSON.stringify(INITIAL_TENANTS));
    }
  }, []);

  const saveTenantsState = (updatedTenants: Tenant[]) => {
    setTenants(updatedTenants);
    localStorage.setItem('saas_tenants_data', JSON.stringify(updatedTenants));
    // Dispatch storage event so open website & admin tabs immediately reflect account status updates
    window.dispatchEvent(new StorageEvent('storage', { key: 'saas_tenants_data', newValue: JSON.stringify(updatedTenants) }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Lock/Unlock account
  const handleToggleStatus = (tenantId: string) => {
    const nextList = tenants.map((item) => {
      if (item.id === tenantId) {
        const nextStatus = item.status === 'active' ? 'locked' : 'active';
        showToast(
          `Đã ${nextStatus === 'locked' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản cửa hàng "${item.name}"!`
        );
        return { ...item, status: nextStatus as Tenant['status'] };
      }
      return item;
    });
    saveTenantsState(nextList);
  };

  // Add new tenant
  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.subdomain) return;

    const created: Tenant = {
      id: `ten-${Date.now()}`,
      name: newTenant.name,
      subdomain: newTenant.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      ownerName: newTenant.ownerName || 'Chủ cửa hàng',
      ownerEmail: newTenant.ownerEmail || `contact@${newTenant.subdomain}.vn`,
      plan: newTenant.plan,
      paymentStatus: 'Trialing',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      mrr: newTenant.plan === 'Enterprise' ? 12500000 : newTenant.plan === 'Scale' ? 28000000 : 4500000,
      productsCount: 0
    };

    const nextList = [created, ...tenants];
    saveTenantsState(nextList);
    setIsAddModalOpen(false);
    setNewTenant({ name: '', subdomain: '', ownerName: '', ownerEmail: '', plan: 'Professional' });
    showToast(`Tạo thành công cửa hàng mới: ${created.name}`);
  };

  // Edit existing tenant
  const handleUpdateTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    const nextList = tenants.map((t) => (t.id === editingTenant.id ? editingTenant : t));
    saveTenantsState(nextList);
    setIsEditModalOpen(false);
    showToast(`Đã cập nhật thông tin cửa hàng "${editingTenant.name}"!`);
  };

  // Delete tenant
  const handleDeleteTenant = (tenant: Tenant) => {
    if (confirm(`Bạn có chắc chắn muốn xóa cửa hàng "${tenant.name}" khỏi nền tảng?`)) {
      const nextList = tenants.filter((t) => t.id !== tenant.id);
      saveTenantsState(nextList);
      showToast(`Đã xóa cửa hàng "${tenant.name}".`);
    }
  };

  // Update Plan config
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? editingPlan : p)));
    setIsPlanModalOpen(false);
    showToast(`Đã lưu cấu hình Gói cước "${editingPlan.name}"!`);
  };

  // Trigger manual backup
  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      showToast('Đã hoàn tất sao lưu Database toàn bộ 152 Tenants thành công!');
    }, 2000);
  };

  // Filtered tenants logic
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? t.status === 'active'
        : filterStatus === 'locked'
        ? t.status === 'locked'
        : filterStatus === 'overdue'
        ? t.paymentStatus === 'Overdue'
        : true;
    const matchesPlan = filterPlan === 'all' || t.plan === filterPlan;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const activeTenantsCount = tenants.filter((t) => t.status === 'active').length;
  const chartDataSlice = MRR_GROWTH_DATA.slice(-mrrPeriod);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* --- MAIN CONTENT CANVAS --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-950 text-slate-100 font-sans">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {activeTab === 'analytics' && 'Tổng quan hệ thống SaaS'}
              {activeTab === 'tenants' && 'Danh sách Cửa hàng (Tenants)'}
              {activeTab === 'plans' && 'Cấu hình Gói cước Dịch vụ (Plans)'}
              {activeTab === 'settings' && 'Cài đặt Hạ tầng & Bảo mật System'}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Kiểm soát phân quyền Row Level Security (RLS) & Trạng thái Multi-Tenant Cửa hàng
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Đã làm mới dữ liệu toàn hệ thống!')}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm mới</span>
            </button>

            {activeTab === 'tenants' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/25 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Cửa hàng Mới</span>
              </button>
            )}
          </div>
        </header>

        {/* --- TAB 1: TỔNG QUAN HỆ THỐNG (ANALYTICS & METRICS) --- */}
        {activeTab === 'analytics' && (
          <div className="p-8 space-y-8 animate-fade-in">
            {/* 4 SaaS Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: MRR */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Doanh thu định kỳ (MRR)</span>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">645.000.000 ₫</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>+14.2% so với tháng trước</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Active Tenants */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cửa hàng đang chạy</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">{activeTenantsCount} Cửa hàng</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>+10 cửa hàng mới tháng này</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Churn Rate */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tỷ lệ rời bỏ (Churn)</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">1.4%</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <TrendingUp className="w-4 h-4 transform rotate-180" />
                    <span>-0.3% (Mức an toàn cực tốt)</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Customer LTV */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Giá trị trọn đời (LTV)</span>
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">48.500.000 ₫</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                    <span>Trung bình 11.2 tháng/Tenant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* MRR Growth Chart (2 Cols) */}
              <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-lg">Tăng trưởng Doanh thu MRR</h3>
                    <p className="text-xs text-slate-400">Đơn vị: Triệu VNĐ (VNĐ triệu)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950 p-1 rounded-xl flex gap-1 text-xs font-bold border border-slate-800">
                      <button
                        onClick={() => setMrrPeriod(3)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          mrrPeriod === 3 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        3 Tháng
                      </button>
                      <button
                        onClick={() => setMrrPeriod(6)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          mrrPeriod === 6 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        6 Tháng
                      </button>
                      <button
                        onClick={() => setMrrPeriod(12)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          mrrPeriod === 12 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        12 Tháng
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartDataSlice} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="month" tickLine={false} stroke="#64748b" fontSize={12} />
                      <YAxis tickLine={false} stroke="#64748b" fontSize={12} unit="M" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          border: '1px solid #334155',
                          color: '#fff',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                        }}
                        formatter={(val: any) => [`${val} Triệu VNĐ`, 'Doanh thu MRR']}
                      />
                      <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Plan Distribution (1 Col) */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Tỷ lệ Phân bổ Gói Cước</h3>
                  <p className="text-xs text-slate-400 mb-4">Cơ cấu gói cước của 152 Cửa hàng</p>
                  <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PLAN_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {PLAN_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  {PLAN_DISTRIBUTION.map((plan) => (
                    <div key={plan.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: plan.color }}></span>
                      <span className="text-xs font-semibold text-slate-300 truncate">{plan.name}: {plan.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Feed & Infrastructure Meters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Activity Log Feed */}
              <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
                <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Nhật ký Hoạt động Hệ thống Gần đây (System Audit Log)
                </h3>
                <div className="space-y-4">
                  {RECENT_ACTIVITIES.map((act) => (
                    <div key={act.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                        {act.type === 'signup' && <Building2 className="w-4 h-4 text-emerald-400" />}
                        {act.type === 'payment' && <DollarSign className="w-4 h-4 text-indigo-400" />}
                        {act.type === 'lock' && <Lock className="w-4 h-4 text-rose-400" />}
                        {act.type === 'security' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 leading-relaxed">{act.text}</p>
                        <span className="text-[10px] text-slate-500 font-medium">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Infrastructure Health */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  Hạ tầng & Supabase RLS
                </h3>
                
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>RLS Database Query Load</span>
                    <span className="text-emerald-400">Optimal (14%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[14%]"></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>API Latency (Vite/Supabase)</span>
                    <span className="text-indigo-400">42ms</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full w-[25%]"></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Storage (S3 Assets)</span>
                    <span className="text-slate-400">14.2 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-violet-500 h-2 rounded-full w-[28%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: DANH SÁCH CỬA HÀNG (TENANT MANAGEMENT) --- */}
        {activeTab === 'tenants' && (
          <div className="p-8 space-y-6 animate-fade-in">
            {/* Filter & Search Toolbar */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên cửa hàng, subdomain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-500"
                />
              </div>

              {/* Status & Plan Filters */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-200 cursor-pointer"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="locked">Đã bị khóa</option>
                    <option value="overdue">Quá hạn thanh toán</option>
                  </select>
                </div>

                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-200 cursor-pointer"
                >
                  <option value="all">Tất cả Gói cước</option>
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Scale">Scale</option>
                </select>
              </div>
            </div>

            {/* TENANT DATA TABLE */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-950/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-4 px-6 whitespace-nowrap">Tên Cửa Hàng & Chủ Sở Hữu</th>
                      <th className="py-4 px-6 whitespace-nowrap">Subdomain</th>
                      <th className="py-4 px-6 whitespace-nowrap">Gói Dịch Vụ</th>
                      <th className="py-4 px-6 whitespace-nowrap">Thanh Toán</th>
                      <th className="py-4 px-6 whitespace-nowrap">Ngày Tạo</th>
                      <th className="py-4 px-6 text-center whitespace-nowrap">Trạng Thái Tài Khoản</th>
                      <th className="py-4 px-6 text-right whitespace-nowrap">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                          Không tìm thấy cửa hàng phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((tenant) => (
                        <tr key={tenant.id} className="hover:bg-slate-800/50 transition-colors group">
                          {/* Store Name & Owner */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                                {tenant.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-100 text-sm hover:text-indigo-400 transition cursor-pointer whitespace-nowrap">
                                  {tenant.name}
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{tenant.ownerName} ({tenant.ownerEmail})</p>
                              </div>
                            </div>
                          </td>

                          {/* Subdomain */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <a
                              href={`https://${tenant.subdomain}.fitallest.com`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1.5"
                            >
                              {tenant.subdomain}.fitallest.com
                              <ExternalLink className="w-3 h-3 text-indigo-400 opacity-60 group-hover:opacity-100 transition" />
                            </a>
                          </td>

                          {/* Plan */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wide border whitespace-nowrap ${
                                tenant.plan === 'Enterprise'
                                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                  : tenant.plan === 'Scale'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : tenant.plan === 'Professional'
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {tenant.plan}
                            </span>
                          </td>

                          {/* Payment Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            {tenant.paymentStatus === 'Paid' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 whitespace-nowrap">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Đã thanh toán
                              </span>
                            )}
                            {tenant.paymentStatus === 'Overdue' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-500/30 whitespace-nowrap">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Quá hạn phí
                              </span>
                            )}
                            {tenant.paymentStatus === 'Trialing' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5" />
                                Đang dùng thử
                              </span>
                            )}
                          </td>

                          {/* Created Date */}
                          <td className="py-4 px-6 text-slate-400 font-mono text-xs whitespace-nowrap">
                            {tenant.createdAt}
                          </td>

                          {/* ACCOUNT STATUS TOGGLE SWITCH DIRECTLY ON ROW */}
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleToggleStatus(tenant.id)}
                                title={tenant.status === 'active' ? 'Bấm để KHÓA cửa hàng này' : 'Bấm để MỞ KHÓA cửa hàng'}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  tenant.status === 'active' ? 'bg-emerald-500' : 'bg-slate-700'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    tenant.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span
                                className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border whitespace-nowrap ${
                                  tenant.status === 'active' 
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {tenant.status === 'active' ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                              </span>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingTenant(tenant);
                                  setIsEditModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                title="Chỉnh sửa cửa hàng"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTenant(tenant)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                title="Xóa cửa hàng"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => showToast(`Truy cập Client Admin của: ${tenant.name}`)}
                                className="px-2.5 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition cursor-pointer whitespace-nowrap"
                              >
                                Vào Admin
                              </button>
                              <button
                                onClick={() => handleExportTenantData(tenant)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-indigo-500/30 transition-all shadow-sm shrink-0 whitespace-nowrap"
                                title="Export toàn bộ dữ liệu Tenant này để chuyển giao mua đứt"
                              >
                                <Download size={13} />
                                <span>Export Data 1-Click</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Hiển thị {filteredTenants.length} trên tổng số {tenants.length} Cửa hàng</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 cursor-pointer" disabled>
                    Trước
                  </button>
                  <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer">
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: QUẢN LÝ GÓI CƯỚC (PLANS) --- */}
        {activeTab === 'plans' && (
          <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Danh mục Gói Cước Dịch Vụ SaaS</h3>
                <p className="text-xs text-slate-500">Cấu hình giá cả và tính năng hạn mức cho từng nhóm khách hàng</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white p-6 rounded-2xl border ${
                    plan.badge ? 'border-2 border-indigo-500 shadow-md' : 'border-slate-200 shadow-sm'
                  } relative flex flex-col justify-between`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{plan.name}</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price)}
                      <span className="text-xs font-normal text-slate-500">/tháng</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">{plan.description}</p>

                    <ul className="mt-6 space-y-3 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {plan.maxProducts >= 999999 ? 'Không giới hạn Sản phẩm' : `Tối đa ${plan.maxProducts} Sản phẩm`}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {plan.maxAdmins >= 999 ? 'Không giới hạn Admin' : `${plan.maxAdmins} Tài khoản Admin`}
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.hasCustomDomain ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300" />
                        )}
                        <span>Gắn Tên miền riêng (Custom Domain)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {plan.hasAiFeatures ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300" />
                        )}
                        <span>Tích hợp AI Báo giá & Chatbot</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setIsPlanModalOpen(true);
                    }}
                    className={`mt-8 w-full py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      plan.badge
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Chỉnh sửa Cấu hình
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: CÀI ĐẶT HỆ THỐNG (SYSTEM SETTINGS) --- */}
        {activeTab === 'settings' && (
          <div className="p-8 space-y-6 animate-fade-in max-w-4xl">
            {/* System Status Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                Hạ tầng Multi-Tenant & Bảo mật Supabase RLS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Database Row Level Security (RLS)</p>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5">Đang bật (Active Protected)</p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Tần suất Sao lưu Database</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">Tự động mỗi 6 giờ</p>
                  </div>
                  <button
                    onClick={handleTriggerBackup}
                    disabled={isBackingUp}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isBackingUp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                    <span>Sao lưu ngay</span>
                  </button>
                </div>
              </div>

              {/* Platform Controls */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Bật Chế độ Bảo trì Toàn Nền Tảng (Maintenance Mode)</p>
                    <p className="text-xs text-slate-500">Khi bật, tất cả Client Admin sẽ tạm dừng để nâng cấp hệ thống.</p>
                  </div>
                  <button
                    onClick={() => showToast('Đã cập nhật trạng thái bảo trì!')}
                    className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                  >
                    Tắt (Hoạt động bình thường)
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Domain Routing Wildcard SSL</p>
                    <p className="text-xs text-slate-500">Tự động cấp chứng chỉ SSL cho tất cả `*.fitallest.com` subdomains.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Đã cấu hình Wildcard
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL THÊM CỬA HÀNG MỚI (ADD TENANT MODAL) --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Khởi tạo Cửa hàng mới (Tenant)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTenant} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Cửa hàng / Công ty (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cửa Hàng Vật Tư Nam Sài Gòn"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subdomain mong muốn (*)</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="namsaigon"
                    value={newTenant.subdomain}
                    onChange={(e) => setNewTenant({ ...newTenant, subdomain: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-l-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-200 text-slate-500 font-mono rounded-r-xl">
                    .fitallest.com
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên chủ sở hữu</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={newTenant.ownerName}
                    onChange={(e) => setNewTenant({ ...newTenant, ownerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email đăng nhập</label>
                  <input
                    type="email"
                    placeholder="owner@namsaigon.vn"
                    value={newTenant.ownerEmail}
                    onChange={(e) => setNewTenant({ ...newTenant, ownerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn Gói cước ban đầu</label>
                <select
                  value={newTenant.plan}
                  onChange={(e) => setNewTenant({ ...newTenant, plan: e.target.value as Tenant['plan'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Starter">Starter (1.5 Triệu / tháng)</option>
                  <option value="Professional">Professional (4.5 Triệu / tháng)</option>
                  <option value="Enterprise">Enterprise (12.5 Triệu / tháng)</option>
                  <option value="Scale">Scale (28 Triệu / tháng)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  Tạo Cửa Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL SỬA CỬA HÀNG (EDIT TENANT MODAL) --- */}
      {isEditModalOpen && editingTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-400" />
                Chỉnh sửa Cửa hàng: {editingTenant.name}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateTenantSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Cửa hàng (*)</label>
                <input
                  type="text"
                  required
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subdomain (*)</label>
                <input
                  type="text"
                  required
                  value={editingTenant.subdomain}
                  onChange={(e) => setEditingTenant({ ...editingTenant, subdomain: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chủ sở hữu</label>
                  <input
                    type="text"
                    value={editingTenant.ownerName}
                    onChange={(e) => setEditingTenant({ ...editingTenant, ownerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingTenant.ownerEmail}
                    onChange={(e) => setEditingTenant({ ...editingTenant, ownerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gói cước</label>
                  <select
                    value={editingTenant.plan}
                    onChange={(e) =>
                      setEditingTenant({ ...editingTenant, plan: e.target.value as Tenant['plan'] })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Scale">Scale</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thanh toán</label>
                  <select
                    value={editingTenant.paymentStatus}
                    onChange={(e) =>
                      setEditingTenant({
                        ...editingTenant,
                        paymentStatus: e.target.value as Tenant['paymentStatus']
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Paid">Đã thanh toán (Paid)</option>
                    <option value="Overdue">Quá hạn phí (Overdue)</option>
                    <option value="Trialing">Dùng thử (Trialing)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CHỈNH SỬA GÓI CƯỚC (EDIT PLAN MODAL) --- */}
      {isPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                Cấu hình Gói cước: {editingPlan.name}
              </h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlanSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Giá cước (VNĐ / tháng)</label>
                <input
                  type="number"
                  required
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả gói</label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tối đa Sản phẩm</label>
                  <input
                    type="number"
                    value={editingPlan.maxProducts}
                    onChange={(e) => setEditingPlan({ ...editingPlan, maxProducts: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tối đa Admin Users</label>
                  <input
                    type="number"
                    value={editingPlan.maxAdmins}
                    onChange={(e) => setEditingPlan({ ...editingPlan, maxAdmins: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.hasCustomDomain}
                    onChange={(e) => setEditingPlan({ ...editingPlan, hasCustomDomain: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Cho phép Tên miền riêng (Custom Domain)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.hasAiFeatures}
                    onChange={(e) => setEditingPlan({ ...editingPlan, hasAiFeatures: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Tích hợp AI Báo giá & Chatbot</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
