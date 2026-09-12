import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Tag,
  ChevronRight,
  Eye
} from 'lucide-react';
import { NewsArticle, Language } from '../../types';
import { translations } from '../../lib/translations';

interface NewsSectionProps {
  articles: NewsArticle[];
  currentLang: Language;
  onSelectArticle: (article: NewsArticle) => void;
  onNavigate: (section: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  articles,
  currentLang,
  onSelectArticle,
  onNavigate
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const t = translations[currentLang];

  const filteredArticles = activeFilter === 'all'
    ? articles
    : articles.filter(a => (a.category as string) === activeFilter);

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'sw' ? 'Habari na Matukio' : 'Updates & Field Dispatch'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.news.title}
            </h2>
            <p className="text-slate-600 text-base">
              {t.news.subtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: t.news.filterAll },
              { id: 'update', label: t.news.filterNews },
              { id: 'event', label: t.news.filterEvents },
              { id: 'story', label: t.news.filterStories },
              { id: 'press', label: t.news.filterPress },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === f.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => {
            const articleCategory = String(article.category || 'story').replace(/_/g, ' ');
            const dateDisplay = article.publishedDate 
              ? new Date(article.publishedDate).toLocaleDateString()
              : (article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '');

            return (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-emerald-300 backdrop-blur-md">
                        {articleCategory}
                      </span>
                    </div>

                    {article.eventDate && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-emerald-700/90 px-2.5 py-1 rounded-lg backdrop-blur-md">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.eventDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {dateDisplay && <span>{dateDisplay}</span>}
                      {dateDisplay && <span>•</span>}
                      <span>{article.author}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                      {currentLang === 'sw' ? article.titleSw : article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {currentLang === 'sw' ? article.summarySw : article.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {article.tags?.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    id={`read-article-${article.id}`}
                    type="button"
                    onClick={() => onSelectArticle(article)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors"
                  >
                    <span>{t.news.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
