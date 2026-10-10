'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CompareBar } from '@/components/common/CompareBar';
import { Toast } from '@/components/common/Toast';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useApp } from '@/context/AppContext';
import { Heart, Search } from 'lucide-react';

export default function FavoritesPage() {
  const { lang, favorites, clearFavorites, properties } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const savedList = properties.filter((p) => favorites.includes(p.id));

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="wrap py-10 pb-20">
          {/* Header */}
          <div className="sec-h">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
                {t('সংরক্ষিত বাসা', 'Saved homes')}
              </h1>
              <p className="mut text-sm mt-1">
                {t(
                  'আপনার পছন্দের তালিকা এই ব্রাউজারে সংরক্ষিত থাকে।',
                  'Your saved list is kept in this browser.'
                )}
              </p>
            </div>
            {savedList.length > 0 && (
              <button
                type="button"
                onClick={clearFavorites}
                className="btn line sm"
              >
                {t('সব বাদ দিন', 'Remove all')}
              </button>
            )}
          </div>

          {/* Properties or Empty State */}
          {savedList.length > 0 ? (
            <div className="pgrid">
              {savedList.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="card p-14 text-center flex flex-col items-center justify-center gap-3 bg-[#F7F5EF] border-dashed border-[#E2E7E1] rounded-2xl max-w-lg mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F2EC] text-[#218363] grid place-items-center">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-[#202923]">
                {t('এখনো কিছু সংরক্ষণ করা হয়নি', 'Nothing saved yet')}
              </h3>
              <p className="mut text-sm max-w-sm">
                {t(
                  'যেকোনো বাসার হৃদয় আইকনে ক্লিক করে পছন্দের তালিকায় রাখুন।',
                  'Tap the heart icon on any home to keep it here.'
                )}
              </p>
              <Link href="/properties" className="btn pri mt-2 inline-flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>{t('বাসা খুঁজুন', 'Find a home')}</span>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CompareBar />
      <Toast />
    </>
  );
}
