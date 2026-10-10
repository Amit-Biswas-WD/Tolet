'use client';

import React, { useState, use, Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CompareBar } from '@/components/common/CompareBar';
import { Toast } from '@/components/common/Toast';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useApp } from '@/context/AppContext';
import { LOCATIONS, PROPERTY_TYPES, AMENITIES, CONDITIONS, FURNISHING, LANDLORDS } from '@/lib/constants';
import { getArt } from '@/lib/art';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Layers,
  Check,
  FileText,
  Clock,
  Calendar,
  Scale,
  Phone,
  MessageSquare,
  ChevronRight,
  Info,
  X,
  CheckCircle2,
} from 'lucide-react';
import { LocationKey, PropertyTypeKey } from '@/types';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#626D65]">লোড হচ্ছে...</div>}>
      <PropertyDetailContent params={params} />
    </Suspense>
  );
}

function PropertyDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, properties, favorites, toggleFavorite, comparison, toggleComparison, showToast } = useApp();

  const property = properties.find((p) => p.id === id);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [visitForm, setVisitForm] = useState({ date: '', time: '10:00', name: '', phone: '' });
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('আসসালামু আলাইকুম, বাসাটি সম্পর্কে বিস্তারিত জানতে চাই।');

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  if (!property) {
    return (
      <>
        <Header />
        <main className="wrap py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('তালিকাটি পাওয়া যায়নি', 'Listing not found')}</h1>
          <p className="mut mb-6">{t('এটি সরানো হয়ে থাকতে পারে।', 'It may have been removed.')}</p>
          <Link href="/properties" className="btn pri">
            {t('সব বাসা দেখুন', 'Browse homes')}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const p = property;
  const isFav = favorites.includes(p.id);
  const isCmp = comparison.includes(p.id);

  const locName = LOCATIONS[p.loc as LocationKey]
    ? lang === 'bn'
      ? LOCATIONS[p.loc as LocationKey][0]
      : LOCATIONS[p.loc as LocationKey][1]
    : p.loc;
  const subName = lang === 'bn' ? p.sub[0] : p.sub[1];
  const typeName = PROPERTY_TYPES[p.type]
    ? lang === 'bn'
      ? PROPERTY_TYPES[p.type][0]
      : PROPERTY_TYPES[p.type][1]
    : p.type;
  const landlord = LANDLORDS[p.ll % LANDLORDS.length];

  const photoKinds = ['ext', 'living', 'bed', 'kitchen', 'bath'];
  const gallery = photoKinds.map((kind) => getArt(p.seed, kind));

  const similar = properties
    .filter((x) => x.id !== p.id && x.status === 'active' && (x.loc === p.loc || x.type === p.type))
    .slice(0, 3);

  const facts = [
    {
      icon: <Bed className="w-5 h-5 text-[#218363]" />,
      label: t('বেডরুম', 'Bedrooms'),
      val: p.beds ? formatNumber(p.beds, lang) : '—',
    },
    {
      icon: <Bath className="w-5 h-5 text-[#218363]" />,
      label: t('বাথরুম', 'Bathrooms'),
      val: formatNumber(p.baths, lang),
    },
    {
      icon: <Maximize2 className="w-5 h-5 text-[#218363]" />,
      label: t('আয়তন', 'Area'),
      val: `${formatNumber(p.sqft, lang)} ${t('বর্গফুট', 'sq ft')}`,
    },
    {
      icon: <Layers className="w-5 h-5 text-[#218363]" />,
      label: t('ফার্নিশিং', 'Furnishing'),
      val: FURNISHING[p.furn] ? t(FURNISHING[p.furn][0], FURNISHING[p.furn][1]) : p.furn,
    },
  ];

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast(t('লিংক কপি হয়েছে (ডেমো)', 'Link copied (demo)'));
    } catch {
      showToast(t('লিংক কপি করা যায়নি', 'Could not copy link'), 'info');
    }
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitForm.date || !visitForm.name || !visitForm.phone) {
      showToast(t('অনুগ্রহ করে সব তথ্য দিন', 'Please fill in all fields'), 'error');
      return;
    }
    setVisitSuccess(true);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageModalOpen(false);
    showToast(t('বার্তা পাঠানো হয়েছে (ডেমো)', 'Message sent (demo)'));
  };

  return (
    <>
      <Header />
      <main id="main" className="flex-1 bg-white">
        <div className="wrap">
          {/* Breadcrumbs */}
          <div className="py-6">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#626D65]">
              <Link href="/" className="hover:text-[#218363]">{t('হোম', 'Home')}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/properties" className="hover:text-[#218363]">{t('বাসা খুঁজুন', 'Find a home')}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/properties?loc=${p.loc}`} className="hover:text-[#218363]">{locName}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#202923] font-medium truncate max-w-xs">
                {lang === 'bn' ? p.title[0] : p.title[1]}
              </span>
            </div>
          </div>

          {/* Details Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-9 items-start pb-16">
            {/* Left Column */}
            <div className="min-w-0">
              {/* Header Titles & Badges */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="badge info">{t('নমুনা তালিকা', 'Sample listing')}</span>
                    <span className="badge ok">{t('প্রকাশিত', 'Published')}</span>
                    <span className="badge">{typeName}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#202923]">
                    {lang === 'bn' ? p.title[0] : p.title[1]}
                  </h1>
                  <div className="loct mt-2 text-[#626D65]">
                    <MapPin className="w-4 h-4 text-[#218363]" />
                    <span>{`${subName}, ${locName}, ${t('ঢাকা', 'Dhaka')}`}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(p.id)}
                    className="btn line sm flex items-center gap-1.5"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'text-[#D6336C] fill-[#D6336C]' : 'text-[#202923]'
                      }`}
                    />
                    <span>{isFav ? t('সংরক্ষিত', 'Saved') : t('সংরক্ষণ', 'Save')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn line sm flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t('শেয়ার', 'Share')}</span>
                  </button>
                </div>
              </div>

              {/* Gallery */}
              <div className="gal">
                <div className="main">
                  <img
                    src={gallery[activePhotoIdx]}
                    alt={`${lang === 'bn' ? p.title[0] : p.title[1]} - Photo ${activePhotoIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="th">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      className={activePhotoIdx === i ? 'on' : ''}
                      onClick={() => setActivePhotoIdx(i)}
                      aria-label={`Photo ${i + 1}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <p className="hint mt-2 text-xs text-[#626D65]">
                {t(
                  'ছবিগুলো নমুনা চিত্র, বাস্তব বাসার ছবি নয়।',
                  'Images are sample illustrations, not photos of a real home.'
                )}
              </p>

              {/* Facts Grid */}
              <div className="facts">
                {facts.map((f, i) => (
                  <div key={i}>
                    {f.icon}
                    <small className="block mt-1.5 text-xs text-[#626D65]">{f.label}</small>
                    <strong className="text-base font-bold text-[#202923]">{f.val}</strong>
                  </div>
                ))}
              </div>

              {/* Description */}
              <section className="dsec mt-8">
                <h2 className="text-xl font-bold mb-3">{t('বিবরণ', 'Description')}</h2>
                <p className="mut text-base leading-relaxed max-w-2xl">
                  {p.desc ? (lang === 'bn' ? p.desc[0] : p.desc[1]) : ''}
                </p>
              </section>

              {/* Amenities */}
              <section className="dsec mt-8">
                <h2 className="text-xl font-bold mb-3">{t('সুবিধাসমূহ', 'Amenities')}</h2>
                <div className="amen">
                  {p.amen.map((a) => (
                    <span key={a} className="flex items-center gap-2 text-sm text-[#202923]">
                      <Check className="w-4 h-4 text-[#218363]" />
                      <span>{AMENITIES[a] ? (lang === 'bn' ? AMENITIES[a][0] : AMENITIES[a][1]) : a}</span>
                    </span>
                  ))}
                </div>
              </section>

              {/* Rental Conditions */}
              <section className="dsec mt-8">
                <h2 className="text-xl font-bold mb-3">{t('ভাড়ার শর্ত', 'Rental conditions')}</h2>
                <div className="amen !grid-cols-1 sm:!grid-cols-2">
                  {p.cond.map((c) => (
                    <span key={c} className="flex items-center gap-2 text-sm text-[#202923]">
                      <FileText className="w-4 h-4 text-[#218363]" />
                      <span>{CONDITIONS[c] ? (lang === 'bn' ? CONDITIONS[c][0] : CONDITIONS[c][1]) : c}</span>
                    </span>
                  ))}
                </div>

                <div className="card flat mt-4 flex gap-6 flex-wrap bg-[#F7F5EF]">
                  <div>
                    <small className="mut block text-xs">{t('অগ্রিম (নমুনা)', 'Advance (sample)')}</small>
                    <strong className="font-bold text-[#202923]">
                      {formatNumber(p.adv, lang)} {t('মাসের ভাড়া', 'months’ rent')} = {formatCurrency(p.adv * p.rent, lang)}
                    </strong>
                  </div>
                  <div>
                    <small className="mut block text-xs">{t('প্রাপ্যতা', 'Availability')}</small>
                    <strong className="font-bold text-[#202923]">{formatDate(p.avail, lang)}</strong>
                  </div>
                </div>

                <div className="note info mt-3">
                  <Info className="w-4 h-4 flex-none mt-0.5" />
                  <span>
                    {t(
                      'অগ্রিম দেওয়ার আগে বাসা দেখে লিখিত চুক্তি নিন।',
                      'View the home and get a written agreement before paying any advance.'
                    )}
                  </span>
                </div>
              </section>

              {/* Location Map Placeholder */}
              <section className="dsec mt-8">
                <h2 className="text-xl font-bold mb-3">{t('অবস্থান', 'Location')}</h2>
                <div className="mapph" role="img" aria-label="Map preview">
                  <svg viewBox="0 0 640 320" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                    <rect width="640" height="320" fill="#E8F2EC" />
                    <g stroke="#E2E7E1" strokeWidth="14" fill="none">
                      <path d="M0 90H640M0 230H640M160 0V320M420 0V320" />
                      <path d="M0 300 640 20" strokeWidth="9" />
                    </g>
                    <g fill="#FFFFFF" opacity="0.8">
                      <rect x="190" y="110" width="80" height="50" rx="6" />
                      <rect x="450" y="120" width="120" height="70" rx="6" />
                      <rect x="40" y="130" width="90" height="70" rx="6" />
                      <rect x="200" y="250" width="160" height="50" rx="6" />
                    </g>
                    <path
                      d="M300 200c0-30 24-44 24-70a24 24 0 1 0-48 0c0 26 24 40 24 70z"
                      transform="translate(0 -20)"
                      fill="#176B52"
                    />
                    <circle cx="300" cy="110" r="9" fill="#ffffff" />
                  </svg>
                  <span className="badge" style={{ position: 'absolute', left: '12px', bottom: '12px', background: '#FFFFFF' }}>
                    {t('ম্যাপ প্রিভিউ (প্রোটোটাইপ)', 'Map preview (prototype)')}
                  </span>
                </div>
                <p className="hint mt-2 text-xs text-[#626D65]">
                  {`${subName}, ${locName}, ${t('ঢাকা', 'Dhaka')}`}
                </p>
              </section>
            </div>

            {/* Right Sticky Sidebar */}
            <aside className="stick">
              {/* Rent & Main Actions Card */}
              <div className="card sh grid gap-4">
                <div>
                  <div className="price">
                    <strong className="num text-3xl font-bold text-[#202923]">
                      {formatCurrency(p.rent, lang)}
                    </strong>
                    <span className="text-base text-[#626D65]">/{t('মাস', 'month')}</span>
                  </div>
                  <div className="hint text-xs text-[#626D65] mt-1">{t('নমুনা ভাড়া', 'Sample rent')}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setVisitModalOpen(true)}
                  className="btn pri lg block w-full flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t('ভিজিটের অনুরোধ', 'Request a visit')}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(p.id)}
                    className="btn line block flex-1 flex items-center justify-center gap-1.5"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'text-[#D6336C] fill-[#D6336C]' : 'text-[#202923]'
                      }`}
                    />
                    <span>{isFav ? t('সংরক্ষিত', 'Saved') : t('সংরক্ষণ', 'Save')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleComparison(p.id)}
                    className="btn line block flex-1 flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-4 h-4 text-[#202923]" />
                    <span>{isCmp ? t('তুলনায় আছে', 'In compare') : t('তুলনা', 'Compare')}</span>
                  </button>
                </div>
              </div>

              {/* Landlord Contact Card */}
              <div className="card flat grid gap-3.5 bg-white">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-[#E8F2EC] text-[#218363] grid place-items-center font-bold text-lg flex-none">
                    {(lang === 'bn' ? landlord[0] : landlord[1]).slice(0, 1)}
                  </span>
                  <div>
                    <strong className="block text-sm font-semibold text-[#202923]">
                      {lang === 'bn' ? landlord[0] : landlord[1]}
                    </strong>
                    <div className="hint text-xs text-[#626D65]">
                      {t('বাড়িওয়ালা (কাল্পনিক নমুনা)', 'Landlord (fictional sample)')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#202923]">
                  <Phone className="w-4 h-4 text-[#218363]" />
                  <span className="num font-medium">০১7XX-XXXXXX</span>
                  <span className="hint text-xs">({t('ডেমো, লুকানো', 'demo, masked')})</span>
                </div>

                <button
                  type="button"
                  onClick={() => setMessageModalOpen(true)}
                  className="btn line block w-full flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('বার্তা পাঠান (ডেমো)', 'Send a message (demo)')}</span>
                </button>
              </div>
            </aside>
          </div>

          {/* Similar Properties Section */}
          {similar.length > 0 && (
            <section className="sec pt-0 border-t border-[#E2E7E1]">
              <div className="sec-h mt-8">
                <h2>{t('অনুরূপ বাসা', 'Similar properties')}</h2>
              </div>
              <div className="pgrid">
                {similar.map((x) => (
                  <PropertyCard key={x.id} property={x} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <CompareBar />
      <Toast />

      {/* Visit Request Modal */}
      {visitModalOpen && (
        <div className="ov" onClick={() => { setVisitModalOpen(false); setVisitSuccess(false); }}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {visitSuccess ? (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#E2F4E8] text-[#1A7A43] grid place-items-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">{t('ডেমো অনুরোধ নথিভুক্ত হয়েছে', 'Demo request recorded')}</h3>
                <p className="mut text-sm max-w-sm">
                  {t(
                    'আপনার ভিজিট অনুরোধটি শুধু এই ব্রাউজারে সংরক্ষিত হয়েছে। কোনো বাড়িওয়ালার কাছে পাঠানো হয়নি এবং কোনো অ্যাপয়েন্টমেন্ট বুক হয়নি।',
                    'Your visit request was recorded in this demo. It was not sent to any landlord and no real appointment was booked.'
                  )}
                </p>
                <button
                  type="button"
                  className="btn pri mt-2"
                  onClick={() => { setVisitModalOpen(false); setVisitSuccess(false); }}
                >
                  {t('ঠিক আছে', 'OK')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-2 border-b border-[#E2E7E1]">
                  <div>
                    <h3 className="text-lg font-bold">{t('ভিজিটের অনুরোধ', 'Request a visit')}</h3>
                    <p className="mut text-xs">{lang === 'bn' ? p.title[0] : p.title[1]}</p>
                  </div>
                  <button type="button" className="ibtn !w-8 !h-8" onClick={() => setVisitModalOpen(false)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="note info text-xs">
                  <Info className="w-4 h-4 flex-none" />
                  <span>{t('ডেমো: এটি কোনো বাস্তব অ্যাপয়েন্টমেন্ট তৈরি করে না।', 'Demo: this does not create a real appointment.')}</span>
                </div>

                <form onSubmit={handleVisitSubmit} className="grid gap-3.5 mt-2">
                  <div className="grid2">
                    <div className="fld">
                      <label>{t('তারিখ', 'Date')}</label>
                      <input
                        type="date"
                        className="in"
                        required
                        value={visitForm.date}
                        onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                      />
                    </div>
                    <div className="fld">
                      <label>{t('পছন্দের সময়', 'Preferred time')}</label>
                      <select
                        className="in"
                        value={visitForm.time}
                        onChange={(e) => setVisitForm({ ...visitForm, time: e.target.value })}
                      >
                        <option>10:00 AM</option>
                        <option>12:00 PM</option>
                        <option>03:00 PM</option>
                        <option>05:00 PM</option>
                        <option>07:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="fld">
                    <label>{t('আপনার নাম', 'Your name')}</label>
                    <input
                      type="text"
                      className="in"
                      required
                      placeholder="e.g. Arif Hossain"
                      value={visitForm.name}
                      onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })}
                    />
                  </div>

                  <div className="fld">
                    <label>{t('মোবাইল নম্বর', 'Mobile number')}</label>
                    <input
                      type="tel"
                      className="in"
                      required
                      placeholder="01XXXXXXXXX"
                      value={visitForm.phone}
                      onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#E2E7E1]">
                    <button type="button" className="btn line" onClick={() => setVisitModalOpen(false)}>
                      {t('বাতিল', 'Cancel')}
                    </button>
                    <button type="submit" className="btn pri">
                      {t('অনুরোধ পাঠান (ডেমো)', 'Send request (demo)')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModalOpen && (
        <div className="ov" onClick={() => setMessageModalOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#E2E7E1]">
              <h3 className="text-lg font-bold">{t('বার্তা পাঠান (ডেমো)', 'Send a message (demo)')}</h3>
              <button type="button" className="ibtn !w-8 !h-8" onClick={() => setMessageModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="note info text-xs">
              <Info className="w-4 h-4 flex-none" />
              <span>{t('বার্তা কোথাও পাঠানো হবে না। এটি শুধুমাত্র ডেমো।', 'The message will not be sent anywhere. This is a demo.')}</span>
            </div>

            <form onSubmit={handleMessageSubmit} className="grid gap-3.5 mt-2">
              <div className="fld">
                <label>{t('আপনার বার্তা', 'Your message')}</label>
                <textarea
                  className="in"
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-[#E2E7E1]">
                <button type="button" className="btn line" onClick={() => setMessageModalOpen(false)}>
                  {t('বাতিল', 'Cancel')}
                </button>
                <button type="submit" className="btn pri">
                  {t('পাঠান (ডেমো)', 'Send (demo)')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
