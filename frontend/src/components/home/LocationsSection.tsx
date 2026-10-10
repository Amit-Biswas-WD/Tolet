'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { LOCATIONS } from '@/lib/constants';
import { LocationKey } from '@/types';
import { getArt } from '@/lib/art';
import { formatNumber } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function LocationsSection() {
  const { lang, properties } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const getLocCount = (k: LocationKey) => {
    return properties.filter((p) => p.loc === k && p.status === 'active').length;
  };

  const locKeys = Object.keys(LOCATIONS) as LocationKey[];

  return (
    <section className="sec alt">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <h2>{t('জনপ্রিয় এলাকা', 'Popular locations')}</h2>
            <p>
              {t(
                'ঢাকার ব্যস্ত ও জনপ্রিয় আবাসিক এলাকাগুলো ঘুরে দেখুন।',
                'Explore busy, popular residential areas across Dhaka.'
              )}
            </p>
          </div>
        </div>

        <div className="locs">
          {locKeys.map((k, i) => (
            <Link
              key={k}
              href={`/properties?loc=${k}`}
              className="loc"
              aria-label={`${t(LOCATIONS[k][0], LOCATIONS[k][1])} listings`}
            >
              <img
                src={getArt(300 + i * 17, 'ext')}
                alt=""
                loading="lazy"
                width={800}
                height={600}
              />
              <div>
                <span>
                  <strong>{lang === 'bn' ? LOCATIONS[k][0] : LOCATIONS[k][1]}</strong>
                  <small>
                    {lang === 'bn' ? LOCATIONS[k][1] : LOCATIONS[k][0]} ·{' '}
                    {formatNumber(getLocCount(k), lang)} {t('টি তালিকা', 'listings')}
                  </small>
                </span>
                <span className="go">
                  <ArrowRight className="w-[18px] h-[18px]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
