import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Save, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { SiteSettings } from '../../../types/cms';

export default function ContactInfoTab() {
  const { siteSettings, updateSiteSettings } = useCms();
  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setFormData({ ...siteSettings });
  }, [siteSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Clean phone number for tel: link
      const cleanPhone = formData.phoneDisplay.replace(/[^0-9+]/g, '');
      const phoneTel = cleanPhone.startsWith('+') ? cleanPhone : `+1${cleanPhone.replace(/^1/, '')}`;
      const phoneLink = `tel:${phoneTel}`;
      const emailLink = `mailto:${formData.emailDisplay}`;

      await updateSiteSettings({
        ...formData,
        phoneTel,
        phoneLink,
        emailLink,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Global Company Profile
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Contact Information Management
          </h2>
          <p className="text-xs text-slate-400">
            Centralized business credentials. Updating here updates headers, footers, CTAs, and click-to-call links site-wide.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Sync Site-Wide Contact Info'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Contact information saved to Cloud Firestore and synchronized across entire website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Contact Channels */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-400" />
            <span>Primary Phone &amp; Email</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Official Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Public Telephone Number Display *
            </label>
            <input
              type="text"
              required
              value={formData.phoneDisplay}
              onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
              placeholder="(888) 445-5423"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold text-orange-400"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Auto-formats to click-to-call link across all buttons and headers.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.emailDisplay}
              onChange={(e) => setFormData({ ...formData, emailDisplay: e.target.value })}
              placeholder="iwebnext.com@gmail.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Operating Hours & Physical Location */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Operations &amp; Address</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Physical Business / Dispatch Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dispatch &amp; Operating Hours
            </label>
            <input
              type="text"
              value={formData.businessHours}
              onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
              placeholder="Monday – Sunday: 7:00 AM – 8:00 PM"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Emergency Service Notice
            </label>
            <input
              type="text"
              value={formData.emergencyNotice}
              onChange={(e) => setFormData({ ...formData, emergencyNotice: e.target.value })}
              placeholder="Emergency HVAC breakdown services available upon inquiry"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
