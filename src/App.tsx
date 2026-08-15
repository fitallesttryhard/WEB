/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Categories from './components/Categories';
import StorefrontSections from './components/StorefrontSections';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginGate from './components/AdminLoginGate';
import ProductDetail from './components/ProductDetail';
import ContactUs from './components/ContactUs';
import Products from './components/Products';
import BlogList from './components/BlogList';
import ArticleDetail from './components/ArticleDetail';
import ProjectsShowcase from './components/ProjectsShowcase';
import FloatingWidgets from './components/FloatingWidgets';
import CatalogDownloadModal from './components/CatalogDownloadModal';
import { CartProvider } from './contexts/CartContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CartDrawer from './components/CartDrawer';

function AdminArea() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <AdminLoginGate />;
  }
  return <AdminDashboard />;
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '').split('?')[0];
      if (hash === '#admin') setCurrentView('admin');
      else if (hash === '#product') setCurrentView('product');
      else if (hash === '#contact') setCurrentView('contact');
      else if (hash === '#products') setCurrentView('products');
      else if (hash === '#blog') setCurrentView('blog');
      else if (hash === '#article') setCurrentView('article');
      else if (hash === '#projects') setCurrentView('projects');
      else setCurrentView('home');
    };
    handleHashChange(); // check on initial load
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Cuộn lên đầu trang mỗi khi chuyển trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (currentView === 'admin') {
    return (
      <HelmetProvider>
        <Helmet>
          <title>Quản trị hệ thống | Sbuild</title>
          <meta name="description" content="Hệ thống quản trị nội dung và sản phẩm Sbuild." />
        </Helmet>
        <SettingsProvider>
          <AuthProvider>
            <AdminArea />
          </AuthProvider>
        </SettingsProvider>
      </HelmetProvider>
    );
  }

  const PageLayout = ({ children, title, description, keywords = '' }: any) => (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
      </Helmet>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-red-200 selection:text-red-900 overflow-x-hidden">
              <Navbar />
              {children}
              <Footer />
              <CartDrawer />
              <FloatingWidgets onOpenCatalogModal={() => setIsCatalogModalOpen(true)} />
              <CatalogDownloadModal 
                isOpen={isCatalogModalOpen} 
                onClose={() => setIsCatalogModalOpen(false)} 
              />
            </div>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );

  if (currentView === 'product') {
    return (
      <PageLayout title="Chi tiết sản phẩm | Sbuild" description="Chi tiết sản phẩm">
        <ProductDetail />
      </PageLayout>
    );
  }

  if (currentView === 'contact') {
    return (
      <PageLayout title="Liên hệ | Sbuild" description="Liên hệ với Sbuild để được tư vấn và báo giá chi tiết.">
        <ContactUs />
      </PageLayout>
    );
  }

  if (currentView === 'products') {
    return (
      <PageLayout title="Sản phẩm | Sbuild" description="Danh sách các sản phẩm vật tư xây dựng cao cấp từ Sbuild.">
        <Products />
      </PageLayout>
    );
  }

  if (currentView === 'blog') {
    return (
      <PageLayout title="Tin tức & Sự kiện | Sbuild" description="Tin tức kiến trúc, kinh nghiệm xây dựng và cập nhật mới nhất từ Sbuild.">
        <BlogList />
      </PageLayout>
    );
  }

  if (currentView === 'article') {
    return (
      <PageLayout title="Chi tiết bài viết | Sbuild" description="Chi tiết bài viết tin tức Sbuild">
        <ArticleDetail />
      </PageLayout>
    );
  }

  if (currentView === 'projects') {
    return (
      <PageLayout title="Dự án tiêu biểu | Sbuild" description="Danh sách các công trình dự án lớn đã sử dụng giải pháp nẹp và vật tư Sbuild.">
        <div className="pt-20">
          <ProjectsShowcase />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Sbuild - Giải Pháp Vật Tư Xây Dựng Toàn Diện"
      description="Chuyên cung cấp vật tư xây dựng, phụ kiện giàn giáo, băng cản nước và nẹp trang trí chất lượng cao."
      keywords="vật tư xây dựng, phụ kiện giàn giáo, nẹp nhôm, nẹp inox, nẹp nhựa, băng cản nước"
    >
      <main className="flex-grow flex flex-col w-full">
        <Hero />
        <Categories />
        <StorefrontSections />
        <ProjectsShowcase />
        <AboutUs />
      </main>
    </PageLayout>
  );
}
