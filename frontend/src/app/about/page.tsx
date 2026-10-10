'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';

export default function AboutPage() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
              {t('ToLet.com সম্পর্কে', 'About ToLet.com')}
            </h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'ঢাকায় বাসা খোঁজা ও ভাড়া দেওয়ার প্রক্রিয়া সহজ ও স্বচ্ছ করার একটি আধুনিক প্ল্যাটফর্ম।',
                'A modern platform to make house-hunting and renting in Dhaka easier and transparent.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20">
          <div className="legal max-w-3xl space-y-6">
            <p className="text-base sm:text-lg text-[#202923] leading-relaxed">
              {t(
                'ToLet.com বাংলাদেশের ভাড়াটিয়া ও বাড়িওয়ালাদের এক জায়গায় আনার লক্ষ্য নিয়ে তৈরি। বনশ্রী, মিরপুর, উত্তরা, রামপুরা, মোহাম্মদপুর সহ সমগ্র ঢাকায় বাসা খোঁজার অভিজ্ঞতাকে নির্বিঘ্ন ও ঝামেলামুক্ত করাই আমাদের উদ্দেশ্য।',
                'ToLet.com connects tenants and landlords across Dhaka in one reliable marketplace, bringing transparency and convenience to residential rentals.'
              )}
            </p>

            <h2 className="text-xl font-bold text-[#202923] pt-4">{t('আমরা কী সুবিধা দিই', 'What we provide')}</h2>
            <ul className="list-disc pl-5 space-y-2 text-[#626D65]">
              <li>{t('বাজেট ও এলাকা অনুযায়ী দ্রুত খোঁজ', 'Fast search by budget and location')}</li>
              <li>{t('তিনটি পর্যন্ত বাসা পাশাপাশি তুলনা', 'Side-by-side comparison of up to three homes')}</li>
              <li>{t('সরাসরি বাড়িওয়ালার সাথে যোগাযোগের সুযোগ', 'Direct communication with property owners')}</li>
              <li>{t('প্রতারণা কমানোর নিরাপত্তা নির্দেশিকা', 'Safety guidance that protects tenants')}</li>
            </ul>

            <h2 className="text-xl font-bold text-[#202923] pt-4">{t('স্বচ্ছতা ও অঙ্গীকার', 'Transparency')}</h2>
            <p className="text-[#626D65] leading-relaxed">
              {t(
                'আমরা প্রতিটি বাসার বিস্তারিত তথ্য, ছবি, সুবিধা ও শর্ত স্পষ্ট আকারে তুলে ধরি যাতে বাসা দেখার আগেই আপনি সঠিক সিদ্ধান্ত নিতে পারেন।',
                'We present clear details, verified photos, amenities, and lease conditions to help you make informed housing decisions.'
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
