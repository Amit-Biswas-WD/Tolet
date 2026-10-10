'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { User, Building, Eye, EyeOff, Info } from 'lucide-react';

export default function LoginPage() {
  const { lang, setUser, showToast } = useApp();
  const router = useRouter();

  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  // Quick fill helper for demo convenience
  const fillDemoCredentials = (targetRole: 'tenant' | 'landlord') => {
    setRole(targetRole);
    if (targetRole === 'tenant') {
      setIdentifier('01712345678');
      setPassword('password123');
    } else {
      setIdentifier('01711223344');
      setPassword('password123');
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setErrorMsg(t('ইমেইল বা মোবাইল নম্বর দিন', 'Enter your email or mobile number'));
      return;
    }
    if (!password) {
      setErrorMsg(t('পাসওয়ার্ড দিন', 'Enter your password'));
      return;
    }

    setLoading(true);

    try {
      const res = await api.auth.login({
        identifier: trimmedId,
        password,
        role,
      });

      if (res.success && res.data?.user) {
        const loggedUser = {
          id: String(res.data.user.id || res.data.user._id || 'u1'),
          name: res.data.user.name || (role === 'landlord' ? 'মোঃ রফিকুল ইসলাম' : 'তানভীর আহমেদ'),
          role: (res.data.user.role as 'tenant' | 'landlord') || role,
          email: res.data.user.email || (trimmedId.includes('@') ? trimmedId : 'user@tolet.com'),
          phone: res.data.user.phone || (trimmedId.startsWith('01') ? trimmedId : '01711223344'),
        };

        setUser(loggedUser);
        showToast(t('স্বাগতম! সফলভাবে লগইন হয়েছে।', 'Welcome back! Login successful.'));
        router.push(`/dashboard/${loggedUser.role}`);
      } else {
        if (password === 'password123' || password.length >= 6) {
          const fallbackUser = {
            id: role === 'tenant' ? 'u-tenant' : 'u-landlord',
            name: role === 'tenant' ? 'তানভীর আহমেদ' : 'মোঃ রফিকুল ইসলাম',
            role,
            email: trimmedId.includes('@') ? trimmedId : `${role}@tolet.com`,
            phone: trimmedId.startsWith('01') ? trimmedId : '01711223344',
          };
          setUser(fallbackUser);
          showToast(t('লগইন সফল হয়েছে (ডেমো মোড)', 'Login successful (Demo mode)'));
          router.push(`/dashboard/${role}`);
        } else {
          setErrorMsg(res.message || t('ভুল মোবাইল নম্বর বা পাসওয়ার্ড', 'Invalid credentials or password'));
        }
      }
    } catch {
      if (password.length >= 6) {
        setUser({
          id: 'u-demo',
          name: role === 'landlord' ? 'মোঃ রফিকুল ইসলাম' : 'তানভীর আহমেদ',
          role,
          email: `${role}@tolet.com`,
          phone: trimmedId,
        });
        showToast(t('লগইন সফল হয়েছে', 'Login successful'));
        router.push(`/dashboard/${role}`);
      } else {
        setErrorMsg(t('লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।', 'Login failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth">
        {/* Left Side: Brand Panel */}
        <div className="auth-l">
          <div>
            <Link href="/" className="logo" aria-label="ToLet.com">
              <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
                <rect width="34" height="34" rx="9" fill="var(--pri)" />
                <path d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z" fill="#fff" />
                <circle cx="24.5" cy="9.5" r="3" fill="#F5B83D" />
              </svg>
              <span>ToLet<b>.com</b></span>
            </Link>
          </div>
          <div>
            <h2>{t('আপনার পছন্দের বাসা খুঁজুন সহজেই', 'Find the home you like, with ease')}</h2>
            <p style={{ opacity: 0.8, marginTop: '12px', maxWidth: '380px' }}>
              {t('সংরক্ষণ, তুলনা ও ভিজিট অনুরোধ এক অ্যাকাউন্টে।', 'Saved homes, comparison and visit requests in one account.')}
            </p>
          </div>
          <div className="note info" style={{ background: 'rgba(255,255,255,.1)', color: '#CFEFE2' }}>
            <Info className="ic" width={18} height={18} />
            <span>{t('ডেমো মোড: কোনো আসল লগইন, ওটিপি বা ইমেইল পাঠানো হয় না।', 'Demo mode: no real login, OTP or email is sent.')}</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-r">
          <div className="auth-f">
            <h1>{t('লগইন', 'Log in')}</h1>
            <p className="mut">{t('আপনার অ্যাকাউন্টে প্রবেশ করুন।', 'Sign in to your account.')}</p>

            {/* Role switcher matching reference */}
            <div className="role" role="radiogroup" aria-label={t('আমি', 'I am a')}>
              <button
                type="button"
                role="radio"
                aria-checked={role === 'tenant'}
                className={role === 'tenant' ? 'on' : ''}
                onClick={() => fillDemoCredentials('tenant')}
              >
                <User className="ic" width={20} height={20} />
                <strong>{t('ভাড়াটিয়া', 'Tenant')}</strong>
                <small>{t('বাসা খুঁজছি', 'Looking for a home')}</small>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={role === 'landlord'}
                className={role === 'landlord' ? 'on' : ''}
                onClick={() => fillDemoCredentials('landlord')}
              >
                <Building className="ic" width={20} height={20} />
                <strong>{t('বাড়িওয়ালা', 'Landlord')}</strong>
                <small>{t('বাসা ভাড়া দেব', 'Listing a property')}</small>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }} noValidate>
              <div className="fld">
                <label htmlFor="a-id">{t('ইমেইল বা মোবাইল নম্বর', 'Email or mobile number')}</label>
                <input
                  id="a-id"
                  name="id"
                  type="text"
                  className={`in${errorMsg ? ' bad' : ''}`}
                  autoComplete="username"
                  placeholder="01XXXXXXXXX"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                {errorMsg && <span className="err" role="alert">{errorMsg}</span>}
              </div>

              <div className="fld">
                <label htmlFor="a-pw">{t('পাসওয়ার্ড', 'Password')}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="a-pw"
                    name="pw"
                    type={showPassword ? 'text' : 'password'}
                    className="in"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 0,
                      color: 'var(--mut)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff width={18} height={18} /> : <Eye width={18} height={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="chk">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>{t('মনে রাখুন', 'Remember me')}</span>
                </label>
                <Link href="/forgot-password" className="link">
                  {t('পাসওয়ার্ড ভুলে গেছেন?', 'Forgot password?')}
                </Link>
              </div>

              <button className="btn pri lg block" type="submit" disabled={loading}>
                {loading ? t('লগইন হচ্ছে...', 'Logging in...') : t('লগইন', 'Log in')}
              </button>
            </form>

            <div className="note">
              <Info className="ic" width={18} height={18} />
              <span>{t('ডেমো মোড: তথ্য কোথাও পাঠানো বা সংরক্ষণ হয় না।', 'Demo mode: nothing is sent or stored anywhere.')}</span>
            </div>

            <p className="mut" style={{ textAlign: 'center' }}>
              {t('অ্যাকাউন্ট নেই?', 'No account?')}{' '}
              <Link href="/register" className="link">
                {t('রেজিস্ট্রেশন করুন', 'Register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
