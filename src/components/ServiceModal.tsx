import { X, Check, AlertCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { HvacService } from '../types/hvac';
import { useCms } from '../context/CmsContext';

interface ServiceModalProps {
  service: HvacService | null;
  onClose: () => void;
  onBookService: (serviceName: string) => void;
}

export default function ServiceModal({ service, onClose, onBookService }: ServiceModalProps) {
  const { siteSettings } = useCms();
  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-800 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Image */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 bg-slate-900">
          <img
            src={service.imageSrc}
            alt={service.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs uppercase font-bold tracking-wider text-orange-400">
              {siteSettings.companyName} Service Detail
            </span>
            <h2 id="service-modal-title" className="text-2xl font-bold text-white leading-tight">
              {service.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {service.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Service Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {service.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Highlights */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  What We Deliver
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {service.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Indicators / Problems */}
            <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-200/80">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-950">
                  When To Call Us
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {service.commonSigns.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span>Direct phone dispatch:</span>
            <a
              href={siteSettings.phoneLink}
              className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{siteSettings.phoneDisplay}</span>
            </a>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookService(service.name);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Book This Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
