import React from 'react';
import { 
  X, 
  Calendar, 
  User, 
  MapPin, 
  Share2, 
  Tag, 
  Clock,
  Sparkles
} from 'lucide-react';
import { NewsArticle, Language } from '../../types';
import { translations } from '../../lib/translations';

interface NewsModalProps {
  article: NewsArticle | null;
  currentLang: Language;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  article,
  currentLang,
  onClose
}) => {
  if (!article) return null;
  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image Banner */}
        <div className="relative h-64 sm:h-80 bg-slate-900">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            id="close-news-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
              {String(article.category || 'Story').replace(/_/g, ' ')}
            </span>

            {article.location && (
              <span className="flex items-center gap-1 text-xs text-slate-200 bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {article.location}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : (article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                {article.author}
              </span>
              {article.eventDate && (
                <>
                  <span>•</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Event Date: {article.eventDate}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {currentLang === 'sw' ? article.titleSw : article.title}
            </h1>

            <p className="text-sm font-semibold text-emerald-800 bg-emerald-50/60 p-4 rounded-xl border-l-4 border-emerald-600">
              {currentLang === 'sw' ? article.summarySw : article.summary}
            </p>
          </div>

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100 pt-4">
            {currentLang === 'sw' ? article.contentSw : article.content}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {article.tags.map((t, idx) => (
              <span key={idx} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                #{t}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-bold transition-colors"
          >
            {currentLang === 'sw' ? 'Funga' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
