'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { FAQS_DATA } from '@/lib/constants';
import { Search, Building, Shield, User, ChevronDown } from 'lucide-react';

export default function HelpCenterPage() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const topics = [
    {
      icon: <Search className="w-5 h-5 text-[#218363]" />,
      title: t('বাসা খোঁজা', 'Searching'),
      desc: t('ফিল্টার ও সংরক্ষণ', 'Filters and saving'),
    },
    {
      icon: <Building className="w-5 h-5 text-[#218363]" />,
      title: t('বাড়িওয়ালা', 'Landlords'),
      desc: t('তালিকা তৈরি ও ব্যবস্থাপনা', 'Creating and managing listings'),
    },
    {
      icon: <Shield className="w-5 h-5 text-[#218363]" />,
      title: t('নিরাপত্তা', 'Safety'),
      desc: t('প্রতারণা এড়ানোর উপায়', 'Avoiding scams'),
    },
    {
      icon: <User className="w-5 h-5 text-[#218363]" />,
      title: t('অ্যাকাউন্ট', 'Account'),
      desc: t('লগইন ও প্রোফাইল', 'Login and profile'),
    },
  ];

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">Help Center</h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'সাধারণ প্রশ্নের উত্তর এবং ব্যবহারের নির্দেশিকা।',
                'Answers to common questions and how-to guides.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {topics.map((x, i) => (
              <div key={i} className="feat">
                <div className="ci">{x.icon}</div>
                <h3 className="font-bold text-base">{x.title}</h3>
                <p className="mut text-sm">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4">{t('জনপ্রিয় প্রশ্ন', 'Popular questions')}</h2>
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

          <div className="card flat mt-10 flex justify-between items-center gap-4 flex-wrap bg-[#F7F5EF] p-6 rounded-2xl">
            <div>
              <h3 className="text-lg font-bold text-[#202923]">{t('উত্তর পাননি?', 'Did not find an answer?')}</h3>
              <p className="mut text-sm">{t('যোগাযোগ ফর্মে প্রশ্ন লিখুন (ডেমো)।', 'Write to us using the contact form (demo).')}</p>
            </div>
            <Link href="/contact" className="btn pri">
              {t('যোগাযোগ করুন', 'Contact us')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
