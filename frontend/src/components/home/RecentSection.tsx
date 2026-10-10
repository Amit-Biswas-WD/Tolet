'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ArrowRight } from 'lucide-react';

export function RecentSection() {
  const { lang, properties } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const recent = properties
    .filter((p) => !p.feat && p.status === 'active')
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  return (
    <section className="sec alt">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <h2>{t('সম্প্রতি যোগ হয়েছে', 'Recently added')}</h2>
            <p>{t('সবচেয়ে নতুন নমুনা তালিকাগুলো।', 'The newest sample listings.')}</p>
          </div>
          <Link href="/properties?sort=new" className="link">
            <span>{t('নতুনগুলো দেখুন', 'See newest')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pgrid">
          {recent.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
