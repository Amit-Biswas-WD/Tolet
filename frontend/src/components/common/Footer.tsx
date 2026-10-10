'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Globe } from 'lucide-react';

export function Footer() {
  const { lang, setLang, showToast } = useApp();
  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const handleSocialClick = () => {
    showToast(t('এটি প্রোটোটাইপ, সোশ্যাল লিংক সক্রিয় নয়', 'Prototype only: social links are not active'), 'info');
  };

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fg">
          {/* Logo & description */}
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
            <p className="mt-3 max-w-[300px] text-[#BBD3C8] text-sm">
              {t('আপনার পছন্দের বাসা খুঁজুন সহজেই', 'Find the home you like, with ease')}
            </p>
            <div className="soc">
              {['f', 'in', 'X', 'yt'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={handleSocialClick}
                  aria-label="Social media link"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4>{t('বাসা খুঁজুন', 'Discover')}</h4>
            <Link href="/properties?type=family">{t('ফ্যামিলি অ্যাপার্টমেন্ট', 'Family Apartment')}</Link>
            <Link href="/properties?type=bachelor">{t('ব্যাচেলর বাসা', 'Bachelor Flat')}</Link>
            <Link href="/properties?type=sublet">{t('সাবলেট', 'Sublet')}</Link>
            <Link href="/properties?type=room">{t('রুম ভাড়া', 'Room Rental')}</Link>
            <Link href="/wanted">Wanted Properties</Link>
          </div>

          {/* Landlords */}
          <div>
            <h4>{t('বাড়িওয়ালা', 'Landlords')}</h4>
            <Link href="/rent-out">{t('বাসা ভাড়া দিন', 'List your property')}</Link>
            <Link href="/pricing">{t('মূল্য ও ক্রেডিট', 'Pricing & credits')}</Link>
            <Link href="/dashboard/landlord">{t('ড্যাশবোর্ড (ডেমো)', 'Dashboard (demo)')}</Link>
          </div>

          {/* Support */}
          <div>
            <h4>{t('সহায়তা', 'Support')}</h4>
            <Link href="/help">Help Center</Link>
            <Link href="/safety">{t('ভাড়ার নিরাপত্তা', 'Rental safety')}</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">{t('যোগাযোগ', 'Contact')}</Link>
          </div>

          {/* Company */}
          <div>
            <h4>{t('কোম্পানি', 'Company')}</h4>
            <Link href="/about">{t('আমাদের সম্পর্কে', 'About')}</Link>
            <Link href="/privacy">{t('গোপনীয়তা নীতি', 'Privacy policy')}</Link>
            <Link href="/terms">{t('শর্তাবলি', 'Terms & conditions')}</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bar">
          <span>
            © 2026 ToLet.com ·{' '}
            {t(
              'এটি একটি ডিজাইন প্রোটোটাইপ; সব তথ্য ও ছবি নমুনা।',
              'This is a design prototype; all data and images are samples.'
            )}
          </span>

          <label className="flex items-center gap-2 cursor-pointer">
            <Globe className="w-4 h-4 text-[#BBD3C8]" />
            <span className="sr">Language</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'bn' | 'en')}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-2 py-1 text-sm outline-none cursor-pointer"
            >
              <option value="bn" className="text-black">বাংলা</option>
              <option value="en" className="text-black">English</option>
            </select>
          </label>
        </div>
      </div>
    </footer>
  );
}
