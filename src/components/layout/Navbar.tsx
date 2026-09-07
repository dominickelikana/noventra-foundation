import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Globe, 
  UserPlus, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeSection,
  onNavigate,
  onOpenDonate,
  onOpenVolunteer,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'news', label: t.nav.news },
    { id: 'gallery', label: t.nav.gallery },
    { id: 'transparency', label: t.nav.transparency },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top utility banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentLang === 'sw' ? 'Ilianzishwa 14 Julai 2025 • NGO Iliyosajiliwa' : 'Founded 14 July 2025 • Registered NGO'}
            </span>
            <div className="hidden md:flex items-center gap-4 text-slate-400">
              <a href="tel:+255754889900" className="flex items-center gap-1 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                +255 754 889 900
              </a>
              <a href="mailto:info@noventrafoundation.org" className="flex items-center gap-1 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                info@noventrafoundation.org
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                  currentLang === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN 🇬🇧
              </button>
              <button
                id="btn-lang-sw"
                type="button"
                onClick={() => onLanguageChange('sw')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                  currentLang === 'sw'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SW 🇹🇿
              </button>
            </div>

            {/* Admin link */}
            <button
              id="btn-admin-portal"
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-0.5 px-2 rounded hover:bg-slate-800"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : t.nav.adminPortal}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav className={`bg-white/95 backdrop-blur-md transition-shadow duration-300 border-b border-slate-200/80 ${
        isScrolled ? 'shadow-md py-2.5' : 'py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <button 
            id="nav-logo-btn"
            type="button"
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-current text-white" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                NOVENTRA
              </div>
              <div className="text-[10px] font-semibold tracking-wider uppercase text-emerald-700 -mt-1">
                Charity Foundation
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeSection === link.id
                    ? 'text-emerald-700 bg-emerald-50 font-bold'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="btn-volunteer-nav"
              type="button"
              onClick={onOpenVolunteer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>{t.nav.volunteer}</span>
            </button>

            <button
              id="btn-donate-nav"
              type="button"
              onClick={onOpenDonate}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Heart className="w-4 h-4 fill-current text-emerald-100" />
              <span>{t.nav.donate}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="btn-donate-mobile-quick"
              type="button"
              onClick={onOpenDonate}
              className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600"
            >
              {t.nav.donate}
            </button>
            <button
              id="btn-toggle-mobile-menu"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium ${
                  activeSection === link.id
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                id="btn-volunteer-mobile-drawer"
                type="button"
                onClick={() => {
                  onOpenVolunteer();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.nav.volunteer}</span>
              </button>

              <button
                id="btn-donate-mobile-drawer"
                type="button"
                onClick={() => {
                  onOpenDonate();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 shadow-md shadow-emerald-600/20"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{t.nav.donate}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
