import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  PieChart, 
  Lock, 
  Building, 
  CheckCircle2, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/translations';

interface TransparencySectionProps {
  currentLang: Language;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [downloadedDoc, setDownloadedDoc] = useState<string | null>(null);

  const budgetAllocation = [
    { label: t.transparency.directPrograms, percent: 88, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
    { label: t.transparency.operations, percent: 7, color: 'bg-teal-500', textColor: 'text-teal-700' },
    { label: t.transparency.fundraising, percent: 5, color: 'bg-amber-500', textColor: 'text-amber-700' },
  ];

  const handleDownload = (docName: string) => {
    setDownloadedDoc(docName);
    setTimeout(() => setDownloadedDoc(null), 4000);
  };

  return (
    <section id="transparency-section" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLang === 'sw' ? 'Usimamizi na Uwazi wa Fedha' : 'Financial Integrity & Governance'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.transparency.title}
          </h2>
          <p className="text-slate-600 text-base">
            {t.transparency.subtitle}
          </p>
        </div>

        {/* Budget Allocation Progress Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {t.transparency.budgetTitle}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {currentLang === 'sw'
                ? 'Kila shilingi inayotolewa kwa Noventra Charity Foundation inatumiwa kwa viwango vya juu vya maadili na uwazi. Asilimia 88 inaenda moja kwa moja kwenye miradi ya kusaidia jamii.'
                : 'Every single donation entrusted to Noventra Charity Foundation is governed with strict oversight. 88% directly funds grassroots programs and beneficiary aid.'}
            </p>

            <div className="space-y-4 pt-2">
              {budgetAllocation.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-slate-800">{item.label}</span>
                    <span className={item.textColor}>{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong>{currentLang === 'sw' ? 'Uhakiki Huru wa Nje:' : 'Independent External Audit:'}</strong>{' '}
                {currentLang === 'sw'
                  ? 'Taarifa za fedha zinakaguliwa kila mwaka na wakaguzi wa hesabu walioidhinishwa (Certified Public Accountants) na kuwasilishwa kwa Msajili wa NGO Tanzania.'
                  : 'Annual financial audits performed by independent certified public accountants and filed with the Registrar of NGOs in Tanzania.'}
              </div>
            </div>
          </div>

          {/* Audit Reports & Governance Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {t.transparency.reportsTitle}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">PDF Reports</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Noventra Annual Financial Report 2025/2026', size: '1.8 MB', date: 'Published July 2026' },
                  { name: 'NGO Compliance Certificate & Registration Deed', size: '1.1 MB', date: 'Ministry of Community Dev' },
                  { name: 'Safeguarding & Anti-Corruption Governance Charter', size: '950 KB', date: 'Board Approved' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-4 hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{doc.name}</h4>
                        <span className="text-[10px] text-slate-400">{doc.date} • {doc.size}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(doc.name)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadedDoc === doc.name ? 'Opening...' : 'View PDF'}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentLang === 'sw' ? 'Hati zote ziko wazi kwa umma na wadau.' : 'Publicly accessible to all partners, donors, and regulatory bodies.'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
