import { useState } from 'react';
import { MapPin, Search, Phone, Navigation, Info } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface ServiceAreasProps {
  onOpenQuoteModal: (service?: string, city?: string) => void;
}

export default function ServiceAreas({ onOpenQuoteModal }: ServiceAreasProps) {
  const { serviceAreas, siteSettings, isPreviewMode } = useCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const availableAreas = serviceAreas.filter((a) => a.isPublished || isPreviewMode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchFeedback('Please enter a city or ZIP code to check coverage.');
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const match = availableAreas.some(
      (zone) =>
        zone.regionName.toLowerCase().includes(query) ||
        (zone.coveredCities || []).some((c) => c.toLowerCase().includes(query))
    );

    if (match) {
      setSearchFeedback(`Coverage Verified: Standard technician dispatch is available for "${searchQuery}".`);
    } else {
      setSearchFeedback(
        `Custom Dispatch Route: We frequently service areas surrounding "${searchQuery}". Please call ${siteSettings.phoneDisplay} to confirm the nearest technician window.`
      );
    }
  };

  return (
    <section id="service-areas" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-400">
            <span>Service Territory &amp; Dispatch</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Coverage Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            HVAC Service Areas
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            {siteSettings.companyName} dispatches experienced technicians for residential heating and cooling as well as commercial HVAC maintenance across our service zones.
          </p>
        </div>

        {/* Territory Notice */}
        <div className="mb-10 max-w-4xl mx-auto p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white uppercase tracking-wider block">
              Service Territory &amp; Immediate Availability
            </span>
            <p>
              Technicians are routed by regional proximity. To confirm immediate availability for your home or commercial building today, call{' '}
              <a href={siteSettings.phoneLink} className="font-bold text-orange-400 hover:underline">
                {siteSettings.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>

        {/* Interactive Coverage Lookup Bar */}
        <div className="max-w-xl mx-auto mb-14">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFeedback(null);
                }}
                placeholder="Enter city or ZIP code (e.g. Metro Central)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Check Availability
            </button>
          </form>

          {searchFeedback && (
            <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <Navigation className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>{searchFeedback}</span>
            </div>
          )}
        </div>

        {/* Service Zones Cards from CMS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {availableAreas.map((zone) => (
            <div
              key={zone.id}
              className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {zone.countyOrZone}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {zone.regionName}
                </h3>
                <p className="text-xs font-semibold text-emerald-400">
                  {zone.responseStandard}
                </p>
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Included Municipalities &amp; Districts:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(zone.coveredCities || []).map((city, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onOpenQuoteModal('HVAC Service', zone.regionName)}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 cursor-pointer"
                >
                  Request Dispatch Here &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Territory Callout Bar */}
        <div className="text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-2xl mx-auto space-y-3">
          <h4 className="text-base font-bold text-white">
            Located outside our primary listed areas?
          </h4>
          <p className="text-xs text-slate-300">
            Our dispatch coordinators regularly arrange extended routes for residential heat pump installations and commercial HVAC projects.
          </p>
          <div className="pt-2">
            <a
              href={siteSettings.phoneLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Dispatch: {siteSettings.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
