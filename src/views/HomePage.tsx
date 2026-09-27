
import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import StorefrontSections from '../components/StorefrontSections';
import KnowledgeShowcase from '../components/KnowledgeShowcase';
import AboutUs, { AboutCoreValuesAndCTA } from '../components/AboutUs';

export function HomePage() {
  return (
    <main className="flex-grow flex flex-col w-full">
      <Hero />
      <AboutUs showCoreValuesAndCTA={false} />
      <Categories />
      <StorefrontSections />
      <Suspense fallback={<div>Loading...</div>}>
        <KnowledgeShowcase />
        <AboutCoreValuesAndCTA />
      </Suspense>
    </main>
  );
}
