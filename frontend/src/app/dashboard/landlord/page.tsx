'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LineChart, BarChart } from '@/components/common/Charts';
import { LOCATIONS, PROPERTY_TYPES, AMENITIES, CONDITIONS, FURNISHING } from '@/lib/constants';
import { getArt } from '@/lib/art';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Building,
  Plus,
  MessageSquare,
  Calendar,
  Users,
  Mail,
  BarChart2,
  Wallet,
  User,
  Cog,
  Home,
  Shield,
  Bell,
  Menu,
  X,
  Info,
  Check,
  ChevronRight,
  Eye,
  Trash2,
  Edit2,
  Send,
  Upload,
  ArrowLeft,
} from 'lucide-react';

export default function LandlordDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#64716A]">লোড হচ্ছে...</div>}>
      <LandlordDashboardContent />
    </Suspense>
  );
}

function LandlordDashboardContent() {
  const { lang, setLang, showToast, user, setUser, properties, setProperties } = useApp();
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
    { id: 'n1', t: ['একটি নতুন ভিজিট অনুরোধ এসেছে', 'A new visit request has arrived'], time: ['১০ মিনিট আগে', '10 min ago'] },
    { id: 'n2', t: ['আপনার বিজ্ঞাপনে নতুন অনুসন্ধান জমা হয়েছে', 'New inquiry received on listing'], time: ['২ ঘণ্টা আগে', '2 h ago'] },
  ]);

  // Landlord Properties (owned by 'me' or all local demo properties)
  const myProps = properties.slice(0, 5);

  // Inquiries State
  const [inqFilter, setInqFilter] = useState<'all' | 'new' | 'replied'>('all');
  const [inquiries, setInquiries] = useState([
    { id: 'lq1', from: 'তানভীর আহমেদ', propId: 'p1', msg: 'পরিবার নিয়ে ওঠার জন্য কি আগামী মাস থেকে খালি হবে?', date: '2026-10-09', status: 'new' as const },
    { id: 'lq2', from: 'সাদিয়া জাহান', propId: 'p2', msg: 'গ্যাস সংযোগ কি সিলিন্ডার নাকি পাইপলাইন?', date: '2026-10-08', status: 'new' as const },
    { id: 'lq3', from: 'আব্দুল মতিন', propId: 'p1', msg: 'অগ্রিম কত মাসের দিতে হবে?', date: '2026-10-06', status: 'replied' as const },
  ]);

