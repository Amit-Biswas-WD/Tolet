'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PROPERTY_TYPES } from '@/lib/constants';
import { PropertyTypeKey } from '@/types';
import { formatNumber } from '@/lib/utils';
import { Home, User, Users, Bed, Layers, Briefcase } from 'lucide-react';

export function CategorySection() {
  const { lang, properties } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const renderIcon = (key: PropertyTypeKey) => {
    switch (key) {
      case 'family': return <Home className="w-6 h-6 text-[#176B52]" />;
      case 'bachelor': return <User className="w-6 h-6 text-[#176B52]" />;
      case 'sublet': return <Users className="w-6 h-6 text-[#176B52]" />;
      case 'room': return <Bed className="w-6 h-6 text-[#176B52]" />;
      case 'studio': return <Layers className="w-6 h-6 text-[#176B52]" />;
      case 'office': return <Briefcase className="w-6 h-6 text-[#176B52]" />;
      default: return <Home className="w-6 h-6 text-[#176B52]" />;
    }
  };

  const getCount = (k: PropertyTypeKey) => {
    return properties.filter((p) => p.type === k && p.status === 'active').length;
  };

  return (
    <section className="sec pt-14">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <h2>{t('আপনার প্রয়োজন অনুযায়ী ক্যাটাগরি', 'Browse by category')}</h2>
            <p>
              {t(
                'পরিবার, ব্যাচেলর, শিক্ষার্থী বা অফিসের জন্য উপযুক্ত বাসা বেছে নিন।',
                'Pick the kind of space that suits families, bachelors, students or small offices.'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.keys(PROPERTY_TYPES) as PropertyTypeKey[]).map((k) => (
            <Link
              key={k}
              href={`/properties?type=${k}`}
              className="cat"
            >
              <div className="ci">{renderIcon(k)}</div>
              <strong>{t(PROPERTY_TYPES[k][0], PROPERTY_TYPES[k][1])}</strong>
              <span>
                {formatNumber(getCount(k), lang)}{' '}
                {t('টি নমুনা তালিকা', 'sample listings')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
