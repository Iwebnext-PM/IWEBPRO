/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './firebase/authContext';
import { CmsProvider, useCms } from './context/CmsContext';

// Public Website Components
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import ServiceAreas from './components/ServiceAreas';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import StickyMobileBar from './components/StickyMobileBar';
import ServiceModal from './components/ServiceModal';
import QuoteModal from './components/QuoteModal';
import LeadDashboardModal from './components/LeadDashboardModal';

// Admin CMS Components
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';

import { HvacService } from './types/hvac';
import { Eye, ArrowLeft, Settings, ShieldCheck, X } from 'lucide-react';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { siteSettings } = useCms();

  const [currentView, setCurrentView] = useState<'website' | 'admin' | 'login'>('website');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Modal States
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<HvacService | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [preselectedServiceForQuote, setPreselectedServiceForQuote] = useState<string | undefined>(undefined);
  const [leadDashboardOpen, setLeadDashboardOpen] = useState(false);
  const [initialContactService, setInitialContactService] = useState<string | undefined>(undefined);

  // Sync with URL Hash (#admin, #login)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') {
        setCurrentView(isAdmin ? 'admin' : 'login');
      } else if (hash === '#login') {
        setCurrentView('login');
      } else if (hash === '#website' || hash === '') {
        setCurrentView('website');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdmin]);

  // Handle switching views
  const navigateToAdmin = () => {
    if (isAdmin) {
      setCurrentView('admin');
      window.location.hash = '#admin';
    } else {
      setCurrentView('login');
      window.location.hash = '#login';
    }
  };

  const navigateToWebsite = () => {
    setCurrentView('website');
    window.location.hash = '';
  };

  const handleOpenQuoteModal = (serviceName?: string) => {
    setPreselectedServiceForQuote(serviceName);
    setQuoteModalOpen(true);
  };

  const handleBookServiceFromModal = (serviceName: string) => {
    setSelectedServiceForModal(null);
    setInitialContactService(serviceName);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setPreselectedServiceForQuote(serviceName);
      setQuoteModalOpen(true);
    }
  };

  const handleSelectServiceFromHero = (serviceId: string) => {
    setPreselectedServiceForQuote(serviceId);
    setQuoteModalOpen(true);
  };

  const handleOpenCoverageQuote = (serviceName?: string) => {
    setPreselectedServiceForQuote(serviceName || 'HVAC Service');
    setQuoteModalOpen(true);
  };

  // Render Admin Panel View
  if (currentView === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Verifying administrator credentials...</p>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <AdminLogin
          onSuccess={() => {
            setCurrentView('admin');
            window.location.hash = '#admin';
          }}
          onBackToSite={navigateToWebsite}
        />
      );
    }

    return (
      <AdminLayout
        onBackToWebsite={navigateToWebsite}
        onPreviewSite={() => {
          setIsPreviewMode(true);
          setCurrentView('website');
          window.location.hash = '';
        }}
      />
    );
  }

  // Render Admin Login View
  if (currentView === 'login') {
    return (
      <AdminLogin
        onSuccess={() => {
          setCurrentView('admin');
          window.location.hash = '#admin';
        }}
        onBackToSite={navigateToWebsite}
      />
    );
  }

  // Render Public Website View
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Live Preview Mode Sticky Bar */}
      {isPreviewMode && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-4 py-2.5 shadow-xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse" />
            <Eye className="w-4 h-4 text-slate-950" />
            <span>Live Website Preview Mode Active · Real-time Firestore Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentView('admin');
                window.location.hash = '#admin';
              }}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Back to Admin Panel</span>
            </button>
            <button
              onClick={() => setIsPreviewMode(false)}
              className="p-1 hover:bg-amber-600/50 rounded text-slate-950 transition-colors cursor-pointer"
              title="Close Preview Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sticky Header with Dynamic CMS Navigation & Dispatcher Link */}
      <Header
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenQuoteModal={handleOpenQuoteModal}
          onSelectService={handleSelectServiceFromHero}
        />

        {/* 2. Our HVAC Services (Dynamic from Firestore) */}
        <ServicesSection
          onSelectServiceModal={(service) => setSelectedServiceForModal(service)}
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* 3. Why Choose Iwebpro */}
        <WhyChooseUs
          onOpenQuoteModal={() => handleOpenQuoteModal()}
        />

        {/* 4. How It Works */}
        <HowItWorks
          onOpenQuoteModal={() => handleOpenQuoteModal()}
        />

        {/* 5. Service Areas (Dynamic from Firestore) */}
        <ServiceAreas
          onOpenQuoteModal={handleOpenCoverageQuote}
        />

        {/* 6. Testimonials (Dynamic from Firestore) */}
        <TestimonialsSection
          onOpenQuoteModal={() => handleOpenQuoteModal()}
        />

        {/* 7. FAQ Section (Dynamic from Firestore) */}
        <FaqSection
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* 8. Contact Section (Direct Firebase Lead Submission) */}
        <ContactSection
          initialService={initialContactService}
          onOpenDashboard={() => setLeadDashboardOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenDashboard={() => setLeadDashboardOpen(true)}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        onOpenQuoteModal={() => handleOpenQuoteModal()}
      />

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        onBookService={handleBookServiceFromModal}
      />

      {/* Instant Free Quote Modal (Submits directly to Cloud Firestore) */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedService={preselectedServiceForQuote}
      />

      {/* Lead Tracking & Real-Time Scheduling Modal */}
      <LeadDashboardModal
        isOpen={leadDashboardOpen}
        onClose={() => setLeadDashboardOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CmsProvider>
        <AppContent />
      </CmsProvider>
    </AuthProvider>
  );
}
