'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CompareBar } from '@/components/common/CompareBar';
import { Toast } from '@/components/common/Toast';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES, FURNISHING } from '@/lib/constants';
import { formatNumber, formatCurrency } from '@/lib/utils';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  X,
  Building,
} from 'lucide-react';
import { LocationKey, PropertyTypeKey } from '@/types';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const { lang, properties } = useApp();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [loc, setLoc] = useState(searchParams.get('loc') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [min, setMin] = useState(searchParams.get('min') || '');
  const [max, setMax] = useState(searchParams.get('max') || '');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [area, setArea] = useState('');
  const [furn, setFurn] = useState('');
  const [avail, setAvail] = useState('');
  const [sort, setSort] = useState<'new' | 'low' | 'high'>('new');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  // Filtered and sorted properties
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    const result = properties.filter((p) => {
      if (p.status !== 'active') return false;
      if (loc && p.loc !== loc) return false;
      if (type && p.type !== type) return false;
      if (min && p.rent < Number(min)) return false;
      if (max && p.rent > Number(max)) return false;
      if (beds) {
        if (beds === '4' ? p.beds < 4 : p.beds !== Number(beds)) return false;
      }
      if (baths && p.baths < Number(baths)) return false;
      if (area && p.sqft < Number(area)) return false;
      if (furn && p.furn !== furn) return false;
      if (avail === 'now' && p.avail !== 'now') return false;
      if (avail === 'soon' && (p.avail === 'now' || p.avail > '2026-11-10')) return false;

      if (qLower) {
        const text = [
          p.title[0],
          p.title[1],
          p.sub[0],
          p.sub[1],
          LOCATIONS[p.loc as LocationKey] ? LOCATIONS[p.loc as LocationKey][0] : '',
          LOCATIONS[p.loc as LocationKey] ? LOCATIONS[p.loc as LocationKey][1] : '',
          PROPERTY_TYPES[p.type] ? PROPERTY_TYPES[p.type][0] : '',
          PROPERTY_TYPES[p.type] ? PROPERTY_TYPES[p.type][1] : '',
        ]
          .join(' ')
          .toLowerCase();
        if (!text.includes(qLower)) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sort === 'low') return a.rent - b.rent;
      if (sort === 'high') return b.rent - a.rent;
      return a.days - b.days;
    });

    return result;
  }, [properties, loc, type, min, max, beds, baths, area, furn, avail, q, sort]);

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const clearAllFilters = () => {
    setQ('');
    setLoc('');
    setType('');
    setMin('');
    setMax('');
    setBeds('');
    setBaths('');
    setArea('');
    setFurn('');
    setAvail('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    q || loc || type || min || max || beds || baths || area || furn || avail
  );

  const filterPanel = (prefix: string = '') => (
    <div className="card flat flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{t('ফিল্টার', 'Filters')}</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="link text-xs font-semibold text-[#218363]"
          >
            {t('সব মুছুন', 'Clear all')}
          </button>
        )}
      </div>

      {/* Location */}
      <div className="fld">
        <label htmlFor={`${prefix}loc`}>{t('এলাকা', 'Location')}</label>
        <select
          id={`${prefix}loc`}
          className="in"
          value={loc}
          onChange={(e) => {
            setLoc(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('সব এলাকা', 'All areas')}</option>
          {(Object.keys(LOCATIONS) as LocationKey[]).map((k) => (
            <option key={k} value={k}>
              {t(LOCATIONS[k][0], LOCATIONS[k][1])}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="fld">
        <label htmlFor={`${prefix}type`}>{t('বাসার ধরন', 'Property type')}</label>
        <select
          id={`${prefix}type`}
          className="in"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('সব ধরন', 'All types')}</option>
          {(Object.keys(PROPERTY_TYPES) as PropertyTypeKey[]).map((k) => (
            <option key={k} value={k}>
              {t(PROPERTY_TYPES[k][0], PROPERTY_TYPES[k][1])}
            </option>
          ))}
        </select>
      </div>

      {/* Min / Max Rent */}
      <div className="grid2 gap-2.5">
        <div className="fld">
          <label htmlFor={`${prefix}min`}>{t('সর্বনিম্ন ৳', 'Min ৳')}</label>
          <input
            id={`${prefix}min`}
            type="number"
            min="0"
            step="500"
            inputMode="numeric"
            className="in"
            placeholder="5000"
            value={min}
            onChange={(e) => {
              setMin(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="fld">
          <label htmlFor={`${prefix}max`}>{t('সর্বোচ্চ ৳', 'Max ৳')}</label>
          <input
            id={`${prefix}max`}
            type="number"
            min="0"
            step="500"
            inputMode="numeric"
            className="in"
            placeholder="40000"
            value={max}
            onChange={(e) => {
              setMax(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="fld">
        <label htmlFor={`${prefix}beds`}>{t('বেডরুম', 'Bedrooms')}</label>
        <select
          id={`${prefix}beds`}
          className="in"
          value={beds}
          onChange={(e) => {
            setBeds(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('যেকোনো', 'Any')}</option>
          <option value="1">১ {t('বেড', 'bed')}</option>
          <option value="2">২ {t('বেড', 'beds')}</option>
          <option value="3">৩ {t('বেড', 'beds')}</option>
          <option value="4">৪+ {t('বেড', 'beds')}</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="fld">
        <label htmlFor={`${prefix}baths`}>{t('বাথরুম (ন্যূনতম)', 'Bathrooms (min)')}</label>
        <select
          id={`${prefix}baths`}
          className="in"
          value={baths}
          onChange={(e) => {
            setBaths(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('যেকোনো', 'Any')}</option>
          <option value="1">১+</option>
          <option value="2">২+</option>
          <option value="3">৩+</option>
        </select>
      </div>

      {/* Min Area */}
      <div className="fld">
        <label htmlFor={`${prefix}area`}>{t('ন্যূনতম আয়তন (বর্গফুট)', 'Min area (sq ft)')}</label>
        <input
          id={`${prefix}area`}
          type="number"
          min="0"
          step="50"
          inputMode="numeric"
          className="in"
          placeholder="800"
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Furnishing */}
      <div className="fld">
        <label htmlFor={`${prefix}furn`}>{t('ফার্নিশিং', 'Furnishing')}</label>
        <select
          id={`${prefix}furn`}
          className="in"
          value={furn}
          onChange={(e) => {
            setFurn(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('যেকোনো', 'Any')}</option>
          {Object.keys(FURNISHING).map((k) => (
            <option key={k} value={k}>
              {t(FURNISHING[k][0], FURNISHING[k][1])}
            </option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div className="fld">
        <label htmlFor={`${prefix}avail`}>{t('প্রাপ্যতা', 'Availability')}</label>
        <select
          id={`${prefix}avail`}
          className="in"
          value={avail}
          onChange={(e) => {
            setAvail(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('যেকোনো', 'Any')}</option>
          <option value="now">{t('এখনই খালি', 'Available now')}</option>
          <option value="soon">{t('৩০ দিনের মধ্যে', 'Within 30 days')}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="wrap">
      {/* Header breadcrumbs and title */}
      <div className="py-7">
        <div className="flex items-center gap-1.5 text-xs text-[#626D65] mb-3">
          <Link href="/" className="hover:text-[#218363]">
            {t('হোম', 'Home')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#202923] font-medium">{t('বাসা খুঁজুন', 'Find a home')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold">
          {type && !loc
            ? t(PROPERTY_TYPES[type as PropertyTypeKey][0], PROPERTY_TYPES[type as PropertyTypeKey][1])
            : loc && !type
            ? `${t(LOCATIONS[loc as LocationKey][0], LOCATIONS[loc as LocationKey][1])}, ${t('ঢাকা', 'Dhaka')}`
            : t('বাসা খুঁজুন', 'Find a home')}
        </h1>
        <p className="mut text-sm mt-1">
          {t(
            'সব তালিকা নমুনা তথ্য। ছবিগুলো চিত্র, বাস্তব ছবি নয়।',
            'All listings are sample data. Images are illustrations, not real photographs.'
          )}
        </p>
      </div>

      {/* Layout Grid: Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-7 items-start pb-16">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block sticky top-24">
          {filterPanel('desktop_')}
        </aside>

        {/* Results Area */}
        <div className="min-w-0">
          {/* Search bar, mobile filter trigger, Sort and View toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <input
                type="search"
                className="in pl-10"
                placeholder={t(
                  'এলাকা বা কীওয়ার্ড লিখে খুঁজুন',
                  'Type an area or keyword'
                )}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
              <Search className="w-4 h-4 text-[#626D65] absolute left-3.5 top-3.5" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                type="button"
                className="btn line sm lg:hidden flex items-center gap-1.5"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t('ফিল্টার', 'Filters')}</span>
              </button>

              {/* Sort Dropdown */}
              <select
                className="in !min-h-[38px] !h-[38px] !py-1 text-sm w-auto cursor-pointer"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as 'new' | 'low' | 'high');
                  setPage(1);
                }}
              >
                <option value="new">{t('নতুনগুলো আগে', 'Newest')}</option>
                <option value="low">{t('কম ভাড়া আগে', 'Lowest rent')}</option>
                <option value="high">{t('বেশি ভাড়া আগে', 'Highest rent')}</option>
              </select>

              {/* Grid / List Segments */}
              <div className="seg">
                <button
                  type="button"
                  className={view === 'grid' ? 'on' : ''}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className={view === 'list' ? 'on' : ''}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Result Count and Active Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <strong className="num text-sm font-semibold">
              {formatNumber(filtered.length, lang)} {t('টি বাসা পাওয়া গেছে', 'homes found')}
            </strong>

            {q && (
              <span className="chip rm">
                "{q}"
                <button type="button" onClick={() => setQ('')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {loc && (
              <span className="chip rm">
                {t(LOCATIONS[loc as LocationKey][0], LOCATIONS[loc as LocationKey][1])}
                <button type="button" onClick={() => setLoc('')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {type && (
              <span className="chip rm">
                {t(PROPERTY_TYPES[type as PropertyTypeKey][0], PROPERTY_TYPES[type as PropertyTypeKey][1])}
                <button type="button" onClick={() => setType('')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {min && (
              <span className="chip rm">
                ≥ {formatCurrency(min, lang)}
                <button type="button" onClick={() => setMin('')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {max && (
              <span className="chip rm">
                ≤ {formatCurrency(max, lang)}
                <button type="button" onClick={() => setMax('')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {beds && (
              <span className="chip rm">
                {beds === '4' ? '4+' : formatNumber(beds, lang)} {t('বেড', 'bed')}
                <button type="button" onClick={() => setBeds('')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="link text-xs font-semibold ml-2 text-[#218363]"
              >
                {t('সব মুছুন', 'Clear all')}
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {paginated.length > 0 ? (
            <div className={`pgrid ${view === 'list' ? 'list' : 'two'}`}>
              {paginated.map((p) => (
                <PropertyCard key={p.id} property={p} isListView={view === 'list'} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center flex flex-col items-center justify-center gap-3 bg-[#F7F5EF] border-dashed border-[#E2E7E1] rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F2EC] text-[#218363] grid place-items-center">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-[#202923]">
                {t('কোনো বাসা পাওয়া যায়নি', 'No homes match your filters')}
              </h3>
              <p className="mut text-sm max-w-md">
                {t(
                  'ফিল্টার কিছুটা শিথিল করুন বা সব ফিল্টার মুছে আবার চেষ্টা করুন।',
                  'Loosen a filter or clear them all and try again.'
                )}
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn pri mt-2"
              >
                {t('সব ফিল্টার মুছুন', 'Clear all filters')}
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-1.5 mt-8" aria-label="Pagination">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="ibtn !w-10 !h-10 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors ${
                    currentPage === i + 1
                      ? 'bg-[#176B52] text-white'
                      : 'border border-[#E2E7E1] bg-white hover:bg-[#E8F2EC]'
                  }`}
                >
                  {formatNumber(i + 1, lang)}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="ibtn !w-10 !h-10 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="drw" onClick={() => setMobileFiltersOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            onClick={(e) => e.stopPropagation()}
            className="p-5"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#E2E7E1]">
              <strong className="text-lg font-bold">{t('ফিল্টার', 'Filters')}</strong>
              <button
                type="button"
                className="ibtn"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4">{filterPanel('mobile_')}</div>

            <button
              type="button"
              className="btn pri lg block w-full mt-4"
              onClick={() => setMobileFiltersOpen(false)}
            >
              {t('ফলাফল দেখুন', 'Show results')} ({formatNumber(filtered.length, lang)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <Suspense fallback={<div className="wrap py-12 text-center">Loading properties...</div>}>
          <PropertiesContent />
        </Suspense>
      </main>
      <Footer />
      <CompareBar />
      <Toast />
    </>
  );
}
