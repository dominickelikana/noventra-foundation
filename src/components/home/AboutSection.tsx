import React from 'react';
import { 
  Heart, 
  Target, 
  Compass, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Award, 
  CheckCircle2,
  Calendar,
  Building2
} from 'lucide-react';
import { Language, SiteSettings } from '../../types';
import { translations } from '../../lib/translations';

interface AboutSectionProps {
  currentLang: Language;
  siteSettings: SiteSettings;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  currentLang,
  siteSettings,
  onOpenDonate,
  onOpenVolunteer
}) => {
  const t = translations[currentLang];

  const values = [
    { title: t.about.val1Title, desc: t.about.val1Desc },
    { title: t.about.val2Title, desc: t.about.val2Desc },
    { title: t.about.val3Title, desc: t.about.val3Desc },
    { title: t.about.val4Title, desc: t.about.val4Desc },
    { title: t.about.val5Title, desc: t.about.val5Desc },
    { title: t.about.val6Title, desc: t.about.val6Desc },
  ];

  return (
    <section id="about-section" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLang === 'sw' ? 'Historia na Utambulisho Wetu' : 'Identity & Governance'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.about.title}
          </h2>
          <p className="text-slate-600 text-base">
            {t.about.subtitle}
          </p>
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              {t.about.visionTitle}
            </h3>
            <p className="text-slate-700 text-base leading-relaxed">
              {t.about.visionText}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Sparkles className="w-4 h-4" />
              <span>{currentLang === 'sw' ? 'Mtazamo wa Kudumu wa Miaka 20+' : 'Long-term 20+ Year Horizon'}</span>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              {t.about.missionTitle}
            </h3>
            <p className="text-slate-700 text-base leading-relaxed">
              {t.about.missionText}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-teal-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentLang === 'sw' ? 'Uwajibikaji na Utendaji wa Vitendo' : 'Action-Driven Accountability'}</span>
            </div>
          </div>

        </div>

        {/* History / Foundation Background Story */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.about.historyTitle}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {t.about.historyText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900">14 July 2025</strong>
                <span className="text-xs text-slate-500">{currentLang === 'sw' ? 'Tarehe ya Kuanzishwa' : 'Official Foundation Date'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900">00NGO/R/2025/0714</strong>
                <span className="text-xs text-slate-500">{currentLang === 'sw' ? 'Namba ya Usajili wa NGO' : 'Official NGO Registration'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900">Tanzania & Beyond</strong>
                <span className="text-xs text-slate-500">{currentLang === 'sw' ? 'Eneo la Utekelezaji' : 'Operational Scope'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.about.valuesTitle}
            </h3>
            <p className="text-slate-600 text-sm">
              {currentLang === 'sw' 
                ? 'Misingi inayoongoza kila uamuzi, mradi na ushirikiano wetu.'
                : 'The fundamental principles guiding every decision, project and partnership.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
                    0{i + 1}
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {v.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
