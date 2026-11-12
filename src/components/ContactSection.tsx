import { useState } from 'react';
import { Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { PropertyType, UrgencyLevel, ContactSubmission } from '../types/cms';

interface ContactSectionProps {
  initialService?: string;
  onOpenAdmin?: () => void;
  onOpenDashboard?: () => void;
}

export default function ContactSection({ initialService, onOpenAdmin, onOpenDashboard }: ContactSectionProps) {
  const { siteSettings, services, submitContactLead } = useCms();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceRequired: initialService || services[0]?.name || 'Air Conditioning Installation',
    propertyType: 'residential' as PropertyType,
    urgency: 'standard' as UrgencyLevel,
    preferredDate: '',
    preferredTime: 'Morning (8am - 12pm)',
    serviceCity: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<ContactSubmission | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your full name.';
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for dispatch coordination.';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required for confirmation.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a brief description of your HVAC issue or installation needs.';
    } else if (formData.message.trim().length < 8) {
      newErrors.message = 'Please provide at least a short sentence describing your requirements.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const referenceNo = `IWB-2026-${randomSuffix}`;

      // Submit directly to Cloud Firestore database!
      const created = await submitContactLead({
        referenceNo,
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceRequired: formData.serviceRequired,
        propertyType: formData.propertyType,
        urgency: formData.urgency,
        preferredDate: formData.preferredDate || undefined,
        preferredTime: formData.preferredTime,
        serviceCity: formData.serviceCity.trim() || undefined,
        message: formData.message.trim(),
      });

      setSubmittedLead(created);
    } catch (err) {
      console.error('Lead submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (!submittedLead) return;
    navigator.clipboard.writeText(submittedLead.referenceNo);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleResetForm = () => {
    setSubmittedLead(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      serviceRequired: services[0]?.name || 'Air Conditioning Installation',
      propertyType: 'residential',
      urgency: 'standard',
      preferredDate: '',
      preferredTime: 'Morning (8am - 12pm)',
      serviceCity: '',
      message: ''
    });
    setErrors({});
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-400">
            <span>Direct Inquiries &amp; Free Estimates</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Fast Technical Response</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact {siteSettings.companyName}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Need emergency repair, an installation estimate, or routine maintenance? Call our dispatch team directly or submit our service booking form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Company Information from CMS */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Phone Card */}
            <div className="bg-slate-950 rounded-2xl p-7 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Direct Phone Line
                  </span>
                  <div className="text-xl font-extrabold text-white">
                    {siteSettings.companyName} Dispatch
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Speak directly with an HVAC coordinator to schedule immediate service, request diagnostic help, or review replacement options.
              </p>

              <a
                href={siteSettings.phoneLink}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-center rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <Phone className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Call: {siteSettings.phoneDisplay}</span>
              </a>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                <span>Direct link:</span>
                <span className="font-mono text-orange-400">{siteSettings.phoneLink}</span>
              </div>
            </div>

            {/* Email & Operating Info from CMS */}
            <div className="bg-slate-950 rounded-2xl p-7 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Email Correspondence
                  </span>
                  <a
                    href={siteSettings.emailLink}
                    className="block text-base font-bold text-white hover:text-orange-400 transition-colors"
                  >
                    {siteSettings.emailDisplay}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <div className="font-bold text-white mb-0.5">Operating Hours:</div>
                  <p>{siteSettings.businessHours}</p>
                  <p className="text-slate-400 mt-1">{siteSettings.emergencyNotice}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All requests synced directly to our active database queue.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form or Success Ticket */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 rounded-2xl p-7 sm:p-8 border border-slate-800 shadow-2xl">
              {submittedLead ? (
                <div className="space-y-6 text-center py-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Request Successfully Saved to Database
                    </span>
                    <h3 className="text-2xl font-extrabold text-white">
                      Thank You, {submittedLead.customerName}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been stored securely in Cloud Firestore under tracking number{' '}
                      <strong className="text-orange-400 font-mono">{submittedLead.referenceNo}</strong>.
                    </p>
                  </div>

                  {/* Receipt Box */}
                  <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-left text-xs space-y-2.5 max-w-md mx-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Service Required:</span>
                      <span className="font-bold text-white">{submittedLead.serviceRequired}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Property Type:</span>
                      <span className="capitalize font-semibold text-white">{submittedLead.propertyType}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Phone Provided:</span>
                      <span className="font-mono text-white">{submittedLead.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Tracking Reference:</span>
                      <div className="flex items-center gap-1.5 font-mono text-orange-400 font-bold">
                        <span>{submittedLead.referenceNo}</span>
                        <button
                          type="button"
                          onClick={handleCopyRef}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Copy Reference"
                        >
                          {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={siteSettings.phoneLink}
                      className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Speak with Coordinator: {siteSettings.phoneDisplay}</span>
                    </a>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleResetForm}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="space-y-1 pb-2 border-b border-slate-850">
                    <h3 className="text-xl font-bold text-white">
                      Request a Free Quote or Service Booking
                    </h3>
                    <p className="text-xs text-slate-400">
                      Fill out the form below. We will coordinate your service promptly.
                    </p>
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-orange-500'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                        className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-orange-500'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email and Service Required */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-orange-500'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Service Required <span className="text-orange-500">*</span>
                      </label>
                      <select
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.name} className="bg-slate-900 text-white">
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Property Type & Urgency */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Property Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyType: 'residential' })}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                            formData.propertyType === 'residential'
                              ? 'bg-slate-800 border-orange-500 text-white'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          Residential
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyType: 'commercial' })}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                            formData.propertyType === 'commercial'
                              ? 'bg-slate-800 border-orange-500 text-white'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          Commercial
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Urgency Level
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="standard">Standard Inquiry (1–2 Business Days)</option>
                        <option value="priority">Priority Dispatch (Same / Next Day)</option>
                        <option value="emergency_24_7">Emergency 24/7 Breakdown</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Service Details / Problem Description <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your system symptoms or installation needs..."
                      className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.message ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-orange-500'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Saving to Database...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Request a Free Quote</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
