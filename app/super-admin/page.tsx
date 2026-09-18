"use client";

import { lazy, Suspense } from 'react';

const SuperAdminDashboard = lazy(() => import('../../src/components/SuperAdminDashboard'));

export default function SuperAdminPage() {
  return (
    <>
      <title>Super Admin Control Portal | Fi.tallest SaaS</title>
      <Suspense fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Đang tải Fi.tallest...</p>
        </div>
      }>
        <SuperAdminDashboard />
      </Suspense>
    </>
  );
}


