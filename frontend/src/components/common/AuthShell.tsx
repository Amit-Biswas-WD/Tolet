'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Info } from 'lucide-react';

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { lang } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  return (
    <div className="auth">
      {/* Left Branding Side */}
      <div className="auth-l">
        <div>
          <Link href="/" className="logo text-white">
            <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
              <rect width="34" height="34" rx="9" fill="#176B52" />
              <path
                d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z"
                fill="#ffffff"
              />
              <circle cx="24.5" cy="9.5" r="3" fill="#D8B77A" />
            </svg>
            <span>
              ToLet<b className="text-[#6FE0B8]">.com</b>
            </span>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
            {t('আপনার পছন্দের বাসা খুঁজুন সহজেই', 'Find the home you like, with ease')}
          </h2>
          <p className="opacity-80 mt-3 text-sm max-w-sm leading-relaxed">
            {t(
              'সংরক্ষণ, তুলনা ও ভিজিট অনুরোধ এক অ্যাকাউন্টে।',
              'Saved homes, comparison and visit requests in one account.'
            )}
          </p>
        </div>

        <div className="note info !bg-white/10 !text-[#CFEFE2] text-xs">
          <Info className="w-4 h-4 flex-none" />
          <span>
            {t(
              'সুরক্ষিত প্রমাণীকরণ: নিরাপদ সেশন এবং ভূমিকাভিত্তিক এক্সেস।',
              'Secure authentication: safe sessions and role-based access control.'
            )}
          </span>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-r">
        <div className="auth-f">{children}</div>
      </div>
    </div>
  );
}
