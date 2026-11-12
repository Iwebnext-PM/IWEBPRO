import React, { useState } from 'react';
import { Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { CmsAboutUs } from '../../../types/cms';

export default function AboutUsManagementTab() {
  const { aboutUs, updateAboutUs } = useCms();
  const [formData, setFormData] = useState<CmsAboutUs>({ ...aboutUs });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setFormData({ ...aboutUs });
  }, [aboutUs]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAboutUs(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddValue = () => {
    setFormData({
      ...formData,
      companyValues: [
        ...(formData.companyValues || []),
        { title: 'New Core Value', description: 'Describe company principle.', icon: 'ShieldCheck' },
      ],
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Brand Story &amp; Values
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            About Us Management
          </h2>
          <p className="text-xs text-slate-400">
            Manage company introduction, background, mission statement, vision, and core values.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save & Publish About Us'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>About Us content saved to Cloud Firestore and published!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800">
            Core Introduction &amp; Mission
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Page Heading (H1)</label>
            <input
              type="text"
              value={formData.pageHeading}
              onChange={(e) => setFormData({ ...formData, pageHeading: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Intro Sentence</label>
            <textarea
              rows={2}
              value={formData.companyIntro}
              onChange={(e) => setFormData({ ...formData, companyIntro: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Story &amp; Craftsmanship</label>
            <textarea
              rows={4}
              value={formData.companyDescription}
              onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mission Statement</label>
              <textarea
                rows={3}
                value={formData.missionStatement}
                onChange={(e) => setFormData({ ...formData, missionStatement: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vision Statement</label>
              <textarea
                rows={3}
                value={formData.visionStatement}
                onChange={(e) => setFormData({ ...formData, visionStatement: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Company Values</h3>
            <button
              type="button"
              onClick={handleAddValue}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              <span>Add Value</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(formData.companyValues || []).map((val, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => {
                      const next = [...formData.companyValues];
                      next[idx].title = e.target.value;
                      setFormData({ ...formData, companyValues: next });
                    }}
                    className="flex-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = formData.companyValues.filter((_, i) => i !== idx);
                      setFormData({ ...formData, companyValues: next });
                    }}
                    className="p-1 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={val.description}
                  onChange={(e) => {
                    const next = [...formData.companyValues];
                    next[idx].description = e.target.value;
                    setFormData({ ...formData, companyValues: next });
                  }}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
