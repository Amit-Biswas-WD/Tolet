'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CompareBar } from '@/components/common/CompareBar';
import { Toast } from '@/components/common/Toast';
import { Hero } from '@/components/home/Hero';
import { CategorySection } from '@/components/home/CategorySection';
import { LocationsSection } from '@/components/home/LocationsSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { RecentSection } from '@/components/home/RecentSection';
import { VerificationSection } from '@/components/home/VerificationSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TenantFeaturesSection } from '@/components/home/TenantFeaturesSection';
import { LandlordCtaSection } from '@/components/home/LandlordCtaSection';
import { SafetyTipsSection } from '@/components/home/SafetyTipsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { BottomCtaSection } from '@/components/home/BottomCtaSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <CategorySection />
        <LocationsSection />
        <FeaturedSection />
        <RecentSection />
        <VerificationSection />
        <HowItWorksSection />
        <TenantFeaturesSection />
        <LandlordCtaSection />
        <SafetyTipsSection />
        <FaqSection />
        <BottomCtaSection />
      </main>
      <Footer />
      <CompareBar />
      <Toast />
    </>
  );
}
