import { Phone, Mail, ShieldCheck, MapPin, ArrowUp, Settings } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface FooterProps {
  onOpenDashboard: () => void;
  onOpenQuoteModal: (service?: string) => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenDashboard, onOpenQuoteModal, onOpenAdmin }: FooterProps) {
  const { siteSettings, navigation, services } = useCms();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const publishedServices = services.filter((s) => s.isPublished);

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pb-20 sm:pb-12">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-lg">
                {navigation.logoText ? navigation.logoText[0] : 'I'}
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {siteSettings.companyName}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {navigation.footerDescription ||
                'Professional heating, ventilation, and air conditioning installation, repair, and maintenance for residential and commercial spaces. Dependable climate solutions you can trust year-round.'}
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <a
                  href={siteSettings.phoneLink}
                  className="hover:text-white font-bold text-white transition-colors"
                >
                  {siteSettings.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a
                  href={siteSettings.emailLink}
                  className="hover:text-white transition-colors"
                >
                  {siteSettings.emailDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{siteSettings.serviceAreaNotice || 'Regional Metro Coverage & Surrounding Municipalities'}</span>
              </div>
            </div>
          </div>

          {/* Quick HVAC Services Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Our HVAC Services
            </h4>
            <ul className="space-y-2">
              {publishedServices.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => onOpenQuoteModal(service.name)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Services & Commercial */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Specialized Solutions
            </h4>
            <ul className="space-y-2">
              {publishedServices.slice(5).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => onOpenQuoteModal(service.name)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <a href="#service-areas" className="hover:text-white transition-colors">
                  Service Area Matrix
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Dispatch Hours & Portal */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Dispatch Hours
            </h4>
            <div className="space-y-1 text-slate-300">
              <p className="font-semibold text-white">Hours of Service:</p>
              <p>{siteSettings.businessHours}</p>
              <p className="text-[11px] text-orange-400 pt-1">
                Emergency triage available via telephone.
              </p>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin Panel (CMS)</span>
              </button>
              <button
                onClick={onOpenDashboard}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 text-xs font-semibold rounded-lg border border-slate-800 transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Lead Tracker</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            {navigation.copyrightText ||
              `© ${new Date().getFullYear()} ${siteSettings.companyName}. All rights reserved. Professional heating, ventilation, and air conditioning services.`}
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAdmin}
              className="hover:text-orange-400 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              <span>Admin CMS</span>
            </button>
            <a href="#contact" className="hover:text-white transition-colors text-[11px]">
              Privacy &amp; Service Terms
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
