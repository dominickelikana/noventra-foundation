import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Package, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, Language, Donation, DonationType, PaymentMethod, SiteSettings } from '../../types';
import { translations } from '../../lib/translations';
import { createDonation } from '../../lib/db';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  preSelectedProject?: Project | null;
  currentLang: Language;
  siteSettings: SiteSettings;
  onDonationSuccess: (donation: Donation) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  projects,
  preSelectedProject,
  currentLang,
  siteSettings,
  onDonationSuccess
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  const [donationType, setDonationType] = useState<DonationType>('money');
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'TZS' | 'USD'>('TZS');
  const [projectId, setProjectId] = useState<string>(preSelectedProject?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  
  // Donor details
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState('');
  const [physicalItemsDesc, setPhysicalItemsDesc] = useState('');
  const [transactionRef, setTransactionRef] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const tzsPresetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];
  const usdPresetAmounts = [10, 25, 50, 100, 250, 500];

  const presetAmounts = currency === 'TZS' ? tzsPresetAmounts : usdPresetAmounts;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(id);
    setTimeout(() => setCopiedNumber(null), 3000);
  };

  const getEffectiveAmount = (): number => {
    if (customAmount && Number(customAmount) > 0) {
      return Number(customAmount);
    }
    return selectedAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const effectiveAmount = donationType === 'money' ? getEffectiveAmount() : undefined;
      const refCode = transactionRef.trim() || `NOV-${Date.now().toString().slice(-6)}`;
      const receiptNo = `NOV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const selectedProj = projects.find(p => p.id === projectId);
      const projectName = selectedProj ? (currentLang === 'sw' ? selectedProj.titleSw : selectedProj.title) : undefined;

      const newDonation = await createDonation({
        receiptNumber: receiptNo,
        donorName: donorName.trim() || (isAnonymous ? 'Anonymous Donor' : 'Valued Supporter'),
        donorEmail: donorEmail.trim() || 'supporter@noventra.org',
        donorPhone: donorPhone.trim() || 'N/A',
        isAnonymous,
        donationType,
        amount: effectiveAmount,
        currency,
        projectId: projectId || undefined,
        projectName,
        paymentMethod: donationType === 'money' ? paymentMethod : undefined,
        transactionReference: refCode,
        status: donationType === 'money' ? 'completed' : 'pending',
        message: donorMessage.trim() || undefined,
        physicalItemsDescription: physicalItemsDesc.trim() || undefined,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitting(false);
      onClose();
      onDonationSuccess(newDonation);
    } catch (err) {
      console.error('Donation error:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 sm:p-8 relative">
          <button
            id="close-donation-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4 fill-current text-emerald-400" />
            <span>{currentLang === 'sw' ? 'Mchango Rasmi wa Noventra' : 'Official Donation Portal'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.donation.title}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-lg">
            {t.donation.subtitle}
          </p>

          {/* Donation Type Switcher Tabs */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl mt-6 max-w-md border border-slate-700">
            <button
              type="button"
              onClick={() => setDonationType('money')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                donationType === 'money'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.donation.tabMoney}</span>
            </button>

            <button
              type="button"
              onClick={() => setDonationType('food')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                donationType !== 'money'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.donation.tabItems}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* ================= Financial Donation Fields ================= */}
          {donationType === 'money' ? (
            <div className="space-y-6">
              
              {/* Currency & Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t.donation.chooseAmount}
                  </label>
                  
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('TZS');
                        setSelectedAmount(50000);
                        setCustomAmount('');
                      }}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        currency === 'TZS' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      TZS (Shilingi)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('USD');
                        setSelectedAmount(25);
                        setCustomAmount('');
                      }}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        currency === 'USD' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                {/* Amount presets grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {currency === 'TZS' ? `${(amt / 1000).toLocaleString()}k` : `$${amt}`}
                    </button>
                  ))}
                </div>

                {/* Custom amount field */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    {currency === 'TZS' ? 'TZS' : 'USD ($)'}
                  </span>
                  <input
                    id="custom-donation-amount"
                    type="number"
                    min="1000"
                    placeholder={t.donation.customAmount}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {t.donation.paymentMethod}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'mpesa', name: 'M-Pesa', desc: 'Vodacom TZ', badge: 'Lipa: 5678901', color: 'border-emerald-500' },
                    { id: 'tigopesa', name: 'Tigo Pesa', desc: 'Mixx by Yas', badge: 'Lipa: 6789012', color: 'border-blue-500' },
                    { id: 'airtel', name: 'Airtel Money', desc: 'Airtel TZ', badge: 'Lipa: 7890123', color: 'border-red-500' },
                    { id: 'halopesa', name: 'HaloPesa', desc: 'Halotel', badge: '0624 889 900', color: 'border-amber-500' },
                    { id: 'bank_transfer', name: 'CRDB / NMB', desc: 'Bank Wire', badge: 'Direct A/C', color: 'border-emerald-700' },
                    { id: 'card', name: 'Card / Online', desc: 'Visa / MC', badge: 'Instant', color: 'border-slate-800' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        paymentMethod === method.id
                          ? 'bg-emerald-50/70 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{method.name}</span>
                        {paymentMethod === method.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{method.desc}</div>
                      <div className="text-[10px] font-semibold text-emerald-700 mt-1 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/80 inline-block">
                        {method.badge}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Tanzanian Payment Instructions Box */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-xs border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" />
                      {currentLang === 'sw' ? 'Taarifa Rasmi za Malipo' : 'Official Payment Numbers'}
                    </span>
                    <span className="text-[10px] text-slate-400">Tanzania Shillings & USD</span>
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80">
                      <div>
                        <strong className="text-white block">M-Pesa (Vodacom):</strong>
                        <span>{siteSettings.paymentAccounts.mpesaNumber} ({siteSettings.paymentAccounts.mpesaName})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('5678901', 'mpesa')}
                        className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                        title="Copy Lipa Namba"
                      >
                        {copiedNumber === 'mpesa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80">
                      <div>
                        <strong className="text-white block">CRDB Bank (TZS) / NMB (USD):</strong>
                        <span className="text-[11px]">{siteSettings.paymentAccounts.bankAccountNumber}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('0150889900100', 'crdb')}
                        className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                        title="Copy Account"
                      >
                        {copiedNumber === 'crdb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction reference input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {currentLang === 'sw' 
                      ? 'Namba ya Muamala / SMS ya Malipo (Mf. MP89A7B2991 au Kumbukumbu ya Benki)' 
                      : 'Payment Reference / Transaction ID from your SMS or Bank (Optional/Self-Verification)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MP-982187293X / CRDB-TXN-8812"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>
          ) : (
            /* ================= In-Kind & Physical Supplies Donation ================= */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <p className="font-bold mb-1">
                  {currentLang === 'sw' ? 'Mchango wa Vifaa na Mahitaji ya Kibinadamu' : 'In-Kind & Physical Supplies Donation'}
                </p>
                <p>
                  {currentLang === 'sw'
                    ? 'Tunapokea vyakula visivyoharibika haraka, sare na vitabu vya shule, magodoro, nguo safi na dawa katika ofisi yetu kuu ya Dar es Salaam au vituo vyetu vya mikoani.'
                    : 'We gratefully receive non-perishable food, school uniforms & books, bedding, clean clothing, and certified medical kits at our Dar es Salaam headquarters or regional hubs.'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {t.donation.itemType}
                </label>
                <select
                  value={donationType}
                  onChange={(e) => setDonationType(e.target.value as DonationType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="food">Chakula (Grains, Maize flour, Cooking oil, Nutrition packs)</option>
                  <option value="school_supplies">Vifaa vya Shule (Vitabu, Madaftari, Kalamu, Uniforms)</option>
                  <option value="clothes">Mavazi na Viatu (Clean clothes, Shoes, Blankets)</option>
                  <option value="medical_supplies">Vifaa vya Matibabu & First Aid Kits</option>
                  <option value="other">Vinginevyo (Solar lamps, Computers, Construction)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {t.donation.itemDescription} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={physicalItemsDesc}
                  onChange={(e) => setPhysicalItemsDesc(e.target.value)}
                  placeholder={currentLang === 'sw' ? 'Mfano: Katoni 5 za daftari za shule na kalamu 200, ziko Kinondoni Dar es Salaam...' : 'Describe item quantities, condition, and pickup/delivery location...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* Project Designation Dropdown */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {t.donation.selectProject}
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="">{t.donation.allProjects}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {currentLang === 'sw' ? p.titleSw : p.title} ({p.category})
                </option>
              ))}
            </select>
          </div>

          {/* Donor Information */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t.donation.donorInfo}
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{currentLang === 'sw' ? 'Weka bila jina (Anonymous)' : 'Anonymous donation'}</span>
              </label>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required={!isAnonymous}
                    placeholder={t.donation.fullName + ' *'}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required={!isAnonymous}
                    placeholder={t.donation.phone + ' * (mf. +255...)'}
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="email"
                    required={!isAnonymous}
                    placeholder={t.donation.email + ' * (for official receipt)'}
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder={currentLang === 'sw' ? 'Ujumbe wa Baraka / Maombi (Hiari)' : 'Words of encouragement / Message (Optional)'}
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {currentLang === 'sw' ? 'Ghairi' : 'Cancel'}
            </button>

            <button
              id="submit-donation-final-btn"
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>
                {submitting
                  ? (currentLang === 'sw' ? 'Inakamilisha...' : 'Processing...')
                  : donationType === 'money'
                  ? `${t.donation.submitDonation} (${currency === 'TZS' ? 'TZS ' + getEffectiveAmount().toLocaleString() : '$' + getEffectiveAmount()})`
                  : t.donation.submitItems}
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
