import React, { useState } from 'react';
import { Save, CheckCircle2, Plus, Trash2, Sliders } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { NavigationConfig, NavLinkItem } from '../../../types/cms';

export default function HeaderFooterTab() {
  const { navigation, updateNavigation } = useCms();
  const [formData, setFormData] = useState<NavigationConfig>({ ...navigation });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setFormData({ ...navigation });
  }, [navigation]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateNavigation(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHeaderLink = () => {
    const newLink: NavLinkItem = {
      id: 'nl-' + Date.now(),
      label: 'New Link',
      url: '#',
      order: formData.headerLinks.length + 1,
    };
    setFormData({
      ...formData,
      headerLinks: [...formData.headerLinks, newLink],
    });
  };

  const handleDeleteHeaderLink = (id: string) => {
    setFormData({
      ...formData,
      headerLinks: formData.headerLinks.filter((l) => l.id !== id),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Navigation Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Header &amp; Footer Management
          </h2>
          <p className="text-xs text-slate-400">
            Manage navigation links, brand wordmark, sticky behavior, call button, and footer copyright.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save & Publish Navigation'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Navigation settings published to live website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Header Settings */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800">
            Top Navigation Bar (Header)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Logo / Brand Text</label>
              <input
                type="text"
                value={formData.logoText}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Header Call Button Text</label>
              <input
                type="text"
                value={formData.callButtonText}
                onChange={(e) => setFormData({ ...formData, callButtonText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Call Button Phone Link</label>
              <input
                type="text"
                value={formData.callButtonPhone}
                onChange={(e) => setFormData({ ...formData, callButtonPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="stickyNav"
              checked={formData.isSticky}
              onChange={(e) => setFormData({ ...formData, isSticky: e.target.checked })}
              className="w-4 h-4 accent-orange-600 rounded"
            />
            <label htmlFor="stickyNav" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Enable Sticky Top Bar on scroll
            </label>
          </div>

          {/* Links List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Navigation Links
              </span>
              <button
                type="button"
                onClick={handleAddHeaderLink}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-orange-400" />
                <span>Add Link</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.headerLinks.map((link, idx) => (
                <div key={link.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">{idx + 1}.</span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const next = [...formData.headerLinks];
                      next[idx].label = e.target.value;
                      setFormData({ ...formData, headerLinks: next });
                    }}
                    placeholder="Link Label"
                    className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const next = [...formData.headerLinks];
                      next[idx].url = e.target.value;
                      setFormData({ ...formData, headerLinks: next });
                    }}
                    placeholder="#services"
                    className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteHeaderLink(link.id)}
                    className="p-1 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800">
            Footer Configuration
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Footer Company Description
            </label>
            <textarea
              rows={2}
              value={formData.footerDescription}
              onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Copyright Notice Text
            </label>
            <input
              type="text"
              value={formData.copyrightText}
              onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
