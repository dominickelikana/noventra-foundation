import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  Target, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Project, Language } from '../../types';
import { translations } from '../../lib/translations';

interface ProjectModalProps {
  project: Project | null;
  currentLang: Language;
  onClose: () => void;
  onDonate: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  currentLang,
  onClose,
  onDonate
}) => {
  if (!project) return null;
  const t = translations[currentLang];
  const [copied, setCopied] = useState(false);

  const percentRaised = Math.min(100, Math.round((project.amountRaised / project.targetAmount) * 100));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0
    }).format(amount).replace('TZS', 'TZS ');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentLang === 'sw' ? project.titleSw : project.title,
        text: currentLang === 'sw' ? project.descriptionSw : project.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header Image */}
        <div className="relative h-72 sm:h-80 bg-slate-900">
          <img
            src={project.featuredImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Close button */}
          <button
            id="close-project-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Location & Status Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                {String(project.category || '').replace(/_/g, ' ')}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-200 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {project.location}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-slate-200 bg-slate-900/80 hover:bg-slate-900 px-3 py-1 rounded-lg backdrop-blur-md transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copied ? (currentLang === 'sw' ? 'Imenakiliwa!' : 'Copied Link!') : (currentLang === 'sw' ? 'Shiriki' : 'Share')}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {currentLang === 'sw' ? project.titleSw : project.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {currentLang === 'sw' ? 'Kuanza:' : 'Started:'} {project.startDate}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                {project.beneficiariesCount} {t.projects.beneficiaries}
              </span>
            </div>
          </div>

          {/* Progress Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs text-emerald-900 font-semibold block">
                  {currentLang === 'sw' ? 'Kiasi Kilichopatikana' : 'Total Funds Raised'}
                </span>
                <span className="text-2xl font-black text-emerald-800">
                  {formatCurrency(project.amountRaised)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-900 font-semibold block">
                  {currentLang === 'sw' ? 'Lengo la Mradi' : 'Target Goal'}
                </span>
                <span className="text-lg font-bold text-slate-700">
                  {formatCurrency(project.targetAmount)}
                </span>
              </div>
            </div>

            <div className="w-full bg-emerald-200/60 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all"
                style={{ width: `${percentRaised}%` }}
              ></div>
            </div>
            <div className="text-right text-xs font-bold text-emerald-800">
              {percentRaised}% {currentLang === 'sw' ? 'ya lengo limefikiwa' : 'of goal funded'}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {currentLang === 'sw' ? 'Maelezo Kamili ya Mradi' : 'Project Story & Scope'}
            </h4>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {currentLang === 'sw' ? project.descriptionSw : project.description}
            </p>
          </div>

          {/* Impact Metrics Highlights */}
          {project.impactMetrics && project.impactMetrics.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {currentLang === 'sw' ? 'Matokeo na Athari Zilizothibitishwa' : 'Verified Impact Metrics'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.impactMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-emerald-700">{metric.value}</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      {currentLang === 'sw' ? metric.labelSw : metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Preview if available */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {currentLang === 'sw' ? 'Picha za Uwanjani' : 'Field Photos'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.gallery.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`${project.title} field photo ${i + 1}`}
                    className="h-28 w-full object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {currentLang === 'sw' ? 'Funga' : 'Close'}
            </button>

            <button
              id="btn-donate-from-project-modal"
              type="button"
              onClick={() => {
                onClose();
                onDonate(project);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/25 transition-all"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{t.projects.donateToProject}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
