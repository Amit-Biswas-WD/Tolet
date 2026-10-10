'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, Check, AlertTriangle } from 'lucide-react';

export function VerificationSection() {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const ticks = [
    [
      t('বাড়িওয়ালার পরিচয় যাচাই', 'Landlord identity check'),
      t('এনআইডি ও যোগাযোগ নম্বর মিলিয়ে দেখা।', 'Match NID and contact number.'),
    ],
    [
      t('ছবি ও বিবরণ রিভিউ', 'Photo and description review'),
      t('ভুল বা বিভ্রান্তিকর তথ্য বাদ দেওয়া।', 'Remove misleading or inaccurate details.'),
    ],
    [
      t('সরেজমিন পরিদর্শন', 'On-site visit'),
      t('নির্বাচিত তালিকার বাস্তব পরিদর্শন।', 'Physical inspection for selected listings.'),
    ],
    [
      t('রিপোর্ট ও ফিডব্যাক', 'Reports and feedback'),
      t('সন্দেহজনক তালিকা জানানোর সুযোগ।', 'A way to flag suspicious listings.'),
    ],
  ];

  const statusRows = [
    t('বাড়িওয়ালার পরিচয়', 'Landlord identity'),
    t('ছবি রিভিউ', 'Photo review'),
    t('সরেজমিন পরিদর্শন', 'On-site visit'),
  ];

  return (
    <section className="sec">
      <div className="wrap split">
        {/* Left Column */}
        <div>
          <span className="eyebrow">
            <Shield className="w-4 h-4 text-[#218363]" />
            <span>{t('ভবিষ্যৎ পরিকল্পনা', 'Planned feature')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold my-3.5">
            {t('যাচাইকৃত তালিকার ধারণা', 'The verified-listing concept')}
          </h2>
          <p className="mut max-w-xl">
            {t(
              'বাস্তব প্ল্যাটফর্মে প্রতিটি তালিকা প্রকাশের আগে ধাপে ধাপে রিভিউ করা হবে। নিচের ধাপগুলো পরিকল্পনা মাত্র।',
              'On a live platform each listing would be reviewed in steps before it goes public. The steps below are a plan only.'
            )}
          </p>

          <div className="ticks">
            {ticks.map((x, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="ck flex-none mt-0.5">
                  <Check className="w-4 h-4 text-[#218363]" />
                </span>
                <div>
                  <strong className="block text-sm sm:text-base font-semibold text-[#202923]">
                    {x[0]}
                  </strong>
                  <div className="mut text-sm">{x[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Status Card */}
        <div className="card sh grid gap-3.5">
          <h3 className="text-lg font-bold">{t('বর্তমান অবস্থা', 'Current status')}</h3>
          <div className="note">
            <AlertTriangle className="w-4 h-4 flex-none mt-0.5" />
            <span>
              {t(
                'এই প্রোটোটাইপের কোনো তালিকা বা বাড়িওয়ালা যাচাই করা হয়নি। সব তথ্য নমুনা।',
                'No listing or landlord in this prototype has been verified. All information is sample data.'
              )}
            </span>
          </div>

          <div className="divide-y divide-[#E2E7E1]">
            {statusRows.map((x, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 text-sm">
                <span>{x}</span>
                <span className="badge info">{t('পরিকল্পিত', 'Planned')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
