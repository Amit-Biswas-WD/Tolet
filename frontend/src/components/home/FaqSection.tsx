'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FAQS_DATA } from '@/lib/constants';
import { ChevronDown, ArrowRight } from 'lucide-react';

export function FaqSection() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const topFaqs = FAQS_DATA.slice(0, 5);

  return (
    <section className="sec">
      <div className="wrap max-w-[860px]">
        <div className="sec-h">
          <div>
            <h2>{t('সচরাচর জিজ্ঞাসা', 'Frequently asked questions')}</h2>
          </div>
          <Link href="/faq" className="link">
            <span>{t('সব প্রশ্ন', 'All questions')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-[#E2E7E1] border-t border-[#E2E7E1]">
          {topFaqs.map(([q, a], i) => (
            <details key={i} className="faq group">
              <summary className="flex justify-between items-center py-4 cursor-pointer font-semibold text-base select-none">
                <span>{lang === 'bn' ? q[0] : q[1]}</span>
                <ChevronDown className="w-5 h-5 chevron text-[#626D65] flex-none" />
              </summary>
              <div className="ans text-sm sm:text-base text-[#626D65] pb-5 leading-relaxed">
                {lang === 'bn' ? a[0] : a[1]}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
