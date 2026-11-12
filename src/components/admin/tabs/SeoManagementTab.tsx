import React, { useState } from 'react';
import { Search, Save, CheckCircle2, Globe, ShieldCheck, Code, RefreshCw } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { SiteSettings } from '../../../types/cms';

export default function SeoManagementTab() {
  const { siteSettings, updateSiteSettings } = useCms();
  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedSitemap, setGeneratedSitemap] = useState('');

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

  const generateXmlSitemap = () => {
    const origin = window.location.origin;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${origin}/#services</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/#service-areas</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/#contact</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    setGeneratedSitemap(xml);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Search Visibility &amp; Schema
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            SEO &amp; Metadata Management
          </h2>
          <p className="text-xs text-slate-400">
            Configure titles, meta tags, OpenGraph social cards, and XML sitemaps.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save & Publish SEO'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>SEO configuration updated in Firestore and published!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Metadata */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" />
            <span>Search Engine Snippet</span>
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Homepage SEO Title (`&lt;title&gt;` &amp; `og:title`) *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {formData.seoTitle?.length || 0} / 60 chars
              </span>
            </div>
            <input
              type="text"
              required
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Meta Description (`meta name="description"`) *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {formData.seoDescription?.length || 0} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Meta Keywords (Optional)
            </label>
            <input
              type="text"
              value={formData.metaKeywords || ''}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              placeholder="HVAC installation, AC repair, furnace maintenance"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              OpenGraph Social Share Image URL
            </label>
            <input
              type="text"
              value={formData.ogImage || ''}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>
        </div>

        {/* Indexing, Robots & Structured Data */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Crawling &amp; Robots Indexing</span>
            </h3>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="robotsIndex"
                checked={formData.robotsIndexing}
                onChange={(e) => setFormData({ ...formData, robotsIndexing: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <div>
                <label htmlFor="robotsIndex" className="text-xs text-slate-200 font-bold block cursor-pointer">
                  Allow Search Engines to Index Site (`index, follow`)
                </label>
                <p className="text-[11px] text-slate-400">
                  Uncheck if site is in maintenance mode or staging.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Canonical URL Override (Optional)
              </label>
              <input
                type="text"
                value={formData.canonicalUrl || ''}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                placeholder="https://iwebpro-hvac.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          {/* XML Sitemap Tool */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span>XML Sitemap Generator</span>
              </h3>
              <button
                type="button"
                onClick={generateXmlSitemap}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-orange-400" />
                <span>Generate Sitemap</span>
              </button>
            </div>

            {generatedSitemap ? (
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-40">
                {generatedSitemap}
              </pre>
            ) : (
              <p className="text-xs text-slate-400">
                Click generate to output an XML sitemap of all active routes for Google Search Console submission.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
