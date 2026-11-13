import { Layers, Building, ShieldCheck, Headphones, Clock, Zap, Phone, Check } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { normalizeImageUrl, handleImageError } from '../utils/imageUtils';

interface WhyChooseUsProps {
  onOpenQuoteModal: () => void;
}

export default function WhyChooseUs({ onOpenQuoteModal }: WhyChooseUsProps) {
  const { homepageConfig, siteSettings, isPreviewMode } = useCms();

  if (!homepageConfig.showWhyUsSection && !isPreviewMode) {
    return null;
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-5 h-5 text-sky-400" />;
      case 'Building':
        return <Building className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-indigo-400" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-orange-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <section id="why-us" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header from CMS */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-400">
            <span>{homepageConfig.whyUsSubtitle || 'Our Service Commitment · Integrity & Standards'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {homepageConfig.whyUsHeading || 'Why Choose Iwebpro?'}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            {homepageConfig.whyUsDescription}
          </p>
        </div>

        {/* Value Pillars Grid from CMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {(homepageConfig.whyUsFeatures || []).map((point, index) => (
            <div
              key={point.id || index}
              className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-slate-600 transition-colors">
                  {getIcon(point.iconName)}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                  {point.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {point.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Iwebpro Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dual Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Residential Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="relative h-60 w-full overflow-hidden bg-slate-800">
              <img
                src={normalizeImageUrl('/assets/images/furnace_installation_1794427370552.jpg')}
                alt="High-efficiency furnace installation"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, 'heating')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-slate-950/80 text-orange-400 text-xs font-bold px-3 py-1 rounded border border-slate-800">
                Residential Climate Care
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Home Comfort, Safety &amp; Energy Savings
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Properly installed furnaces, heat pumps, and ductwork reduce seasonal energy consumption, prevent unexpected mid-winter shutoffs, and ensure consistent temperatures throughout every room.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Transparent diagnostic walkthrough before work begins</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Respectful in-home service with protective work mats</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Commercial Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="relative h-60 w-full overflow-hidden bg-slate-800">
              <img
                src={normalizeImageUrl('/assets/images/commercial_rooftop_hvac_1794427369351.jpg')}
                alt="Commercial HVAC rooftop systems"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, 'commercial')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-slate-950/80 text-sky-400 text-xs font-bold px-3 py-1 rounded border border-slate-800">
                Commercial Facility Solutions
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Reliable Commercial Rooftop &amp; Package Units
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Commercial operations cannot afford HVAC downtime. We service rooftop air handlers, package cooling units, ventilation ducting, and building economizers to keep staff and patrons comfortable.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Preventative commercial maintenance agreements</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Coordinated dispatch to minimize business disruption</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onOpenQuoteModal}
              className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Request Free Service Estimate
            </button>
            <a
              href={siteSettings.phoneLink}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>Call ({siteSettings.phoneDisplay})</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
