import React from 'react';
import { X, MapPin, Calendar, Tag, Download } from 'lucide-react';
import { GalleryItem, Language } from '../../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  currentLang: Language;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  currentLang,
  onClose
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md">
      <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Preview Image */}
        <div className="max-h-[70vh] flex items-center justify-center bg-black">
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                {item.category}
              </span>
              {item.location && (
                <span className="flex items-center gap-1 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {item.location}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {currentLang === 'sw' ? item.titleSw : item.title}
            </h3>
            {item.description && (
              <p className="text-xs text-slate-300 max-w-xl">
                {currentLang === 'sw' ? item.descriptionSw || item.description : item.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold self-end sm:self-center transition-colors"
          >
            {currentLang === 'sw' ? 'Funga' : 'Close Preview'}
          </button>
        </div>

      </div>
    </div>
  );
};
