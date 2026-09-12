import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Tag, 
  Sparkles, 
  Eye, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { GalleryItem, Language } from '../../types';
import { translations } from '../../lib/translations';

interface GallerySectionProps {
  items: GalleryItem[];
  currentLang: Language;
  onSelectItem: (item: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  currentLang,
  onSelectItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[currentLang];

  const categories = [
    { id: 'all', label: t.gallery.filterAll },
    { id: 'education', label: t.gallery.filterEducation },
    { id: 'healthcare', label: t.gallery.filterHealthcare },
    { id: 'environment', label: t.gallery.filterEnvironment },
    { id: 'relief', label: t.gallery.filterRelief },
  ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(i => i.category === selectedCategory);

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'sw' ? 'Mkusanyiko wa Picha' : 'Visual Stories'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.gallery.title}
            </h2>
            <p className="text-slate-600 text-base">
              {t.gallery.subtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style / Modern Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Hover overlay icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-emerald-300" />
              </div>

              {/* Category tag */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                <h4 className="font-bold text-sm leading-snug group-hover:text-emerald-300 transition-colors">
                  {currentLang === 'sw' ? item.titleSw : item.title}
                </h4>
                {item.location && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
