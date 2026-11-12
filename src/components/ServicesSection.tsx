import { useState } from 'react';
import {
  Snowflake,
  Wrench,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Thermometer,
  Wind,
  Building2,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { CmsService } from '../types/cms';

interface ServicesSectionProps {
  onSelectServiceModal: (service: CmsService) => void;
  onOpenQuoteModal: (serviceName?: string) => void;
}

export default function ServicesSection({
  onSelectServiceModal,
  onOpenQuoteModal
}: ServicesSectionProps) {
  const { services, homepageConfig, siteSettings, isPreviewMode } = useCms();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!homepageConfig.showServicesSection && !isPreviewMode) {
    return null;
  }

  // Only show published services unless in admin preview mode
  const availableServices = services.filter((s) => s.isPublished || isPreviewMode);

  const categories = [
    { id: 'all', label: `All Services (${availableServices.length})` },
    { id: 'cooling', label: 'Air Conditioning' },
    { id: 'heating', label: 'Heating & Furnace' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'ductwork', label: 'Ductwork' },
    { id: 'commercial', label: 'Commercial' }
  ];

  const filteredServices = availableServices.filter((service) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'heating') {
      return service.category === 'heating' || service.id === 'furnace-service';
    }
    return service.category === activeCategory;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Snowflake':
        return <Snowflake className="w-5 h-5 text-sky-500" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-sky-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Thermometer':
        return <Thermometer className="w-5 h-5 text-rose-500" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-500" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      default:
        return <Wrench className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header from CMS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-400">
              <span>{homepageConfig.servicesSubtitle || 'Comprehensive Climate Solutions · Residential & Commercial'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {homepageConfig.servicesHeading || 'Our HVAC Services'}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {homepageConfig.servicesDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <a
              href={siteSettings.phoneLink}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <span>Questions? Call {siteSettings.phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto mb-10 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-slate-950/70 rounded-2xl border border-slate-800/90 overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col group hover:shadow-xl hover:shadow-black/30"
            >
              {/* Card Image Slot */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                <img
                  src={service.imageSrc}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Editorial Index Number */}
                <div className="absolute top-3 left-3 text-[11px] font-mono tracking-wider text-slate-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  0{index + 1}
                </div>

                {/* Floating Icon */}
                <div className="absolute bottom-3 left-3 w-9 h-9 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-center shadow">
                  {getServiceIcon(service.iconName)}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectServiceModal(service)}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 group/btn cursor-pointer py-1"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-3.5 h-3.5 text-orange-400 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => onOpenQuoteModal(service.name)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-orange-600 rounded-md transition-colors cursor-pointer"
                  >
                    {service.ctaButtonText || 'Get Quote'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Action Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-bold text-white">
              Not sure which HVAC service matches your situation?
            </h4>
            <p className="text-xs text-slate-400">
              Describe your symptoms over the phone to our technical support team for immediate guidance.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={siteSettings.phoneLink}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Call ({siteSettings.phoneDisplay})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
