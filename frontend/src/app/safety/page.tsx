'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { Eye, FileText, Key, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function SafetyPage() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const tips = [
    {
      icon: <Eye className="w-5 h-5 text-[#218363]" />,
      title: t('বাসা নিজে দেখুন', 'View the home in person'),
      desc: t(
        'অগ্রিম বা বুকিং ফি দেওয়ার আগে নিজে গিয়ে ভেতরে-বাইরে দেখুন। সম্ভব হলে সাথে বিশ্বস্ত কাউকে নিন।',
        'Go and see the inside and outside before paying any advance or booking fee. Bring someone you trust if you can.'
      ),
    },
    {
      icon: <FileText className="w-5 h-5 text-[#218363]" />,
      title: t('ভাড়ার শর্ত লিখিত নিন', 'Get the terms in writing'),
      desc: t(
        'মাসিক ভাড়া, অগ্রিম, সার্ভিস চার্জ, বিল, মেয়াদ ও নোটিস সময় চুক্তিপত্রে স্পষ্ট থাকা উচিত।',
        'Monthly rent, advance, service charge, bills, duration and notice period should be clear in the agreement.'
      ),
    },
    {
      icon: <Key className="w-5 h-5 text-[#218363]" />,
      title: t('পরিচয় যথাযথভাবে যাচাই করুন', 'Check identity appropriately'),
      desc: t(
        'বাড়িওয়ালার পরিচয় ও বাসার মালিকানার কাগজ সৌজন্যের সাথে দেখতে চান। নিজের এনআইডি কপি দিলে কাজের উদ্দেশ্য লিখে দিন।',
        'Politely ask for the landlord’s identity and proof of ownership. If you share your NID copy, note its purpose on it.'
      ),
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-[#218363]" />,
      title: t('সন্দেহজনক অগ্রিম এড়ান', 'Avoid suspicious advance payments'),
      desc: t(
        'দেখার আগে টাকা চাওয়া, অতিরিক্ত তাড়া দেওয়া বা বাজারদরের চেয়ে অনেক কম ভাড়া দেখালে সতর্ক হোন। মোবাইল ব্যাংকিংয়ে অচেনা কাউকে টাকা পাঠাবেন না।',
        'Be wary of requests for money before viewing, heavy pressure to hurry, or rent far below the market rate. Do not send money by mobile banking to someone you do not know.'
      ),
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-[#218363]" />,
      title: t('রসিদ ও প্রমাণ রাখুন', 'Keep receipts and records'),
      desc: t(
        'প্রতিটি লেনদেনের রসিদ রাখুন এবং বার্তা ও চুক্তির কপি সংরক্ষণ করুন।',
        'Keep a receipt for every payment and save copies of messages and the agreement.'
      ),
    },
  ];

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
              {t('ভাড়ার নিরাপত্তা', 'Rental safety')}
            </h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'বাসা ভাড়ার সময় সাধারণ ঝুঁকি এড়াতে কয়েকটি ব্যবহারিক পরামর্শ।',
                'Practical advice for avoiding common risks when renting.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {tips.map((x, i) => (
              <div key={i} className="feat">
                <div className="ci">{x.icon}</div>
                <h3 className="font-bold text-base text-[#202923]">{x.title}</h3>
                <p className="mut text-sm leading-relaxed">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="note info">
            <Info className="w-5 h-5 flex-none" />
            <span>
              {t('এটি সাধারণ নির্দেশিকা, আইনি পরামর্শ নয়।', 'This is general guidance, not legal advice.')}
            </span>
          </div>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
export default SafetyPage;
