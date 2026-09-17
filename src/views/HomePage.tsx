
import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import StorefrontSections from '../components/StorefrontSections';
import ProjectsShowcase from '../components/ProjectsShowcase';
import AboutUs, { AboutCoreValuesAndCTA } from '../components/AboutUs';

export function HomePage() {
  return (
    <main className="flex-grow flex flex-col w-full">
      <Hero />
      <AboutUs showCoreValuesAndCTA={false} />
      <Categories />
      <StorefrontSections />
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsShowcase />
        <AboutCoreValuesAndCTA />
      </Suspense>
    </main>
  );
}
