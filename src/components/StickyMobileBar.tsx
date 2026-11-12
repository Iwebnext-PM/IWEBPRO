import { Phone, Calendar } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface StickyMobileBarProps {
  onOpenQuoteModal: () => void;
}

export default function StickyMobileBar({ onOpenQuoteModal }: StickyMobileBarProps) {
  const { siteSettings } = useCms();

  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2.5 sm:hidden shadow-2xl"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href={siteSettings.phoneLink}
          className="flex-1 py-3 px-3 bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>Call: {siteSettings.phoneDisplay}</span>
        </a>

        <button
          onClick={onOpenQuoteModal}
          className="flex-1 py-3 px-3 bg-slate-800 active:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span>Free Quote</span>
        </button>
      </div>
    </aside>
  );
}
