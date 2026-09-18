"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import ArticleDetail from '@/src/components/ArticleDetail';

export default function ArticleSlugPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : undefined;
  return <ArticleDetail slug={slug} />;
}
