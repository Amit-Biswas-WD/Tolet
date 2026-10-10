'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Building,
  Upload,
  MessageSquare,
  CheckCircle,
  Calendar,
  BarChart3,
  Wallet,
  ArrowRight,
} from 'lucide-react';

export function LandlordCtaSection() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const features = [
    {
      icon: <Upload className="w-4 h-4 text-[#8FE3C3]" />,
      text: t('বাসার তালিকা প্রকাশ করুন', 'Publish property listings'),
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-[#8FE3C3]" />,
      text: t('জিজ্ঞাসা ও বার্তা পরিচালনা', 'Manage inquiries'),
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-[#8FE3C3]" />,
      text: t('তালিকার অবস্থা ট্র্যাক করুন', 'Track listing status'),
    },
    {
      icon: <Calendar className="w-4 h-4 text-[#8FE3C3]" />,
      text: t('ভিজিটের সময় নির্ধারণ করুন', 'Schedule property visits'),
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-[#8FE3C3]" />,
      text: t('তালিকার পরিসংখ্যান দেখুন', 'View listing analytics'),
    },
    {
      icon: <Wallet className="w-4 h-4 text-[#8FE3C3]" />,
      text: t('ক্রেডিট ও লেনদেন দেখুন', 'Credits and transactions'),
    },
  ];

  return (
    <section className="sec pt-0">
      <div className="wrap">
        <div className="lord">
          <div>
            <span className="eyebrow !bg-white/10 !border-transparent !text-[#8FE3C3]">
              <Building className="w-4 h-4 text-[#8FE3C3]" />
              <span>{t('বাড়িওয়ালাদের জন্য', 'For landlords')}</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold my-3 text-white">
              {t(
                'আপনার বাসার জন্য সঠিক ভাড়াটিয়া খুঁজুন',
                'Find the right tenant for your property'
              )}
            </h2>

            <p className="text-white/85 text-sm sm:text-base mb-6 leading-relaxed">
              {t(
                'তালিকা তৈরি করুন, জিজ্ঞাসা সামলান, ভিজিট ঠিক করুন এবং তালিকার অগ্রগতি এক ড্যাশবোর্ডে দেখুন।',
                'Create a listing, handle inquiries, arrange visits and follow performance from one dashboard.'
              )}
            </p>

            <Link href="/rent-out" className="btn white lg inline-flex">
              <span>{t('বাসা ভাড়া দিন', 'List your property')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg2">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2.5 items-start bg-white/[0.07] rounded-xl p-3.5 text-sm text-white">
                <span className="mt-0.5">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
