'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { AuthShell } from '@/components/common/AuthShell';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { lang, showToast } = useApp();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      showToast(t('অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল দিন', 'Please enter your mobile or email'), 'error');
      return;
    }

    try {
      sessionStorage.setItem('reset_id', identifier);
    } catch {}

    showToast(t('যাচাইকরণ কোড পাঠানো হয়েছে (ডেমো)', 'Verification code sent (demo)'));
    router.push('/otp-verify');
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <AuthShell>
          <h1 className="text-2xl font-bold text-[#202923]">{t('পাসওয়ার্ড ভুলে গেছেন?', 'Forgot your password?')}</h1>
          <p className="mut text-sm">
            {t(
              'মোবাইল নম্বর বা ইমেইল দিন। পাসওয়ার্ড রিসেটের কোড পাঠানো হবে।',
              'Enter your mobile number or email to receive a password reset code.'
            )}
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
            <div className="fld">
              <label htmlFor="fp-id">{t('মোবাইল নম্বর বা ইমেইল', 'Mobile number or email')}</label>
              <input
                id="fp-id"
                type="text"
                required
                className="in"
                placeholder="01XXXXXXXXX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <button type="submit" className="btn pri lg block w-full">
              {t('কোড পাঠান (ডেমো)', 'Send code (demo)')}
            </button>
          </form>

          <div className="mt-4">
            <Link href="/login" className="link flex items-center gap-1.5 text-xs font-semibold text-[#218363]">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('লগইনে ফিরুন', 'Back to login')}</span>
            </Link>
          </div>
        </AuthShell>
      </main>
      <Toast />
    </>
  );
}
