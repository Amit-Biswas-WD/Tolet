'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { AuthShell } from '@/components/common/AuthShell';
import { useApp } from '@/context/AppContext';

export default function ResetPasswordPage() {
  const { lang, showToast } = useApp();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  // Strength score: 0 to 3
  const score = [
    password.length >= 8,
    /[A-Za-z]/.test(password) && /\d/.test(password),
    /[^A-Za-z0-9]/.test(password) || password.length >= 12,
  ].filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      showToast(t('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে', 'Password must be at least 8 characters'), 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast(t('পাসওয়ার্ড দুটি মেলেনি', 'Passwords do not match'), 'error');
      return;
    }

    try {
      sessionStorage.removeItem('reset_id');
    } catch {}

    showToast(t('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে', 'Password updated successfully'));
    router.push('/login');
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <AuthShell>
          <h1 className="text-2xl font-bold text-[#202923]">{t('নতুন পাসওয়ার্ড', 'Set a new password')}</h1>
          <p className="mut text-sm">
            {t(
              'আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড সেট করুন।',
              'Choose a strong new password for your account.'
            )}
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
            <div className="fld">
              <label htmlFor="new-pw">{t('নতুন পাসওয়ার্ড', 'New password')}</label>
              <input
                id="new-pw"
                type="password"
                required
                className="in"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Password strength bar */}
            <div className="str" aria-hidden="true">
              <i className={score > 0 ? 'on' : ''}></i>
              <i className={score > 1 ? 'on' : ''}></i>
              <i className={score > 2 ? 'on' : ''}></i>
            </div>

            <div className="fld">
              <label htmlFor="confirm-pw">{t('পাসওয়ার্ড নিশ্চিত করুন', 'Confirm password')}</label>
              <input
                id="confirm-pw"
                type="password"
                required
                className="in"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn pri lg block w-full mt-2">
              {t('পাসওয়ার্ড বদলান', 'Update password')}
            </button>
          </form>
        </AuthShell>
      </main>
      <Toast />
    </>
  );
}
