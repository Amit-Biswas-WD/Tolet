'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';

export default function TermsPage() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
              {t('শর্তাবলি', 'Terms & Conditions')}
            </h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t('ToLet.com প্ল্যাটফর্ম ব্যবহারের নিয়ম ও শর্তাবলি।', 'Terms and conditions governing the use of ToLet.com.')}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20">
          <div className="legal max-w-3xl space-y-6 text-[#626D65]">
            <h2 className="text-xl font-bold text-[#202923]">{t('প্ল্যাটফর্মের ভূমিকা', 'Platform Role')}</h2>
            <p className="leading-relaxed">
              {t(
                'ToLet.com একটি আবাসিক রেন্টাল মার্কেটপ্লেস যা ভাড়াটিয়া এবং বাড়িওয়ালাদের মধ্যে সংযোগ স্থাপন করে। কোনো বাসা চূড়ান্ত চুক্তি করার আগে সরেজমিনে পরিদর্শন করা ভাড়াটিয়ার দায়িত্ব।',
                'ToLet.com acts as a residential rental discovery marketplace connecting tenants and landlords. Physical inspection prior to signing a lease remains the responsibility of the tenant.'
              )}
            </p>

            <h2 className="text-xl font-bold text-[#202923] pt-4">{t('তালিকার নির্ভুলতা', 'Listing Accuracy')}</h2>
            <p className="leading-relaxed">
              {t(
                'বাড়িওয়ালাদের সঠিক ও বাস্তব তথ্য প্রদান করতে হবে। কোনো বিভ্রান্তিকর বা প্রতারণামূলক তালিকা চিহ্নিত হলে তা অবিলম্বে অপসারণ করা হবে।',
                'Property posters must guarantee accurate and truthful property descriptions. Misleading or fraudulent listings are subject to immediate removal.'
              )}
            </p>

            <h2 className="text-xl font-bold text-[#202923] pt-4">{t('পেমেন্ট ও অগ্রিম', 'Payments & Advances')}</h2>
            <p className="leading-relaxed">
              {t(
                'অনলাইনে বাসা না দেখে অপরিচিত কাউকে অগ্রিম অর্থ প্রেরণ করা থেকে বিরত থাকার পরামর্শ দেওয়া হয়। কোনো অনাকাঙ্ক্ষিত লেনদেনের দায় প্ল্যাটফর্ম বহন করবে না।',
                'Users are advised never to transfer advance money online without verifying the property in person and obtaining written receipts.'
              )}
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
