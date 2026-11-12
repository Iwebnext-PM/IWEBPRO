import { useState, useEffect } from 'react';
import { Phone, Menu, X, ShieldCheck, Settings, ExternalLink } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { useAuth } from '../firebase/authContext';

interface HeaderProps {
  onOpenQuoteModal: (preselectedService?: string) => void;
  onOpenAdmin: () => void;
}

export default function Header({ onOpenQuoteModal, onOpenAdmin }: HeaderProps) {
  const { siteSettings, navigation } = useCms();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSticky = navigation.isSticky;

  return (
    <header
      className={`${isSticky ? 'sticky top-0' : 'relative'} z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md shadow-md border-b border-slate-800'
          : 'bg-slate-950 border-b border-slate-850'
      }`}
    >
      {/* Top Direct Dispatch Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="font-medium text-slate-200">Residential &amp; Commercial HVAC Dispatch</span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-400">{siteSettings.businessHours}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Website Admin CMS"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
              {isAdmin && (
                <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                  Logged In
                </span>
              )}
            </button>
            <a
              href={siteSettings.phoneLink}
              className="font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>{siteSettings.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Brand Wordmark from CMS */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                {navigation.logoText ? navigation.logoText[0] : 'I'}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-slate-100 transition-colors">
                  {navigation.logoText || siteSettings.companyName}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  HVAC Services
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links from CMS */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navigation.headerLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Free Quote
            </button>
            <a
              href={siteSettings.phoneLink}
              className="px-4.5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all shadow-sm hover:shadow-orange-500/20 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>{navigation.callButtonText || `Call: ${siteSettings.phoneDisplay}`}</span>
            </a>
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={siteSettings.phoneLink}
              className="p-2 text-orange-400 hover:text-orange-300 rounded-lg border border-slate-800"
              aria-label="Call HVAC Dispatch"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-200">
            {navigation.headerLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="px-3 py-2 text-left rounded-md hover:bg-slate-800 text-orange-400 font-semibold flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Panel (CMS)</span>
            </button>
          </nav>
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
            >
              Request Quote
            </button>
            <a
              href={siteSettings.phoneLink}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
