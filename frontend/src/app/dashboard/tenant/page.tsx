'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/constants';
import { getArt } from '@/lib/art';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Heart,
  MessageSquare,
  Calendar,
  Search,
  Mail,
  User,
  Cog,
  Home,
  Building,
  Shield,
  Bell,
  Menu,
  X,
  Info,
  Check,
  ChevronRight,
  Eye,
  Trash2,
  Send,
  Plus,
} from 'lucide-react';

export default function TenantDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#64716A]">লোড হচ্ছে...</div>}>
      <TenantDashboardContent />
    </Suspense>
  );
}

function TenantDashboardContent() {
  const { lang, setLang, showToast, user, setUser, favorites, properties } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get('tab') || 'overview';
  const [tab, setTab] = useState<string>(initialTab);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  // Notifications
  const [notifs, setNotifs] = useState([
    { id: 'n1', t: ['নতুন ভিজিট অনুরোধ (নমুনা)', 'New visit request (sample)'], time: ['১০ মিনিট আগে', '10 min ago'] },
    { id: 'n2', t: ['একটি জিজ্ঞাসার উত্তর এসেছে (নমুনা)', 'An inquiry received a reply (sample)'], time: ['২ ঘণ্টা আগে', '2 h ago'] },
    { id: 'n3', t: ['আপনার পছন্দের বাসার ভাড়া কমেছে', 'Price dropped on saved property'], time: ['গতকাল', 'Yesterday'] },
  ]);

  // Saved properties
  const savedProps = properties.filter((p) => favorites.includes(p.id));

  // Inquiries State
  const [inquiries, setInquiries] = useState([
    { id: 'inq-1', propId: 'p1', date: '2026-10-09', status: 'replied' as const },
    { id: 'inq-2', propId: 'p2', date: '2026-10-08', status: 'sent' as const },
    { id: 'inq-3', propId: 'p4', date: '2026-10-05', status: 'replied' as const },
  ]);

  // Visits State
  const [visits, setVisits] = useState([
    { id: 'v1', propId: 'p1', date: '2026-10-15', time: '11:00 AM', status: 'confirmed' as const },
    { id: 'v2', propId: 'p3', date: '2026-10-18', time: '04:30 PM', status: 'requested' as const },
  ]);

  // Wanted State
  const [myWanted, setMyWanted] = useState([
    {
      id: 'w1',
      type: 'family',
      loc: 'mirpur',
      beds: 3,
      min: 20000,
      max: 26000,
      move: '2026-11-01',
      note: 'মিরপুর ২ অথবা ১০ এর আশেপাশে ৩ বেডরুমের বাসা আবশ্যক। লিফট ও গ্যাস সংযোগ থাকতে হবে।',
      by: 'তানভীর আহমেদ',
    },
  ]);

  // Conversations State
  const [activeConvIdx, setActiveConvIdx] = useState(0);
  const [convs, setConvs] = useState([
    {
      name: 'মোঃ রফিকুল ইসলাম (বাড়িওয়ালা)',
      propTitle: 'বনশ্রীতে ৩ বেডরুমের আলো-বাতাসপূর্ণ ফ্ল্যাট',
      messages: [
        { sender: 0, text: 'আসসালামু আলাইকুম, বাসাটি কি এখনও খালি আছে?', time: 'গতকাল ১০:১৫' },
        { sender: 1, text: 'ওয়ালাইকুম আসসালাম। জি, আগামী মাসের ১ তারিখ থেকে খালি হবে।', time: 'গতকাল ১০:৩০' },
        { sender: 0, text: 'পরিবার নিয়ে সপরিবারে দেখার জন্য কবে আসা যাবে?', time: 'গতকাল ১০:৩৫' },
        { sender: 1, text: 'শুক্রবার বিকেলে ৪টার দিকে এসে সরাসরি দেখে যেতে পারেন।', time: 'আজ ০৯:০০' },
      ],
    },
    {
      name: 'কামরুল হাসান (বাড়িওয়ালা)',
      propTitle: 'উত্তরা সেক্টর ৭ এ আধুনিক ফ্ল্যাট',
      messages: [
        { sender: 0, text: 'বাসার সাথে গ্যারেজ সুবিধা অন্তর্ভুক্ত কি না জানাবেন?', time: '৩ দিন আগে' },
        { sender: 1, text: 'জি, ১টি গাড়ি ও ১টি বাইকের পার্কিং স্পেস আছে।', time: '২ দিন আগে' },
      ],
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Profile State
  const [profile, setProfile] = useState({
    name: user?.name || 'তানভীর আহমেদ',
    phone: user?.phone || '01712345678',
    email: user?.email || 'tanvir@example.com',
    area: 'মিরপুর, ঢাকা',
  });

  // Settings State
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    digest: true,
    visit: true,
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const nextConvs = [...convs];
    nextConvs[activeConvIdx].messages.push({
      sender: 1,
      text: chatInput.trim(),
      time: t('এইমাত্র', 'Just now'),
    });
    setConvs(nextConvs);
    setChatInput('');
  };

  const navItems = [
    { key: 'overview', icon: <Search className="ic" width={19} height={19} />, label: t('ওভারভিউ', 'Overview') },
    { key: 'favorites', icon: <Heart className="ic" width={19} height={19} />, label: t('সংরক্ষিত বাসা', 'Favorites') },
    { key: 'inquiries', icon: <MessageSquare className="ic" width={19} height={19} />, label: t('জিজ্ঞাসা', 'Inquiries') },
    { key: 'visits', icon: <Calendar className="ic" width={19} height={19} />, label: t('ভিজিট অনুরোধ', 'Visit requests') },
    { key: 'wanted', icon: <Search className="ic" width={19} height={19} />, label: t('ওয়ান্টেড অনুরোধ', 'Wanted requests') },
    { key: 'messages', icon: <Mail className="ic" width={19} height={19} />, label: t('বার্তা', 'Messages') },
    { key: 'profile', icon: <User className="ic" width={19} height={19} />, label: t('প্রোফাইল', 'Profile') },
    { key: 'settings', icon: <Cog className="ic" width={19} height={19} />, label: t('সেটিংস', 'Settings') },
  ];

  const currentNav = navItems.find((n) => n.key === tab) || navItems[0];

  return (
    <div className="dash">
      {/* Sidebar */}
      <aside className="dside" aria-label={t('ড্যাশবোর্ড মেনু', 'Dashboard menu')}>
        <Link href="/" className="logo" aria-label="ToLet.com">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
            <rect width="34" height="34" rx="9" fill="var(--pri)" />
            <path d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z" fill="#fff" />
            <circle cx="24.5" cy="9.5" r="3" fill="#F5B83D" />
          </svg>
          <span>ToLet<b>.com</b></span>
        </Link>

        <div className="rl">{t('ভাড়াটিয়া', 'Tenant')}</div>
        {navItems.map((n) => (
          <button
            key={n.key}
            type="button"
            className={`nv ${tab === n.key ? 'on' : ''}`}
            onClick={() => {
              setTab(n.key);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {n.icon}
            <span>{n.label}</span>
          </button>
        ))}

        <div className="rl" style={{ marginTop: '8px' }}>
          {t('ডেমো ভিউ', 'Demo views')}
        </div>
        <Link href="/dashboard/landlord" className="nv">
          <Building className="ic" width={19} height={19} />
          <span>{t('বাড়িওয়ালা', 'Landlord')}</span>
        </Link>
        <Link href="/dashboard/admin" className="nv">
          <Shield className="ic" width={19} height={19} />
          <span>{t('অ্যাডমিন', 'Admin')}</span>
        </Link>
        <Link href="/" className="nv" style={{ marginTop: '8px' }}>
          <Home className="ic" width={19} height={19} />
          <span>{t('ওয়েবসাইটে ফিরুন', 'Back to website')}</span>
        </Link>
      </aside>

      {/* Main Container */}
      <div className="dmain">
        {/* Topbar */}
        <div className="dtop">
          <button
            type="button"
            className="ibtn mnav"
            onClick={() => setDrawerOpen(true)}
            aria-label={t('মেনু', 'Menu')}
          >
            <Menu className="ic" width={20} height={20} />
          </button>

          <h1>{currentNav.label}</h1>

          <div className="seg" role="group" aria-label={t('ভাষা', 'Language')}>
            <button
              type="button"
              className={lang === 'bn' ? 'on' : ''}
              onClick={() => setLang('bn')}
            >
              বাং
            </button>
            <button
              type="button"
              className={lang === 'en' ? 'on' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>

          {/* Notifications Menu */}
          <div className="menu">
            <button
              type="button"
              className="ibtn"
              onClick={() => {
                setNotifMenuOpen(!notifMenuOpen);
                setUserMenuOpen(false);
              }}
              aria-label={t('বিজ্ঞপ্তি', 'Notifications')}
            >
              <Bell className="ic" width={20} height={20} />
              {notifs.length > 0 && <span className="dot">{notifs.length}</span>}
            </button>
            {notifMenuOpen && (
              <div className="pop" style={{ minWidth: '300px', maxWidth: '88vw' }}>
                <div className="cap">{t('বিজ্ঞপ্তি (নমুনা)', 'Notifications (sample)')}</div>
                {notifs.map((n) => (
                  <div key={n.id} style={{ padding: '10px 12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px' }}>{lang === 'bn' ? n.t[0] : n.t[1]}</div>
                    <small className="mut">{lang === 'bn' ? n.time[0] : n.time[1]}</small>
                  </div>
                ))}
                <div className="sep" />
                <button
                  type="button"
                  className="mi"
                  onClick={() => {
                    setNotifs([]);
                    setNotifMenuOpen(false);
                    showToast(t('সব নোটিফিকেশন পড়া হয়েছে', 'All notifications marked as read'));
                  }}
                >
                  <Check className="ic" width={18} height={18} />
                  <span>{t('সব পড়া হয়েছে', 'Mark all read')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="menu">
            <button
              type="button"
              className="ibtn"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotifMenuOpen(false);
              }}
              aria-label={t('প্রোফাইল মেনু', 'Profile menu')}
            >
              <User className="ic" width={20} height={20} />
            </button>
            {userMenuOpen && (
              <div className="pop">
                <div className="cap">{t('ডেমো ব্যবহারকারী', 'Demo user')}</div>
                <button
                  type="button"
                  className="mi"
                  onClick={() => {
                    setTab('profile');
                    setUserMenuOpen(false);
                  }}
                >
                  <User className="ic" width={18} height={18} />
                  <span>{t('প্রোফাইল', 'Profile')}</span>
                </button>
                <button
                  type="button"
                  className="mi"
                  onClick={() => {
                    setTab('settings');
                    setUserMenuOpen(false);
                  }}
                >
                  <Cog className="ic" width={18} height={18} />
                  <span>{t('সেটিংস', 'Settings')}</span>
                </button>
                <Link href="/" className="mi">
                  <Home className="ic" width={18} height={18} />
                  <span>{t('ওয়েবসাইট', 'Website')}</span>
                </Link>
                <div className="sep" />
                <button
                  type="button"
                  className="mi"
                  onClick={() => {
                    setUser(null);
                    showToast(t('লগ আউট সম্পন্ন হয়েছে', 'Logged out successfully'));
                    router.push('/login');
                  }}
                >
                  <span style={{ color: 'var(--err)' }}>{t('লগ আউট', 'Log out')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Body */}
        <main className="dbody">
          <div className="demo">
            <Info className="ic" width={16} height={16} />
            <span>{t('ডেমো ডেটা: এখানকার সব তথ্য ও পরিসংখ্যান কাল্পনিক, কোনো বাস্তব সিস্টেমে প্রভাব ফেলে না।', 'Demo data: everything here is fictional and affects no real system.')}</span>
          </div>

          {/* TAB 1: OVERVIEW */}
          {tab === 'overview' && (
            <>
              <div className="sum">
                <div className="sc">
                  <div className="top">
                    <span>{t('সংরক্ষিত', 'Saved')}</span>
                    <Heart className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(favorites.length, lang)}</strong>
                  <small>{t('পছন্দের বাসা', 'Homes you saved')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('জিজ্ঞাসা', 'Inquiries')}</span>
                    <MessageSquare className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(inquiries.length, lang)}</strong>
                  <small>{t('ডেমো', 'Demo')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('ভিজিট অনুরোধ', 'Visit requests')}</span>
                    <Calendar className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(visits.length, lang)}</strong>
                  <small>{t('নমুনা', 'Sample')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('ওয়ান্টেড অনুরোধ', 'Wanted requests')}</span>
                    <Search className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(myWanted.length, lang)}</strong>
                  <small>{t('আপনার প্রকাশিত', 'Posted by you')}</small>
                </div>
              </div>

              <div className="two">
                {/* Recent Inquiries */}
                <div className="card">
                  <div className="ch">
                    <h2>{t('সাম্প্রতিক জিজ্ঞাসা', 'Recent inquiries')}</h2>
                    <button type="button" className="link" onClick={() => setTab('inquiries')}>
                      {t('সব', 'All')} <ChevronRight width={14} height={14} />
                    </button>
                  </div>
                  <div className="tw">
                    <table className="t">
                      <thead>
                        <tr>
                          <th>{t('বাসা', 'Property')}</th>
                          <th>{t('তারিখ', 'Date')}</th>
                          <th>{t('অবস্থা', 'Status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.slice(0, 4).map((iq) => {
                          const prop = properties.find((p) => p.id === iq.propId);
                          return (
                            <tr key={iq.id}>
                              <td>
                                {prop ? (
                                  <Link href={`/properties/${prop.id}`} className="link">
                                    {lang === 'bn' ? prop.title[0] : prop.title[1]}
                                  </Link>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td>{iq.date}</td>
                              <td>
                                <span className={`badge ${iq.status === 'replied' ? 'ok' : 'info'}`}>
                                  {iq.status === 'replied' ? t('উত্তর এসেছে', 'Replied') : t('পাঠানো', 'Sent')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Upcoming Visits */}
                <div className="card">
                  <div className="ch">
                    <h2>{t('আসন্ন ভিজিট (ডেমো)', 'Upcoming visits (demo)')}</h2>
                  </div>
                  {visits.length > 0 ? (
                    visits.map((v) => {
                      const prop = properties.find((p) => p.id === v.propId);
                      return (
                        <div key={v.id} className="li">
                          <div>
                            <strong>
                              {prop ? (
                                <Link href={`/properties/${prop.id}`}>
                                  {lang === 'bn' ? prop.title[0] : prop.title[1]}
                                </Link>
                              ) : (
                                'Property'
                              )}
                            </strong>
                            <small>{v.date} · {v.time}</small>
                          </div>
                          <span className={`badge ${v.status === 'confirmed' ? 'ok' : 'warn'}`}>
                            {v.status === 'confirmed' ? t('নিশ্চিত (ডেমো)', 'Confirmed (demo)') : t('অনুরোধ করা হয়েছে', 'Requested')}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="mut">{t('কোনো ভিজিট অনুরোধ নেই।', 'No visit requests.')}</p>
                  )}
                </div>
              </div>

              {/* Recently Saved */}
              <div className="card">
                <div className="ch">
                  <h2>{t('সম্প্রতি সংরক্ষিত', 'Recently saved')}</h2>
                  <Link href="/properties" className="btn pri sm">
                    <Search className="ic" width={16} height={16} />
                    <span>{t('আরও বাসা খুঁজুন', 'Find more homes')}</span>
                  </Link>
                </div>
                {savedProps.length > 0 ? (
                  savedProps.slice(0, 3).map((p) => (
                    <div key={p.id} className="li">
                      <img src={getArt(p.seed, 'ext')} alt="" />
                      <div>
                        <strong>
                          <Link href={`/properties/${p.id}`} className="link">
                            {lang === 'bn' ? p.title[0] : p.title[1]}
                          </Link>
                        </strong>
                        <small>
                          {LOCATIONS[p.loc as keyof typeof LOCATIONS]?.[lang === 'bn' ? 0 : 1]} · {formatCurrency(p.rent, lang)}
                        </small>
                      </div>
                      <Link href={`/properties/${p.id}`} className="btn ghost sm">
                        <Eye className="ic" width={16} height={16} />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="empty">
                    <div className="ci">
                      <Heart className="ic" width={28} height={28} />
                    </div>
                    <h3>{t('এখনো কিছু সংরক্ষণ করা হয়নি', 'Nothing saved yet')}</h3>
                    <p>{t('পছন্দের বাসা এখানে দেখা যাবে।', 'Your favourites will show up here.')}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: FAVORITES */}
          {tab === 'favorites' && (
            <>
              {savedProps.length > 0 ? (
                <div className="pgrid two">
                  {savedProps.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <div className="ci">
                    <Heart className="ic" width={28} height={28} />
                  </div>
                  <h3>{t('এখনো কিছু সংরক্ষণ করা হয়নি', 'Nothing saved yet')}</h3>
                  <p>{t('যেকোনো বাসার হৃদয় আইকনে ক্লিক করুন।', 'Tap the heart on any home.')}</p>
                  <Link href="/properties" className="btn pri">
                    {t('বাসা খুঁজুন', 'Find a home')}
                  </Link>
                </div>
              )}
            </>
          )}

          {/* TAB 3: INQUIRIES */}
          {tab === 'inquiries' && (
            <div className="tw">
              <table className="t">
                <thead>
                  <tr>
                    <th>{t('বাসা', 'Property')}</th>
                    <th>{t('এলাকা', 'Location')}</th>
                    <th>{t('তারিখ', 'Date')}</th>
                    <th>{t('অবস্থা', 'Status')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((iq) => {
                    const prop = properties.find((p) => p.id === iq.propId);
                    return (
                      <tr key={iq.id}>
                        <td>
                          {prop ? (
                            <Link href={`/properties/${prop.id}`} className="link">
                              {lang === 'bn' ? prop.title[0] : prop.title[1]}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          {prop ? LOCATIONS[prop.loc as keyof typeof LOCATIONS]?.[lang === 'bn' ? 0 : 1] : '—'}
                        </td>
                        <td>{iq.date}</td>
                        <td>
                          <span className={`badge ${iq.status === 'replied' ? 'ok' : 'info'}`}>
                            {iq.status === 'replied' ? t('উত্তর এসেছে', 'Replied') : t('পাঠানো', 'Sent')}
                          </span>
                        </td>
                        <td>
                          {prop && (
                            <Link href={`/properties/${prop.id}`} className="btn line sm">
                              <Eye className="ic" width={16} height={16} />
                              <span>{t('দেখুন', 'View')}</span>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: VISITS */}
          {tab === 'visits' && (
            <>
              {visits.length > 0 ? (
                <div className="tw">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>{t('বাসা', 'Property')}</th>
                        <th>{t('তারিখ ও সময়', 'Date and time')}</th>
                        <th>{t('অবস্থা', 'Status')}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((v) => {
                        const prop = properties.find((p) => p.id === v.propId);
                        return (
                          <tr key={v.id}>
                            <td>
                              {prop ? (
                                <Link href={`/properties/${prop.id}`} className="link">
                                  {lang === 'bn' ? prop.title[0] : prop.title[1]}
                                </Link>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td>{v.date} · {v.time}</td>
                            <td>
                              <span className={`badge ${v.status === 'confirmed' ? 'ok' : 'warn'}`}>
                                {v.status === 'confirmed' ? t('নিশ্চিত (ডেমো)', 'Confirmed (demo)') : t('অনুরোধ করা হয়েছে', 'Requested')}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn line sm"
                                onClick={() => {
                                  setVisits(visits.filter((x) => x.id !== v.id));
                                  showToast(t('ভিজিট অনুরোধ বাতিল করা হয়েছে', 'Visit request cancelled'));
                                }}
                              >
                                {t('বাতিল', 'Cancel')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty">
                  <div className="ci">
                    <Calendar className="ic" width={28} height={28} />
                  </div>
                  <h3>{t('কোনো ভিজিট অনুরোধ নেই', 'No visit requests')}</h3>
                  <p>{t('বাসার পাতা থেকে ভিজিটের অনুরোধ করুন।', 'Request a visit from a property page.')}</p>
                </div>
              )}
            </>
          )}

          {/* TAB 5: WANTED */}
          {tab === 'wanted' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Link href="/wanted/new" className="btn pri">
                  <Plus className="ic" width={18} height={18} />
                  <span>{t('নতুন অনুরোধ', 'New request')}</span>
                </Link>
              </div>
              {myWanted.length > 0 ? (
                <div className="grid2">
                  {myWanted.map((w) => (
                    <div key={w.id}>
                      <article className="card flat" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                          <span className="tag">
                            {PROPERTY_TYPES[w.type as keyof typeof PROPERTY_TYPES]?.[lang === 'bn' ? 0 : 1] || w.type}
                          </span>
                          <span className="badge info">{t('আপনার অনুরোধ', 'Your request')}</span>
                        </div>
                        <h3 style={{ fontSize: '16.5px' }}>
                          {LOCATIONS[w.loc as keyof typeof LOCATIONS]?.[lang === 'bn' ? 0 : 1]}, {t('ঢাকা', 'Dhaka')} — {w.beds} {t('বেডরুম', 'bedroom')}
                        </h3>
                        <div className="price">
                          <strong className="num">{formatCurrency(w.min, lang)} – {formatCurrency(w.max, lang)}</strong>
                          <span>/{t('মাস', 'month')}</span>
                        </div>
                        <p className="mut" style={{ fontSize: '14px' }}>{w.note}</p>
                        <div className="pc-f" style={{ borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                          <span className="loct">
                            <Calendar className="ic" width={15} height={15} />
                            {t('ওঠার তারিখ', 'Move-in')}: {w.move}
                          </span>
                        </div>
                      </article>
                      <div style={{ marginTop: '8px' }}>
                        <button
                          type="button"
                          className="btn line sm"
                          onClick={() => {
                            setMyWanted(myWanted.filter((x) => x.id !== w.id));
                            showToast(t('বিজ্ঞাপন মুছে ফেলা হয়েছে', 'Wanted request removed'));
                          }}
                        >
                          <Trash2 className="ic" width={16} height={16} />
                          <span>{t('মুছুন', 'Delete')}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <div className="ci">
                    <Search className="ic" width={28} height={28} />
                  </div>
                  <h3>{t('আপনি এখনো কোনো অনুরোধ প্রকাশ করেননি', 'You have not posted a request yet')}</h3>
                  <p>{t('আপনার বাজেট ও প্রয়োজন জানিয়ে অনুরোধ প্রকাশ করুন।', 'Post your budget and requirements.')}</p>
                </div>
              )}
            </>
          )}

          {/* TAB 6: MESSAGES */}
          {tab === 'messages' && (
            <>
              <div className="note info">
                <Info className="ic" width={18} height={18} />
                <span>{t('এগুলো কাল্পনিক ডেমো কথোপকথন। কোনো বার্তা সত্যিকারে পাঠানো হয় না।', 'These are fictional demo conversations. No message is actually delivered.')}</span>
              </div>
              <div className="msgs">
                <div className="cl" role="tablist" aria-label={t('কথোপকথন', 'Conversations')}>
                  {convs.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === activeConvIdx}
                      className={idx === activeConvIdx ? 'on' : ''}
                      onClick={() => setActiveConvIdx(idx)}
                    >
                      <span className="av">{c.name.slice(0, 1)}</span>
                      <span style={{ minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '14px' }}>{c.name}</strong>
                        <small className="mut">
                          {c.messages[c.messages.length - 1].text.slice(0, 26)}…
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="th">
                  <div className="bd" aria-live="polite">
                    {convs[activeConvIdx].messages.map((m, mIdx) => (
                      <div key={mIdx} className={`bub ${m.sender === 1 ? 'me' : ''}`}>
                        {m.text}
                        <small>{m.time}</small>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage}>
                    <input
                      name="m"
                      className="in"
                      placeholder={t('বার্তা লিখুন (ডেমো)', 'Write a message (demo)')}
                      autoComplete="off"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button className="btn pri" type="submit" aria-label={t('পাঠান', 'Send')}>
                      <Send className="ic" width={18} height={18} />
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}

          {/* TAB 7: PROFILE */}
          {tab === 'profile' && (
            <form
              className="card"
              style={{ maxWidth: '720px', display: 'grid', gap: '16px' }}
              onSubmit={(e) => {
                e.preventDefault();
                showToast(t('প্রোফাইল আপডেট সফল হয়েছে (ডেমো)', 'Profile updated (demo)'));
              }}
            >
              <div className="lc">
                <span className="av" style={{ width: '60px', height: '60px', fontSize: '22px' }}>
                  {profile.name.slice(0, 1)}
                </span>
                <div>
                  <strong>{profile.name}</strong>
                  <div className="hint">{t('ডেমো প্রোফাইল', 'Demo profile')}</div>
                </div>
              </div>

              <div className="grid2">
                <div className="fld">
                  <label htmlFor="pf-n">{t('পূর্ণ নাম', 'Full name')}</label>
                  <input
                    id="pf-n"
                    name="n"
                    className="in"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="pf-p">{t('মোবাইল', 'Mobile')}</label>
                  <input
                    id="pf-p"
                    name="p"
                    className="in"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="pf-e">{t('ইমেইল', 'Email')}</label>
                  <input
                    id="pf-e"
                    name="e"
                    type="email"
                    className="in"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="pf-a">{t('এলাকা', 'Area')}</label>
                  <input
                    id="pf-a"
                    name="a"
                    className="in"
                    value={profile.area}
                    onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <button className="btn pri" type="submit">
                  {t('সংরক্ষণ করুন (ডেমো)', 'Save (demo)')}
                </button>
              </div>
            </form>
          )}

          {/* TAB 8: SETTINGS */}
          {tab === 'settings' && (
            <div className="card" style={{ maxWidth: '720px' }}>
              <div className="row">
                <div>
                  <strong>{t('ইমেইল বিজ্ঞপ্তি', 'Email notifications')}</strong>
                  <small>{t('নতুন কার্যক্রমের খবর ইমেইলে', 'Updates about activity by email')}</small>
                </div>
                <button
                  type="button"
                  className={`tg ${settings.email ? 'on' : ''}`}
                  role="switch"
                  aria-checked={settings.email}
                  onClick={() => setSettings({ ...settings, email: !settings.email })}
                />
              </div>

              <div className="row">
                <div>
                  <strong>{t('এসএমএস বিজ্ঞপ্তি', 'SMS notifications')}</strong>
                  <small>{t('গুরুত্বপূর্ণ আপডেট এসএমএসে', 'Important updates by SMS')}</small>
                </div>
                <button
                  type="button"
                  className={`tg ${settings.sms ? 'on' : ''}`}
                  role="switch"
                  aria-checked={settings.sms}
                  onClick={() => setSettings({ ...settings, sms: !settings.sms })}
                />
              </div>

              <div className="row">
                <div>
                  <strong>{t('সাপ্তাহিক সারাংশ', 'Weekly digest')}</strong>
                  <small>{t('সপ্তাহের নতুন বাসার সারাংশ', 'A summary of new homes each week')}</small>
                </div>
                <button
                  type="button"
                  className={`tg ${settings.digest ? 'on' : ''}`}
                  role="switch"
                  aria-checked={settings.digest}
                  onClick={() => setSettings({ ...settings, digest: !settings.digest })}
                />
              </div>

              <div className="row">
                <div>
                  <strong>{t('ভিজিট রিমাইন্ডার', 'Visit reminders')}</strong>
                  <small>{t('ভিজিটের আগে মনে করিয়ে দিন', 'Remind me before a visit')}</small>
                </div>
                <button
                  type="button"
                  className={`tg ${settings.visit ? 'on' : ''}`}
                  role="switch"
                  aria-checked={settings.visit}
                  onClick={() => setSettings({ ...settings, visit: !settings.visit })}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="drw" onClick={() => setDrawerOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('ড্যাশবোর্ড মেনু', 'Dashboard menu')}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
              <Link href="/" className="logo">
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <rect width="34" height="34" rx="9" fill="var(--pri)" />
                  <path d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z" fill="#fff" />
                  <circle cx="24.5" cy="9.5" r="3" fill="#F5B83D" />
                </svg>
                <span>ToLet<b>.com</b></span>
              </Link>
              <button type="button" className="ibtn" onClick={() => setDrawerOpen(false)}>
                <X className="ic" width={20} height={20} />
              </button>
            </div>
            <div className="nl">
              {navItems.map((n) => (
                <button
                  key={n.key}
                  type="button"
                  style={tab === n.key ? { background: 'var(--soft)', color: 'var(--pri-t)', fontWeight: 600 } : {}}
                  onClick={() => {
                    setTab(n.key);
                    setDrawerOpen(false);
                  }}
                >
                  {n.icon}
                  <span>{n.label}</span>
                </button>
              ))}
              <Link href="/" className="nv">
                <Home className="ic" width={20} height={20} />
                <span>{t('ওয়েবসাইটে ফিরুন', 'Back to website')}</span>
              </Link>
              <Link href="/dashboard/landlord" className="nv">
                <Building className="ic" width={20} height={20} />
                <span>{t('বাড়িওয়ালা ভিউ', 'Landlord view')}</span>
              </Link>
              <Link href="/dashboard/admin" className="nv">
                <Shield className="ic" width={20} height={20} />
                <span>{t('অ্যাডমিন ভিউ', 'Admin view')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
