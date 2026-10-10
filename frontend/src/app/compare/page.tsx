'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES, AMENITIES, CONDITIONS, FURNISHING } from '@/lib/constants';
import { getArt } from '@/lib/art';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { Scale, Search, X } from 'lucide-react';
import { LocationKey, PropertyTypeKey } from '@/types';

export default function ComparePage() {
  const { lang, comparison, toggleComparison, clearComparison, properties } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const comparedList = properties.filter((p) => comparison.includes(p.id));

  const rows = [
    {
      label: t('মাসিক ভাড়া', 'Monthly rent'),
      render: (p: (typeof properties)[0]) => (
        <strong className="text-base font-bold text-[#202923]">{formatCurrency(p.rent, lang)}</strong>
      ),
    },
    {
      label: t('এলাকা', 'Location'),
      render: (p: (typeof properties)[0]) => {
        const loc = LOCATIONS[p.loc as LocationKey]
          ? lang === 'bn'
            ? LOCATIONS[p.loc as LocationKey][0]
            : LOCATIONS[p.loc as LocationKey][1]
          : p.loc;
        const sub = lang === 'bn' ? p.sub[0] : p.sub[1];
        return `${sub}, ${loc}`;
      },
    },
    {
      label: t('ধরন', 'Type'),
      render: (p: (typeof properties)[0]) =>
        PROPERTY_TYPES[p.type]
          ? lang === 'bn'
            ? PROPERTY_TYPES[p.type][0]
            : PROPERTY_TYPES[p.type][1]
          : p.type,
    },
    {
      label: t('বেডরুম', 'Bedrooms'),
      render: (p: (typeof properties)[0]) => (p.beds ? `${formatNumber(p.beds, lang)} ${t('বেড', 'bed')}` : '—'),
    },
    {
      label: t('বাথরুম', 'Bathrooms'),
      render: (p: (typeof properties)[0]) => `${formatNumber(p.baths, lang)} ${t('বাথ', 'bath')}`,
    },
    {
      label: t('আয়তন', 'Area'),
      render: (p: (typeof properties)[0]) => `${formatNumber(p.sqft, lang)} ${t('বর্গফুট', 'sq ft')}`,
    },
    {
      label: t('ফার্নিশিং', 'Furnishing'),
      render: (p: (typeof properties)[0]) =>
        FURNISHING[p.furn] ? t(FURNISHING[p.furn][0], FURNISHING[p.furn][1]) : p.furn,
    },
    {
      label: t('অগ্রিম', 'Advance'),
      render: (p: (typeof properties)[0]) => `${formatNumber(p.adv, lang)} ${t('মাস', 'months')}`,
    },
    {
      label: t('প্রাপ্যতা', 'Availability'),
      render: (p: (typeof properties)[0]) =>
        p.avail === 'now' ? t('এখনই খালি', 'Available now') : formatDate(p.avail, lang),
    },
    {
      label: t('সুবিধা', 'Amenities'),
      render: (p: (typeof properties)[0]) =>
        p.amen
          .map((a) => (AMENITIES[a] ? (lang === 'bn' ? AMENITIES[a][0] : AMENITIES[a][1]) : a))
          .join(', ') || '—',
    },
    {
      label: t('ভাড়ার শর্ত', 'Conditions'),
      render: (p: (typeof properties)[0]) =>
        p.cond
          .map((c) => (CONDITIONS[c] ? (lang === 'bn' ? CONDITIONS[c][0] : CONDITIONS[c][1]) : c))
          .join(', ') || '—',
    },
  ];

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="wrap py-10 pb-20">
          {/* Header */}
          <div className="sec-h">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
                {t('বাসা তুলনা', 'Compare homes')}
              </h1>
              <p className="mut text-sm mt-1">
                {t('সর্বোচ্চ তিনটি বাসা পাশাপাশি দেখুন।', 'Compare up to three homes side by side.')}
              </p>
            </div>
            {comparedList.length > 0 && (
              <button
                type="button"
                onClick={clearComparison}
                className="btn line sm"
              >
                {t('সব মুছুন', 'Clear all')}
              </button>
            )}
          </div>

          {/* Table or Empty */}
          {comparedList.length > 0 ? (
            <div>
              <div className="tw border border-[#E2E7E1] rounded-2xl overflow-x-auto shadow-sm">
                <table className="t min-w-[720px] w-full text-sm">
                  <thead>
                    <tr>
                      <th scope="col" className="sticky left-0 bg-[#F7F5EF] min-w-[150px] z-10"></th>
                      {comparedList.map((p) => {
                        const title = lang === 'bn' ? p.title[0] : p.title[1];
                        const img = p.imgs && p.imgs[0] ? p.imgs[0] : getArt(p.seed, 'ext');
                        return (
                          <th
                            key={p.id}
                            scope="col"
                            className="p-4 align-top min-w-[240px] text-left font-normal bg-white"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full aspect-[16/10] object-cover rounded-xl mb-3 border border-[#E2E7E1]"
                            />
                            <div className="font-bold text-[#202923] text-sm leading-snug line-clamp-2">
                              {title}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Link href={`/properties/${p.id}`} className="btn line sm">
                                {t('বিস্তারিত', 'Details')}
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleComparison(p.id)}
                                className="btn ghost sm text-[#626D65] hover:text-[#B3261E]"
                                aria-label="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7E1]">
                    {rows.map((r, i) => (
                      <tr key={i} className="hover:bg-[#F7F5EF]/60">
                        <td className="sticky left-0 bg-[#F7F5EF] font-semibold text-xs text-[#626D65] uppercase tracking-wider p-3.5 z-10 border-r border-[#E2E7E1]">
                          {r.label}
                        </td>
                        {comparedList.map((p) => (
                          <td key={p.id} className="p-3.5 text-sm text-[#202923] align-top">
                            {r.render(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {comparedList.length < 3 && (
                <p className="hint text-xs text-[#626D65] mt-3">
                  {t('আরও ', 'Add ')}
                  {formatNumber(3 - comparedList.length, lang)}
                  {t(' টি বাসা যোগ করতে পারেন।', ' more to compare.')}
                </p>
              )}
            </div>
          ) : (
            <div className="card p-14 text-center flex flex-col items-center justify-center gap-3 bg-[#F7F5EF] border-dashed border-[#E2E7E1] rounded-2xl max-w-lg mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F2EC] text-[#218363] grid place-items-center">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-[#202923]">
                {t('তুলনার জন্য কোনো বাসা নেই', 'Nothing to compare')}
              </h3>
              <p className="mut text-sm max-w-sm">
                {t(
                  'বাসার কার্ডে “তুলনা” টিক দিয়ে সর্বোচ্চ তিনটি বাসা বেছে নিন।',
                  'Tick “Compare” on up to three property cards.'
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
      <Toast />
    </>
  );
}
