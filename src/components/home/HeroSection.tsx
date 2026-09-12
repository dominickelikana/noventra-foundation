import React from 'react';
import { 
  Heart, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  GraduationCap, 
  Stethoscope, 
  Trees 
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/translations';

interface HeroSectionProps {
  currentLang: Language;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
  onNavigate: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onOpenDonate,
  onOpenVolunteer,
  onNavigate
}) => {
  const t = translations[currentLang];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[580px] flex items-center">
      {/* Background Image with Deep Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop"
          alt="African children smiling and learning with hope"
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{t.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            <span className="text-emerald-400">{t.hero.titleStart}</span>{' '}
            <span className="text-white">{t.hero.titleEnd}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-donate-primary-btn"
              type="button"
              onClick={onOpenDonate}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-700/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Heart className="w-5 h-5 fill-current text-white" />
              <span>{t.hero.ctaDonate}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="hero-volunteer-secondary-btn"
              type="button"
              onClick={onOpenVolunteer}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 backdrop-blur-md transition-all hover:text-white"
            >
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <span>{t.hero.ctaVolunteer}</span>
            </button>
          </div>

          {/* Quick Tanzania Payment Note */}
          <div className="pt-4 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80 max-w-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {currentLang === 'sw' 
                ? 'Malipo salama kupitia M-Pesa (Lipa Namba 5678901), Tigo Pesa, Airtel Money na Benki ya CRDB/NMB'
                : 'Direct donations accepted via M-Pesa (Lipa No 5678901), Airtel Money, Tigo Pesa & CRDB Bank'}
            </span>
          </div>

        </div>

        {/* Floating Impact Stats Grid */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">12,500+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              {currentLang === 'sw' ? 'Watu Waliofaidika' : 'Lives Transformed'}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">45+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              {currentLang === 'sw' ? 'Miradi ya Jamii' : 'Community Projects'}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">650+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              {currentLang === 'sw' ? 'Wajitoleaji Walio Tayari' : 'Active Volunteers'}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">100%</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              {currentLang === 'sw' ? 'Uwazi wa Fedha' : 'Fund Accountability'}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
