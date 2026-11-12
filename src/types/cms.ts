export type PropertyType = 'residential' | 'commercial';
export type UrgencyLevel = 'standard' | 'priority' | 'emergency_24_7';

export interface SiteSettings {
  companyName: string;
  phoneDisplay: string;
  phoneTel: string;
  phoneLink: string;
  emailDisplay: string;
  emailLink: string;
  address: string;
  businessHours: string;
  emergencyNotice: string;
  serviceAreaNotice?: string;
  // Theme & Design
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: string; // 'rounded-lg' | 'rounded-xl' | 'rounded-2xl'
  fontFamily: string;
  // SEO
  seoTitle: string;
  seoDescription: string;
  metaKeywords: string;
  ogImage: string;
  canonicalUrl: string;
  robotsIndexing: boolean;
  updatedAt: string;
}

export interface TrustIndicator {
  id: string;
  title: string;
  description?: string;
  iconName: string;
  order: number;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export interface HowItWorksItem {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  actionLabel: string;
  order: number;
}

export interface HomepageConfig {
  // Hero
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  heroBgImage: string;
  heroBgVideoUrl?: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaUrl: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaUrl: string;
  heroTextAlignment: 'left' | 'center';
  heroOverlayOpacity: number; // 0 to 100
  // Trust Indicators
  trustIndicators: TrustIndicator[];
  // Services Section
  servicesHeading: string;
  servicesSubtitle: string;
  servicesDescription: string;
  servicesDisplayStyle: 'grid' | 'bento' | 'carousel';
  servicesDisplayCount: number;
  showServicesSection: boolean;
  // Why Choose Us
  whyUsHeading: string;
  whyUsSubtitle: string;
  whyUsDescription: string;
  whyUsFeatures: WhyChooseItem[];
  showWhyUsSection: boolean;
  // How It Works
  howItWorksHeading: string;
  howItWorksSubtitle: string;
  howItWorksDescription: string;
  howItWorksSteps: HowItWorksItem[];
  showHowItWorksSection: boolean;
  // Contact CTA
  contactCtaHeading: string;
  contactCtaDescription: string;
  contactCtaPhone: string;
  contactCtaButtonText: string;
  contactCtaBgImage?: string;
  updatedAt: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  isHomepage?: boolean;
  sections: Array<{
    id: string;
    type: 'hero' | 'text' | 'features' | 'cta' | 'image';
    title?: string;
    content?: string;
    imageUrl?: string;
  }>;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CmsService {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: 'cooling' | 'heating' | 'maintenance' | 'ductwork' | 'commercial';
  highlights: string[];
  commonSigns: string[];
  imageSrc: string;
  galleryImages?: string[];
  iconName: string;
  seoTitle?: string;
  seoDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  order: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface CmsAboutUs {
  pageHeading: string;
  companyIntro: string;
  companyDescription: string;
  missionStatement: string;
  visionStatement: string;
  companyValues: Array<{ title: string; description: string; icon: string }>;
  aboutImage: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  updatedAt: string;
}

export interface CmsServiceArea {
  id: string;
  regionName: string;
  countyOrZone: string;
  coveredCities: string[];
  responseStandard: string;
  description?: string;
  locationImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface CmsTestimonial {
  id: string;
  customerName: string;
  clientType: string;
  serviceReceived: string;
  reviewText: string;
  rating: number; // 1 to 5
  customerPhoto?: string;
  displayInitials: string;
  isFeatured: boolean;
  isPublished: boolean;
  date: string;
}

export interface CmsFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isExternal?: boolean;
}

export interface NavigationConfig {
  logoText: string;
  logoImageUrl?: string;
  headerLinks: NavLinkItem[];
  callButtonText: string;
  callButtonPhone: string;
  isSticky: boolean;
  footerDescription: string;
  footerLinks: NavLinkItem[];
  copyrightText: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  dimensions?: string;
  folder?: string;
  uploadedAt: string;
}

export interface ContactSubmission {
  id: string;
  referenceNo: string;
  customerName: string;
  phone: string;
  email: string;
  serviceRequired: string;
  propertyType: 'residential' | 'commercial';
  urgency: 'standard' | 'priority' | 'emergency_24_7';
  preferredDate?: string;
  preferredTime?: string;
  serviceCity?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt: string;
  assignedTechnician?: string;
  technicianNotes?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'editor' | 'viewer';
  displayName?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entity: string;
  details: string;
  timestamp: string;
}
