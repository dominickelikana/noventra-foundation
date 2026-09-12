import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Users, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Project, ProjectCategory, Language } from '../../types';
import { translations } from '../../lib/translations';

interface ProjectsSectionProps {
  projects: Project[];
  currentLang: Language;
  onSelectProject: (project: Project) => void;
  onDonateToProject: (project: Project) => void;
  onNavigate: (section: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  currentLang,
  onSelectProject,
  onDonateToProject,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[currentLang];

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: t.projects.filterAll },
    { id: 'education', label: t.projects.filterEducation },
    { id: 'healthcare', label: t.projects.filterHealthcare },
    { id: 'orphans', label: t.projects.filterOrphans },
    { id: 'women_youth', label: t.projects.filterWomenYouth },
    { id: 'environment', label: t.projects.filterEnvironment },
    { id: 'emergency', label: t.projects.filterEmergency },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0
    }).format(amount).replace('TZS', 'TZS ');
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'sw' ? 'Mabadiliko ya Vitendo' : 'Real World Action'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.projects.title}
            </h2>
            <p className="text-slate-600 text-base">
              {t.projects.subtitle}
            </p>
          </div>

          <button
            id="view-all-projects-btn"
            type="button"
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 shrink-0"
          >
            <span>{currentLang === 'sw' ? 'Tazama Miradi Yote' : 'Explore All Initiatives'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-proj-${cat.id}`}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const percentRaised = Math.min(100, Math.round((project.amountRaised / project.targetAmount) * 100));
            const isCompleted = project.status === 'completed';

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={project.featuredImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{project.location}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                        project.status === 'active' 
                          ? 'bg-emerald-500/90 text-white' 
                          : project.status === 'completed'
                          ? 'bg-blue-600/90 text-white'
                          : 'bg-amber-500/90 text-white'
                      }`}>
                        {project.status === 'active' ? t.projects.statusActive : project.status === 'completed' ? t.projects.statusCompleted : t.projects.statusPlanned}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                      {currentLang === 'sw' ? project.titleSw : project.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {currentLang === 'sw' ? project.descriptionSw : project.description}
                    </p>

                    {/* Fundraising Progress */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600">
                          {t.projects.raised}: <strong className="text-emerald-700 font-bold">{formatCurrency(project.amountRaised)}</strong>
                        </span>
                        <span className="text-emerald-700 font-black">{percentRaised}%</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-1000"
                          style={{ width: `${percentRaised}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{t.projects.target}: {formatCurrency(project.targetAmount)}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-600" />
                          {project.beneficiariesCount} {t.projects.beneficiaries}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
                  <button
                    id={`btn-view-project-${project.id}`}
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
                  >
                    {t.projects.viewDetails}
                  </button>

                  <button
                    id={`btn-donate-project-${project.id}`}
                    type="button"
                    onClick={() => onDonateToProject(project)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{currentLang === 'sw' ? 'Changia' : 'Support'}</span>
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
