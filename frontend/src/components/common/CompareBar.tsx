'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Scale, X } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export function CompareBar() {
  const { comparison, clearComparison, lang } = useApp();
  const pathname = usePathname();

  if (comparison.length === 0 || pathname === '/compare' || pathname.startsWith('/dashboard')) {
    return null;
  }

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  return (
    <div className="cmpbar" role="region" aria-label="Comparison bar">
      <span className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-[#8FE3C3]" />
        {formatNumber(comparison.length, lang)}/৩ {t('টি বাসা নির্বাচিত', 'homes selected')}
      </span>
      <Link href="/compare" className="btn pri sm">
        {t('তুলনা করুন', 'Compare')}
      </Link>
      <button
        type="button"
        onClick={clearComparison}
        className="ibtn !w-[34px] !h-[34px] !bg-transparent !border-white/30 !text-white"
        aria-label={t('তুলনা মুছুন', 'Clear comparison')}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
