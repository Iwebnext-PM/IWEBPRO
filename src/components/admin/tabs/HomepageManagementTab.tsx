import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  Sliders
} from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { HomepageConfig, TrustIndicator, WhyChooseItem, HowItWorksItem } from '../../../types/cms';

interface HomepageManagementTabProps {
  onPreviewSite: () => void;
}

export default function HomepageManagementTab({ onPreviewSite }: HomepageManagementTabProps) {
  const { homepageConfig, updateHomepageConfig, media } = useCms();
  const [formData, setFormData] = useState<HomepageConfig>({ ...homepageConfig });
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'trust' | 'services' | 'why-us' | 'how-it-works' | 'contact-cta'>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync if context updates from Firestore
  React.useEffect(() => {
    setFormData({ ...homepageConfig });
  }, [homepageConfig]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateHomepageConfig(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  // Trust Indicators helpers
  const handleAddTrustIndicator = () => {
    const newIndicator: TrustIndicator = {
      id: 't-' + Date.now(),
      title: 'New Trust Marker',
      iconName: 'ShieldCheck',
      order: formData.trustIndicators.length + 1,
    };
    setFormData({
      ...formData,
      trustIndicators: [...formData.trustIndicators, newIndicator],
    });
  };

  const handleDeleteTrustIndicator = (id: string) => {
    setFormData({
      ...formData,
      trustIndicators: formData.trustIndicators.filter((t) => t.id !== id),
    });
  };

  // Why Choose Us helpers
  const handleAddWhyFeature = () => {
    const newFeature: WhyChooseItem = {
      id: 'w-' + Date.now(),
      title: 'New Value Proposition',
      description: 'Describe how Iwebpro delivers exceptional HVAC performance.',
      iconName: 'CheckCircle',
      order: formData.whyUsFeatures.length + 1,
    };
    setFormData({
      ...formData,
      whyUsFeatures: [...formData.whyUsFeatures, newFeature],
    });
  };

  const handleDeleteWhyFeature = (id: string) => {
    setFormData({
      ...formData,
      whyUsFeatures: formData.whyUsFeatures.filter((f) => f.id !== id),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Frontend Architecture Control
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Homepage Content Management
          </h2>
          <p className="text-xs text-slate-400">
            Customize hero statements, trust indicators, headlines, and call-to-action buttons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPreviewSite}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving to Database...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Homepage updates saved to Cloud Firestore and published to live website!</span>
        </div>
      )}

      {/* Sub-sections segmented navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'hero', label: 'Hero Section' },
          { id: 'trust', label: 'Trust Indicators' },
          { id: 'services', label: 'Services Intro' },
          { id: 'why-us', label: 'Why Choose Us' },
          { id: 'how-it-works', label: 'How It Works' },
          { id: 'contact-cta', label: 'Contact CTA' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-orange-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section Editor */}
      {activeSubTab === 'hero' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Hero Section Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Main Hero Headline (H1)
              </label>
              <input
                type="text"
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subheading / Mission Kicker
              </label>
              <input
                type="text"
                value={formData.heroSubheading}
                onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hero Body Description
              </label>
              <textarea
                rows={3}
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-orange-400">
                  Primary CTA Button
                </span>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.heroPrimaryCtaText}
                    onChange={(e) => setFormData({ ...formData, heroPrimaryCtaText: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Button URL / Link</label>
                  <input
                    type="text"
                    value={formData.heroPrimaryCtaUrl}
                    onChange={(e) => setFormData({ ...formData, heroPrimaryCtaUrl: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-sky-400">
                  Secondary CTA Button
                </span>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.heroSecondaryCtaText}
                    onChange={(e) => setFormData({ ...formData, heroSecondaryCtaText: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Button URL / Anchor</label>
                  <input
                    type="text"
                    value={formData.heroSecondaryCtaUrl}
                    onChange={(e) => setFormData({ ...formData, heroSecondaryCtaUrl: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Background Image & Overlay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Background Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.heroBgImage}
                    onChange={(e) => setFormData({ ...formData, heroBgImage: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                {media.length > 0 && (
                  <div className="mt-2 text-[11px] text-slate-400">
                    <span>Quick select from media: </span>
                    {media.slice(0, 3).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, heroBgImage: m.fileUrl })}
                        className="text-orange-400 hover:underline mr-2"
                      >
                        {m.fileName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dark Scrim Overlay Opacity ({formData.heroOverlayOpacity}%)
                </label>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={formData.heroOverlayOpacity}
                  onChange={(e) => setFormData({ ...formData, heroOverlayOpacity: Number(e.target.value) })}
                  className="w-full accent-orange-500"
                />
                <span className="text-[11px] text-slate-500">
                  Ensures high legibility and 4.5:1 WCAG contrast over photo assets.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Indicators Editor */}
      {activeSubTab === 'trust' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Trust Indicators</h3>
              <p className="text-xs text-slate-400">Markers displayed in the hero ribbon.</p>
            </div>
            <button
              type="button"
              onClick={handleAddTrustIndicator}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              <span>Add Indicator</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.trustIndicators.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3"
              >
                <span className="text-xs font-mono text-slate-500">{index + 1}.</span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...formData.trustIndicators];
                    next[index].title = e.target.value;
                    setFormData({ ...formData, trustIndicators: next });
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
                <select
                  value={item.iconName}
                  onChange={(e) => {
                    const next = [...formData.trustIndicators];
                    next[index].iconName = e.target.value;
                    setFormData({ ...formData, trustIndicators: next });
                  }}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Building2">Building2</option>
                  <option value="CheckCircle">CheckCircle</option>
                  <option value="Clock">Clock</option>
                  <option value="Zap">Zap</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteTrustIndicator(item.id)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Section Copy */}
      {activeSubTab === 'services' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Services Section Header &amp; Display Rules
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title</label>
            <input
              type="text"
              value={formData.servicesHeading}
              onChange={(e) => setFormData({ ...formData, servicesHeading: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Kicker</label>
            <input
              type="text"
              value={formData.servicesSubtitle}
              onChange={(e) => setFormData({ ...formData, servicesSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description Paragraph</label>
            <textarea
              rows={3}
              value={formData.servicesDescription}
              onChange={(e) => setFormData({ ...formData, servicesDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Style</label>
              <select
                value={formData.servicesDisplayStyle}
                onChange={(e) => setFormData({ ...formData, servicesDisplayStyle: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value="bento">Asymmetric Bento Grid (Recommended)</option>
                <option value="grid">Uniform 4-Column Grid</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="showServices"
                checked={formData.showServicesSection}
                onChange={(e) => setFormData({ ...formData, showServicesSection: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <label htmlFor="showServices" className="text-xs text-slate-300 font-semibold cursor-pointer">
                Show Services Section on Homepage
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      {activeSubTab === 'why-us' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Why Choose Iwebpro Features</h3>
              <p className="text-xs text-slate-400">Value pillars displayed on the homepage.</p>
            </div>
            <button
              type="button"
              onClick={handleAddWhyFeature}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.whyUsFeatures.map((item, index) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-orange-400 font-bold">0{index + 1}.</span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...formData.whyUsFeatures];
                      next[index].title = e.target.value;
                      setFormData({ ...formData, whyUsFeatures: next });
                    }}
                    className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteWhyFeature(item.id)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const next = [...formData.whyUsFeatures];
                    next[index].description = e.target.value;
                    setFormData({ ...formData, whyUsFeatures: next });
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      {activeSubTab === 'how-it-works' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            How It Works Steps (3 Steps)
          </h3>

          <div className="space-y-4">
            {formData.howItWorksSteps.map((step, index) => (
              <div key={step.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-orange-400">Step {step.stepNumber}</span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const next = [...formData.howItWorksSteps];
                      next[index].title = e.target.value;
                      setFormData({ ...formData, howItWorksSteps: next });
                    }}
                    className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold"
                  />
                </div>
                <input
                  type="text"
                  value={step.subtitle}
                  onChange={(e) => {
                    const next = [...formData.howItWorksSteps];
                    next[index].subtitle = e.target.value;
                    setFormData({ ...formData, howItWorksSteps: next });
                  }}
                  className="w-full px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-orange-400"
                />
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => {
                    const next = [...formData.howItWorksSteps];
                    next[index].description = e.target.value;
                    setFormData({ ...formData, howItWorksSteps: next });
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      {activeSubTab === 'contact-cta' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Contact Call-to-Action Ribbon
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
            <input
              type="text"
              value={formData.contactCtaHeading}
              onChange={(e) => setFormData({ ...formData, contactCtaHeading: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.contactCtaDescription}
              onChange={(e) => setFormData({ ...formData, contactCtaDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number Display</label>
              <input
                type="text"
                value={formData.contactCtaPhone}
                onChange={(e) => setFormData({ ...formData, contactCtaPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.contactCtaButtonText}
                onChange={(e) => setFormData({ ...formData, contactCtaButtonText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
