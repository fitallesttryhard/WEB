"use client";

import { FitallestNavbar } from '../../src/components/fitallest/Navbar';
import { FitallestFooter } from '../../src/components/fitallest/Footer';
import FloatingWidgets from '../../src/components/FloatingWidgets';
import CartDrawer from '../../src/components/CartDrawer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FitallestNavbar />
      <main className="flex-grow pb-16 sm:pb-0">
        {children}
      </main>
      <FitallestFooter />
      <FloatingWidgets onOpenCatalogModal={() => {
        if (typeof window !== 'undefined') window.location.href = '/quote';
      }} />
      <CartDrawer />
    </>
  );
}



