import React from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Target, 
  Compass, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/translations';

interface WelcomeSectionProps {
  currentLang: Language;
  onNavigate: (section: string) => void;
  onOpenDonate: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  currentLang,
  onNavigate,
  onOpenDonate
}) => {
  const t = translations[currentLang];

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left visual collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"
                alt="Noventra community outreach"
                className="w-full h-[440px] object-cover"
              />
            </div>

            {/* Overlapping secondary card */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-slate-900 text-white p-5 rounded-2xl shadow-xl max-w-[240px] border border-slate-800 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    {currentLang === 'sw' ? 'Ilianzishwa' : 'Established'}
                  </div>
                  <div className="text-sm font-bold text-white">14 July 2025</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-2 leading-tight">
                {currentLang === 'sw' 
                  ? 'Taasisi isiyo ya kiserikali na isiyo ya kutafuta faida.'
                  : 'Community-focused non-profit charity foundation.'}
              </p>
            </div>

            {/* Accent badge */}
            <div className="absolute -top-4 -left-4 z-20 bg-emerald-600 text-white py-2 px-4 rounded-xl shadow-lg font-bold text-xs flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-200" />
              <span>Official Foundation</span>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentLang === 'sw' ? 'Ujumbe wa Ukaribisho' : 'Welcome Message'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t.welcome.title}
              </h2>
              <p className="text-emerald-700 font-medium mt-1 text-sm sm:text-base">
                {t.welcome.subtitle}
              </p>
            </div>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p className="bg-slate-50 p-4 rounded-2xl border-l-4 border-emerald-600 text-slate-800 font-medium italic">
                "{t.welcome.body1}"
              </p>
              <p>
                {t.welcome.body2}
              </p>
              <p>
                {t.welcome.body3}
              </p>
              <p className="font-semibold text-emerald-800">
                {t.welcome.invite}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="welcome-learn-more-btn"
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>{t.welcome.learnMore}</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                id="welcome-donate-btn"
                type="button"
                onClick={onOpenDonate}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors"
              >
                <span>{t.nav.donate}</span>
                <HeartHandshake className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
