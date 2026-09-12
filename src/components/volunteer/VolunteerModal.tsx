import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VolunteerArea, Language, VolunteerApplication } from '../../types';
import { translations } from '../../lib/translations';
import { submitVolunteerApplication } from '../../lib/db';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>('female');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [skills, setSkills] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState<VolunteerArea[]>(['education']);
  const [availability, setAvailability] = useState<'weekdays' | 'weekends' | 'full_time' | 'flexible'>('weekends');
  const [previousExperience, setPreviousExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<VolunteerApplication | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const volunteerAreasList: { id: VolunteerArea; labelEn: string; labelSw: string }[] = [
    { id: 'education', labelEn: 'Education & Tutoring', labelSw: 'Ufadhili wa Elimu & Kufundisha' },
    { id: 'healthcare', labelEn: 'Healthcare & Medical Outreach', labelSw: 'Programu za Afya & Kambi' },
    { id: 'environment', labelEn: 'Environmental & Tree Planting', labelSw: 'Mazingira & Upandaji Miti' },
    { id: 'community_development', labelEn: 'Community Development', labelSw: 'Maendeleo ya Jamii' },
    { id: 'fundraising', labelEn: 'Fundraising & Donor Engagement', labelSw: 'Ukusanyaji Michango & Wafadhili' },
    { id: 'it_tech', labelEn: 'IT & Digital Technology', labelSw: 'TEHAMA & Teknolojia' },
    { id: 'media', labelEn: 'Photography, Video & Media', labelSw: 'Upigaji Picha, Video & Habari' },
    { id: 'event_management', labelEn: 'Event Coordination & Logistics', labelSw: 'Maandalizi ya Matukio' },
    { id: 'emergency_response', labelEn: 'Emergency & Disaster Response', labelSw: 'Misaada ya Dharura' },
    { id: 'other', labelEn: 'Other Skills & General Support', labelSw: 'Mengineyo / Usaidizi Mkuu' },
  ];

  const handleAreaToggle = (area: VolunteerArea) => {
    if (areasOfInterest.includes(area)) {
      if (areasOfInterest.length > 1) {
        setAreasOfInterest(areasOfInterest.filter(a => a !== area));
      }
    } else {
      setAreasOfInterest([...areasOfInterest, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) return;

    setSubmitting(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      
      const app = await submitVolunteerApplication({
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        location,
        occupation,
        skills: skillsArray.length > 0 ? skillsArray : ['General Community Service'],
        areasOfInterest,
        availability,
        previousExperience,
        motivation,
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRelation,
          phone: emergencyPhone
        },
        consentAgreed: true,
      });

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSubmittedApp(app);
      setSubmitting(false);
    } catch (err) {
      console.error('Volunteer application error:', err);
      setSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (submittedApp) {
      navigator.clipboard.writeText(submittedApp.applicationCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 sm:p-8 relative">
          <button
            id="close-volunteer-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>{currentLang === 'sw' ? 'Jiunge na Jamii ya Noventra' : 'Join Noventra Changemakers'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.volunteer.title}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-lg">
            {t.volunteer.subtitle}
          </p>
        </div>

        {/* Content or Success screen */}
        {submittedApp ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                {t.volunteer.successTitle}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {t.volunteer.successMessage}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto flex items-center justify-between">
              <span className="font-mono text-xl font-black text-emerald-700">
                {submittedApp.applicationCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {t.volunteer.reviewNotice}
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20"
              >
                {currentLang === 'sw' ? 'Sawa, Asante' : 'Done, Thank You'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. {currentLang === 'sw' ? 'Taarifa Binafsi' : 'Personal Details'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.volunteer.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Peter Mwita"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.volunteer.email} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.volunteer.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+255 754 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.volunteer.dob} *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.volunteer.gender} *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="female">Female (Mwanamke)</option>
                    <option value="male">Male (Mwanaume)</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.volunteer.location} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dar es Salaam (Kinondoni)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.volunteer.occupation} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nurse / Teacher / Student"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Areas of Interest */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. {t.volunteer.areasTitle} *
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {volunteerAreasList.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleAreaToggle(area.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      areasOfInterest.includes(area.id)
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{currentLang === 'sw' ? area.labelSw : area.labelEn}</span>
                    {areasOfInterest.includes(area.id) && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills & Availability */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. {currentLang === 'sw' ? 'Ujuzi na Upatikanaji' : 'Skills & Availability'}
              </h4>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.volunteer.skills} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First aid, Social media, Graphic design, Driving, Event organizing"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.volunteer.availability} *
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="weekends">Weekends only (Mwishoni mwa wiki)</option>
                  <option value="weekdays">Weekdays (Siku za kazi)</option>
                  <option value="flexible">Flexible / On-Call (Muda wowote unaohitajika)</option>
                  <option value="full_time">Full-Time Volunteer Fellowship</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.volunteer.motivation} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={currentLang === 'sw' ? 'Eleza kwa kifupi kile kinachokusukuma kujitolea na Noventra Foundation...' : 'Tell us why you want to volunteer and what you hope to achieve...'}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                4. {t.volunteer.emergencyContact} *
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder={t.volunteer.emergencyName + ' *'}
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder={t.volunteer.emergencyRelation + ' * (mf. Mzazi/Ndugu)'}
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder={t.volunteer.emergencyPhone + ' *'}
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5"
                />
                <span>{t.volunteer.consent}</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {currentLang === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>

              <button
                id="submit-volunteer-btn"
                type="submit"
                disabled={submitting || !consentAgreed}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? (currentLang === 'sw' ? 'Inatuma...' : 'Submitting...') : t.volunteer.submitBtn}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
