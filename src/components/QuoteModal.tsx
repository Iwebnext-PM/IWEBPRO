import { useState, useEffect } from 'react';
import { X, Phone, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { PropertyType, UrgencyLevel, Lead } from '../types/hvac';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export default function QuoteModal({ isOpen, onClose, preselectedService }: QuoteModalProps) {
  const { siteSettings, services, submitContactLead } = useCms();
  const publishedServices = services.filter((s) => s.isPublished);
  const defaultServiceName = preselectedService || (publishedServices[0]?.name || 'Air Conditioning Installation');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceRequired: defaultServiceName,
    propertyType: 'residential' as PropertyType,
    urgency: 'standard' as UrgencyLevel,
    preferredDate: '',
    preferredTime: 'Morning (8am - 12pm)',
    serviceCity: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceRequired: preselectedService }));
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for quote confirmation.';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a short description of what you need.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const createdLead = await submitContactLead({
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceRequired: formData.serviceRequired,
        propertyType: formData.propertyType,
        urgency: formData.urgency,
        preferredDate: formData.preferredDate || undefined,
        preferredTime: formData.preferredTime,
        serviceCity: formData.serviceCity.trim() || undefined,
        message: formData.message.trim()
      });

      setSubmittedLead(createdLead);
    } catch (err) {
      console.error('Error submitting quote lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedLead(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
              {siteSettings.companyName} Quote Engine
            </span>
            <h2 id="quote-modal-title" className="text-xl font-bold text-white">
              Request a Free HVAC Quote
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {submittedLead ? (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-white">
                  Quote Request Received!
                </h3>
                <p className="text-xs text-slate-300">
                  Tracking Reference:{' '}
                  <span className="font-mono text-orange-400 font-bold">
                    {submittedLead.referenceNo}
                  </span>
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Our HVAC specialist will review your requirements and follow up promptly. Lead has been dispatched to our central management portal.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={siteSettings.phoneLink}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now for Immediate Assistance: {siteSettings.phoneDisplay}</span>
                </a>
              </div>

              <button
                onClick={handleClose}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-[10px] text-rose-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[10px] text-rose-400">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] text-rose-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Service Required
                </label>
                <select
                  value={formData.serviceRequired}
                  onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {publishedServices.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="residential">Residential Home</option>
                    <option value="commercial">Commercial Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Urgency
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="standard">Standard (1-2 days)</option>
                    <option value="priority">Priority</option>
                    <option value="emergency_24_7">Emergency 24/7</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Brief Problem Description *
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what system symptoms you are seeing..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                {errors.message && (
                  <p className="mt-1 text-[10px] text-rose-400">{errors.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Free Quote Request</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 pt-1">
                Prefer to talk? Call{' '}
                <a href={siteSettings.phoneLink} className="text-orange-400 font-bold hover:underline">
                  {siteSettings.phoneDisplay}
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
