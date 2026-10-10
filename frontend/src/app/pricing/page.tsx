'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import { Check, AlertTriangle } from 'lucide-react';

export default function PricingPage() {
  const { lang, showToast } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const plans = [
    {
      title: t('বেসিক', 'Basic'),
      price: 0,
      popular: false,
      features: [
        t('১টি তালিকা', '1 listing'),
        t('সাধারণ প্রদর্শন', 'Standard placement'),
        t('জিজ্ঞাসা গ্রহণ', 'Receive inquiries'),
      ],
    },
    {
      title: t('স্ট্যান্ডার্ড', 'Standard'),
      price: 500,
      popular: true,
      features: [
        t('৫টি তালিকা', '5 listings'),
        t('অগ্রাধিকার প্রদর্শন', 'Priority placement'),
        t('ভিজিট ব্যবস্থাপনা', 'Visit management'),
        t('বেসিক পরিসংখ্যান', 'Basic analytics'),
      ],
    },
    {
      title: t('প্রো', 'Pro'),
      price: 1500,
      popular: false,
      features: [
        t('২০টি তালিকা', '20 listings'),
        t('ফিচারড ব্যাজ', 'Featured badge'),
        t('বিস্তারিত পরিসংখ্যান', 'Detailed analytics'),
        t('একাধিক সম্পত্তি ব্যবস্থাপনা', 'Multi-property management'),
      ],
    },
  ];

  const creditExamples = [
    {
      action: t('তালিকা প্রকাশ', 'Publish a listing'),
      cost: `১০ ${t('ক্রেডিট', 'credits')}`,
    },
    {
      action: t('ফিচারড করা', 'Feature a listing'),
      cost: `৩০ ${t('ক্রেডিট', 'credits')}`,
    },
    {
      action: t('তালিকা নবায়ন', 'Renew a listing'),
      cost: `৫ ${t('ক্রেডিট', 'credits')}`,
    },
  ];

  const handleSelect = (planName: string) => {
    showToast(
      `${t('ডেমো প্ল্যান', 'Demo plan')}: ${planName} — ${t(
        'কোনো পেমেন্ট প্রক্রিয়া হয় না',
        'No payment is processed'
      )}`,
      'info'
    );
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
              {t('মূল্য ও ক্রেডিট', 'Pricing and credits')}
            </h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'নিচের মূল্য শুধু ডিজাইন প্রোটোটাইপের জন্য উদাহরণ। এটি কোনো বাস্তব বাণিজ্যিক প্রস্তাব নয়।',
                'The prices below are illustrative for this design prototype only. They are not a real commercial offer.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20">
          <div className="note mb-8">
            <AlertTriangle className="w-5 h-5 flex-none mt-0.5 text-[#8A5700]" />
            <span>
              {t(
                'ডেমো মূল্য: কোনো পেমেন্ট প্রক্রিয়া করা হয় না।',
                'Demo pricing: no payment is processed.'
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p, i) => (
              <div
                key={i}
                className={`card price-c flex flex-col justify-between ${
                  p.popular ? 'border-[#176B52] shadow-lg ring-1 ring-[#176B52]' : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-[#202923]">{p.title}</h2>
                    {p.popular && <span className="badge ok">{t('জনপ্রিয়', 'Popular')}</span>}
                  </div>

                  <div className="text-3xl font-bold text-[#202923] mb-5">
                    {formatCurrency(p.price, lang)}
                    <small className="text-sm font-normal text-[#626D65]">/{t('মাস', 'mo')}</small>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-[#202923]">
                        <Check className="w-4 h-4 text-[#218363]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelect(p.title)}
                  className={`btn block w-full ${p.popular ? 'pri' : 'line'}`}
                >
                  {t('এটি বেছে নিন (ডেমো)', 'Choose (demo)')}
                </button>
              </div>
            ))}
          </div>

          {/* Credits section */}
          <section className="dsec mt-14 pt-8 border-t border-[#E2E7E1]">
            <h2 className="text-xl font-bold mb-4">
              {t('ক্রেডিট কীভাবে কাজ করে (উদাহরণ)', 'How credits work (example)')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {creditExamples.map((c, i) => (
                <div key={i} className="feat">
                  <h3 className="text-sm font-semibold text-[#626D65]">{c.action}</h3>
                  <p className="text-2xl font-bold text-[#202923] mt-1">{c.cost}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
