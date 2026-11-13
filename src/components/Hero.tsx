import { useState } from 'react';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Flame,
  Snowflake,
  Building2,
  Clock,
  CheckCircle,
  Zap,
  Layers
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { normalizeImageUrl, handleImageError } from '../utils/imageUtils';

interface HeroProps {
  onOpenQuoteModal: (service?: string) => void;
  onSelectService: (serviceId: string) => void;
}

export default function Hero({ onOpenQuoteModal }: HeroProps) {
  const { homepageConfig, siteSettings } = useCms();
  const [quickService, setQuickService] = useState('ac-repair');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenQuoteModal(quickService);
  };

  const getIndicatorIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'CheckCircle':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-yellow-400 shrink-0" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />;
    }
  };

  const overlayOpacity = homepageConfig.heroOverlayOpacity ?? 85;

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-850">
      {/* Background Photography with Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={normalizeImageUrl(homepageConfig.heroBgImage, '/assets/images/hero_hvac_technician.jpg')}
          alt="HVAC technician and climate control equipment"
          className="w-full h-full object-cover object-center lg:object-[60%_30%]"
          style={{ opacity: (100 - overlayOpacity) / 100 + 0.15 }}
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, 'hero')}
        />
        {/* Measured dark gradient scrim for 4.5:1 WCAG contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70"
          style={{ opacity: overlayOpacity / 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy & Primary CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Context kicker: clean unboxed metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-orange-400">
              <span className="uppercase tracking-wider">{siteSettings.companyName} Climate Solutions</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Heating, Ventilation &amp; Air Conditioning</span>
            </div>

            {/* Primary Headline from CMS */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight lg:leading-[1.15] text-balance">
              {homepageConfig.heroHeading}
            </h1>

            {/* Subheadline / Description from CMS */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              {homepageConfig.heroDescription}
            </p>

            {/* Prominent Two Primary CTAs from CMS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href={homepageConfig.heroPrimaryCtaUrl || siteSettings.phoneLink}
                className="px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-orange-600/25 flex items-center justify-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-700/60 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-orange-200">
                    Speak With A Specialist
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {homepageConfig.heroPrimaryCtaText || `Call Now: ${siteSettings.phoneDisplay}`}
                  </div>
                </div>
              </a>

              <button
                onClick={() => onOpenQuoteModal()}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-base rounded-xl border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{homepageConfig.heroSecondaryCtaText || 'Request a Free Quote'}</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>

            {/* Trust Indicators from CMS */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(homepageConfig.trustIndicators || []).map((indicator) => (
                  <div key={indicator.id} className="flex items-center gap-2">
                    {getIndicatorIcon(indicator.iconName)}
                    <span className="text-xs font-medium text-slate-300">
                      {indicator.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Quick Triage & Estimate Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl">
              <div className="space-y-1 pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Fast HVAC Dispatch
                </span>
                <h2 className="text-xl font-bold text-white">
                  Schedule Diagnostic or Quote
                </h2>
                <p className="text-xs text-slate-400">
                  Select your HVAC requirement for priority coordination.
                </p>
              </div>

              <form onSubmit={handleQuickSubmit} className="pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    What service do you need?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickService('ac-repair')}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        quickService === 'ac-repair'
                          ? 'bg-sky-950/80 border-sky-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Snowflake className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold">AC Repair</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Cooling troubleshooting</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickService('ac-installation')}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        quickService === 'ac-installation'
                          ? 'bg-sky-950/80 border-sky-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Snowflake className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold">AC Install</span>
                      </div>
                      <p className="text-[11px] text-slate-400">New system setup</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickService('heating-repair')}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        quickService === 'heating-repair'
                          ? 'bg-orange-950/80 border-orange-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold">Heating / Heat Pump</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Furnace &amp; warmth</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickService('commercial-hvac')}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        quickService === 'commercial-hvac'
                          ? 'bg-slate-700 border-orange-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">Commercial</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Facility &amp; RTU</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Direct telephone line:</span>
                    <a href={siteSettings.phoneLink} className="font-bold text-orange-400 hover:underline">
                      {siteSettings.phoneDisplay}
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Email inquiries:</span>
                    <a href={siteSettings.emailLink} className="font-medium text-slate-300 hover:underline">
                      {siteSettings.emailDisplay}
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Free Quote Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
