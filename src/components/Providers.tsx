"use client";

import { SettingsProvider } from '../contexts/SettingsContext';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import SeoAnalyticsInjector from './SeoAnalyticsInjector';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <SeoAnalyticsInjector />
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

