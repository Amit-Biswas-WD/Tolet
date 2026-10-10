'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatNumber } from '@/lib/utils';

export function HowItWorksSection() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const steps = [
    {
      title: t('সঠিক বাসা খুঁজুন', 'Search for a suitable home'),
      desc: t(
        'এলাকা, বাজেট ও ধরন দিয়ে ফিল্টার করে আপনার প্রয়োজন অনুযায়ী বাসা বেছে নিন।',
        'Filter by area, budget and type to narrow down homes that fit your needs.'
      ),
    },
    {
      title: t('তুলনা করুন ও যোগাযোগ করুন', 'Compare and contact the landlord'),
      desc: t(
        'তিনটি পর্যন্ত বাসা পাশাপাশি তুলনা করুন এবং বাড়িওয়ালাকে প্রশ্ন পাঠান।',
        'Compare up to three homes side by side and send questions to the landlord.'
      ),
    },
    {
      title: t('বাসা দেখুন, তারপর সিদ্ধান্ত নিন', 'Visit, then decide'),
      desc: t(
        'দেখার সময় নির্ধারণ করুন, শর্ত যাচাই করুন এবং ভেবেচিন্তে সিদ্ধান্ত নিন।',
        'Arrange a visit, check the terms and make an informed decision.'
      ),
    },
  ];

  return (
    <section className="sec alt">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <h2>{t('ToLet.com কীভাবে কাজ করে', 'How ToLet.com works')}</h2>
          </div>
        </div>

        <div className="grid3">
          {steps.map((s, i) => (
            <div key={i} className="card step">
              <div className="sn">{formatNumber(i + 1, lang)}</div>
              <h3 className="text-base font-bold">{s.title}</h3>
              <p className="mut text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
