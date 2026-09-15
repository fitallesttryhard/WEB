
"use client";
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLoginGate from '../components/AdminLoginGate';
import AdminDashboard from '../components/AdminDashboard';

export function AdminArea() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <AdminLoginGate />;
  }
  return <AdminDashboard />;
}
