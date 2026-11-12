import { MessageSquareQuote, ShieldAlert, ArrowRight, Star } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface TestimonialsSectionProps {
  onOpenQuoteModal: () => void;
}

export default function TestimonialsSection({ onOpenQuoteModal }: TestimonialsSectionProps) {
  const { testimonials, siteSettings, isPreviewMode } = useCms();

  const availableTestimonials = testimonials.filter((t) => t.isPublished || isPreviewMode);

  return (
    <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-400">
            <span>Customer Feedback Layout</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Transparency Commitment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client Experiences &amp; Feedback
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            We value genuine client relationships and verified customer feedback. The reviews below reflect our service standards across residential and commercial HVAC projects.
          </p>
        </div>

        {/* Verified Feedback Grid from CMS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {availableTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${idx < (t.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    Verified Customer
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{t.reviewText}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                  {t.displayInitials || t.customerName?.[0] || 'C'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {t.customerName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t.clientType} · {t.serviceReceived}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Conversion CTA */}
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-3">
            Experience our professional HVAC service firsthand.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenQuoteModal}
              className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule Service Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={siteSettings.phoneLink}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              Or Call: {siteSettings.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
