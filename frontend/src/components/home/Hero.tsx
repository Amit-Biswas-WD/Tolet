'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/constants';
import { getArt } from '@/lib/art';
import { formatCurrency } from '@/lib/utils';
import { Shield, Search } from 'lucide-react';
import { LocationKey, PropertyTypeKey } from '@/types';

export function Hero() {
  const { lang } = useApp();
  const router = useRouter();

  const [loc, setLoc] = useState('');
  const [type, setType] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (loc) params.set('loc', loc);
    if (type) params.set('type', type);
    if (min) params.set('min', min);
    if (max) params.set('max', max);
    router.push(`/properties?${params.toString()}`);
  };

  const popularAreas: LocationKey[] = ['banasree', 'mirpur', 'uttara', 'rampura', 'mohammadpur'];

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-g">
          {/* Left Column: Heading, lead, chips */}
          <div>
            <span className="eyebrow">
              <Shield className="w-4 h-4 text-[#218363]" />
              <span>
                {t(
                  'বাংলাদেশের বাসা ভাড়ার প্ল্যাটফর্ম · প্রোটোটাইপ',
                  'Bangladesh rental marketplace · prototype'
                )}
              </span>
            </span>

            <h1>
              {lang === 'bn' ? (
                <>
                  আপনার নতুন ঠিকানা, <em>খুঁজে নিন সহজেই।</em>
                </>
              ) : (
                <>
                  Your next address, <em>found with ease.</em>
                </>
              )}
            </h1>

            <p className="lead">
              {t(
                'ঢাকার পছন্দের এলাকায় আপনার বাজেট ও প্রয়োজন অনুযায়ী বাসা খুঁজুন। তুলনা করুন, পছন্দের তালিকায় রাখুন, আর সরাসরি যোগাযোগ করুন।',
                'Find a home in your preferred Dhaka neighbourhood that fits your budget and needs. Compare, save your favourites and get in touch directly.'
              )}
            </p>

            {/* Quick area chips */}
            <div className="chips" role="group" aria-label="Quick search">
              <span className="mut text-sm font-medium">
                {t('জনপ্রিয় এলাকা:', 'Popular areas:')}
              </span>
              {popularAreas.map((k) => (
                <button
                  key={k}
                  type="button"
                  className="chip hover:border-[#218363] hover:text-[#218363]"
                  onClick={() => router.push(`/properties?loc=${k}`)}
                >
                  {t(LOCATIONS[k][0], LOCATIONS[k][1])}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Collage */}
          <div className="collage">
            <div className="arch">
              <img
                src={getArt(33, 'ext')}
                alt={t(
                  'নমুনা চিত্র: আধুনিক আবাসিক ভবন',
                  'Sample illustration: a modern residential building'
                )}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="circ">
              <img
                src={getArt(77, 'living')}
                alt={t('নমুনা চিত্র: বসার ঘর', 'Sample illustration: living room')}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="float">
              <span className="mut text-xs block">
                {t('বনশ্রী · নমুনা তালিকা', 'Banasree · sample listing')}
              </span>
              <strong className="num text-lg font-bold text-[#202923]">
                {formatCurrency(28000, lang)}{' '}
                <small className="font-normal text-xs text-[#626D65]">
                  /{t('মাস', 'mo')}
                </small>
              </strong>
              <span className="mut text-xs block mt-0.5">
                {t('৩ বেড · ৩ বাথ · ১,৩৫০ বর্গফুট', '3 bed · 3 bath · 1,350 sq ft')}
              </span>
            </div>
          </div>
        </div>

        {/* Search Box overlapping the hero fold */}
        <div className="sbox">
          <form onSubmit={handleSubmit} role="search" aria-label="Property search">
            {/* Location */}
            <div className="fld">
              <label htmlFor="h-loc">{t('এলাকা', 'Location')}</label>
              <select
                id="h-loc"
                name="loc"
                className="in"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
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
              <label htmlFor="h-type">{t('বাসার ধরন', 'Property type')}</label>
              <select
                id="h-type"
                name="type"
                className="in"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">{t('সব ধরন', 'All types')}</option>
                {(Object.keys(PROPERTY_TYPES) as PropertyTypeKey[]).map((k) => (
                  <option key={k} value={k}>
                    {t(PROPERTY_TYPES[k][0], PROPERTY_TYPES[k][1])}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rent */}
            <div className="fld">
              <label htmlFor="h-min">{t('সর্বনিম্ন ভাড়া (৳)', 'Min rent (৳)')}</label>
              <input
                id="h-min"
                name="min"
                className="in"
                type="number"
                min="0"
                step="500"
                inputMode="numeric"
                placeholder="5000"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            </div>

            {/* Max Rent */}
            <div className="fld">
              <label htmlFor="h-max">{t('সর্বোচ্চ ভাড়া (৳)', 'Max rent (৳)')}</label>
              <input
                id="h-max"
                name="max"
                className="in"
                type="number"
                min="0"
                step="500"
                inputMode="numeric"
                placeholder="40000"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn pri lg">
              <Search className="w-[18px] h-[18px]" />
              <span>{t('বাসা খুঁজুন', 'Search')}</span>
            </button>
          </form>
        </div>
      </div>
      <div className="hero-pad"></div>
    </section>
  );
}
