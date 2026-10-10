'use client';

import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { lang, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('সাধারণ প্রশ্ন');
  const [msg, setMsg] = useState('');

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) {
      showToast(t('অনুগ্রহ করে সব ঘর পূরণ করুন', 'Please fill in all fields'), 'error');
      return;
    }
    setName('');
    setEmail('');
    setMsg('');
    showToast(t('ডেমো: বার্তা সফলভাবে রেকর্ড করা হয়েছে', 'Demo: message recorded successfully'));
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-10 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">{t('যোগাযোগ', 'Contact us')}</h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'ডেমো ফর্ম: বার্তা কোনো সাপোর্ট টিমের কাছে যায় না।',
                'Demo form: messages are not sent to any live support team.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <form onSubmit={handleSubmit} className="card grid gap-4 bg-white border border-[#E2E7E1] shadow-sm">
              <div className="fld">
                <label>{t('নাম', 'Name')} *</label>
                <input
                  type="text"
                  required
                  className="in"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="fld">
                <label>{t('ইমেইল', 'Email')} *</label>
                <input
                  type="email"
                  required
                  className="in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="fld">
                <label>{t('বিষয়', 'Topic')}</label>
                <select className="in" value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option value="সাধারণ প্রশ্ন">{t('সাধারণ প্রশ্ন', 'General question')}</option>
                  <option value="তালিকা সংক্রান্ত">{t('তালিকা সংক্রান্ত', 'About a listing')}</option>
                  <option value="রিপোর্ট করুন">{t('রিপোর্ট করুন', 'Report an issue')}</option>
                </select>
              </div>

              <div className="fld">
                <label>{t('বার্তা', 'Message')} *</label>
                <textarea
                  className="in"
                  rows={4}
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </div>

              <button type="submit" className="btn pri lg mt-2">
                {t('বার্তা পাঠান (ডেমো)', 'Send message (demo)')}
              </button>
            </form>

            <div className="grid gap-4">
              <div className="feat flex flex-row items-center gap-4">
                <div className="ci flex-none"><Mail className="w-5 h-5 text-[#218363]" /></div>
                <div>
                  <strong className="block text-sm font-semibold text-[#202923]">support@tolet.example</strong>
                  <div className="mut text-xs">{t('ইমেইল (কাল্পনিক ঠিকানা)', 'Email (fictional address)')}</div>
                </div>
              </div>

              <div className="feat flex flex-row items-center gap-4">
                <div className="ci flex-none"><Phone className="w-5 h-5 text-[#218363]" /></div>
                <div>
                  <strong className="block text-sm font-semibold text-[#202923]">০১৭XX-XXXXXX</strong>
                  <div className="mut text-xs">{t('ফোন (কাল্পনিক নম্বর)', 'Phone (fictional number)')}</div>
                </div>
              </div>

              <div className="feat flex flex-row items-center gap-4">
                <div className="ci flex-none"><MapPin className="w-5 h-5 text-[#218363]" /></div>
                <div>
                  <strong className="block text-sm font-semibold text-[#202923]">ঢাকা, বাংলাদেশ</strong>
                  <div className="mut text-xs">{t('অফিস (নমুনা)', 'Office (sample)')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
