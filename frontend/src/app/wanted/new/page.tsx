'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/constants';
import { Info } from 'lucide-react';
import { LocationKey, PropertyTypeKey } from '@/types';

export default function NewWantedPage() {
  const { lang, showToast } = useApp();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    loc: '',
    type: '',
    beds: '2',
    min: '',
    max: '',
    move: '',
    note: '',
  });

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.loc || !form.type || !form.min || !form.max || !form.move) {
      showToast(t('অনুগ্রহ করে সব প্রয়োজনীয় ঘর পূরণ করুন', 'Please fill in all required fields'), 'error');
      return;
    }
    if (Number(form.min) > Number(form.max)) {
      showToast(t('সর্বোচ্চ বাজেট সর্বনিম্নের চেয়ে কম হতে পারে না', 'Max budget cannot be less than minimum'), 'error');
      return;
    }

    showToast(t('অনুরোধ প্রকাশিত হয়েছে (ডেমো)', 'Request posted (demo)'));
    router.push('/wanted');
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="ph py-8 bg-[#E8F2EC]">
          <div className="wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
              {t('অনুরোধ প্রকাশ করুন', 'Post a wanted request')}
            </h1>
            <p className="mut text-sm sm:text-base mt-2 max-w-xl">
              {t(
                'আপনার প্রয়োজন জানান। এই প্রোটোটাইপে অনুরোধটি স্থানীয়ভাবে সংরক্ষিত হবে।',
                'Describe what you need. In this prototype the request will be recorded locally.'
              )}
            </p>
          </div>
        </div>

        <div className="wrap py-8 pb-20 max-w-2xl">
          <form onSubmit={handleSubmit} className="card grid gap-4 bg-white shadow-sm border border-[#E2E7E1]">
            <div className="grid2">
              <div className="fld">
                <label>{t('আপনার নাম', 'Your name')} *</label>
                <input
                  type="text"
                  required
                  className="in"
                  placeholder="e.g. Ayesha Siddika"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="fld">
                <label>{t('পছন্দের এলাকা', 'Preferred location')} *</label>
                <select
                  required
                  className="in"
                  value={form.loc}
                  onChange={(e) => setForm({ ...form, loc: e.target.value })}
                >
                  <option value="">{t('বেছে নিন', 'Select')}</option>
                  {(Object.keys(LOCATIONS) as LocationKey[]).map((k) => (
                    <option key={k} value={k}>{t(LOCATIONS[k][0], LOCATIONS[k][1])}</option>
                  ))}
                </select>
              </div>

              <div className="fld">
                <label>{t('বাসার ধরন', 'Property type')} *</label>
                <select
                  required
                  className="in"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">{t('বেছে নিন', 'Select')}</option>
                  {(Object.keys(PROPERTY_TYPES) as PropertyTypeKey[]).map((k) => (
                    <option key={k} value={k}>{t(PROPERTY_TYPES[k][0], PROPERTY_TYPES[k][1])}</option>
                  ))}
                </select>
              </div>

              <div className="fld">
                <label>{t('বেডরুম', 'Bedrooms')}</label>
                <select
                  className="in"
                  value={form.beds}
                  onChange={(e) => setForm({ ...form, beds: e.target.value })}
                >
                  <option value="1">১ {t('বেড', 'bed')}</option>
                  <option value="2">২ {t('বেড', 'beds')}</option>
                  <option value="3">৩ {t('বেড', 'beds')}</option>
                  <option value="4">৪+ {t('বেড', 'beds')}</option>
                </select>
              </div>

              <div className="fld">
                <label>{t('সর্বনিম্ন বাজেট (৳)', 'Min budget (৳)')} *</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="in"
                  placeholder="15000"
                  value={form.min}
                  onChange={(e) => setForm({ ...form, min: e.target.value })}
                />
              </div>

              <div className="fld">
                <label>{t('সর্বোচ্চ বাজেট (৳)', 'Max budget (৳)')} *</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="in"
                  placeholder="25000"
                  value={form.max}
                  onChange={(e) => setForm({ ...form, max: e.target.value })}
                />
              </div>

              <div className="fld sm:col-span-2">
                <label>{t('ওঠার তারিখ', 'Move-in date')} *</label>
                <input
                  type="date"
                  required
                  className="in"
                  value={form.move}
                  onChange={(e) => setForm({ ...form, move: e.target.value })}
                />
              </div>
            </div>

            <div className="fld">
              <label>{t('অতিরিক্ত প্রয়োজন', 'Additional requirements')}</label>
              <textarea
                className="in"
                rows={3}
                placeholder={t(
                  'যেমন: লিফট, স্কুলের কাছে, গ্যাস সংযোগ ইত্যাদি',
                  'e.g. lift, near school, gas line etc.'
                )}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <div className="note info text-xs">
              <Info className="w-4 h-4 flex-none" />
              <span>{t('ফোন নম্বর বা ব্যক্তিগত তথ্য এখানে লিখবেন না।', 'Do not write phone numbers or private details here.')}</span>
            </div>

            <div className="flex gap-3 mt-4">
              <button type="submit" className="btn pri lg flex-1">
                {t('অনুরোধ প্রকাশ করুন', 'Post request')}
              </button>
              <Link href="/wanted" className="btn line lg">
                {t('বাতিল', 'Cancel')}
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
