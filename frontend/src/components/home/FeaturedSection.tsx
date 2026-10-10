'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ArrowRight } from 'lucide-react';

export function FeaturedSection() {
  const { lang, properties } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const featured = properties.filter((p) => p.feat && p.status === 'active').slice(0, 6);

  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <h2>{t('ফিচারড বাসা', 'Featured properties')}</h2>
            <p>
              {t(
                'নমুনা তালিকা: এগুলো ডেমো তথ্য, বাস্তব বাসা নয়।',
                'Sample listings: demonstration data, not real homes.'
              )}
            </p>
          </div>
          <Link href="/properties" className="link">
            <span>{t('সব দেখুন', 'View all')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pgrid">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
