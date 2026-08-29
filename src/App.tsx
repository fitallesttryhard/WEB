import { CartProvider } from './contexts/CartContext';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FitallestNavbar } from './components/fitallest/Navbar';
import { FitallestFooter } from './components/fitallest/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { HostingPage } from './pages/HostingPage';
import { DomainPage } from './pages/DomainPage';
import { QuotePage } from './pages/QuotePage';
import { AiDesignPage } from './pages/AiDesignPage';
import { SeoPage } from './pages/SeoPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BlogPage } from './pages/BlogPage';
import { AdminProjectsPage } from './pages/AdminProjectsPage';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SeoAnalyticsInjector from './components/SeoAnalyticsInjector';

// Dynamic imports for Admin Core
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminLoginGate = lazy(() => import('./components/AdminLoginGate'));
const SuperAdminDashboard = lazy(() => import('./components/SuperAdminDashboard'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Đang tải Fi.tallest...</p>
    </div>
  );
}

function AdminArea() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <AdminLoginGate />;
  }
  return <AdminDashboard />;
}

export default function App() {
  useEffect(() => {
    // Auto-clear old cached SBUILD keys from browser localStorage
    ['admin_local_products', 'admin_local_categories', 'sbuild_user', 'sbuild_site_custom_settings', 'admin_local_media_gallery'].forEach(key => {
      localStorage.removeItem(key);
    });
  }, []);

  const [currentTab, setCurrentTab] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '').replace('#', '').split('?')[0];
      if (!hash || hash === 'home') {
        setCurrentTab('home');
        return;
      }
      if (hash === 'super-admin' || hash === 'superadmin') setCurrentTab('super-admin');
      else if (hash === 'admin') setCurrentTab('admin');
      else if (['home', 'services', 'hosting', 'domain', 'quote', 'ai-design', 'seo', 'projects', 'blog', 'posts', 'articles', 'article'].includes(hash)) {
        if (['posts', 'articles', 'article'].includes(hash)) {
          setCurrentTab('blog');
        } else {
          setCurrentTab(hash);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = tab;
    }
  };

  if (currentTab === 'super-admin') {
    return (
      <HelmetProvider>
        <Helmet>
          <title>Super Admin Control Portal | Fi.tallest SaaS</title>
        </Helmet>
        <Suspense fallback={<PageLoader />}>
          <SuperAdminDashboard />
        </Suspense>
      </HelmetProvider>
    );
  }

    if (currentTab === 'admin') {
    return (
      <HelmetProvider>
        <Helmet>
          <title>Quản trị hệ thống | Fi.tallest</title>
        </Helmet>
        <SettingsProvider>
          <SeoAnalyticsInjector />
          <AuthProvider>
            <CartProvider>
              <Suspense fallback={<PageLoader />}>
                <AdminArea />
              </Suspense>
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </HelmetProvider>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'services':
        return <ServicesPage setCurrentTab={changeTab} />;
      case 'hosting':
        return <HostingPage setCurrentTab={changeTab} />;
      case 'domain':
        return <DomainPage setCurrentTab={changeTab} />;
      case 'quote':
        return <QuotePage setCurrentTab={changeTab} />;
      case 'ai-design':
        return <AiDesignPage setCurrentTab={changeTab} />;
      case 'seo':
        return <SeoPage setCurrentTab={changeTab} />;
      case 'projects':
        return <ProjectsPage setCurrentTab={changeTab} />;
      case 'blog':
        return <BlogPage setCurrentTab={changeTab} />;
      case 'home':
      default:
        return <HomePage setCurrentTab={changeTab} />;
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Fi.tallest - Đỉnh Cao Công Nghệ Thiết Kế Website & Apps</title>
        <meta name="description" content="Fi.tallest kiến tạo các sản phẩm Website và Ứng dụng di động độc bản, tối ưu chuẩn UX/UI." />
      </Helmet>
      <SettingsProvider>
        <SeoAnalyticsInjector />
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#050A14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
            <FitallestNavbar currentTab={currentTab} setCurrentTab={changeTab} />
            <main className="flex-grow">
              {renderContent()}
            </main>
            <FitallestFooter setCurrentTab={changeTab} />
          </div>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}
