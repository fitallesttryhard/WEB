"use client";
import React, { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import CartDrawer from '@/src/components/CartDrawer';
import FloatingWidgets from '@/src/components/FloatingWidgets';
import CatalogDownloadModal from '@/src/components/CatalogDownloadModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-red-200 selection:text-red-900 overflow-x-clip">
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWidgets onOpenCatalogModal={() => setIsCatalogModalOpen(true)} />
      <CatalogDownloadModal 
        isOpen={isCatalogModalOpen} 
        onClose={() => setIsCatalogModalOpen(false)} 
      />
    </div>
  );
}
