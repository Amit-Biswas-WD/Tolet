'use client';

import React from 'react';
import Link from 'next/link';
import { Property } from '@/types';
import { useApp } from '@/context/AppContext';
import { getArt } from '@/lib/art';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/constants';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { Heart, MapPin, Bed, Bath, Maximize2, Clock } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  isListView?: boolean;
}

export function PropertyCard({ property: p, isListView = false }: PropertyCardProps) {
  const { lang, favorites, toggleFavorite, comparison, toggleComparison } = useApp();

  const isFav = favorites.includes(p.id);
  const isCmp = comparison.includes(p.id);

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const title = lang === 'bn' ? p.title[0] : p.title[1];
  const locName = LOCATIONS[p.loc as keyof typeof LOCATIONS]
    ? lang === 'bn'
      ? LOCATIONS[p.loc as keyof typeof LOCATIONS][0]
      : LOCATIONS[p.loc as keyof typeof LOCATIONS][1]
    : p.loc;
  const subName = lang === 'bn' ? p.sub[0] : p.sub[1];
  const typeName = PROPERTY_TYPES[p.type]
    ? lang === 'bn'
      ? PROPERTY_TYPES[p.type][0]
      : PROPERTY_TYPES[p.type][1]
    : p.type;

  const availText =
    p.avail === 'now'
      ? t('এখনই খালি', 'Available now')
      : t('খালি হবে ', 'Available from ') + formatDate(p.avail, lang);

  const imageUrl = p.imgs && p.imgs[0] ? p.imgs[0] : getArt(p.seed, 'ext');

  return (
    <article className={`pc ${isListView ? 'pc-list' : ''}`}>
      {/* Property Image & Overlays */}
      <div className="pc-img">
        <Link href={`/properties/${p.id}`} tabIndex={-1} aria-hidden="true">
          <img
            src={imageUrl}
            alt={`${title}, ${subName}, ${locName}`}
            loading="lazy"
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </Link>
        <span
          className="badge"
          style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            background: 'rgba(255,255,255,0.95)',
            color: '#0A5A42',
          }}
        >
          {t('নমুনা তালিকা', 'Sample listing')}
        </span>
        <button
          type="button"
          onClick={() => toggleFavorite(p.id)}
          className={`fav ${isFav ? 'on' : ''}`}
          aria-pressed={isFav}
          aria-label={isFav ? t('সংরক্ষণ বাদ দিন', 'Remove from saved') : t('সংরক্ষণ করুন', 'Save property')}
        >
          <Heart
            className={`w-[19px] h-[19px] ${
              isFav ? 'text-[#D6336C] fill-[#D6336C]' : 'text-[#33403a]'
            }`}
          />
        </button>
      </div>

      {/* Property Body */}
      <div className="pc-b">
        <div className="pc-top">
          <span className="tag">{typeName}</span>
          <label className="cmpb">
            <input
              type="checkbox"
              checked={isCmp}
              onChange={() => toggleComparison(p.id)}
            />
            <span>{t('তুলনা', 'Compare')}</span>
          </label>
        </div>

        <h3>
          <Link href={`/properties/${p.id}`} className="hover:text-[#218363] transition-colors">
            {title}
          </Link>
        </h3>

        <div className="loct">
          <MapPin className="w-[15px] h-[15px] flex-none text-[#626D65]" />
          <span>{`${subName}, ${locName}`}</span>
        </div>

        <div className="price">
          <strong className="num text-[#202923] text-xl font-bold">
            {formatCurrency(p.rent, lang)}
          </strong>
          <span className="text-sm text-[#626D65]">/{t('মাস', 'month')}</span>
        </div>

        <div className="specs">
          <span>
            <Bed className="w-4 h-4 text-[#626D65]" />
            {p.beds ? formatNumber(p.beds, lang) : '—'} {t('বেড', 'bed')}
          </span>
          <span>
            <Bath className="w-4 h-4 text-[#626D65]" />
            {formatNumber(p.baths, lang)} {t('বাথ', 'bath')}
          </span>
          <span>
            <Maximize2 className="w-4 h-4 text-[#626D65]" />
            {formatNumber(p.sqft, lang)} {t('বর্গফুট', 'sq ft')}
          </span>
        </div>

        <div className="pc-f">
          <span className="avail">
            <Clock className="w-3.5 h-3.5" />
            {availText}
          </span>
          <Link href={`/properties/${p.id}`} className="btn line sm">
            {t('বিস্তারিত', 'Details')}
          </Link>
        </div>
      </div>
    </article>
  );
}