interface LandlordVisit {
  id: string;
  from: string;
  propId: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'declined';
}

  // Visits State
  const [visits, setVisits] = useState<LandlordVisit[]>([
    { id: 'lv1', from: 'তানভীর আহমেদ', propId: 'p1', date: '2026-10-15', time: '11:00 AM', status: 'pending' },
    { id: 'lv2', from: 'মাহমুদুল হাসান', propId: 'p3', date: '2026-10-16', time: '04:30 PM', status: 'approved' },
  ]);

  // Tenants State
  const [tenants] = useState([
    { id: 't1', name: 'আব্দুল্লাহ আল মামুন', propId: 'p1', rent: 28000, since: '2025-06-01', status: 'paid' as const },
    { id: 't2', name: 'নাসরিন সুলতানা', propId: 'p2', rent: 35000, since: '2025-11-01', status: 'due' as const },
  ]);

  // Credits & Transactions
  const [credits, setCredits] = useState(150);
  const [txs, setTxs] = useState([
    { id: 'tx-1', type: ['লিস্টিং ক্রেডিট টপ-আপ (ডেমো)', 'Credit top-up (demo)'], date: '2026-10-08', cr: 100 },
    { id: 'tx-2', type: ['লিস্টিং বুস্ট ফি', 'Listing boost fee'], date: '2026-10-05', cr: -30 },
    { id: 'tx-3', type: ['নতুন বাসা প্রকাশ ফি', 'New listing publication fee'], date: '2026-10-01', cr: -20 },
  ]);

  // Quick Edit Modal
  const [editPropId, setEditPropId] = useState<string | null>(null);
  const [editRent, setEditRent] = useState<number>(0);

  // Conversations State
  const [activeConvIdx, setActiveConvIdx] = useState(0);
  const [convs, setConvs] = useState([
    {
      name: 'তানভীর আহমেদ (ভাড়াটিয়া)',
      propTitle: 'বনশ্রীতে ৩ বেডরুমের আলো-বাতাসপূর্ণ ফ্ল্যাট',
      messages: [
        { sender: 0, text: 'আসসালামু আলাইকুম, বাসাটি কি এখনও খালি আছে?', time: 'গতকাল ১০:১৫' },
        { sender: 1, text: 'ওয়ালাইকুম আসসালাম। জি, আগামী মাসের ১ তারিখ থেকে খালি হবে।', time: 'গতকাল ১০:৩০' },
        { sender: 0, text: 'পরিবার নিয়ে সপরিবারে দেখার জন্য কবে আসা যাবে?', time: 'গতকাল ১০:৩৫' },
      ],
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Add Property 6-Step Workflow State
  const [step, setStep] = useState(1);
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

  const [settings, setSettings] = useState({
    email: true,
    sms: true,
    visit: true,
  });

  const viewsData = [42, 55, 48, 70, 64, 81, 77, 90, 86, 102, 95, 118, 110, 126];
  const dayLabels = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(2026, 9, 10 - (13 - i));
    return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short' });
  });

  const navItems = [
    { key: 'overview', icon: <BarChart2 className="ic" width={19} height={19} />, label: t('ওভারভিউ', 'Overview') },
    { key: 'properties', icon: <Building className="ic" width={19} height={19} />, label: t('আমার বাসা', 'My properties') },
    { key: 'add', icon: <Plus className="ic" width={19} height={19} />, label: t('বাসা যোগ করুন', 'Add property') },
    { key: 'inquiries', icon: <MessageSquare className="ic" width={19} height={19} />, label: t('জিজ্ঞাসা', 'Inquiries') },
    { key: 'visits', icon: <Calendar className="ic" width={19} height={19} />, label: t('ভিজিট ব্যবস্থাপনা', 'Visit management') },
    { key: 'tenants', icon: <Users className="ic" width={19} height={19} />, label: t('ভাড়াটিয়া', 'Tenants') },
    { key: 'messages', icon: <Mail className="ic" width={19} height={19} />, label: t('বার্তা', 'Messages') },
    { key: 'analytics', icon: <BarChart2 className="ic" width={19} height={19} />, label: t('পরিসংখ্যান', 'Analytics') },
    { key: 'credits', icon: <Wallet className="ic" width={19} height={19} />, label: t('ক্রেডিট ও লেনদেন', 'Credits & transactions') },
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

        <div className="rl">{t('বাড়িওয়ালা', 'Landlord')}</div>
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
        <Link href="/dashboard/tenant" className="nv">
          <User className="ic" width={19} height={19} />
          <span>{t('ভাড়াটিয়া', 'Tenant')}</span>
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
                <div className="cap">{t('ডেমো বাড়িওয়ালা', 'Demo landlord')}</div>
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
                    <span>{t('সক্রিয় তালিকা', 'Active listings')}</span>
                    <Building className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(myProps.filter((p) => p.status === 'active').length, lang)}</strong>
                  <small>{t('প্রকাশিত', 'Published')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('রিভিউতে', 'Under review')}</span>
                    <ClockIcon className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(myProps.filter((p) => p.status === 'pending').length, lang)}</strong>
                  <small>{t('মডারেশন অপেক্ষমাণ', 'Awaiting moderation')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('নতুন জিজ্ঞাসা', 'New inquiries')}</span>
                    <MessageSquare className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(inquiries.filter((i) => i.status === 'new').length, lang)}</strong>
                  <small>{t('উত্তর দেওয়া বাকি', 'Awaiting reply')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('মোট ভিউ (নমুনা)', 'Total views (sample)')}</span>
                    <Eye className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(1260, lang)}</strong>
                  <small>{t('সব তালিকা', 'All listings')}</small>
                </div>
              </div>

              <div className="two">
                {/* 14 Days View Line Chart */}
                <div className="card">
                  <div className="ch">
                    <h2>{t('গত ১৪ দিনের ভিউ (নমুনা)', 'Views, last 14 days (sample)')}</h2>
                  </div>
                  <LineChart data={viewsData} labels={dayLabels} lang={lang} />
                </div>

                {/* Moderation Status */}
                <div className="card">
                  <div className="ch">
                    <h2>{t('তালিকার মডারেশন অবস্থা', 'Listing moderation status')}</h2>
                  </div>
                  {myProps.map((p) => (
                    <div key={p.id} className="li">
                      <div>
                        <strong>
                          <Link href={`/properties/${p.id}`}>
                            {lang === 'bn' ? p.title[0] : p.title[1]}
                          </Link>
                        </strong>
                        <small>{formatCurrency(p.rent, lang)}</small>
                      </div>
                      <span className={`badge ${p.status === 'active' ? 'ok' : p.status === 'pending' ? 'warn' : 'err'}`}>
                        {p.status === 'active' ? t('সক্রিয়', 'Active') : p.status === 'pending' ? t('অপেক্ষমাণ', 'Pending') : t('প্রত্যাখ্যাত', 'Rejected')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="card">
                <div className="ch">
                  <h2>{t('সাম্প্রতিক জিজ্ঞাসা', 'Recent inquiries')}</h2>
                  <button type="button" className="btn pri sm" onClick={() => setTab('add')}>
                    <Plus className="ic" width={16} height={16} />
                    <span>{t('বাসা যোগ করুন', 'Add property')}</span>
                  </button>
                </div>
                <div className="tw">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>{t('প্রেরক', 'From')}</th>
                        <th>{t('বাসা', 'Property')}</th>
                        <th>{t('বার্তা', 'Message')}</th>
                        <th>{t('অবস্থা', 'Status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.slice(0, 3).map((iq) => {
                        const prop = properties.find((p) => p.id === iq.propId);
                        return (
                          <tr key={iq.id}>
                            <td><strong>{iq.from}</strong></td>
                            <td>
                              {prop ? (
                                <Link href={`/properties/${prop.id}`} className="link">
                                  {lang === 'bn' ? prop.title[0] : prop.title[1]}
                                </Link>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td><span style={{ minWidth: '180px', display: 'block' }}>{iq.msg}</span></td>
                            <td>
                              <span className={`badge ${iq.status === 'replied' ? 'ok' : 'info'}`}>
                                {iq.status === 'replied' ? t('উত্তর এসেছে', 'Replied') : t('নতুন', 'New')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MY PROPERTIES */}
          {tab === 'properties' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
                <p className="mut">{formatNumber(myProps.length, lang)} {t('টি তালিকা', 'listings')}</p>
                <button type="button" className="btn pri" onClick={() => setTab('add')}>
                  <Plus className="ic" width={18} height={18} />
                  <span>{t('নতুন বাসা', 'New property')}</span>
                </button>
              </div>

              <div className="tw">
                <table className="t">
                  <thead>
                    <tr>
                      <th>{t('বাসা', 'Property')}</th>
                      <th>{t('ভাড়া', 'Rent')}</th>
                      <th>{t('অবস্থা', 'Status')}</th>
                      <th>{t('ভিউ', 'Views')}</th>
                      <th>{t('কার্যক্রম', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProps.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '220px' }}>
                            <img src={getArt(p.seed, 'ext')} alt="" style={{ width: '56px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                              <strong style={{ fontSize: '14px' }}>
                                <Link href={`/properties/${p.id}`} className="link">
                                  {lang === 'bn' ? p.title[0] : p.title[1]}
                                </Link>
                              </strong>
                              <div className="hint">{LOCATIONS[p.loc as keyof typeof LOCATIONS]?.[lang === 'bn' ? 0 : 1]}</div>
                              {p.status === 'rejected' && (
                                <div className="err">{t('কারণ: ছবি অস্পষ্ট (নমুনা)', 'Reason: photos unclear (sample)')}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td><strong>{formatCurrency(p.rent, lang)}</strong></td>
                        <td>
                          <span className={`badge ${p.status === 'active' ? 'ok' : p.status === 'pending' ? 'warn' : 'err'}`}>
                            {p.status === 'active' ? t('সক্রিয়', 'Active') : p.status === 'pending' ? t('অপেক্ষমাণ', 'Pending') : t('প্রত্যাখ্যাত', 'Rejected')}
                          </span>
                        </td>
                        <td>{formatNumber(p.id.charCodeAt(1) * 12, lang)}</td>
                        <td>
                          <div className="acts">
                            <button
                              type="button"
                              className="btn line sm"
                              onClick={() => {
                                setEditPropId(p.id);
                                setEditRent(p.rent);
                              }}
                            >
                              <Edit2 className="ic" width={15} height={15} />
                              <span>{t('সম্পাদনা', 'Edit')}</span>
                            </button>
                            <button
                              type="button"
                              className="btn line sm"
                              onClick={() => {
                                const nextStatus = p.status === 'active' ? 'draft' : 'pending';
                                setProperties(properties.map((x) => (x.id === p.id ? { ...x, status: nextStatus } : x)));
                                showToast(
                                  nextStatus === 'draft'
                                    ? t('তালিকা আনপাবলিশ করা হয়েছে', 'Listing unpublished')
                                    : t('রিভিউয়ের জন্য জমা দেওয়া হয়েছে', 'Submitted for review')
                                );
                              }}
                            >
                              {p.status === 'active' ? t('আনপাবলিশ', 'Unpublish') : t('রিভিউতে পাঠান', 'Submit')}
                            </button>
                            <button
                              type="button"
                              className="btn ghost sm"
                              onClick={() => {
                                setProperties(properties.filter((x) => x.id !== p.id));
                                showToast(t('তালিকা মুছে ফেলা হয়েছে', 'Listing deleted'));
                              }}
                              aria-label={t('মুছুন', 'Delete')}
                            >
                              <Trash2 className="ic" width={16} height={16} style={{ color: 'var(--err)' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Edit Dialog */}
              {editPropId && (
                <div className="ov" onClick={() => setEditPropId(null)}>
                  <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h3>{t('বাসা সম্পাদনা', 'Edit property')}</h3>
                    <div className="fld">
                      <label>{t('মাসিক ভাড়া (৳)', 'Monthly rent (৳)')}</label>
                      <input
                        type="number"
                        className="in"
                        value={editRent}
                        onChange={(e) => setEditRent(Number(e.target.value))}
                      />
                    </div>
                    <div className="mf">
                      <button type="button" className="btn line" onClick={() => setEditPropId(null)}>
                        {t('বাতিল', 'Cancel')}
                      </button>
                      <button
                        type="button"
                        className="btn pri"
                        onClick={() => {
                          setProperties(properties.map((x) => (x.id === editPropId ? { ...x, rent: editRent } : x)));
                          setEditPropId(null);
                          showToast(t('ভাড়া আপডেট সম্পন্ন হয়েছে', 'Rent updated'));
                        }}
                      >
                        {t('সংরক্ষণ করুন', 'Save')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 3: ADD PROPERTY */}
          {tab === 'add' && (
            <div style={{ display: 'grid', gap: '18px', maxWidth: '860px' }}>
              <div className="steps" aria-label={t('ধাপ', 'Steps')}>
                {[
                  t('বেসিক তথ্য', 'Basics'),
                  t('অবস্থান', 'Location'),
                  t('ভাড়া ও শর্ত', 'Rent & terms'),
                  t('রুম ও সুবিধা', 'Rooms & amenities'),
                  t('ছবি', 'Photos'),
                  t('রিভিউ', 'Review'),
                ].map((sName, sIdx) => {
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

              <div className="card" style={{ display: 'grid', gap: '18px' }}>
                <h2>
                  {formatNumber(step, lang)}. {
                    [
                      t('বেসিক তথ্য', 'Basics'),
                      t('অবস্থান', 'Location'),
                      t('ভাড়া ও শর্ত', 'Rent & terms'),
                      t('রুম ও সুবিধা', 'Rooms & amenities'),
                      t('ছবি', 'Photos'),
                      t('রিভিউ', 'Review'),
                    ][step - 1]
                  }
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
                      <span className="hint">{t('সর্বোচ্চ ৮টি। ছবি কোথাও আপলোড হয় না, শুধু এই পৃষ্ঠায় প্রিভিউ দেখা যায়।', 'Up to 8. Photos preview locally.')}</span>
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
                      onClick={() => {
                        const newProp = {
                          id: `p-${Date.now().toString(36)}`,
                          title: [draft.title || 'নতুন ফ্ল্যাট', draft.title || 'New Flat'] as [string, string],
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
                          desc: [draft.desc || 'বাসার বর্ণনা', draft.desc || 'Property description'] as [string, string],
                        };
                        setProperties([newProp, ...properties]);
                        showToast(t('তালিকা জমা হয়েছে! মডারেশন অপেক্ষমাণ।', 'Listing submitted for moderation'));
                        setTab('properties');
                        setStep(1);
                      }}
                    >
                      <span>{t('জমা দিন', 'Submit listing')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INQUIRIES */}
          {tab === 'inquiries' && (
            <>
              <div className="tabs" role="tablist">
                <button
                  type="button"
                  className={inqFilter === 'all' ? 'on' : ''}
                  onClick={() => setInqFilter('all')}
                >
                  {t('সব', 'All')}
                </button>
                <button
                  type="button"
                  className={inqFilter === 'new' ? 'on' : ''}
                  onClick={() => setInqFilter('new')}
                >
                  {t('নতুন', 'New')}
                </button>
                <button
                  type="button"
                  className={inqFilter === 'replied' ? 'on' : ''}
                  onClick={() => setInqFilter('replied')}
                >
                  {t('উত্তর দেওয়া', 'Replied')}
                </button>
              </div>

              <div className="tw">
                <table className="t">
                  <thead>
                    <tr>
                      <th>{t('প্রেরক', 'From')}</th>
                      <th>{t('বাসা', 'Property')}</th>
                      <th>{t('বার্তা', 'Message')}</th>
                      <th>{t('তারিখ', 'Date')}</th>
                      <th>{t('অবস্থা', 'Status')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries
                      .filter((iq) => inqFilter === 'all' || iq.status === inqFilter)
                      .map((iq) => {
                        const prop = properties.find((p) => p.id === iq.propId);
                        return (
                          <tr key={iq.id}>
                            <td><strong>{iq.from}</strong></td>
                            <td>
                              {prop ? (
                                <Link href={`/properties/${prop.id}`} className="link">
                                  {lang === 'bn' ? prop.title[0] : prop.title[1]}
                                </Link>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td><span style={{ minWidth: '200px', display: 'block' }}>{iq.msg}</span></td>
                            <td>{iq.date}</td>
                            <td>
                              <span className={`badge ${iq.status === 'replied' ? 'ok' : 'info'}`}>
                                {iq.status === 'replied' ? t('উত্তর এসেছে', 'Replied') : t('নতুন', 'New')}
                              </span>
                            </td>
                            <td>
                              {iq.status === 'new' && (
                                <button
                                  type="button"
                                  className="btn pri sm"
                                  onClick={() => {
                                    setInquiries(inquiries.map((x) => (x.id === iq.id ? { ...x, status: 'replied' } : x)));
                                    showToast(t('উত্তর রেকর্ড করা হয়েছে (ডেমো)', 'Reply recorded (demo)'));
                                  }}
                                >
                                  <Send className="ic" width={15} height={15} />
                                  <span>{t('উত্তর দিন', 'Reply')}</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 5: VISITS */}
          {tab === 'visits' && (
            <div className="tw">
              <table className="t">
                <thead>
                  <tr>
                    <th>{t('আবেদনকারী', 'Requested by')}</th>
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
                        <td><strong>{v.from}</strong></td>
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
                          <span className={`badge ${v.status === 'approved' ? 'ok' : v.status === 'pending' ? 'warn' : 'err'}`}>
                            {v.status === 'approved' ? t('অনুমোদিত', 'Approved') : v.status === 'pending' ? t('অপেক্ষমাণ', 'Pending') : t('প্রত্যাখ্যাত', 'Declined')}
                          </span>
                        </td>
                        <td>
                          {v.status === 'pending' && (
                            <div className="acts">
                              <button
                                type="button"
                                className="btn pri sm"
                                onClick={() => {
                                  setVisits(visits.map((x) => (x.id === v.id ? { ...x, status: 'approved' } : x)));
                                  showToast(t('ভিজিট অনুমোদিত হয়েছে', 'Visit approved'));
                                }}
                              >
                                {t('অনুমোদন', 'Approve')}
                              </button>
                              <button
                                type="button"
                                className="btn line sm"
                                onClick={() => {
                                  setVisits(visits.map((x) => (x.id === v.id ? { ...x, status: 'declined' } : x)));
                                  showToast(t('ভিজিট প্রত্যাখ্যান করা হয়েছে', 'Visit declined'));
                                }}
                              >
                                {t('প্রত্যাখ্যান', 'Decline')}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: TENANTS */}
          {tab === 'tenants' && (
            <div className="tw">
              <table className="t">
                <thead>
                  <tr>
                    <th>{t('ভাড়াটিয়া', 'Tenant')}</th>
                    <th>{t('বাসা', 'Property')}</th>
                    <th>{t('ভাড়া', 'Rent')}</th>
                    <th>{t('শুরু', 'Since')}</th>
                    <th>{t('এই মাস', 'This month')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tn) => {
                    const prop = properties.find((p) => p.id === tn.propId);
                    return (
                      <tr key={tn.id}>
                        <td><strong>{tn.name}</strong></td>
                        <td>
                          {prop ? (
                            <Link href={`/properties/${prop.id}`} className="link">
                              {lang === 'bn' ? prop.title[0] : prop.title[1]}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td><strong>{formatCurrency(tn.rent, lang)}</strong></td>
                        <td>{tn.since}</td>
                        <td>
                          <span className={`badge ${tn.status === 'paid' ? 'ok' : 'warn'}`}>
                            {tn.status === 'paid' ? t('পরিশোধিত', 'Paid') : t('বকেয়া', 'Due')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: MESSAGES */}
          {tab === 'messages' && (
            <>
              <div className="note info">
                <Info className="ic" width={18} height={18} />
                <span>{t('এগুলো কাল্পনিক ডেমো কথোপকথন। কোনো বার্তা সত্যিকারে পাঠানো হয় না।', 'These are fictional demo conversations.')}</span>
              </div>
              <div className="msgs">
                <div className="cl" role="tablist">
                  {convs.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={idx === activeConvIdx ? 'on' : ''}
                      onClick={() => setActiveConvIdx(idx)}
                    >
                      <span className="av">{c.name.slice(0, 1)}</span>
                      <span style={{ minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '14px' }}>{c.name}</strong>
                        <small className="mut">{c.messages[c.messages.length - 1].text.slice(0, 26)}…</small>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="th">
                  <div className="bd">
                    {convs[activeConvIdx].messages.map((m, mIdx) => (
                      <div key={mIdx} className={`bub ${m.sender === 1 ? 'me' : ''}`}>
                        {m.text}
                        <small>{m.time}</small>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
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
                    }}
                  >
                    <input
                      name="m"
                      className="in"
                      placeholder={t('বার্তা লিখুন (ডেমো)', 'Write a message (demo)')}
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

          {/* TAB 8: ANALYTICS */}
          {tab === 'analytics' && (
            <>
              <div className="two">
                <div className="card">
                  <div className="ch">
                    <h2>{t('ভিউ (নমুনা)', 'Views (sample)')}</h2>
                  </div>
                  <LineChart data={viewsData} labels={dayLabels} lang={lang} />
                </div>
                <div className="card">
                  <div className="ch">
                    <h2>{t('তালিকা অনুযায়ী জিজ্ঞাসা (নমুনা)', 'Inquiries per listing (sample)')}</h2>
                  </div>
                  <BarChart
                    items={[
                      ['P1', 14],
                      ['P2', 8],
                      ['P3', 19],
                      ['P4', 5],
                    ]}
                    lang={lang}
                  />
                </div>
              </div>

              <div className="card">
                <div className="ch">
                  <h2>{t('তালিকার কার্যকারিতা (নমুনা)', 'Listing performance (sample)')}</h2>
                </div>
                <div className="tw">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>{t('বাসা', 'Property')}</th>
                        <th>{t('ভিউ', 'Views')}</th>
                        <th>{t('জিজ্ঞাসা', 'Inquiries')}</th>
                        <th>{t('জিজ্ঞাসার হার', 'Inquiry rate')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myProps.map((p, idx) => (
                        <tr key={p.id}>
                          <td>
                            <Link href={`/properties/${p.id}`} className="link">
                              {lang === 'bn' ? p.title[0] : p.title[1]}
                            </Link>
                          </td>
                          <td><strong>{formatNumber(150 + idx * 80, lang)}</strong></td>
                          <td>{formatNumber(8 + idx * 4, lang)}</td>
                          <td>{formatNumber(5.2 + idx * 0.8, lang)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 9: CREDITS */}
          {tab === 'credits' && (
            <>
              <div className="sum">
                <div className="sc">
                  <div className="top">
                    <span>{t('ক্রেডিট ব্যালেন্স (নমুনা)', 'Credit balance (sample)')}</span>
                    <Wallet className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(credits, lang)}</strong>
                  <small>{t('পেমেন্ট প্রক্রিয়া হয় না', 'No payment is processed')}</small>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                  type="button"
                  className="btn pri"
                  onClick={() => {
                    setCredits(credits + 100);
                    setTxs([
                      {
                        id: `tx-${Date.now()}`,
                        type: ['ক্রেডিট টপ-আপ (ডেমো, কোনো পেমেন্ট নেই)', 'Credit top-up (demo)'],
                        date: '2026-10-10',
                        cr: 100,
                      },
                      ...txs,
                    ]);
                    showToast(t('১০০ ডেমো ক্রেডিট যোগ হয়েছে', '100 demo credits added'));
                  }}
                >
                  <Plus className="ic" width={18} height={18} />
                  <span>{t('ক্রেডিট যোগ করুন (ডেমো)', 'Add credits (demo)')}</span>
                </button>
              </div>

              <div className="card">
                <div className="ch">
                  <h2>{t('লেনদেন (নমুনা)', 'Transactions (sample)')}</h2>
                </div>
                <div className="tw">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>{t('বিবরণ', 'Description')}</th>
                        <th>{t('তারিখ', 'Date')}</th>
                        <th>{t('ক্রেডিট', 'Credits')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txs.map((x) => (
                        <tr key={x.id}>
                          <td>{lang === 'bn' ? x.type[0] : x.type[1]}</td>
                          <td>{x.date}</td>
                          <td>
                            <strong className="num" style={{ color: x.cr < 0 ? 'var(--err)' : 'var(--ok)' }}>
                              {x.cr > 0 ? '+' : ''}{formatNumber(x.cr, lang)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 10: PROFILE */}
          {tab === 'profile' && (
            <form
              className="card"
              style={{ maxWidth: '720px', display: 'grid', gap: '16px' }}
              onSubmit={(e) => {
                e.preventDefault();
                showToast(t('বাড়িওয়ালার প্রোফাইল আপডেট হয়েছে', 'Landlord profile saved'));
              }}
            >
              <div className="lc">
                <span className="av" style={{ width: '60px', height: '60px', fontSize: '22px' }}>
                  {t('র', 'R')}
                </span>
                <div>
                  <strong>{t('মোঃ রফিকুল ইসলাম', 'Md. Rafiqul Islam')}</strong>
                  <div className="hint">{t('ডেমো প্রোফাইল', 'Demo profile')}</div>
                </div>
              </div>

              <div className="grid2">
                <div className="fld">
                  <label htmlFor="pf-n">{t('পূর্ণ নাম', 'Full name')}</label>
                  <input id="pf-n" className="in" defaultValue="মোঃ রফিকুল ইসলাম" />
                </div>
                <div className="fld">
                  <label htmlFor="pf-p">{t('মোবাইল', 'Mobile')}</label>
                  <input id="pf-p" className="in" defaultValue="01711223344" />
                </div>
                <div className="fld">
                  <label htmlFor="pf-e">{t('ইমেইল', 'Email')}</label>
                  <input id="pf-e" type="email" className="in" defaultValue="rafiqul@example.com" />
                </div>
                <div className="fld">
                  <label htmlFor="pf-a">{t('এলাকা', 'Area')}</label>
                  <input id="pf-a" className="in" defaultValue="বনশ্রী, ঢাকা" />
                </div>
              </div>

              <div>
                <button className="btn pri" type="submit">
                  {t('সংরক্ষণ করুন (ডেমো)', 'Save (demo)')}
                </button>
              </div>
            </form>
          )}

          {/* TAB 11: SETTINGS */}
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
              <Link href="/dashboard/tenant" className="nv">
                <User className="ic" width={20} height={20} />
                <span>{t('ভাড়াটিয়া ভিউ', 'Tenant view')}</span>
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

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
