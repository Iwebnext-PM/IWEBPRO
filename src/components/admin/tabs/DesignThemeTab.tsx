import React, { useState } from 'react';
import { Palette, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { SiteSettings } from '../../../types/cms';

export default function DesignThemeTab() {
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
      await updateSiteSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePresetPalette = (primary: string, secondary: string, accent: string) => {
    setFormData({
      ...formData,
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Visual Identity &amp; Styling
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Design &amp; Theme Settings
          </h2>
          <p className="text-xs text-slate-400">
            Control brand colors, typography, button radius, and global visual hierarchy without touching CSS.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Apply & Publish Theme'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Global theme settings applied and synchronized across website!</span>
        </div>
      )}

      {/* Preset HVAC Palettes */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Professional HVAC Palettes
        </span>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handlePresetPalette('#ea580c', '#0b1727', '#0284c7')}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-xs text-white flex items-center gap-2 cursor-pointer"
          >
            <div className="flex -space-x-1">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-600 border border-slate-900" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-900" />
              <span className="w-3.5 h-3.5 rounded-full bg-sky-600 border border-slate-900" />
            </div>
            <span>Safety Orange &amp; Navy (Default)</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetPalette('#0284c7', '#0b192c', '#f97316')}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-sky-500 rounded-xl text-xs text-white flex items-center gap-2 cursor-pointer"
          >
            <div className="flex -space-x-1">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-600 border border-slate-900" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-900" />
              <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border border-slate-900" />
            </div>
            <span>Electric Cyan &amp; Deep Slate</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetPalette('#e11d48', '#0f172a', '#2563eb')}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-rose-500 rounded-xl text-xs text-white flex items-center gap-2 cursor-pointer"
          >
            <div className="flex -space-x-1">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-slate-900" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-900" />
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-slate-900" />
            </div>
            <span>Crimson Heating &amp; Cobalt</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors Control */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
            <Palette className="w-4 h-4 text-orange-400" />
            <span>Brand Colors</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Brand Accent (CTAs, Badges)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor || '#ea580c'}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={formData.primaryColor || '#ea580c'}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Secondary Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.accentColor || '#0284c7'}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={formData.accentColor || '#0284c7'}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Canvas Dark Navy Shade
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.secondaryColor || '#0b1727'}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={formData.secondaryColor || '#0b1727'}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Typography & Geometry */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800">
            Geometry &amp; Typography
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display &amp; Body Font Family
            </label>
            <select
              value={formData.fontFamily || 'Plus Jakarta Sans'}
              onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Recommended Modern Standard)</option>
              <option value="Outfit">Outfit (Clean Geometric Sans)</option>
              <option value="Manrope">Manrope (Technical Corporate)</option>
              <option value="DM Sans">DM Sans (High Legibility)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Button &amp; Card Border Radius
            </label>
            <select
              value={formData.borderRadius || 'rounded-xl'}
              onChange={(e) => setFormData({ ...formData, borderRadius: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            >
              <option value="rounded-md">Subtle (rounded-md - 6px)</option>
              <option value="rounded-xl">Standard Modern (rounded-xl - 12px)</option>
              <option value="rounded-2xl">Smooth Curved (rounded-2xl - 16px)</option>
            </select>
          </div>

          {/* Interactive Live Button Preview */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Live Component Preview
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                style={{ backgroundColor: formData.primaryColor }}
                className={`px-4 py-2.5 text-white font-bold text-xs ${formData.borderRadius} shadow`}
              >
                Call Now: (888) 445-5423
              </button>
              <button
                type="button"
                style={{ borderColor: formData.primaryColor, color: '#fff' }}
                className={`px-4 py-2.5 bg-slate-900 border text-xs font-bold ${formData.borderRadius}`}
              >
                Request Free Quote
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
