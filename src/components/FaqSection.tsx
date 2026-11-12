import { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface FaqSectionProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function FaqSection({ onOpenQuoteModal }: FaqSectionProps) {
  const { faqs, siteSettings, isPreviewMode } = useCms();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const availableFaqs = faqs.filter((f) => f.isPublished || isPreviewMode);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-400">
            <HelpCircle className="w-4 h-4 text-orange-400" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
            Find immediate answers to common questions about HVAC repair indicators, maintenance frequency, equipment replacement, and commercial services.
          </p>
        </div>

        {/* Accordions List from CMS */}
        <div className="space-y-3.5">
          {availableFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-white pr-2 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-orange-600/20 text-orange-400' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 animate-fade-in">
                    <p>{faq.answer}</p>
                    <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                      <span>Category: {faq.category}</span>
                      <button
                        onClick={() => onOpenQuoteModal(faq.category)}
                        className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Need assistance with this? Request Quote</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">
              Have a specific question not covered here?
            </h4>
            <p className="text-xs text-slate-400">
              Our team is ready to answer questions about your particular make and model.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={siteSettings.phoneLink}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({siteSettings.phoneDisplay})</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
