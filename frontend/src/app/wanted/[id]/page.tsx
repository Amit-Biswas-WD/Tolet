'use client';

import React, { use, Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CompareBar } from '@/components/common/CompareBar';
import { Toast } from '@/components/common/Toast';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/constants';
import { INITIAL_WANTED } from '@/lib/data';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { ChevronRight, MessageSquare, ArrowLeft } from 'lucide-react';
import { LocationKey, PropertyTypeKey } from '@/types';

export default function WantedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#626D65]">লোড হচ্ছে...</div>}>
      <WantedDetailContent params={params} />
    </Suspense>
  );
}

function WantedDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, properties, showToast } = useApp();

  const w = INITIAL_WANTED.find((x) => x.id === id);

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  if (!w) {
    return (
      <>
        <Header />
        <main className="wrap py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('অনুরোধটি পাওয়া যায়নি', 'Request not found')}</h1>
          <Link href="/wanted" className="btn pri">
            {t('সব অনুরোধ দেখুন', 'View all requests')}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const locName = LOCATIONS[w.loc as LocationKey]
    ? lang === 'bn'
      ? LOCATIONS[w.loc as LocationKey][0]
      : LOCATIONS[w.loc as LocationKey][1]
    : w.loc;

  const typeName = PROPERTY_TYPES[w.type as PropertyTypeKey]
    ? lang === 'bn'
      ? PROPERTY_TYPES[w.type as PropertyTypeKey][0]
      : PROPERTY_TYPES[w.type as PropertyTypeKey][1]
    : w.type;

  const byName = lang === 'bn' ? w.by[0] : w.by[1];
  const note = lang === 'bn' ? w.note[0] : w.note[1];

  const matchingProps = properties
    .filter((p) => p.status === 'active' && p.loc === w.loc && p.type === w.type && p.rent <= w.max)
    .slice(0, 3);

  const rows = [
    [t('পছন্দের এলাকা', 'Preferred location'), `${locName}, ${t('ঢাকা', 'Dhaka')}`],
    [t('বাজেট', 'Budget'), `${formatCurrency(w.min, lang)} – ${formatCurrency(w.max, lang)} / ${t('মাস', 'month')}`],
    [t('ধরন', 'Property type'), typeName],
    [t('বেডরুম', 'Bedrooms'), w.beds ? formatNumber(w.beds, lang) : '—'],
    [t('ওঠার তারিখ', 'Move-in date'), formatDate(w.move, lang)],
  ];

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="wrap py-8 pb-20">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-[#626D65] mb-5">
            <Link href="/" className="hover:text-[#218363]">{t('হোম', 'Home')}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/wanted" className="hover:text-[#218363]">Wanted Properties</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#202923] font-medium">{locName}</span>
          </div>

          <div className="dgrid">
            {/* Left Content */}
            <div className="min-w-0">
              <div className="chips mb-3">
                <span className="badge info">{t('নমুনা অনুরোধ', 'Sample request')}</span>
                <span className="badge">{typeName}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
                {locName}, {t('ঢাকা', 'Dhaka')} —{' '}
                {w.beds ? `${formatNumber(w.beds, lang)} ${t('বেডরুম', 'bedroom')}` : typeName}
              </h1>

              {/* Facts Summary */}
              <div className="card flat mt-5 divide-y divide-[#E2E7E1] bg-[#F7F5EF]">
                {rows.map(([lbl, val], i) => (
                  <div key={i} className="flex justify-between items-center py-3 text-sm">
                    <span className="mut">{lbl}</span>
                    <strong className="text-right text-[#202923]">{val}</strong>
                  </div>
                ))}
              </div>

              {/* Additional Requirements */}
              <section className="dsec mt-8">
                <h2 className="text-xl font-bold mb-3">{t('অতিরিক্ত প্রয়োজন', 'Additional requirements')}</h2>
                <p className="mut text-base leading-relaxed max-w-xl">{note}</p>
              </section>

              {/* Matching Properties */}
              {matchingProps.length > 0 && (
                <section className="dsec mt-8 pt-6 border-t border-[#E2E7E1]">
                  <h2 className="text-xl font-bold mb-4">{t('মিলে যাওয়া নমুনা তালিকা', 'Matching sample listings')}</h2>
                  <div className="pgrid two">
                    {matchingProps.map((p) => (
                      <PropertyCard key={p.id} property={p} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Aside */}
            <aside className="stick">
              <div className="card sh grid gap-4 bg-white">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-[#E8F2EC] text-[#218363] grid place-items-center font-bold text-lg flex-none">
                    {byName.slice(0, 1)}
                  </span>
                  <div>
                    <strong className="block text-sm font-semibold text-[#202923]">{byName}</strong>
                    <div className="hint text-xs text-[#626D65]">{t('কাল্পনিক ভাড়াটিয়া', 'Fictional tenant')}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(t('যোগাযোগ ডেমো: বার্তা পাঠানো হয়নি', 'Contact demo: no message was sent'), 'info')}
                  className="btn pri block w-full flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('যোগাযোগ করুন (ডেমো)', 'Contact (demo)')}</span>
                </button>

                <Link
                  href="/wanted"
                  className="btn line block w-full flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('সব অনুরোধ', 'All requests')}</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <CompareBar />
      <Toast />
    </>
  );
}
