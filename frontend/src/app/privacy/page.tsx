'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';

export default function PrivacyPage() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
              {t('গোপনীয়তা নীতি', 'Privacy Policy')}
            </h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t('আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও গোপনীয়তা সম্পর্কিত নীতিমালা।', 'Policies regarding your personal information security.')}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20">
          <div className="legal max-w-3xl space-y-6 text-[#626D65]">
            <h2 className="text-xl font-bold text-[#202923]">{t('তথ্য সংগ্রহ ও ব্যবহার', 'Information Collection and Use')}</h2>
            <p className="leading-relaxed">
              {t(
                'ToLet.com ব্যবহারকারীদের পরিচয় ও যোগাযোগের তথ্যের সর্বোচ্চ গোপনীয়তা রক্ষা করে। অ্যাকাউন্ট তৈরি ও যোগাযোগের সময় সংগৃহীত তথ্য শুধুমাত্র প্ল্যাটফর্মের সার্ভিস প্রদানের উদ্দেশ্যে ব্যবহৃত হয়।',
                'ToLet.com prioritizes the privacy and security of your personal information. Collected data is solely utilized to provide and enhance rental services.'
              )}
            </p>

            <h2 className="text-xl font-bold text-[#202923] pt-4">{t('এনআইডি ও পরিচয় যাচাই', 'Identity Verification')}</h2>
            <p className="leading-relaxed">
              {t(
                'বাড়িওয়ালা বা ভাড়াটিয়ার পরিচয় নিশ্চিত করার উদ্দেশ্যে প্রদত্ত জাতীয় পরিচয়পত্রের তথ্য নিরাপদ এনক্রিপশনের মাধ্যমে সংরক্ষিত থাকে এবং তৃতীয় কোনো পক্ষের সাথে শেয়ার করা হয় না।',
                'NID and identity documents submitted for verification are secured with encryption and never disclosed to unauthorized third parties.'
              )}
            </p>

            <h2 className="text-xl font-bold text-[#202923] pt-4">{t('কুকিজ ও লোকাল স্টোরেজ', 'Cookies and Storage')}</h2>
            <p className="leading-relaxed">
              {t(
                'পছন্দের বাসা সংরক্ষণ, ভাষা পরিবর্তন এবং লগইন সেশন বজায় রাখতে ব্রাউজার লোকাল স্টোরেজ ও নিরাপদ কুকিজ ব্যবহৃত হয়।',
                'We use local storage and secure cookies to store user preferences such as saved favorites and language options.'
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
