import React from 'react';
import {
  FileText,
  Wrench,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

interface DashboardOverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onPreviewSite: () => void;
}

export default function DashboardOverviewTab({ onNavigateTab, onPreviewSite }: DashboardOverviewTabProps) {
  const {
    pages,
    services,
    testimonials,
    faqs,
    submissions,
    activityLogs,
    siteSettings
  } = useCms();

  const publishedServices = services.filter((s) => s.isPublished).length;
  const draftServices = services.filter((s) => !s.isPublished).length;
  const newSubmissions = submissions.filter((s) => s.status === 'new').length;

  const statCards = [
    {
      label: 'Website Pages',
      count: pages.length + 1, // Including homepage
      sub: `${pages.filter((p) => p.isPublished).length + 1} Published`,
      icon: FileText,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/60 border-sky-800/60',
      tab: 'pages',
    },
    {
      label: 'HVAC Services',
      count: services.length,
      sub: `${publishedServices} Published · ${draftServices} Drafts`,
      icon: Wrench,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/60 border-orange-800/60',
      tab: 'services',
    },
    {
      label: 'Testimonials',
      count: testimonials.length,
      sub: `${testimonials.filter((t) => t.isPublished).length} Published`,
      icon: MessageSquareQuote,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60 border-emerald-800/60',
      tab: 'testimonials',
    },
    {
      label: 'FAQs',
      count: faqs.length,
      sub: `${faqs.filter((f) => f.isPublished).length} Active questions`,
      icon: HelpCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/60 border-purple-800/60',
      tab: 'faqs',
    },
    {
      label: 'Lead Inquiries',
      count: submissions.length,
      sub: `${newSubmissions} New actionable inquiries`,
      icon: Inbox,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/60 border-amber-800/60',
      tab: 'submissions',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
              Live Database Connected · Firestore Enterprise
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {siteSettings.companyName} Administration
          </h2>
          <p className="text-xs text-slate-400">
            Control every visible heading, service, image, testimonial, and lead in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onPreviewSite}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Preview Website</span>
          </button>
          <button
            onClick={() => onNavigateTab('homepage')}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Edit Homepage</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl border ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {card.count}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Quick Management Shortcuts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Direct Content Management Modules</span>
            </h3>
            <span className="text-xs text-slate-400">100% Code-Free Editing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              onClick={() => onNavigateTab('homepage')}
              className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                Homepage Content &amp; Hero
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Edit main headlines, CTA buttons, background images, and trust indicators.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('services')}
              className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                HVAC Services Catalog (8)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage AC, heating, furnace, ductwork, and commercial HVAC offerings.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('contact-info')}
              className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                Company &amp; Phone ({siteSettings.phoneDisplay})
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Update phone number, email, dispatch hours, and company information.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('submissions')}
              className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                <span>Customer Submissions</span>
                {newSubmissions > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {newSubmissions} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Review lead requests, assign technicians, and export submissions to CSV.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('media')}
              className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                Media Library &amp; Assets
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload images, replace unit photos, and organize HVAC asset folders.
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('design-theme')}
              className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                Design &amp; Theme Settings
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Change primary brand colors, button border radius, and typography styles.
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Recent Activity &amp; Audit Trail</span>
            </h3>
            <span className="text-[11px] text-slate-500">Realtime</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {activityLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent activity recorded yet. Edits made in any module will log here.
              </div>
            ) : (
              activityLogs.slice(0, 8).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-400 uppercase text-[10px] tracking-wider">
                      {log.entity}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                  <div className="text-[10px] text-slate-500">
                    By: {log.adminEmail}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
