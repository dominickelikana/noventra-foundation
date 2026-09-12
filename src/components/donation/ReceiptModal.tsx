import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Donation, Language, SiteSettings } from '../../types';
import { translations } from '../../lib/translations';

interface ReceiptModalProps {
  donation: Donation | null;
  currentLang: Language;
  siteSettings: SiteSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  donation,
  currentLang,
  siteSettings,
  onClose
}) => {
  if (!donation) return null;
  const t = translations[currentLang];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(6, 78, 59); // Emerald 900
      doc.rect(0, 0, 210, 40, 'F');
      
      // Header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('NOVENTRA CHARITY FOUNDATION', 14, 20);
      doc.setFontSize(10);
      doc.text('Restoring Hope. Transforming Lives. | Reg No: 00NGO/R/2025/0714', 14, 28);
      doc.text('Dar es Salaam, Tanzania | info@noventrafoundation.org', 14, 34);

      // Receipt Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text('OFFICIAL DONATION RECEIPT', 14, 52);
      
      // Details Table
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      
      const startY = 62;
      const lineHeight = 8;
      
      doc.text(`Receipt Number: ${donation.receiptNumber}`, 14, startY);
      doc.text(`Date & Time: ${new Date(donation.createdAt).toLocaleString()}`, 14, startY + lineHeight);
      doc.text(`Donor Name: ${donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}`, 14, startY + lineHeight * 2);
      doc.text(`Donor Email: ${donation.donorEmail}`, 14, startY + lineHeight * 3);
      doc.text(`Donation Type: ${donation.donationType.toUpperCase()}`, 14, startY + lineHeight * 4);
      
      if (donation.amount) {
        doc.text(`Amount: ${donation.currency} ${donation.amount.toLocaleString()}`, 14, startY + lineHeight * 5);
      }
      
      if (donation.projectName) {
        doc.text(`Designated Project: ${donation.projectName}`, 14, startY + lineHeight * 6);
      }

      doc.text(`Payment Channel: ${donation.paymentMethod || 'Manual / In-Kind'}`, 14, startY + lineHeight * 7);
      doc.text(`Transaction Reference: ${donation.transactionReference}`, 14, startY + lineHeight * 8);
      doc.text(`Status: VERIFIED & COMPLETED`, 14, startY + lineHeight * 9);

      // Thank You Note
      doc.setTextColor(5, 150, 105);
      doc.setFontSize(11);
      doc.text('Thank you for partnering with Noventra Foundation to transform vulnerable lives.', 14, startY + lineHeight * 12);
      
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text('This receipt is electronically generated and recognized under Tanzania NGO financial reporting regulations.', 14, startY + lineHeight * 14);

      doc.save(`Noventra_Receipt_${donation.receiptNumber}.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none">
        
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 sm:p-8 text-center relative print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-300" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t.donation.receiptTitle}
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            {t.donation.thankYou}
          </p>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 bg-white" id="printable-receipt">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-current text-emerald-600" />
                <span>NOVENTRA FOUNDATION</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Reg: 00NGO/R/2025/0714 • Dar es Salaam, Tanzania
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Receipt No.</span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                {donation.receiptNumber}
              </span>
            </div>
          </div>

          {/* Amount Badge */}
          {donation.amount ? (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">
                  {currentLang === 'sw' ? 'Kiasi Kilichopokelewa' : 'Amount Received'}
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {donation.currency} {donation.amount.toLocaleString()}
                </span>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>VERIFIED</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
              <span className="text-xs text-slate-500 block">Physical Items Donation</span>
              <span className="text-sm font-bold text-slate-800">{donation.physicalItemsDescription}</span>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Donor Name:</span>
              <strong className="text-slate-800 font-semibold">{donation.isAnonymous ? 'Anonymous Supporter' : donation.donorName}</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Date & Time:</span>
              <strong className="text-slate-800 font-semibold">{new Date(donation.createdAt).toLocaleDateString()}</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Payment Method:</span>
              <strong className="text-slate-800 font-semibold uppercase">{donation.paymentMethod || donation.donationType}</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Ref / SMS Code:</span>
              <strong className="text-slate-800 font-mono font-semibold">{donation.transactionReference}</strong>
            </div>

            {donation.projectName && (
              <div className="col-span-2">
                <span className="text-slate-400 block">Project Designation:</span>
                <strong className="text-emerald-800 font-semibold">{donation.projectName}</strong>
              </div>
            )}
          </div>

          {/* Electronic Stamp */}
          <div className="pt-4 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Noventra Charity Foundation Trust</p>
              <p>Official Electronic Seal • Verified Transaction</p>
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-emerald-600/40 flex items-center justify-center text-[9px] font-bold text-emerald-800 text-center uppercase rotate-[-12deg] p-1">
              OFFICIAL RECEIPT
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {currentLang === 'sw' ? 'Funga' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.donation.printReceipt}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.donation.downloadReceipt}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
