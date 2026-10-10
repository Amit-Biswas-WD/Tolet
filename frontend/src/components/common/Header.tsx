'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PROPERTY_TYPES, TYPE_ICONS } from '@/lib/constants';
import { PropertyTypeKey } from '@/types';
import {
  Heart,
  Scale,
  Menu,
  X,
  ChevronDown,
  Layers,
  User,
  Building,
  Shield,
  Home,
  Search,
  Tag,
  LifeBuoy,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

export function Header() {
  const { lang, setLang, favorites, comparison, user, setUser, showToast } = useApp();
  const pathname = usePathname();
  const [annDismissed, setAnnDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoryMenuOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  const renderTypeIcon = (key: PropertyTypeKey) => {
    switch (key) {
      case 'family': return <Home className="w-4 h-4 text-[#176B52]" />;
      case 'bachelor': return <User className="w-4 h-4 text-[#176B52]" />;
      case 'sublet': return <Layers className="w-4 h-4 text-[#176B52]" />;
      case 'room': return <Home className="w-4 h-4 text-[#176B52]" />;
      case 'studio': return <Layers className="w-4 h-4 text-[#176B52]" />;
      case 'office': return <Building className="w-4 h-4 text-[#176B52]" />;
      default: return <Home className="w-4 h-4 text-[#176B52]" />;
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {!annDismissed && (
        <div className="ann">
          <div className="wrap">
            <span>
              {t(
                'নতুন বাসা খুঁজছেন? আপনার পছন্দের বাসা খুঁজুন সহজেই।',
                'Looking for a new home? Find your place with ease.'
              )}
            </span>
            <Link href="/properties">
              {t('বাসা খুঁজুন', 'Browse homes')}
            </Link>
            <button
              type="button"
              onClick={() => setAnnDismissed(true)}
              aria-label={t('বার্তা বন্ধ করুন', 'Dismiss message')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="hdr">
        <div className="wrap">
          {/* Logo */}
          <Link href="/" className="logo" aria-label="ToLet.com Home">
            <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
              <rect width="34" height="34" rx="9" fill="#176B52" />
              <path
                d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z"
                fill="#ffffff"
              />
              <circle cx="24.5" cy="9.5" r="3" fill="#D8B77A" />
            </svg>
            <span>
              ToLet<b className="text-[#218363]">.com</b>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav" aria-label="Main menu">
            <Link
              href="/"
              className={pathname === '/' ? 'on' : ''}
            >
              {t('হোম', 'Home')}
            </Link>
            <Link
              href="/properties"
              className={pathname.startsWith('/properties') ? 'on' : ''}
            >
              {t('বাসা খুঁজুন', 'Find a home')}
            </Link>

            {/* Categories Dropdown */}
            <div className="menu" ref={catRef}>
              <button
                type="button"
                className="navb"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                aria-expanded={categoryMenuOpen}
              >
                {t('ক্যাটাগরি', 'Categories')}
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>
              {categoryMenuOpen && (
                <div className="pop l">
                  {(Object.keys(PROPERTY_TYPES) as PropertyTypeKey[]).map((k) => (
                    <Link
                      key={k}
                      href={`/properties?type=${k}`}
                      onClick={() => setCategoryMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-[#E8F2EC] text-[#202923]"
                    >
                      {renderTypeIcon(k)}
                      <span>{t(PROPERTY_TYPES[k][0], PROPERTY_TYPES[k][1])}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/wanted"
              className={pathname.startsWith('/wanted') ? 'on' : ''}
            >
              Wanted Properties
            </Link>
            <Link
              href="/pricing"
              className={`opt ${pathname === '/pricing' ? 'on' : ''}`}
            >
              Pricing
            </Link>
            <Link
              href="/help"
              className={`opt ${pathname === '/help' ? 'on' : ''}`}
            >
              Help Center
            </Link>
          </nav>

          {/* Actions on right */}
          <div className="hr">
            {/* Language Switcher */}
            <div className="seg deskonly" role="group" aria-label="Language">
              <button
                type="button"
                className={lang === 'bn' ? 'on' : ''}
                onClick={() => setLang('bn')}
              >
                বাংলা
              </button>
              <button
                type="button"
                className={lang === 'en' ? 'on' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>

            {/* Favorites Icon Button */}
            <Link
              href="/favorites"
              className="ibtn"
              aria-label={t('সংরক্ষিত বাসা', 'Saved homes')}
            >
              <Heart className="w-5 h-5 text-[#202923]" />
              {favorites.length > 0 && (
                <span className="dot">
                  {lang === 'bn' ? Number(favorites.length).toLocaleString('bn-BD') : favorites.length}
                </span>
              )}
            </Link>

            {/* Compare Icon Button */}
            <Link
              href="/compare"
              className="ibtn deskonly"
              aria-label={t('তুলনা', 'Compare')}
            >
              <Scale className="w-5 h-5 text-[#202923]" />
              {comparison.length > 0 && (
                <span className="dot">
                  {lang === 'bn' ? Number(comparison.length).toLocaleString('bn-BD') : comparison.length}
                </span>
              )}
            </Link>

            {/* Demo Views Switcher */}
            <div className="menu deskonly" ref={demoRef}>
              <button
                type="button"
                className="ibtn"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                aria-label={t('ডেমো ভিউ পরিবর্তন', 'Switch demo view')}
                title={t('ডেমো ভিউ', 'Demo views')}
              >
                <Layers className="w-5 h-5 text-[#202923]" />
              </button>
              {demoMenuOpen && (
                <div className="pop">
                  <div className="cap">{t('ডেমো ভিউ (প্রোটোটাইপ)', 'Demo views (prototype)')}</div>
                  <Link
                    href="/dashboard/tenant"
                    onClick={() => setDemoMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-[#176B52]" />
                    <span>{t('ভাড়াটিয়া ড্যাশবোর্ড', 'Tenant dashboard')}</span>
                  </Link>
                  <Link
                    href="/dashboard/landlord"
                    onClick={() => setDemoMenuOpen(false)}
                  >
                    <Building className="w-4 h-4 text-[#176B52]" />
                    <span>{t('বাড়িওয়ালা ড্যাশবোর্ড', 'Landlord dashboard')}</span>
                  </Link>
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setDemoMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4 text-[#176B52]" />
                    <span>{t('অ্যাডমিন ড্যাশবোর্ড', 'Admin dashboard')}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="menu" ref={userRef}>
                <button
                  type="button"
                  className="ibtn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Profile menu"
                >
                  <User className="w-5 h-5 text-[#202923]" />
                </button>
                {userMenuOpen && (
                  <div className="pop">
                    <div className="cap">
                      {user.name} · {user.role === 'landlord' ? t('বাড়িওয়ালা', 'Landlord') : t('ভাড়াটিয়া', 'Tenant')}
                    </div>
                    <Link
                      href={`/dashboard/${user.role}`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Layers className="w-4 h-4 text-[#176B52]" />
                      <span>{t('ড্যাশবোর্ড', 'Dashboard')}</span>
                    </Link>
                    <button
                      type="button"
                      className="mi"
                      onClick={() => {
                        setUser(null);
                        setUserMenuOpen(false);
                        showToast(t('লগ আউট হয়েছে', 'Logged out'));
                      }}
                    >
                      <LogOut className="w-4 h-4 text-[#B3261E]" />
                      <span>{t('লগ আউট', 'Log out')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn ghost deskonly">
                {t('লগইন', 'Login')}
              </Link>
            )}

            {/* List Property Primary Button */}
            <Link href="/rent-out" className="btn pri deskonly">
              {t('বাসা ভাড়া দিন', 'List your property')}
            </Link>

            {/* Mobile Burger Menu Button */}
            <button
              type="button"
              className="ibtn burger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t('মেনু খুলুন', 'Open menu')}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="drw r" onClick={() => setMobileMenuOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2">
              <Link href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                <svg width="30" height="30" viewBox="0 0 34 34">
                  <rect width="34" height="34" rx="9" fill="#176B52" />
                  <path
                    d="M8 16.5 17 9l9 7.5V25a1 1 0 0 1-1 1h-5v-6h-6v6H9a1 1 0 0 1-1-1z"
                    fill="#ffffff"
                  />
                  <circle cx="24.5" cy="9.5" r="3" fill="#D8B77A" />
                </svg>
                <span>ToLet<b className="text-[#218363]">.com</b></span>
              </Link>
              <button
                type="button"
                className="ibtn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="nl mt-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Home className="w-5 h-5 text-[#176B52]" /> {t('হোম', 'Home')}
              </Link>
              <Link href="/properties" onClick={() => setMobileMenuOpen(false)}>
                <Search className="w-5 h-5 text-[#176B52]" /> {t('বাসা খুঁজুন', 'Find a home')}
              </Link>
              <Link href="/wanted" onClick={() => setMobileMenuOpen(false)}>
                <Layers className="w-5 h-5 text-[#176B52]" /> Wanted Properties
              </Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                <Tag className="w-5 h-5 text-[#176B52]" /> Pricing
              </Link>
              <Link href="/help" onClick={() => setMobileMenuOpen(false)}>
                <LifeBuoy className="w-5 h-5 text-[#176B52]" /> Help Center
              </Link>
              <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                <Heart className="w-5 h-5 text-[#176B52]" />
                {t('সংরক্ষিত', 'Saved')} ({favorites.length})
              </Link>
              <Link href="/compare" onClick={() => setMobileMenuOpen(false)}>
                <Scale className="w-5 h-5 text-[#176B52]" />
                {t('তুলনা', 'Compare')} ({comparison.length})
              </Link>
            </div>

            <div className="cap">{t('ক্যাটাগরি', 'Categories')}</div>
            <div className="nl">
              {(Object.keys(PROPERTY_TYPES) as PropertyTypeKey[]).map((k) => (
                <Link
                  key={k}
                  href={`/properties?type=${k}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {renderTypeIcon(k)}
                  <span>{t(PROPERTY_TYPES[k][0], PROPERTY_TYPES[k][1])}</span>
                </Link>
              ))}
            </div>

            <div className="cap">{t('ডেমো ভিউ', 'Demo views')}</div>
            <div className="nl">
              <Link href="/dashboard/tenant" onClick={() => setMobileMenuOpen(false)}>
                <User className="w-5 h-5 text-[#176B52]" /> {t('ভাড়াটিয়া', 'Tenant')}
              </Link>
              <Link href="/dashboard/landlord" onClick={() => setMobileMenuOpen(false)}>
                <Building className="w-5 h-5 text-[#176B52]" /> {t('বাড়িওয়ালা', 'Landlord')}
              </Link>
              <Link href="/dashboard/admin" onClick={() => setMobileMenuOpen(false)}>
                <Shield className="w-5 h-5 text-[#176B52]" /> {t('অ্যাডমিন', 'Admin')}
              </Link>
            </div>

            <div className="grid gap-2.5 mt-4">
              <div className="seg w-full">
                <button
                  type="button"
                  className={`flex-1 ${lang === 'bn' ? 'on' : ''}`}
                  onClick={() => setLang('bn')}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  className={`flex-1 ${lang === 'en' ? 'on' : ''}`}
                  onClick={() => setLang('en')}
                >
                  English
                </button>
              </div>

              {user ? (
                <button
                  type="button"
                  className="btn line block"
                  onClick={() => {
                    setUser(null);
                    setMobileMenuOpen(false);
                    showToast(t('লগ আউট হয়েছে', 'Logged out'));
                  }}
                >
                  {t('লগ আউট', 'Log out')}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="btn line block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('লগইন', 'Login')}
                </Link>
              )}

              <Link
                href="/rent-out"
                className="btn pri block"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('বাসা ভাড়া দিন', 'List your property')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
