import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Building,
  Sparkles
} from 'lucide-react';
import { Language, SiteSettings } from '../../types';
import { translations } from '../../lib/translations';
import { submitContactMessage } from '../../lib/db';

interface ContactSectionProps {
  currentLang: Language;
  siteSettings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentLang, siteSettings }) => {
  const t = translations[currentLang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactMessage({
        name,
        email,
        phone: phone || undefined,
        subject,
        message,
      });
      setSentSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 6000);
    } catch (err) {
      console.error('Contact form error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLang === 'sw' ? 'Wasiliana Nasi Moja kwa Moja' : 'Direct Communication'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-slate-600 text-base">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                {t.contact.hqTitle}
              </h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">{t.contact.addressLabel}</strong>
                    <span>{siteSettings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">{t.contact.phoneLabel}</strong>
                    <a href={`tel:${siteSettings.phone}`} className="hover:text-emerald-700 font-medium transition-colors">
                      {siteSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">{t.contact.emailLabel}</strong>
                    <a href={`mailto:${siteSettings.email}`} className="hover:text-emerald-700 font-medium transition-colors">
                      {siteSettings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">{t.contact.hoursLabel}</strong>
                    <span>{siteSettings.officeHours}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Hotline Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold mb-0.5">
                  {currentLang === 'sw' ? 'Msaada wa Dharura (24/7):' : '24/7 Humanitarian Emergency Desk:'}
                </strong>
                <span>
                  {currentLang === 'sw'
                    ? 'Kwa majanga ya mafuriko, ukame au dharura za kibinadamu, piga namba ya dharura: +255 754 889 900'
                    : 'For disaster and emergency relief coordination, call our 24/7 hotline at +255 754 889 900'}
                </span>
              </div>
            </div>

          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                {currentLang === 'sw' ? 'Tuandikie Ujumbe' : 'Send Us a Direct Message'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {currentLang === 'sw'
                  ? 'Wawakilishi wetu wa jamii watajibu ndani ya saa 24.'
                  : 'Our community coordinators will respond within 24 business hours.'}
              </p>

              {sentSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900">
                    {t.contact.successMessage}
                  </h4>
                  <p className="text-xs text-emerald-700">
                    {currentLang === 'sw'
                      ? 'Ujumbe wako umepokelewa na kusajiliwa katika mfumo wetu.'
                      : 'Your inquiry has been successfully dispatched to the Foundation secretariat.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {t.contact.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {t.contact.email} *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {t.contact.phone}
                      </label>
                      <input
                        type="tel"
                        placeholder="+255..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {t.contact.subject} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={currentLang === 'sw' ? 'Kuhusu mradi, ushirikiano...' : 'General inquiry, partnership...'}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t.contact.message} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={currentLang === 'sw' ? 'Andika ujumbe wako hapa...' : 'Type your detailed inquiry or partnership proposal...'}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <button
                    id="submit-contact-form-btn"
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? (currentLang === 'sw' ? 'Inatuma...' : 'Sending...') : t.contact.submitBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
