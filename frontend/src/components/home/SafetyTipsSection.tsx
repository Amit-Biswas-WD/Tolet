'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Eye, FileText, Key, AlertTriangle, ArrowRight } from 'lucide-react';

export function SafetyTipsSection() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const tips = [
    {
      icon: <Eye className="w-5 h-5 text-[#218363]" />,
      title: t('নিজে গিয়ে দেখুন', 'See it in person'),
      desc: t(
        'অগ্রিম কিছু দেওয়ার আগে বাসাটি নিজে বা বিশ্বস্ত কাউকে নিয়ে দেখুন।',
        'Visit the property yourself, or with someone you trust, before paying anything.'
      ),
    },
    {
      icon: <FileText className="w-5 h-5 text-[#218363]" />,
      title: t('শর্ত লিখিত নিন', 'Get terms in writing'),
      desc: t(
        'ভাড়া, অগ্রিম, বিল ও মেয়াদ চুক্তিপত্রে স্পষ্ট লিখুন।',
        'Rent, advance, bills and duration should all be spelled out in the agreement.'
      ),
    },
    {
      icon: <Key className="w-5 h-5 text-[#218363]" />,
      title: t('পরিচয় যাচাই করুন', 'Check identity'),
      desc: t(
        'মালিকানা ও পরিচয়ের কাগজ সৌজন্যের সাথে দেখতে চান।',
        'Politely ask to see proof of ownership and identity.'
      ),
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-[#218363]" />,
      title: t('সন্দেহজনক অগ্রিম এড়ান', 'Avoid suspicious advances'),
      desc: t(
        'দেখার আগে টাকা চাইলে বা তাড়াহুড়ো করালে সতর্ক হোন।',
        'Be wary of anyone asking for money before a viewing or pushing you to hurry.'
      ),
    },
  ];

  return (
    <section className="sec alt">
      <div className="wrap">
        <div className="sec-h">
          <div>
            <h2>{t('ভাড়ার ঝুঁকি কমাতে', 'Reduce your rental risk')}</h2>
            <p>
              {t(
                'বাসা ভাড়ার সময় এই চারটি অভ্যাস আপনাকে প্রতারণা থেকে বাঁচাতে পারে।',
                'Four habits that help you avoid common rental scams.'
              )}
            </p>
          </div>
          <Link href="/safety" className="link">
            <span>{t('সম্পূর্ণ নির্দেশিকা', 'Full guide')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((s, i) => (
            <div key={i} className="feat">
              <div className="ci">{s.icon}</div>
              <h3 className="font-bold text-base">{s.title}</h3>
              <p className="mut text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
