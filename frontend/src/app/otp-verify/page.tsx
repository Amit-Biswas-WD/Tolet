'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { AuthShell } from '@/components/common/AuthShell';
import { useApp } from '@/context/AppContext';

export default function OtpVerifyPage() {
  const { lang, setUser, showToast } = useApp();
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (val: string, index: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const nextOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      nextOtp[i] = pasted[i] || '';
    }
    setOtp(nextOtp);
    const focusIdx = Math.min(pasted.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      showToast(t('অনুগ্রহ করে ৬ সংখ্যার কোড দিন', 'Please enter all 6 digits'), 'error');
      return;
    }

    try {
      const resetId = sessionStorage.getItem('reset_id');
      if (resetId) {
        showToast(t('কোড যাচাই সফল হয়েছে', 'Code verified'));
        router.push('/reset-password');
        return;
      }

      const pendingReg = JSON.parse(sessionStorage.getItem('pending_reg') || 'null');
      if (pendingReg) {
        setUser({
          id: pendingReg.role === 'tenant' ? 'u1' : 'u2',
          name: pendingReg.name,
          role: pendingReg.role,
          phone: pendingReg.phone,
          email: pendingReg.email,
        });
        showToast(t('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে', 'Account created successfully'));
        router.push(`/dashboard/${pendingReg.role}`);
        return;
      }
    } catch {}

    showToast(t('যাচাই সম্পন্ন হয়েছে', 'Verification complete'));
    router.push('/dashboard/tenant');
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <AuthShell>
          <h1 className="text-2xl font-bold text-[#202923]">{t('ওটিপি যাচাই', 'Verify OTP')}</h1>
          <p className="mut text-sm">
            {t(
              'আপনার নম্বরে প্রেরিত ৬ সংখ্যার কোডটি দিন।',
              'Enter the 6-digit code sent to your number.'
            )}
          </p>

          <form onSubmit={handleSubmit} className="grid gap-5 mt-4">
            <div
              className="flex justify-between gap-2"
              role="group"
              aria-label="6-digit code"
              onPaste={handlePaste}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[#E2E7E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  value={otp[i]}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>

            <button type="submit" className="btn pri lg block w-full">
              {t('যাচাই করুন', 'Verify')}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => showToast(t('ডেমো: কোড পুনরায় পাঠানো হয়েছে', 'Demo: code resent'))}
              className="link text-xs font-semibold text-[#218363]"
            >
              {t('আবার কোড পাঠান (ডেমো)', 'Resend code (demo)')}
            </button>
          </div>
        </AuthShell>
      </main>
      <Toast />
    </>
  );
}
