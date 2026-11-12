import React, { useState } from 'react';
import {
  LayoutDashboard,
  Home,
  FileText,
  Wrench,
  Info,
  MapPin,
  MessageSquareQuote,
  HelpCircle,
  Menu,
  Phone,
  Image as ImageIcon,
  Search,
  Palette,
  Inbox,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  X,
  Sun,
  Moon,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../firebase/authContext';
import { useCms } from '../../context/CmsContext';

// Tabs
import DashboardOverviewTab from './tabs/DashboardOverviewTab';
import HomepageManagementTab from './tabs/HomepageManagementTab';
import PagesManagementTab from './tabs/PagesManagementTab';
import ServicesManagementTab from './tabs/ServicesManagementTab';
import AboutUsManagementTab from './tabs/AboutUsManagementTab';
import ServiceAreasTab from './tabs/ServiceAreasTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import FaqManagementTab from './tabs/FaqManagementTab';
import HeaderFooterTab from './tabs/HeaderFooterTab';
import ContactInfoTab from './tabs/ContactInfoTab';
import MediaLibraryTab from './tabs/MediaLibraryTab';
import SeoManagementTab from './tabs/SeoManagementTab';
import DesignThemeTab from './tabs/DesignThemeTab';
import FormSubmissionsTab from './tabs/FormSubmissionsTab';
import UserManagementTab from './tabs/UserManagementTab';
import SettingsTab from './tabs/SettingsTab';

interface AdminLayoutProps {
  onBackToWebsite: () => void;
  onPreviewSite: () => void;
}

export default function AdminLayout({ onBackToWebsite, onPreviewSite }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { submissions, siteSettings } = useCms();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>('dark');

  const newSubmissionsCount = submissions.filter((s) => s.status === 'new').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'homepage', label: 'Homepage Management', icon: Home },
    { id: 'pages', label: 'Pages Management', icon: FileText },
    { id: 'services', label: 'Services Management', icon: Wrench },
    { id: 'about-us', label: 'About Us Management', icon: Info },
    { id: 'service-areas', label: 'Service Areas', icon: MapPin },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'faqs', label: 'FAQ Management', icon: HelpCircle },
    { id: 'header-footer', label: 'Header & Footer', icon: Menu },
    { id: 'contact-info', label: 'Contact Information', icon: Phone },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'seo', label: 'SEO Management', icon: Search },
    { id: 'design-theme', label: 'Design & Theme', icon: Palette },
    {
      id: 'submissions',
      label: 'Form Submissions',
      icon: Inbox,
      badge: newSubmissionsCount > 0 ? newSubmissionsCount : undefined,
    },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    onBackToWebsite();
  };

  const getBreadcrumbLabel = () => {
    const item = navItems.find((n) => n.id === activeTab);
    return item ? item.label : 'Dashboard';
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverviewTab onNavigateTab={(t) => setActiveTab(t)} onPreviewSite={onPreviewSite} />;
      case 'homepage':
        return <HomepageManagementTab onPreviewSite={onPreviewSite} />;
      case 'pages':
        return <PagesManagementTab />;
      case 'services':
        return <ServicesManagementTab />;
      case 'about-us':
        return <AboutUsManagementTab />;
      case 'service-areas':
        return <ServiceAreasTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'faqs':
        return <FaqManagementTab />;
      case 'header-footer':
        return <HeaderFooterTab />;
      case 'contact-info':
        return <ContactInfoTab />;
      case 'media':
        return <MediaLibraryTab />;
      case 'seo':
        return <SeoManagementTab />;
      case 'design-theme':
        return <DesignThemeTab />;
      case 'submissions':
        return <FormSubmissionsTab />;
      case 'users':
        return <UserManagementTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardOverviewTab onNavigateTab={(t) => setActiveTab(t)} onPreviewSite={onPreviewSite} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${adminTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} antialiased selection:bg-orange-500`}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col w-64 shrink-0 border-r ${adminTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Brand Lockup */}
        <div className={`h-16 flex items-center px-6 gap-3 border-b ${adminTheme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            I
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block text-white">
              {siteSettings.companyName}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
              CMS Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-600/20'
                    : adminTheme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${isActive ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer controls: Back to Site & Logout */}
        <div className={`p-3 border-t space-y-1 ${adminTheme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            type="button"
            onClick={onBackToWebsite}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              adminTheme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-sky-400" />
            <span>Public Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-400 hover:text-rose-300 transition-colors cursor-pointer ${
              adminTheme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b shrink-0 ${adminTheme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className={`font-bold ${adminTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {getBreadcrumbLabel()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPreviewSite}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Preview Website"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Preview Live Website</span>
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white shadow">
                {user?.email ? user.email[0].toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-none">
                  {user?.displayName || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {user?.email || 'admin@iwebpro.local'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveTabContent()}
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-sm flex"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-72 bg-slate-900 h-full p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-sm">
                    I
                  </div>
                  <span className="font-extrabold text-sm text-white">Iwebpro CMS</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 max-h-[75vh] overflow-y-auto pr-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg ${
                        isActive ? 'bg-orange-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-orange-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  onBackToWebsite();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" />
                <span>Return to Public Website</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
