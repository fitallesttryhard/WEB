"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from '@/src/components/ProductDetail';

export default function ProductSlugPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : undefined;
  return <ProductDetail slug={slug} />;
}
