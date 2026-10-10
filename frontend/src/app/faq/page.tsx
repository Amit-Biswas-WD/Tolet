'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { FAQS_DATA } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';

export default function FaqPage() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
              {t('সচরাচর জিজ্ঞাসা', 'Frequently asked questions')}
            </h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'বাসা খোঁজা, ভাড়া দেওয়া এবং নিরাপত্তা সংক্রান্ত সাধারণ প্রশ্নাবলি।',
                'Common questions regarding finding a home, renting, and safety.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20 max-w-3xl">
          <div className="divide-y divide-[#E2E7E1] border-t border-[#E2E7E1]">
            {FAQS_DATA.map(([q, a], i) => (
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
      </main>
      <Footer />
      <Toast />
    </>
  );
}
