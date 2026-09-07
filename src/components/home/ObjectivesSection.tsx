import React from 'react';
import { 
  HeartHandshake, 
  GraduationCap, 
  Briefcase, 
  Trees, 
  LifeBuoy, 
  Globe2,
  ArrowUpRight
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/translations';

interface ObjectivesSectionProps {
  currentLang: Language;
  onNavigate: (section: string) => void;
  onOpenDonate: () => void;
}

export const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({
  currentLang,
  onNavigate,
  onOpenDonate
}) => {
  const t = translations[currentLang];

  const objectives = [
    {
      id: 1,
      icon: HeartHandshake,
      title: t.objectives.obj1Title,
      desc: t.objectives.obj1Desc,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 2,
      icon: GraduationCap,
      title: t.objectives.obj2Title,
      desc: t.objectives.obj2Desc,
      color: 'from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-200/80',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      id: 3,
      icon: Briefcase,
      title: t.objectives.obj3Title,
      desc: t.objectives.obj3Desc,
      color: 'from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-200/80',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      id: 4,
      icon: Trees,
      title: t.objectives.obj4Title,
      desc: t.objectives.obj4Desc,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 5,
      icon: LifeBuoy,
      title: t.objectives.obj5Title,
      desc: t.objectives.obj5Desc,
      color: 'from-red-500/10 to-rose-500/10 text-red-600 border-red-200/80',
      iconBg: 'bg-red-100 text-red-700',
    },
    {
      id: 6,
      icon: Globe2,
      title: t.objectives.obj6Title,
      desc: t.objectives.obj6Desc,
      color: 'from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-200/80',
      iconBg: 'bg-teal-100 text-teal-700',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span>Strategic Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.objectives.title}
          </h2>
          <p className="text-slate-600 text-base">
            {t.objectives.subtitle}
          </p>
        </div>

        {/* Grid of 6 Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj) => {
            const Icon = obj.icon;
            return (
              <div
                key={obj.id}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${obj.iconBg} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-slate-300 group-hover:text-emerald-500 transition-colors">
                      0{obj.id}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {obj.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {obj.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>{currentLang === 'sw' ? 'Mkakati wa Kudumu' : 'Core Focus Area'}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('projects')}
                    className="flex items-center gap-1 hover:text-emerald-900 transition-colors"
                  >
                    <span>{currentLang === 'sw' ? 'Tazama Miradi' : 'View Projects'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
