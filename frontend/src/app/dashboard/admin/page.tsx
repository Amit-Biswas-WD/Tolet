'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LineChart, BarChart } from '@/components/common/Charts';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/constants';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Shield,
  BarChart2,
  Clock,
  Users,
  Search,
  Star,
  Flag,
  Wallet,
  Image,
  Tag,
  LifeBuoy,
  Cog,
  Home,
  User,
  Building,
  Bell,
  Menu,
  X,
  Info,
  Check,
  ChevronRight,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: 'landlord' | 'tenant';
  status: 'active' | 'suspended';
  listings: number;
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#64716A]">লোড হচ্ছে...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
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
    { id: 'an1', t: ['১টি নতুন লিস্টিং অনুমোদনের অপেক্ষায়', '1 new listing awaiting moderation'], time: ['১৫ মিনিট আগে', '15 min ago'] },
    { id: 'an2', t: ['১টি ইউজার রিপোর্ট জমা হয়েছে', '1 new user report flagged'], time: ['১ ঘণ্টা আগে', '1 h ago'] },
  ]);

  // Moderation filter
  const [modFilter, setModFilter] = useState<'all' | 'pending' | 'active' | 'rejected' | 'suspended' | 'draft'>('all');
  const [modSearch, setModSearch] = useState('');

  // Users State
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'tenant' | 'landlord'>('all');
  const [userSearch, setUserSearch] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 'u1', name: 'মোঃ রফিকুল ইসলাম', phone: '01711223344', role: 'landlord', status: 'active', listings: 4 },
    { id: 'u2', name: 'কামরুল হাসান', phone: '01812345678', role: 'landlord', status: 'active', listings: 1 },
    { id: 'u3', name: 'তানভীর আহমেদ', phone: '01712345678', role: 'tenant', status: 'active', listings: 0 },
    { id: 'u4', name: 'সাদিয়া জাহান', phone: '01819876543', role: 'tenant', status: 'active', listings: 0 },
    { id: 'u5', name: 'সন্দেহজনক ইউজার (Fraud Alert)', phone: '01999999999', role: 'landlord', status: 'suspended', listings: 0 },
  ]);

  // Reports State
  const [reports, setReports] = useState([
    { id: 'rep1', type: ['ভুল তথ্য', 'Misleading Info'], propId: 'p4', by: 'আব্দুল মতিন', date: '2026-10-09', status: 'open' as const },
    { id: 'rep2', type: ['ছবি অমিল', 'Photo Mismatch'], propId: 'p7', by: 'নাসরিন সুলতানা', date: '2026-10-07', status: 'resolved' as const },
  ]);

  // Tickets / Support State
  const [tickets, setTickets] = useState([
    { id: 'tk1', sub: 'লিস্টিং এডিট করতে সমস্যা হচ্ছে', from: 'মোঃ রফিকুল ইসলাম', pri: 'জরুরি', status: 'open' as const },
    { id: 'tk2', sub: 'ওটিপি ভেরিফিকেশন এসএমএস দেরি হচ্ছে', from: 'সাদিয়া জাহান', pri: 'সাধারণ', status: 'closed' as const },
  ]);

  // Banners State
  const [banners, setBanners] = useState([
    { id: 'b1', title: 'নতুন বাসা খুঁজছেন? বনশ্রী ও মিরপুরে বিশেষ ছাড়', place: 'হোমপেজ হিরো', on: true },
    { id: 'b2', title: 'বাড়িওয়ালাদের জন্য ১০০ বোনাস লিস্টিং ক্রেডিট', place: 'ড্যাশবোর্ড ব্যানার', on: false },
  ]);

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    auto: false,
    twofa: true,
    maint: false,
  });

  const viewsData = [330, 440, 380, 560, 510, 640, 610, 720, 680, 810, 760, 940, 880, 1008];
  const dayLabels = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(2026, 9, 10 - (13 - i));
    return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short' });
  });

  const pendingProps = properties.filter((p) => p.status === 'pending');

  const navItems = [
    { key: 'overview', icon: <BarChart2 className="ic" width={19} height={19} />, label: t('ওভারভিউ', 'Overview') },
    { key: 'analytics', icon: <BarChart2 className="ic" width={19} height={19} />, label: t('অ্যানালিটিক্স', 'Analytics') },
    { key: 'moderation', icon: <Shield className="ic" width={19} height={19} />, label: t('প্রপার্টি মডারেশন', 'Property moderation') },
    { key: 'pending', icon: <Clock className="ic" width={19} height={19} />, label: t('অপেক্ষমাণ অনুমোদন', 'Pending approvals') },
    { key: 'users', icon: <Users className="ic" width={19} height={19} />, label: t('ব্যবহারকারী', 'Users') },
    { key: 'wanted', icon: <Search className="ic" width={19} height={19} />, label: t('ওয়ান্টেড মডারেশন', 'Wanted moderation') },
    { key: 'reviews', icon: <Star className="ic" width={19} height={19} />, label: t('রিভিউ', 'Reviews') },
    { key: 'reports', icon: <Flag className="ic" width={19} height={19} />, label: t('ব্যবহারকারীর রিপোর্ট', 'User reports') },
    { key: 'transactions', icon: <Wallet className="ic" width={19} height={19} />, label: t('লেনদেন', 'Transactions') },
    { key: 'banners', icon: <Image className="ic" width={19} height={19} />, label: t('ব্যানার', 'Banners') },
    { key: 'categories', icon: <Tag className="ic" width={19} height={19} />, label: t('ক্যাটাগরি ও এলাকা', 'Categories & locations') },
    { key: 'support', icon: <LifeBuoy className="ic" width={19} height={19} />, label: t('সাপোর্ট অনুরোধ', 'Support requests') },
    { key: 'settings', icon: <Cog className="ic" width={19} height={19} />, label: t('প্ল্যাটফর্ম সেটিংস', 'Platform settings') },
  ];

  const currentNav = navItems.find((n) => n.key === tab) || navItems[0];

  return (
    <div className="dash adm">
      {/* Sidebar with ink-navy styling */}
      <aside className="dside" aria-label={t('ড্যাশবোর্ড মেনু', 'Dashboard menu')}>
        <Link href="/" className="logo" aria-label="ToLet.com">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
            <rect width="34" height="34" rx="9" fill="var(--adm)" />
            <path d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z" fill="#fff" />
            <circle cx="24.5" cy="9.5" r="3" fill="var(--adm-a)" />
          </svg>
          <span>ToLet<b>.com</b></span>
        </Link>

        <div className="rl">{t('অ্যাডমিন', 'Admin')}</div>
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
        <Link href="/dashboard/landlord" className="nv">
          <Building className="ic" width={19} height={19} />
          <span>{t('বাড়িওয়ালা', 'Landlord')}</span>
        </Link>
        <Link href="/" className="nv" style={{ marginTop: '8px' }}>
          <Home className="ic" width={19} height={19} />
          <span>{t('ওয়েবসাইটে ফিরুন', 'Back to website')}</span>
        </Link>
      </aside>

      {/* Main Content Area */}
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
                <div className="cap">{t('প্ল্যাটফর্ম অ্যাডমিন', 'Platform Admin')}</div>
                <button
                  type="button"
                  className="mi"
                  onClick={() => {
                    setTab('settings');
                    setUserMenuOpen(false);
                  }}
                >
                  <Cog className="ic" width={18} height={18} />
                  <span>{t('প্ল্যাটফর্ম সেটিংস', 'Settings')}</span>
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
                    <span>{t('অপেক্ষমাণ তালিকা', 'Pending listings')}</span>
                    <Clock className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(pendingProps.length, lang)}</strong>
                  <small>{t('অনুমোদন প্রয়োজন', 'Needs review')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('ব্যবহারকারী (নমুনা)', 'Users (sample)')}</span>
                    <Users className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(users.length, lang)}</strong>
                  <small>{t('ডেমো তালিকা', 'Demo list')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('খোলা রিপোর্ট', 'Open reports')}</span>
                    <Flag className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(reports.filter((r) => r.status === 'open').length, lang)}</strong>
                  <small>{t('মনোযোগ দরকার', 'Needs attention')}</small>
                </div>

                <div className="sc">
                  <div className="top">
                    <span>{t('খোলা সাপোর্ট', 'Open tickets')}</span>
                    <LifeBuoy className="ic" width={20} height={20} />
                  </div>
                  <strong className="num">{formatNumber(tickets.filter((x) => x.status === 'open').length, lang)}</strong>
                  <small>{t('উত্তর বাকি', 'Awaiting reply')}</small>
                </div>
              </div>

              <div className="two">
                {/* Approval Queue */}
                <div className="card">
                  <div className="ch">
                    <h2>{t('অনুমোদনের সারি', 'Approval queue')}</h2>
                    <button type="button" className="link" onClick={() => setTab('pending')}>
                      {t('সব', 'All')} <ChevronRight width={14} height={14} />
                    </button>
                  </div>
                  {pendingProps.length > 0 ? (
                    pendingProps.slice(0, 4).map((p) => (
                      <div key={p.id} className="li">
                        <div>
                          <strong>
                            <Link href={`/properties/${p.id}`}>
                              {lang === 'bn' ? p.title[0] : p.title[1]}
                            </Link>
                          </strong>
                          <small>{formatCurrency(p.rent, lang)}</small>
                        </div>
                        <div className="acts">
                          <button
                            type="button"
                            className="btn pri sm"
                            onClick={() => {
                              setProperties(properties.map((x) => (x.id === p.id ? { ...x, status: 'active' } : x)));
                              showToast(t('তালিকা অনুমোদিত হয়েছে', 'Listing approved'));
                            }}
                          >
                            <Check className="ic" width={16} height={16} />
                            <span>{t('অনুমোদন', 'Approve')}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="mut">{t('কোনো অপেক্ষমাণ তালিকা নেই।', 'No pending listings.')}</p>
                  )}
                </div>

                {/* Daily Views Line Chart */}
                <div className="card">
                  <div className="ch">
                    <h2>{t('দৈনিক ভিউ (নমুনা)', 'Daily views (sample)')}</h2>
                  </div>
                  <LineChart data={viewsData} labels={dayLabels} lang={lang} />
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ANALYTICS */}
          {tab === 'analytics' && (
            <>
              <div className="two" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="card">
                  <div className="ch">
                    <h2>{t('এলাকা অনুযায়ী তালিকা', 'Listings by area')}</h2>
                  </div>
                  <BarChart
                    items={[
                      [t('বনশ্রী', 'Banasree'), 5],
                      [t('মিরপুর', 'Mirpur'), 8],
                      [t('উত্তরা', 'Uttara'), 6],
                      [t('রামপুরা', 'Rampura'), 4],
                    ]}
                    lang={lang}
                  />
                </div>
                <div className="card">
                  <div className="ch">
                    <h2>{t('ধরন অনুযায়ী তালিকা', 'Listings by type')}</h2>
                  </div>
                  <BarChart
                    items={[
                      [t('ফ্যামিলি', 'Family'), 12],
                      [t('ব্যাচেলর', 'Bachelor'), 5],
                      [t('সাবলেট', 'Sublet'), 4],
                      [t('অফিস', 'Office'), 2],
                    ]}
                    lang={lang}
                  />
                </div>
              </div>

              <div className="card">
                <div className="ch">
                  <h2>{t('ট্রাফিক (নমুনা)', 'Traffic (sample)')}</h2>
                </div>
                <LineChart data={viewsData.map((v) => v * 1.5)} labels={dayLabels} lang={lang} />
              </div>
            </>
          )}

          {/* TAB 3: MODERATION */}
          {tab === 'moderation' && (
            <>
              <div className="fbar">
                <div className="fld" style={{ flex: 1, maxWidth: '320px' }}>
                  <input
                    className="in"
                    type="search"
                    placeholder={t('শিরোনাম বা আইডি, এন্টার চাপুন', 'Title or ID, press Enter')}
                    value={modSearch}
                    onChange={(e) => setModSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="tabs" role="tablist">
                {[
                  ['all', t('সব', 'All')],
                  ['pending', t('অপেক্ষমাণ', 'Pending')],
                  ['active', t('প্রকাশিত', 'Published')],
                  ['rejected', t('প্রত্যাখ্যাত', 'Rejected')],
                  ['draft', t('খসড়া', 'Draft')],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    className={modFilter === k ? 'on' : ''}
                    onClick={() => setModFilter(k as any)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="tw">
                <table className="t">
                  <thead>
                    <tr>
                      <th>{t('আইডি', 'ID')}</th>
                      <th>{t('বাসা', 'Property')}</th>
                      <th>{t('ভাড়া', 'Rent')}</th>
                      <th>{t('অবস্থা', 'Status')}</th>
                      <th>{t('কার্যক্রম', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties
                      .filter((p) => {
                        if (modFilter !== 'all' && p.status !== modFilter) return false;
                        if (modSearch && !p.title[0].toLowerCase().includes(modSearch.toLowerCase()) && !p.id.includes(modSearch)) return false;
                        return true;
                      })
                      .map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.id.toUpperCase()}</strong></td>
                          <td>
                            <Link href={`/properties/${p.id}`} className="link">
                              {lang === 'bn' ? p.title[0] : p.title[1]}
                            </Link>
                          </td>
                          <td><strong>{formatCurrency(p.rent, lang)}</strong></td>
                          <td>
                            <span className={`badge ${p.status === 'active' ? 'ok' : p.status === 'pending' ? 'warn' : 'err'}`}>
                              {p.status === 'active' ? t('সক্রিয়', 'Active') : p.status === 'pending' ? t('অপেক্ষমাণ', 'Pending') : t('প্রত্যাখ্যাত', 'Rejected')}
                            </span>
                          </td>
                          <td>
                            <div className="acts">
                              <Link href={`/properties/${p.id}`} className="btn line sm">
                                <Eye className="ic" width={15} height={15} />
                                <span>{t('দেখুন', 'View')}</span>
                              </Link>
                              {p.status !== 'active' && (
                                <button
                                  type="button"
                                  className="btn pri sm"
                                  onClick={() => {
                                    setProperties(properties.map((x) => (x.id === p.id ? { ...x, status: 'active' } : x)));
                                    showToast(t('অনুমোদিত হয়েছে', 'Approved'));
                                  }}
                                >
                                  {t('অনুমোদন', 'Approve')}
                                </button>
                              )}
                              {p.status !== 'rejected' && (
                                <button
                                  type="button"
                                  className="btn line sm"
                                  onClick={() => {
                                    setProperties(properties.map((x) => (x.id === p.id ? { ...x, status: 'rejected' } : x)));
                                    showToast(t('তালিকা প্রত্যাখ্যান করা হয়েছে', 'Rejected'));
                                  }}
                                >
                                  {t('প্রত্যাখ্যান', 'Reject')}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 4: PENDING */}
          {tab === 'pending' && (
            <>
              {pendingProps.length > 0 ? (
                <div className="tw">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>{t('আইডি', 'ID')}</th>
                        <th>{t('বাসা', 'Property')}</th>
                        <th>{t('ভাড়া', 'Rent')}</th>
                        <th>{t('কার্যক্রম', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingProps.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.id.toUpperCase()}</strong></td>
                          <td>
                            <Link href={`/properties/${p.id}`} className="link">
                              {lang === 'bn' ? p.title[0] : p.title[1]}
                            </Link>
                          </td>
                          <td><strong>{formatCurrency(p.rent, lang)}</strong></td>
                          <td>
                            <div className="acts">
                              <button
                                type="button"
                                className="btn pri sm"
                                onClick={() => {
                                  setProperties(properties.map((x) => (x.id === p.id ? { ...x, status: 'active' } : x)));
                                  showToast(t('অনুমোদিত হয়েছে', 'Approved'));
                                }}
                              >
                                {t('অনুমোদন', 'Approve')}
                              </button>
                              <button
                                type="button"
                                className="btn line sm"
                                onClick={() => {
                                  setProperties(properties.map((x) => (x.id === p.id ? { ...x, status: 'rejected' } : x)));
                                  showToast(t('প্রত্যাখ্যাত', 'Rejected'));
                                }}
                              >
                                {t('প্রত্যাখ্যান', 'Reject')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty">
                  <div className="ci">
                    <CheckCircle2 className="ic" width={28} height={28} />
                  </div>
                  <h3>{t('সব অনুমোদন সম্পন্ন', 'All caught up')}</h3>
                  <p>{t('অপেক্ষমাণ কোনো তালিকা নেই।', 'There are no pending listings.')}</p>
                </div>
              )}
            </>
          )}

          {/* TAB 5: USERS */}
          {tab === 'users' && (
            <>
              <div className="fbar">
                <div className="fld" style={{ flex: 1, maxWidth: '320px' }}>
                  <input
                    className="in"
                    type="search"
                    placeholder={t('নাম লিখে এন্টার চাপুন', 'Name, then Enter')}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <div className="fld">
                  <select
                    className="in"
                    style={{ width: 'auto' }}
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  >
                    <option value="all">{t('সব ভূমিকা', 'All roles')}</option>
                    <option value="tenant">{t('ভাড়াটিয়া', 'Tenant')}</option>
                    <option value="landlord">{t('বাড়িওয়ালা', 'Landlord')}</option>
                  </select>
                </div>
              </div>

              <div className="tw">
                <table className="t">
                  <thead>
                    <tr>
                      <th>{t('নাম', 'Name')}</th>
                      <th>{t('ভূমিকা', 'Role')}</th>
                      <th>{t('ফোন নম্বর', 'Phone')}</th>
                      <th>{t('অবস্থা', 'Status')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => {
                        if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
                        if (userSearch && !u.name.toLowerCase().includes(userSearch.toLowerCase()) && !u.phone.includes(userSearch)) return false;
                        return true;
                      })
                      .map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.role === 'landlord' ? t('বাড়িওয়ালা', 'Landlord') : t('ভাড়াটিয়া', 'Tenant')}</td>
                          <td>{u.phone}</td>
                          <td>
                            <span className={`badge ${u.status === 'active' ? 'ok' : 'err'}`}>
                              {u.status === 'active' ? t('সক্রিয়', 'Active') : t('স্থগিত', 'Suspended')}
                            </span>
                          </td>
                          <td>
                            <div className="acts">
                              <button
                                type="button"
                                className={`btn sm ${u.status === 'active' ? 'danger' : 'line'}`}
                                onClick={() => {
                                  const nextSt = u.status === 'active' ? 'suspended' : 'active';
                                  setUsers(users.map((x) => (x.id === u.id ? { ...x, status: nextSt } : x)));
                                  showToast(
                                    nextSt === 'suspended'
                                      ? t('ব্যবহারকারী অ্যাকাউন্ট স্থগিত করা হয়েছে', 'User suspended')
                                      : t('ব্যবহারকারী সক্রিয় করা হয়েছে', 'User activated')
                                  );
                                }}
                              >
                                {u.status === 'active' ? t('স্থগিত', 'Suspend') : t('সক্রিয়', 'Activate')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 6: REPORTS */}
          {tab === 'reports' && (
            <div className="tw">
              <table className="t">
                <thead>
                  <tr>
                    <th>{t('ধরন', 'Type')}</th>
                    <th>{t('বাসা', 'Target')}</th>
                    <th>{t('রিপোর্টকারী', 'Reported by')}</th>
                    <th>{t('তারিখ', 'Date')}</th>
                    <th>{t('অবস্থা', 'Status')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{lang === 'bn' ? r.type[0] : r.type[1]}</strong></td>
                      <td>
                        <Link href={`/properties/${r.propId}`} className="link">
                          {r.propId.toUpperCase()}
                        </Link>
                      </td>
                      <td>{r.by}</td>
                      <td>{r.date}</td>
                      <td>
                        <span className={`badge ${r.status === 'resolved' ? 'ok' : 'warn'}`}>
                          {r.status === 'resolved' ? t('সমাধান হয়েছে', 'Resolved') : t('খোলা', 'Open')}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn pri sm"
                          onClick={() => {
                            const nextSt = r.status === 'resolved' ? 'open' : 'resolved';
                            setReports(reports.map((x) => (x.id === r.id ? { ...x, status: nextSt } : x)));
                            showToast(t('রিপোর্ট অবস্থা পরিবর্তন হয়েছে', 'Report updated'));
                          }}
                        >
                          {r.status === 'resolved' ? t('আবার খুলুন', 'Reopen') : t('সমাধান', 'Resolve')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: BANNERS */}
          {tab === 'banners' && (
            <div className="tw">
              <table className="t">
                <thead>
                  <tr>
                    <th>{t('শিরোনাম', 'Title')}</th>
                    <th>{t('স্থান', 'Placement')}</th>
                    <th>{t('সক্রিয়', 'Active')}</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((b) => (
                    <tr key={b.id}>
                      <td><strong>{b.title}</strong></td>
                      <td>{b.place}</td>
                      <td>
                        <button
                          type="button"
                          className={`tg ${b.on ? 'on' : ''}`}
                          role="switch"
                          aria-checked={b.on}
                          onClick={() => {
                            setBanners(banners.map((x) => (x.id === b.id ? { ...x, on: !x.on } : x)));
                            showToast(t('ব্যানার স্ট্যাটাস পরিবর্তিত হয়েছে', 'Banner toggled'));
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {tab === 'settings' && (
            <div className="card" style={{ maxWidth: '720px' }}>
              <div className="row">
                <div>
                  <strong>{t('স্বয়ংক্রিয় অনুমোদন', 'Auto-approve')}</strong>
                  <small>{t('বিশ্বস্ত বাড়িওয়ালাদের তালিকা স্বয়ংক্রিয় অনুমোদন', 'Auto-approve trusted landlords')}</small>
                </div>
                <button
                  type="button"
                  className={`tg ${platformSettings.auto ? 'on' : ''}`}
                  role="switch"
                  aria-checked={platformSettings.auto}
                  onClick={() => setPlatformSettings({ ...platformSettings, auto: !platformSettings.auto })}
                />
              </div>

              <div className="row">
                <div>
                  <strong>{t('দুই-ধাপ যাচাই', 'Two-step verification')}</strong>
                  <small>{t('অ্যাডমিন লগইনে অতিরিক্ত যাচাই', 'Extra check for admin sign-in')}</small>
                </div>
                <button
                  type="button"
                  className={`tg ${platformSettings.twofa ? 'on' : ''}`}
                  role="switch"
                  aria-checked={platformSettings.twofa}
                  onClick={() => setPlatformSettings({ ...platformSettings, twofa: !platformSettings.twofa })}
                />
              </div>

              <div className="row">
                <div>
                  <strong>{t('রক্ষণাবেক্ষণ মোড', 'Maintenance mode')}</strong>
                  <small>{t('সাইটে সাময়িক বার্তা দেখান (ডেমো)', 'Show a temporary notice (demo)')}</small>
                </div>
                <button
                  type="button"
                  className={`tg ${platformSettings.maint ? 'on' : ''}`}
                  role="switch"
                  aria-checked={platformSettings.maint}
                  onClick={() => setPlatformSettings({ ...platformSettings, maint: !platformSettings.maint })}
                />
              </div>
            </div>
          )}

          {/* Default view for other sub-tabs */}
          {['wanted', 'reviews', 'transactions', 'categories', 'support'].includes(tab) && (
            <div className="card">
              <div className="empty">
                <div className="ci">
                  <Shield className="ic" width={28} height={28} />
                </div>
                <h3>{currentNav.label}</h3>
                <p>{t('এই বিভাগের সব নিয়ন্ত্রণ প্রস্তুত রয়েছে।', 'Admin module is operational and configured.')}</p>
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
                  <rect width="34" height="34" rx="9" fill="var(--adm)" />
                  <path d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z" fill="#fff" />
                  <circle cx="24.5" cy="9.5" r="3" fill="var(--adm-a)" />
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
              <Link href="/dashboard/landlord" className="nv">
                <Building className="ic" width={20} height={20} />
                <span>{t('বাড়িওয়ালা ভিউ', 'Landlord view')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
