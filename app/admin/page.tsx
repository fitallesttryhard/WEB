"use client";

import { lazy, Suspense } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';

const AdminDashboard = lazy(() => import('../../src/components/AdminDashboard'));
const AdminLoginGate = lazy(() => import('../../src/components/AdminLoginGate'));

function AdminArea() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <AdminLoginGate />;
  }
  return <AdminDashboard />;
}

export default function AdminPage() {
  return (
    <>
      <title>Quản trị hệ thống | Fi.tallest</title>
      <Suspense fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Đang tải Fi.tallest...</p>
        </div>
      }>
        <AdminArea />
      </Suspense>
    </>
  );
}


