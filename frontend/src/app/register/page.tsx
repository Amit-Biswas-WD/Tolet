'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { AuthShell } from '@/components/common/AuthShell';
import { useApp } from '@/context/AppContext';
import { User, Building } from 'lucide-react';

export default function RegisterPage() {
  const { lang, showToast } = useApp();
  const router = useRouter();

  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(t('পূর্ণ নাম লিখুন', 'Please enter your full name'), 'error');
      return;
    }
    // BD phone validation: 013-019 followed by 8 digits
    const cleaned = phone.replace(/[\s-]/g, '');
    const phoneValid = /^(\+?88)?01[3-9]\d{8}$/.test(cleaned);
    if (!phoneValid) {
      showToast(t('সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)', 'Enter a valid mobile number (01XXXXXXXXX)'), 'error');
      return;
    }
    if (password.length < 8) {
      showToast(t('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে', 'Password must be at least 8 characters'), 'error');
      return;
    }
    if (!agree) {
      showToast(t('শর্তাবলিতে সম্মতি দিন', 'Please agree to the terms'), 'error');
      return;
    }

    try {
      sessionStorage.setItem('pending_reg', JSON.stringify({ name, phone, email, role }));
    } catch {}

    showToast(t('যাচাইকরণ কোড পাঠানো হয়েছে (ডেমো)', 'Verification code sent (demo)'));
    router.push('/otp-verify');
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <AuthShell>
          <h1 className="text-2xl font-bold text-[#202923]">{t('অ্যাকাউন্ট খুলুন', 'Create an account')}</h1>
          <p className="mut text-sm">{t('কয়েক মিনিটেই শুরু করুন।', 'Get started in a minute.')}</p>

          {/* Role selector */}
          <div className="role my-2">
            <button
              type="button"
              className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-colors ${
                role === 'tenant'
                  ? 'border-[#176B52] bg-[#E8F2EC] text-[#176B52]'
                  : 'border-[#E2E7E1] bg-white text-[#202923]'
              }`}
              onClick={() => setRole('tenant')}
            >
              <User className="w-5 h-5" />
              <strong className="text-sm font-semibold">{t('ভাড়াটিয়া', 'Tenant')}</strong>
              <small className="text-xs text-[#626D65]">{t('বাসা খুঁজছি', 'Looking for a home')}</small>
            </button>

            <button
              type="button"
              className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-colors ${
                role === 'landlord'
                  ? 'border-[#176B52] bg-[#E8F2EC] text-[#176B52]'
                  : 'border-[#E2E7E1] bg-white text-[#202923]'
              }`}
              onClick={() => setRole('landlord')}
            >
              <Building className="w-5 h-5" />
              <strong className="text-sm font-semibold">{t('বাড়িওয়ালা', 'Landlord')}</strong>
              <small className="text-xs text-[#626D65]">{t('বাসা ভাড়া দেব', 'Listing a property')}</small>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3.5 mt-2">
            <div className="fld">
              <label htmlFor="reg-name">{t('পূর্ণ নাম', 'Full name')} *</label>
              <input
                id="reg-name"
                type="text"
                required
                className="in"
                placeholder="e.g. Ayesha Siddika"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="fld">
              <label htmlFor="reg-phone">{t('মোবাইল নম্বর', 'Mobile number')} *</label>
              <input
                id="reg-phone"
                type="tel"
                required
                className="in"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="fld">
              <label htmlFor="reg-email">{t('ইমেইল (ঐচ্ছিক)', 'Email (optional)')}</label>
              <input
                id="reg-email"
                type="email"
                className="in"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="fld">
              <label htmlFor="reg-pw">{t('পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)', 'Password (min 8 characters)')} *</label>
              <input
                id="reg-pw"
                type="password"
                required
                className="in"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label className="chk items-start text-xs text-[#626D65] my-1">
              <input
                type="checkbox"
                required
                className="mt-0.5"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                {t('আমি', 'I agree to the')}{' '}
                <Link href="/terms" className="text-[#218363] underline font-medium">
                  {t('শর্তাবলি', 'Terms')}
                </Link>{' '}
                {t('ও', 'and')}{' '}
                <Link href="/privacy" className="text-[#218363] underline font-medium">
                  {t('গোপনীয়তা নীতিতে', 'Privacy policy')}
                </Link>{' '}
                {t('সম্মত', '')}
              </span>
            </label>

            <button type="submit" className="btn pri lg block w-full">
              {t('রেজিস্ট্রেশন করুন', 'Register')}
            </button>
          </form>

          <p className="mut text-sm text-center mt-3">
            {t('আগে থেকেই অ্যাকাউন্ট আছে?', 'Already have an account?')}{' '}
            <Link href="/login" className="link font-semibold text-[#218363]">
              {t('লগইন', 'Log in')}
            </Link>
          </p>
        </AuthShell>
      </main>
      <Toast />
    </>
  );
}
