import { PhoneCall, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface HowItWorksProps {
  onOpenQuoteModal: () => void;
}

export default function HowItWorks({ onOpenQuoteModal }: HowItWorksProps) {
  const { homepageConfig, siteSettings, isPreviewMode } = useCms();

  if (!homepageConfig.showHowItWorksSection && !isPreviewMode) {
    return null;
  }

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <PhoneCall className="w-6 h-6 text-orange-400" />;
      case 1:
        return <MessageSquare className="w-6 h-6 text-sky-400" />;
      case 2:
        return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
      default:
        return <PhoneCall className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header from CMS */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-400">
            <span>{homepageConfig.howItWorksSubtitle || 'Simple 3-Step Coordination · Fast & Transparent'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {homepageConfig.howItWorksHeading || 'How It Works'}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            {homepageConfig.howItWorksDescription}
          </p>
        </div>

        {/* 3 Steps Process Grid from CMS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {(homepageConfig.howItWorksSteps || []).map((step, index) => (
            <div
              key={step.id || index}
              className="relative bg-slate-950/80 rounded-2xl p-7 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 group"
            >
              {/* Step Editorial Number & Icon Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
                  {getStepIcon(index)}
                </div>
                <span className="text-2xl font-extrabold font-mono text-slate-500 group-hover:text-orange-400 transition-colors">
                  {step.stepNumber}
                </span>
              </div>

              {/* Step Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-orange-400 mt-0.5">
                    {step.subtitle}
                  </p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Action Tag */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{step.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Step 1 Quick Action Callout */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-medium text-slate-300">
              Ready for Step 1? Call our dispatch line directly:
            </span>
            <a
              href={siteSettings.phoneLink}
              className="text-sm font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{siteSettings.phoneDisplay}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">or</span>
            <button
              onClick={onOpenQuoteModal}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 underline cursor-pointer"
            >
              Submit an Online Request
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
