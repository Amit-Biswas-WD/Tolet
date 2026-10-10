'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, Wallet, Heart, Scale, Calendar, Shield } from 'lucide-react';

export function TenantFeaturesSection() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const features = [
    {
      icon: <MapPin className="w-5 h-5 text-[#218363]" />,
      title: t('এলাকাভিত্তিক খোঁজ', 'Location-based discovery'),
      desc: t(
        'বনশ্রী, মিরপুর, উত্তরাসহ জনপ্রিয় এলাকায় সহজে খুঁজুন।',
        'Browse popular areas such as Banasree, Mirpur and Uttara.'
      ),
    },
    {
      icon: <Wallet className="w-5 h-5 text-[#218363]" />,
      title: t('বাজেট ফিল্টার', 'Budget filters'),
      desc: t(
        'সর্বনিম্ন ও সর্বোচ্চ ভাড়া দিয়ে ফলাফল সীমিত করুন।',
        'Narrow results with minimum and maximum rent.'
      ),
    },
    {
      icon: <Heart className="w-5 h-5 text-[#218363]" />,
      title: t('সংরক্ষিত বাসা', 'Saved properties'),
      desc: t(
        'পছন্দের বাসা এক জায়গায় রাখুন, পরে আবার দেখুন।',
        'Keep your favourites in one place and revisit them later.'
      ),
    },
    {
      icon: <Scale className="w-5 h-5 text-[#218363]" />,
      title: t('বাসা তুলনা', 'Property comparison'),
      desc: t(
        'ভাড়া, আয়তন, সুবিধা ও শর্ত পাশাপাশি দেখুন।',
        'See rent, size, amenities and conditions side by side.'
      ),
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#218363]" />,
      title: t('ভিজিট অনুরোধ', 'Visit requests'),
      desc: t(
        'পছন্দের তারিখ ও সময়ে বাসা দেখার অনুরোধ পাঠান।',
        'Request a visit on a date and time that suits you.'
      ),
    },
    {
      icon: <Shield className="w-5 h-5 text-[#218363]" />,
      title: t('ভাড়ার নিরাপত্তা নির্দেশিকা', 'Rental safety guidance'),
      desc: t(
        'প্রতারণা এড়াতে ব্যবহারিক পরামর্শ পান।',
        'Get practical tips to avoid common rental scams.'
      ),
    },
  ];

  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <h2>{t('ভাড়াটিয়াদের জন্য সুবিধা', 'Built for tenants')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="feat">
              <div className="ci">{f.icon}</div>
              <h3 className="font-bold text-base">{f.title}</h3>
              <p className="mut text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
