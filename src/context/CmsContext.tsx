import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SiteSettings,
  HomepageConfig,
  CmsService,
  CmsAboutUs,
  CmsServiceArea,
  CmsTestimonial,
  CmsFaq,
  NavigationConfig,
  CmsPage,
  MediaItem,
  ContactSubmission,
  ActivityLog,
} from '../types/cms';
import {
  cmsService,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_HOMEPAGE_CONFIG,
  DEFAULT_SERVICES,
  DEFAULT_ABOUT_US,
  DEFAULT_SERVICE_AREAS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_NAVIGATION,
} from '../firebase/cmsService';
import { useAuth } from '../firebase/authContext';

interface CmsContextType {
  siteSettings: SiteSettings;
  homepageConfig: HomepageConfig;
  services: CmsService[];
  aboutUs: CmsAboutUs;
  serviceAreas: CmsServiceArea[];
  testimonials: CmsTestimonial[];
  faqs: CmsFaq[];
  navigation: NavigationConfig;
  pages: CmsPage[];
  media: MediaItem[];
  submissions: ContactSubmission[];
  activityLogs: ActivityLog[];
  loading: boolean;
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  // Actions
  updateSiteSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updateHomepageConfig: (data: Partial<HomepageConfig>) => Promise<void>;
  saveService: (service: CmsService) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateAboutUs: (data: Partial<CmsAboutUs>) => Promise<void>;
  saveServiceArea: (area: CmsServiceArea) => Promise<void>;
  deleteServiceArea: (id: string) => Promise<void>;
  saveTestimonial: (testimonial: CmsTestimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveFaq: (faq: CmsFaq) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  updateNavigation: (data: Partial<NavigationConfig>) => Promise<void>;
  savePage: (page: CmsPage) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  addMediaItem: (item: MediaItem) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;
  submitContactLead: (lead: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'referenceNo'> & { referenceNo?: string }) => Promise<ContactSubmission>;
  updateSubmissionStatus: (id: string, status: ContactSubmission['status'], notes?: string, tech?: string) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  logActivity: (action: ActivityLog['action'], entity: string, details: string) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [services, setServices] = useState<CmsService[]>(DEFAULT_SERVICES);
  const [aboutUs, setAboutUs] = useState<CmsAboutUs>(DEFAULT_ABOUT_US);
  const [serviceAreas, setServiceAreas] = useState<CmsServiceArea[]>(DEFAULT_SERVICE_AREAS);
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>(DEFAULT_TESTIMONIALS);
  const [faqs, setFaqs] = useState<CmsFaq[]>(DEFAULT_FAQS);
  const [navigation, setNavigation] = useState<NavigationConfig>(DEFAULT_NAVIGATION);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Initialize and attach Firestore listeners
  useEffect(() => {
    // Seed initial records if empty
    cmsService.seedInitialDataIfEmpty().catch(() => {});

    // Realtime listeners
    const unsubSettings = cmsService.subscribeSiteSettings((s) => setSiteSettings(s));
    const unsubHome = cmsService.subscribeHomepageConfig((h) => setHomepageConfig(h));
    const unsubServices = cmsService.subscribeServices((srv) => setServices(srv));
    const unsubAreas = cmsService.subscribeServiceAreas((a) => setServiceAreas(a));
    const unsubTestimonials = cmsService.subscribeTestimonials((t) => setTestimonials(t));
    const unsubFaqs = cmsService.subscribeFaqs((f) => setFaqs(f));
    const unsubNav = cmsService.subscribeNavigation((n) => setNavigation(n));
    const unsubPages = cmsService.subscribePages((p) => setPages(p));
    const unsubSubs = cmsService.subscribeSubmissions((s) => setSubmissions(s));

    // Initial fetch for aboutUs, media, logs
    const fetchRest = async () => {
      try {
        const [about, med, logs] = await Promise.all([
          cmsService.getAboutUs(),
          cmsService.getMedia(),
          cmsService.getActivityLogs(),
        ]);
        setAboutUs(about);
        setMedia(med);
        setActivityLogs(logs);
      } catch (err) {
        console.warn('Initial CMS load notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRest();

    return () => {
      unsubSettings();
      unsubHome();
      unsubServices();
      unsubAreas();
      unsubTestimonials();
      unsubFaqs();
      unsubNav();
      unsubPages();
      unsubSubs();
    };
  }, []);

  // Synchronize CSS custom variables with site settings (e.g. brand color, font, border radius)
  useEffect(() => {
    if (siteSettings.primaryColor) {
      document.documentElement.style.setProperty('--primary-brand-color', siteSettings.primaryColor);
    }
    if (siteSettings.accentColor) {
      document.documentElement.style.setProperty('--accent-brand-color', siteSettings.accentColor);
    }
  }, [siteSettings.primaryColor, siteSettings.accentColor]);

  const logActivity = async (action: ActivityLog['action'], entity: string, details: string) => {
    const adminEmail = user?.email || 'admin@iwebpro.local';
    await cmsService.logActivity({
      adminEmail,
      action,
      entity,
      details,
    });
    const updated = await cmsService.getActivityLogs();
    setActivityLogs(updated);
  };

  const updateSiteSettings = async (data: Partial<SiteSettings>) => {
    await cmsService.updateSiteSettings(data);
    await logActivity('update', 'Site Settings', 'Updated company info, SEO or theme settings');
  };

  const updateHomepageConfig = async (data: Partial<HomepageConfig>) => {
    await cmsService.updateHomepageConfig(data);
    await logActivity('update', 'Homepage', 'Updated homepage hero or section copy');
  };

  const saveService = async (service: CmsService) => {
    await cmsService.saveService(service);
    await logActivity(service.isPublished ? 'publish' : 'update', 'Service', `Saved service: ${service.name}`);
  };

  const deleteService = async (id: string) => {
    await cmsService.deleteService(id);
    await logActivity('delete', 'Service', `Deleted service ID: ${id}`);
  };

  const updateAboutUs = async (data: Partial<CmsAboutUs>) => {
    await cmsService.updateAboutUs(data);
    setAboutUs((prev) => ({ ...prev, ...data }));
    await logActivity('update', 'About Us', 'Updated company story or mission');
  };

  const saveServiceArea = async (area: CmsServiceArea) => {
    await cmsService.saveServiceArea(area);
    await logActivity('update', 'Service Area', `Updated region: ${area.regionName}`);
  };

  const deleteServiceArea = async (id: string) => {
    await cmsService.deleteServiceArea(id);
    await logActivity('delete', 'Service Area', `Deleted service area: ${id}`);
  };

  const saveTestimonial = async (t: CmsTestimonial) => {
    await cmsService.saveTestimonial(t);
    await logActivity('update', 'Testimonial', `Saved review from ${t.customerName}`);
  };

  const deleteTestimonial = async (id: string) => {
    await cmsService.deleteTestimonial(id);
    await logActivity('delete', 'Testimonial', `Deleted testimonial: ${id}`);
  };

  const saveFaq = async (faq: CmsFaq) => {
    await cmsService.saveFaq(faq);
    await logActivity('update', 'FAQ', `Saved FAQ: ${faq.question}`);
  };

  const deleteFaq = async (id: string) => {
    await cmsService.deleteFaq(id);
    await logActivity('delete', 'FAQ', `Deleted FAQ: ${id}`);
  };

  const updateNavigation = async (data: Partial<NavigationConfig>) => {
    await cmsService.updateNavigation(data);
    await logActivity('update', 'Navigation', 'Updated header or footer links');
  };

  const savePage = async (page: CmsPage) => {
    await cmsService.savePage(page);
    await logActivity(page.isPublished ? 'publish' : 'update', 'Page', `Saved page: ${page.title}`);
  };

  const deletePage = async (id: string) => {
    await cmsService.deletePage(id);
    await logActivity('delete', 'Page', `Deleted page: ${id}`);
  };

  const addMediaItem = async (item: MediaItem) => {
    await cmsService.saveMedia(item);
    setMedia((prev) => [item, ...prev]);
    await logActivity('create', 'Media', `Uploaded file: ${item.fileName}`);
  };

  const deleteMediaItem = async (id: string) => {
    await cmsService.deleteMedia(id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
    await logActivity('delete', 'Media', `Deleted file: ${id}`);
  };

  const submitContactLead = async (lead: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'referenceNo'> & { referenceNo?: string }) => {
    const created = await cmsService.submitLead(lead);
    return created;
  };

  const updateSubmissionStatus = async (
    id: string,
    status: ContactSubmission['status'],
    notes?: string,
    tech?: string
  ) => {
    const patch: Partial<ContactSubmission> = { status };
    if (notes !== undefined) patch.technicianNotes = notes;
    if (tech !== undefined) patch.assignedTechnician = tech;
    await cmsService.updateSubmission(id, patch);
    await logActivity('update', 'Lead Submission', `Updated lead ${id} to ${status}`);
  };

  const deleteSubmission = async (id: string) => {
    await cmsService.deleteSubmission(id);
    await logActivity('delete', 'Lead Submission', `Deleted submission: ${id}`);
  };

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [s, h, srv, a, t, f, n, p, m, sub, l] = await Promise.all([
        cmsService.getSiteSettings(),
        cmsService.getHomepageConfig(),
        cmsService.getServices(),
        cmsService.getServiceAreas(),
        cmsService.getTestimonials(),
        cmsService.getFaqs(),
        cmsService.getNavigation(),
        cmsService.getPages(),
        cmsService.getMedia(),
        cmsService.getSubmissions(),
        cmsService.getActivityLogs(),
      ]);
      setSiteSettings(s);
      setHomepageConfig(h);
      setServices(srv);
      setServiceAreas(a);
      setTestimonials(t);
      setFaqs(f);
      setNavigation(n);
      setPages(p);
      setMedia(m);
      setSubmissions(sub);
      setActivityLogs(l);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CmsContext.Provider
      value={{
        siteSettings,
        homepageConfig,
        services,
        aboutUs,
        serviceAreas,
        testimonials,
        faqs,
        navigation,
        pages,
        media,
        submissions,
        activityLogs,
        loading,
        isPreviewMode,
        setIsPreviewMode,
        updateSiteSettings,
        updateHomepageConfig,
        saveService,
        deleteService,
        updateAboutUs,
        saveServiceArea,
        deleteServiceArea,
        saveTestimonial,
        deleteTestimonial,
        saveFaq,
        deleteFaq,
        updateNavigation,
        savePage,
        deletePage,
        addMediaItem,
        deleteMediaItem,
        submitContactLead,
        updateSubmissionStatus,
        deleteSubmission,
        logActivity,
        refreshAllData,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
