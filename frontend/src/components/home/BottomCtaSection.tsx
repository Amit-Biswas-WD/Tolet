'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Search } from 'lucide-react';

export function BottomCtaSection() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  return (
    <section className="sec pt-0">
      <div className="wrap">
        <div className="cta">
          <h2>{t('আজই আপনার পছন্দের বাসা খুঁজুন', 'Start finding your home today')}</h2>
          <p>
            {t(
              'ভাড়াটিয়া হিসেবে বাসা খুঁজুন, অথবা বাড়িওয়ালা হিসেবে আপনার বাসার তালিকা তৈরি করুন।',
              'Search as a tenant, or create a listing as a landlord.'
            )}
          </p>

          <div className="chips justify-center mt-2">
            <Link href="/properties" className="btn white lg inline-flex gap-2">
              <Search className="w-[18px] h-[18px]" />
              <span>{t('বাসা খুঁজুন', 'Find a home')}</span>
            </Link>
            <Link
              href="/rent-out"
              className="btn lg inline-flex"
              style={{ background: 'rgba(255, 255, 255, 0.14)', color: '#ffffff' }}
            >
              <span>{t('বাসা ভাড়া দিন', 'List your property')}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
