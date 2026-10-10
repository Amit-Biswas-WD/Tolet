'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES, AMENITIES, CONDITIONS, FURNISHING } from '@/lib/constants';
import { getArt } from '@/lib/art';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Building,
  Upload,
  Check,
  ChevronRight,
  ArrowLeft,
  X,
  Plus,
  Info,
} from 'lucide-react';

export default function RentOutPage() {
  const { lang, properties, setProperties, showToast } = useApp();
  const router = useRouter();

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<any | null>(null);

  const [draft, setDraft] = useState({
    title: '',
    type: 'family',
    furn: 'unfurn',
    desc: '',
    loc: 'mirpur',
    floor: '4',
    addr: '',
    landmark: '',
    rent: '',
    adv: '2',
    avail: '2026-11-01',
    cond: ['family', 'no_sublet'],
    beds: '3',
    baths: '2',
    sqft: '1250',
    amen: ['lift', 'generator', 'security'],
    imgs: [] as string[],
    agree: false,
  });

  const STEPS = [
    t('বেসিক তথ্য', 'Basics'),
    t('অবস্থান', 'Location'),
    t('ভাড়া ও শর্ত', 'Rent & terms'),
    t('রুম ও সুবিধা', 'Rooms & amenities'),
    t('ছবি', 'Photos'),
    t('রিভিউ', 'Review'),
  ];

  const handleSubmitListing = () => {
    const newProp = {
      id: `p-${Date.now().toString(36)}`,
      title: [draft.title || 'নতুন বাসা', draft.title || 'New Property'] as [string, string],
      sub: ['বনশ্রী', 'Banasree'] as [string, string],
      loc: draft.loc as any,
      type: draft.type as any,
      rent: Number(draft.rent) || 25000,
      beds: Number(draft.beds) || 3,
      baths: Number(draft.baths) || 2,
      sqft: Number(draft.sqft) || 1250,
      furn: draft.furn as any,
      avail: draft.avail || 'now',
      adv: Number(draft.adv) || 2,
      amen: draft.amen,
      cond: draft.cond,
      owner: 'me',
      status: 'pending' as const,
      days: 0,
      feat: false,
      seed: Math.floor(Math.random() * 900) + 100,
      ll: 0,
      views: 0,
      inq: 0,
      floor: Number(draft.floor) || 4,
      desc: [draft.desc || 'বাসার বর্ণনা', draft.desc || 'Description'] as [string, string],
    };

    setProperties([newProp, ...properties]);
    setSubmitted(newProp);
    showToast(t('তালিকা জমা হয়েছে (ডেমো)', 'Listing submitted (demo)'));
  };

  return (
    <>
      <Header />
      <div className="ph">
        <div className="wrap">
          <h1>{t('বাসা ভাড়া দিন', 'List your property')}</h1>
          <p>
            {t(
              'ছয় ধাপের সহজ ফর্মে আপনার বাসার তথ্য, ভাড়া, সুবিধা ও ছবি দিয়ে তালিকা তৈরি করুন। জমা দিলে তালিকা রিভিউয়ের অপেক্ষায় থাকবে।',
              'Create a listing in six simple steps with details, rent, amenities and photos. Once submitted, it will be reviewed.'
            )}
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingBlock: '28px 64px', maxWidth: '860px' }}>
        <div className="crumb">
          <Link href="/">{t('হোম', 'Home')}</Link>
          <ChevronRight className="ic" width={14} height={14} />
          <span>{t('বাসা ভাড়া দিন', 'List your property')}</span>
        </div>

        {submitted ? (
          <div className="card sh" style={{ maxWidth: '640px', display: 'grid', gap: '14px', justifyItems: 'start', margin: '0 auto' }}>
            <div className="empty" style={{ width: '100%', border: 0, background: 'none' }}>
              <div className="ci">
                <Check className="ic" width={30} height={30} />
              </div>
              <h2>{t('তালিকা জমা হয়েছে (ডেমো)', 'Listing submitted (demo)')}</h2>
              <p>
                {t(
                  'এটি রিভিউয়ের অপেক্ষায় থাকবে। অ্যাডমিন ড্যাশবোর্ড থেকে এটি অনুমোদন করলে পাবলিক তালিকায় দেখা যাবে।',
                  'It now waits for review. Once approved from the admin dashboard it appears in the public listings.'
                )}
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className="badge warn">{t('অপেক্ষমাণ', 'Pending')}</span>
                <strong>{lang === 'bn' ? submitted.title[0] : submitted.title[1]}</strong>
              </div>
            </div>
            <div className="chips" style={{ justifyContent: 'center', width: '100%' }}>
              <Link href="/dashboard/landlord?tab=properties" className="btn pri">
                {t('আমার বাসা', 'My properties')}
              </Link>
              <button
                type="button"
                className="btn line"
                onClick={() => {
                  setSubmitted(null);
                  setStep(1);
                  setDraft({
                    title: '',
                    type: 'family',
                    furn: 'unfurn',
                    desc: '',
                    loc: 'mirpur',
                    floor: '4',
                    addr: '',
                    landmark: '',
                    rent: '',
                    adv: '2',
                    avail: '2026-11-01',
                    cond: ['family'],
                    beds: '3',
                    baths: '2',
                    sqft: '1250',
                    amen: ['lift'],
                    imgs: [],
                    agree: false,
                  });
                }}
              >
                {t('আরেকটি যোগ করুন', 'Add another')}
              </button>
              <Link href="/dashboard/admin?tab=pending" className="btn line">
                {t('অ্যাডমিন ভিউ খুলুন', 'Open admin view')}
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {/* Step Indicators matching reference */}
            <div className="steps" aria-label={t('ধাপ', 'Steps')}>
              {STEPS.map((sName, sIdx) => {
                const sNum = sIdx + 1;
                return (
                  <div
                    key={sIdx}
                    className={sNum === step ? 'on' : sNum < step ? 'done' : ''}
                    aria-current={sNum === step ? 'step' : undefined}
                  >
                    <b>{sNum < step ? <Check width={12} height={12} /> : formatNumber(sNum, lang)}</b>
                    <span>{sName}</span>
                  </div>
                );
              })}
            </div>

            {/* Form Card */}
            <div className="card" style={{ display: 'grid', gap: '18px' }}>
              <h2>
                {formatNumber(step, lang)}. {STEPS[step - 1]}
              </h2>

              {/* Step 1: Basics */}
              {step === 1 && (
                <>
                  <div className="fld">
                    <label htmlFor="d-title">{t('শিরোনাম', 'Title')}</label>
                    <input
                      id="d-title"
                      className="in"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      maxLength={90}
                      placeholder={t('যেমন: বনশ্রীতে ৩ বেডরুমের ফ্ল্যাট', 'e.g. 3-bedroom flat in Banasree')}
                    />
                  </div>
                  <div className="grid2">
                    <div className="fld">
                      <label htmlFor="d-type">{t('বাসার ধরন', 'Property type')}</label>
                      <select
                        id="d-type"
                        className="in"
                        value={draft.type}
                        onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                      >
                        {Object.keys(PROPERTY_TYPES).map((k) => (
                          <option key={k} value={k}>
                            {PROPERTY_TYPES[k as keyof typeof PROPERTY_TYPES][lang === 'bn' ? 0 : 1]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="fld">
                      <label htmlFor="d-furn">{t('ফার্নিশিং', 'Furnishing')}</label>
                      <select
                        id="d-furn"
                        className="in"
                        value={draft.furn}
                        onChange={(e) => setDraft({ ...draft, furn: e.target.value })}
                      >
                        {Object.keys(FURNISHING).map((k) => (
                          <option key={k} value={k}>
                            {FURNISHING[k as keyof typeof FURNISHING][lang === 'bn' ? 0 : 1]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="fld">
                    <label htmlFor="d-desc">{t('বিবরণ', 'Description')}</label>
                    <textarea
                      id="d-desc"
                      className="in"
                      value={draft.desc}
                      onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
                      placeholder={t('বাসার বিশেষত্ব, আশপাশ ও যাতায়াত সম্পর্কে লিখুন', 'Describe the home, neighbourhood and transport')}
                    />
                  </div>
                </>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <>
                  <div className="grid2">
                    <div className="fld">
                      <label htmlFor="d-loc">{t('এলাকা', 'Area')}</label>
                      <select
                        id="d-loc"
                        className="in"
                        value={draft.loc}
                        onChange={(e) => setDraft({ ...draft, loc: e.target.value })}
                      >
                        {Object.keys(LOCATIONS).map((k) => (
                          <option key={k} value={k}>
                            {LOCATIONS[k as keyof typeof LOCATIONS][lang === 'bn' ? 0 : 1]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="fld">
                      <label htmlFor="d-floor">{t('তলা', 'Floor')}</label>
                      <input
                        id="d-floor"
                        type="number"
                        className="in"
                        value={draft.floor}
                        onChange={(e) => setDraft({ ...draft, floor: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="fld">
                    <label htmlFor="d-addr">{t('ঠিকানা (ব্লক/রোড/বাড়ি)', 'Address (block, road, house)')}</label>
                    <input
                      id="d-addr"
                      className="in"
                      value={draft.addr}
                      onChange={(e) => setDraft({ ...draft, addr: e.target.value })}
                      placeholder={t('রোড #৪, ব্লক #সি', 'Road #4, Block #C')}
                    />
                    <span className="hint">{t('সঠিক বাড়ির নম্বর জনসমক্ষে না দেওয়াই ভালো।', 'Avoid publishing the exact house number.')}</span>
                  </div>
                  <div className="fld">
                    <label htmlFor="d-land">{t('কাছের পরিচিত স্থান', 'Nearby landmark')}</label>
                    <input
                      id="d-land"
                      className="in"
                      value={draft.landmark}
                      onChange={(e) => setDraft({ ...draft, landmark: e.target.value })}
                      placeholder={t('যেমন: মেট্রোরেল স্টেশন সংলগ্ন', 'e.g. Near Metro station')}
                    />
                  </div>
                </>
              )}

              {/* Step 3: Rent & terms */}
              {step === 3 && (
                <>
                  <div className="grid3">
                    <div className="fld">
                      <label htmlFor="d-rent">{t('মাসিক ভাড়া (৳)', 'Monthly rent (৳)')}</label>
                      <input
                        id="d-rent"
                        type="number"
                        className="in"
                        value={draft.rent}
                        onChange={(e) => setDraft({ ...draft, rent: e.target.value })}
                        placeholder="25000"
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="d-adv">{t('অগ্রিম (মাস)', 'Advance (months)')}</label>
                      <input
                        id="d-adv"
                        type="number"
                        className="in"
                        value={draft.adv}
                        onChange={(e) => setDraft({ ...draft, adv: e.target.value })}
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="d-avail">{t('খালি হবে', 'Available from')}</label>
                      <input
                        id="d-avail"
                        type="date"
                        className="in"
                        value={draft.avail}
                        onChange={(e) => setDraft({ ...draft, avail: e.target.value })}
                      />
                    </div>
                  </div>
                  <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend className="lbl" style={{ marginBottom: '8px' }}>{t('ভাড়ার শর্ত', 'Rental conditions')}</legend>
                    <div className="grid2" style={{ gap: '0 16px' }}>
                      {Object.keys(CONDITIONS).map((k) => (
                        <label key={k} className="chk">
                          <input
                            type="checkbox"
                            checked={draft.cond.includes(k)}
                            onChange={(e) => {
                              const nextCond = e.target.checked
                                ? [...draft.cond, k]
                                : draft.cond.filter((c) => c !== k);
                              setDraft({ ...draft, cond: nextCond });
                            }}
                          />
                          <span>{CONDITIONS[k as keyof typeof CONDITIONS][lang === 'bn' ? 0 : 1]}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}

              {/* Step 4: Rooms & Amenities */}
              {step === 4 && (
                <>
                  <div className="grid3">
                    <div className="fld">
                      <label htmlFor="d-beds">{t('বেডরুম', 'Bedrooms')}</label>
                      <input
                        id="d-beds"
                        type="number"
                        className="in"
                        value={draft.beds}
                        onChange={(e) => setDraft({ ...draft, beds: e.target.value })}
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="d-baths">{t('বাথরুম', 'Bathrooms')}</label>
                      <input
                        id="d-baths"
                        type="number"
                        className="in"
                        value={draft.baths}
                        onChange={(e) => setDraft({ ...draft, baths: e.target.value })}
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="d-sqft">{t('আয়তন (বর্গফুট)', 'Area (sq ft)')}</label>
                      <input
                        id="d-sqft"
                        type="number"
                        className="in"
                        value={draft.sqft}
                        onChange={(e) => setDraft({ ...draft, sqft: e.target.value })}
                      />
                    </div>
                  </div>
                  <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend className="lbl" style={{ marginBottom: '8px' }}>{t('সুবিধাসমূহ', 'Amenities')}</legend>
                    <div className="grid3" style={{ gap: '0 16px' }}>
                      {Object.keys(AMENITIES).map((k) => (
                        <label key={k} className="chk">
                          <input
                            type="checkbox"
                            checked={draft.amen.includes(k)}
                            onChange={(e) => {
                              const nextAmen = e.target.checked
                                ? [...draft.amen, k]
                                : draft.amen.filter((a) => a !== k);
                              setDraft({ ...draft, amen: nextAmen });
                            }}
                          />
                          <span>{AMENITIES[k as keyof typeof AMENITIES][lang === 'bn' ? 0 : 1]}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}

              {/* Step 5: Photos */}
              {step === 5 && (
                <>
                  <div className="up">
                    <div className="ci" style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--soft)', color: 'var(--pri-t)', display: 'grid', placeItems: 'center' }}>
                      <Upload className="ic" width={24} height={24} />
                    </div>
                    <strong>{t('ছবি বেছে নিন', 'Choose photos')}</strong>
                    <span className="hint">{t('সর্বোচ্চ ৮টি। ছবি কোথাও আপলোড হয় না, শুধু এই পৃষ্ঠায় প্রিভিউ দেখা যায়।', 'Up to 8 photos. Previews locally.')}</span>
                    <div className="chips" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn pri"
                        onClick={() => {
                          if (draft.imgs.length >= 8) {
                            showToast(t('সর্বোচ্চ ৮টি ছবি', 'Up to 8 photos'));
                            return;
                          }
                          const newImg = getArt(500 + draft.imgs.length * 17, 'living');
                          setDraft({ ...draft, imgs: [...draft.imgs, newImg] });
                          showToast(t('নমুনা ছবি যোগ করা হয়েছে', 'Sample photo added'));
                        }}
                      >
                        <Plus className="ic" width={18} height={18} />
                        <span>{t('নমুনা চিত্র যোগ করুন', 'Add a sample illustration')}</span>
                      </button>
                    </div>
                  </div>
                  {draft.imgs.length > 0 && (
                    <div className="thumbs">
                      {draft.imgs.map((img, i) => (
                        <div key={i}>
                          <img src={img} alt="" />
                          <button
                            type="button"
                            onClick={() => {
                              setDraft({ ...draft, imgs: draft.imgs.filter((_, idx) => idx !== i) });
                            }}
                            aria-label={t('ছবি সরান', 'Remove photo')}
                          >
                            <X className="ic" width={16} height={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Step 6: Review */}
              {step === 6 && (
                <>
                  <div className="card flat">
                    <div className="row">
                      <span className="mut">{t('শিরোনাম', 'Title')}</span>
                      <strong>{draft.title || t('বনশ্রীতে ৩ বেডরুমের ফ্ল্যাট', 'Flat')}</strong>
                    </div>
                    <div className="row">
                      <span className="mut">{t('ধরন', 'Type')}</span>
                      <strong>{PROPERTY_TYPES[draft.type as keyof typeof PROPERTY_TYPES][lang === 'bn' ? 0 : 1]}</strong>
                    </div>
                    <div className="row">
                      <span className="mut">{t('এলাকা', 'Area')}</span>
                      <strong>{LOCATIONS[draft.loc as keyof typeof LOCATIONS][lang === 'bn' ? 0 : 1]}, {draft.addr || 'ঢাকা'}</strong>
                    </div>
                    <div className="row">
                      <span className="mut">{t('ভাড়া', 'Rent')}</span>
                      <strong>{formatCurrency(Number(draft.rent) || 25000, lang)}</strong>
                    </div>
                    <div className="row">
                      <span className="mut">{t('অগ্রিম', 'Advance')}</span>
                      <strong>{draft.adv} {t('মাস', 'months')}</strong>
                    </div>
                    <div className="row">
                      <span className="mut">{t('রুম', 'Rooms')}</span>
                      <strong>{draft.beds} {t('বেড', 'bed')}, {draft.baths} {t('বাথ', 'bath')}, {draft.sqft} {t('বর্গফুট', 'sq ft')}</strong>
                    </div>
                  </div>
                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={draft.agree}
                      onChange={(e) => setDraft({ ...draft, agree: e.target.checked })}
                    />
                    <span>{t('আমি নিশ্চিত করছি যে তথ্য সঠিক এবং এটি জমা দিলে রিভিউ হবে (ডেমো)।', 'I confirm the information is accurate and understand it will be reviewed (demo).')}</span>
                  </label>
                  <div className="note info">
                    <Info className="ic" width={18} height={18} />
                    <span>{t('জমা দিলে মডারেশন অবস্থা “অপেক্ষমাণ” হবে। কোনো বাস্তব সার্ভারে কিছু যায় না।', 'After submitting, moderation status becomes “Pending”.')}</span>
                  </div>
                </>
              )}

              {/* Wizard navigation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <div className="chips">
                  <button
                    type="button"
                    className="btn line"
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft className="ic" width={16} height={16} />
                    <span>{t('আগের', 'Back')}</span>
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => showToast(t('খসড়া সংরক্ষণ করা হয়েছে (ডেমো)', 'Draft saved (demo)'))}
                  >
                    {t('খসড়া সংরক্ষণ', 'Save draft')}
                  </button>
                </div>
                {step < 6 ? (
                  <button
                    type="button"
                    className="btn pri"
                    onClick={() => {
                      if (step === 1 && !draft.title.trim()) {
                        showToast(t('অনুগ্রহ করে শিরোনাম লিখুন', 'Please add a title'));
                        return;
                      }
                      setStep(step + 1);
                    }}
                  >
                    <span>{t('পরের ধাপ', 'Next')}</span>
                    <ChevronRight className="ic" width={16} height={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn pri"
                    disabled={!draft.agree}
                    onClick={handleSubmitListing}
                  >
                    <span>{t('জমা দিন', 'Submit listing')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
