import React, { useState } from 'react';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  ArrowRight,
  Instagram
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/translations';

interface FooterProps {
  currentLang: Language;
  onNavigate: (section: string) => void;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  onOpenDonate,
  onOpenVolunteer,
  onOpenAdmin
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[currentLang];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Organization Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">NOVENTRA</span>
                <span className="block text-[11px] font-bold tracking-wider uppercase text-emerald-400 -mt-1">
                  Charity Foundation
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {t.footer.aboutText}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{t.transparency.regNumber}</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://instagram.com/noventra_foundation?igsi=dWR5aG5iNWx4czFs&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-pink-400 hover:text-white hover:border-pink-500/50 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <a
                href="https://www.tiktok.com/@noventra.foundation?_r=1&_t=ZS-9996OPDc4d"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 hover:text-white hover:border-cyan-500/50 transition-colors"
              >
                <span>TikTok</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-400 border border-emerald-900/40">M-Pesa</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-blue-400 border border-blue-900/40">Tigo Pesa</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-red-400 border border-red-900/40">Airtel Money</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-yellow-400 border border-yellow-900/40">HaloPesa</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-400 border border-emerald-900/40">CRDB / NMB Bank</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button 
                  id="footer-link-home" 
                  type="button" 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-about" 
                  type="button" 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-projects" 
                  type="button" 
                  onClick={() => onNavigate('projects')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-news" 
                  type="button" 
                  onClick={() => onNavigate('news')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.news}
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-gallery" 
                  type="button" 
                  onClick={() => onNavigate('gallery')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.gallery}
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-transparency" 
                  type="button" 
                  onClick={() => onNavigate('transparency')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.transparency}
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-contact" 
                  type="button" 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Noventra House, Bagamoyo Rd, Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+255754889900" className="hover:text-white transition-colors">
                  +255 754 889 900
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:info@noventrafoundation.org" className="hover:text-white transition-colors">
                  info@noventrafoundation.org
                </a>
              </div>
              <div className="pt-2">
                <button
                  id="btn-volunteer-footer"
                  type="button"
                  onClick={onOpenVolunteer}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <span>{t.nav.volunteer}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footer.newsletterText}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                id="newsletter-submit-btn"
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.footer.subscribeBtn}</span>
              </button>
              {subscribed && (
                <p className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentLang === 'sw' ? 'Asante kwa kujiunga!' : 'Subscribed successfully!'}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center sm:text-left">
            © 2025 - {new Date().getFullYear()} Noventra Charity Foundation. {t.footer.rightsReserved}
            <span className="block sm:inline sm:ml-2 text-slate-600">
              {t.footer.designedFor}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="footer-admin-btn"
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Admin Access
            </button>
            <span>•</span>
            <button
              id="footer-privacy-btn"
              type="button"
              onClick={() => onNavigate('about')}
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Privacy & Safeguarding
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
