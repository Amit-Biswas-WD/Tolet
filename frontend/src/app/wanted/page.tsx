'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CompareBar } from '@/components/common/CompareBar';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/constants';
import { INITIAL_WANTED } from '@/lib/data';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { Plus, Search, Calendar, ChevronRight } from 'lucide-react';
import { LocationKey, PropertyTypeKey, WantedProperty } from '@/types';

export function WantedCard({ w }: { w: WantedProperty }) {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

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

  return (
    <article className="card flat flex flex-col gap-3 hover:border-[#176B52] transition-colors">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <span className="tag">{typeName}</span>
        {w.mine ? (
          <span className="badge info">{t('আপনার অনুরোধ', 'Your request')}</span>
        ) : (
          <span className="badge">{t('নমুনা', 'Sample')}</span>
        )}
      </div>

      <h3 className="text-base font-bold text-[#202923]">
        {locName}, {t('ঢাকা', 'Dhaka')} — {w.beds ? `${formatNumber(w.beds, lang)} ${t('বেডরুম', 'bedroom')}` : typeName}
      </h3>

      <div className="price">
        <strong className="num text-lg font-bold text-[#202923]">
          {formatCurrency(w.min, lang)} – {formatCurrency(w.max, lang)}
        </strong>{' '}
        <span className="text-xs text-[#626D65]">/{t('মাস', 'month')}</span>
      </div>

      <p className="mut text-sm line-clamp-2 leading-relaxed">{note}</p>

      <div className="pc-f pt-3 border-t border-[#E2E7E1] mt-auto">
        <span className="loct text-xs">
          <Calendar className="w-3.5 h-3.5 text-[#626D65]" />
          <span>{t('ওঠার তারিখ', 'Move-in')}: {formatDate(w.move, lang)}</span>
        </span>
        <Link href={`/wanted/${w.id}`} className="btn line sm">
          {t('বিস্তারিত', 'Details')}
        </Link>
      </div>
    </article>
  );
}

export default function WantedPage() {
  const { lang } = useApp();
  const [wantedList, setWantedList] = useState<WantedProperty[]>(INITIAL_WANTED);
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [type, setType] = useState('');
  const [max, setMax] = useState('');

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const filtered = useMemo(() => {
    return wantedList.filter((w) => {
      if (w.status !== 'active') return false;
      if (loc && w.loc !== loc) return false;
      if (type && w.type !== type) return false;
      if (max && w.min > Number(max)) return false;
      if (q) {
        const hay = [w.note[0], w.note[1], w.by[0], w.by[1]].join(' ').toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [wantedList, loc, type, max, q]);

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        {/* Page Head */}
        <div className="ph py-8 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">Wanted Properties</h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'ভাড়াটিয়ারা কী খুঁজছেন তা দেখুন, অথবা নিজের প্রয়োজন জানিয়ে অনুরোধ প্রকাশ করুন। সব উদাহরণ কাল্পনিক।',
                'See what tenants are looking for, or post your own requirements. All examples are fictional.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-8 pb-20">
          {/* Tool bar: search & filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <input
                  type="search"
                  className="in pl-9 !min-h-[42px] !h-[42px] text-sm"
                  placeholder={t('কীওয়ার্ড লিখে খুঁজুন', 'Keyword search')}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <Search className="w-4 h-4 text-[#626D65] absolute left-3 top-3.5" />
              </div>

              <select
                className="in !min-h-[42px] !h-[42px] text-sm w-auto cursor-pointer"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
              >
                <option value="">{t('সব এলাকা', 'All areas')}</option>
                {(Object.keys(LOCATIONS) as LocationKey[]).map((k) => (
                  <option key={k} value={k}>{t(LOCATIONS[k][0], LOCATIONS[k][1])}</option>
                ))}
              </select>

              <select
                className="in !min-h-[42px] !h-[42px] text-sm w-auto cursor-pointer"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">{t('সব ধরন', 'All types')}</option>
                {(Object.keys(PROPERTY_TYPES) as PropertyTypeKey[]).map((k) => (
                  <option key={k} value={k}>{t(PROPERTY_TYPES[k][0], PROPERTY_TYPES[k][1])}</option>
                ))}
              </select>

              <input
                type="number"
                className="in !min-h-[42px] !h-[42px] text-sm w-32"
                placeholder={t('বাজেট ৳', 'Budget ৳')}
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>

            <Link href="/wanted/new" className="btn pri inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>{t('অনুরোধ প্রকাশ করুন', 'Post a request')}</span>
            </Link>
          </div>

          <p className="mut text-sm mb-4">
            <strong className="num text-[#202923] font-bold">{formatNumber(filtered.length, lang)}</strong>{' '}
            {t('টি অনুরোধ', 'requests')}
          </p>

          {/* Cards Grid or Empty */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((w) => (
                <WantedCard key={w.id} w={w} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center flex flex-col items-center justify-center gap-3 bg-[#F7F5EF] border-dashed border-[#E2E7E1] rounded-2xl max-w-md mx-auto my-6">
              <div className="w-12 h-12 rounded-xl bg-[#E8F2EC] text-[#218363] grid place-items-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#202923]">
                {t('কোনো অনুরোধ পাওয়া যায়নি', 'No requests found')}
              </h3>
              <p className="mut text-xs max-w-xs">
                {t('ফিল্টার বদলে আবার চেষ্টা করুন।', 'Change the filters and try again.')}
              </p>
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
