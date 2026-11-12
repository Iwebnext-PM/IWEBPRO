import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import {
  SiteSettings,
  HomepageConfig,
  CmsPage,
  CmsService,
  CmsAboutUs,
  CmsServiceArea,
  CmsTestimonial,
  CmsFaq,
  NavigationConfig,
  MediaItem,
  ContactSubmission,
  AdminUser,
  ActivityLog,
} from '../types/cms';

// Baseline fallback defaults for robust offline/initial bootstrap
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'Iwebpro',
  phoneDisplay: '(888) 445-5423',
  phoneTel: '+18884455423',
  phoneLink: 'tel:+18884455423',
  emailDisplay: 'iwebnext.com@gmail.com',
  emailLink: 'mailto:iwebnext.com@gmail.com',
  address: 'Regional Metro Service Territory, USA',
  businessHours: 'Monday – Sunday: 7:00 AM – 8:00 PM',
  emergencyNotice: 'Emergency HVAC breakdown services available upon inquiry',
  primaryColor: '#ea580c', // Bright orange
  secondaryColor: '#0b1727', // Dark navy
  accentColor: '#0284c7', // Steel blue
  borderRadius: 'rounded-xl',
  fontFamily: 'Plus Jakarta Sans',
  seoTitle: 'Iwebpro – Reliable HVAC Installation & Repair Services',
  seoDescription: 'Keep your home or business comfortable year-round with professional heating, ventilation, and air conditioning solutions from Iwebpro. Call (888) 445-5423.',
  metaKeywords: 'HVAC installation, AC repair, furnace repair, heating maintenance, commercial HVAC',
  ogImage: '/src/assets/images/hero_hvac_technician_1794427369059.jpg',
  canonicalUrl: '',
  robotsIndexing: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  heroHeading: 'Reliable HVAC Installation & Repair Services You Can Trust',
  heroSubheading: 'Professional heating, ventilation, and air conditioning solutions for homes and commercial facilities.',
  heroDescription: 'Keep your home or business comfortable year-round with professional heating, ventilation, and air conditioning solutions from Iwebpro.',
  heroBgImage: '/src/assets/images/hero_hvac_technician_1794427369059.jpg',
  heroPrimaryCtaText: 'Call Now: (888) 445-5423',
  heroPrimaryCtaUrl: 'tel:+18884455423',
  heroSecondaryCtaText: 'Request a Free Quote',
  heroSecondaryCtaUrl: '#contact',
  heroTextAlignment: 'left',
  heroOverlayOpacity: 85,
  trustIndicators: [
    { id: 't-1', title: 'Professional HVAC Solutions', iconName: 'ShieldCheck', order: 1 },
    { id: 't-2', title: 'Residential & Commercial Services', iconName: 'Building2', order: 2 },
    { id: 't-3', title: 'Reliable Installation & Repair', iconName: 'CheckCircle', order: 3 },
    { id: 't-4', title: 'Customer-Focused Service', iconName: 'Clock', order: 4 },
  ],
  servicesHeading: 'Our HVAC Services',
  servicesSubtitle: 'Comprehensive Climate Solutions · Residential & Commercial',
  servicesDescription: 'From emergency air conditioning and furnace troubleshooting to high-efficiency installations and commercial rooftop ventilation, Iwebpro delivers dependable year-round climate control.',
  servicesDisplayStyle: 'bento',
  servicesDisplayCount: 8,
  showServicesSection: true,
  whyUsHeading: 'Why Choose Iwebpro?',
  whyUsSubtitle: 'Our Service Commitment · Integrity & Standards',
  whyUsDescription: 'When you contact Iwebpro, you receive reliable technical expertise, honest assessments, and customer-focused climate care tailored to your exact property requirements.',
  whyUsFeatures: [
    { id: 'w-1', title: 'Comprehensive HVAC Solutions', description: 'From seasonal tune-ups and diagnostic repairs to replacements and new installations, we handle the full spectrum.', iconName: 'Layers', order: 1 },
    { id: 'w-2', title: 'Residential & Commercial Expertise', description: 'Equipped to service single-family homes, multi-story residences, retail storefronts, and commercial facilities.', iconName: 'Building', order: 2 },
    { id: 'w-3', title: 'Professional Service Approach', description: 'Our technicians arrive with diagnostic equipment, clearly explain technical findings, and ensure tidy work environments.', iconName: 'ShieldCheck', order: 3 },
    { id: 'w-4', title: 'Dependable Customer Support', description: 'Transparent communication from initial inquiry through project completion with prompt scheduling updates.', iconName: 'Headphones', order: 4 },
    { id: 'w-5', title: 'Convenient Service Requests', description: 'Reach our team directly by phone at (888) 445-5423 or submit an online quote request anytime.', iconName: 'Clock', order: 5 },
    { id: 'w-6', title: 'Focus on Comfort and Efficiency', description: 'Every recommendation is designed to optimize indoor air quality and maximize energy efficiency.', iconName: 'Zap', order: 6 },
  ],
  showWhyUsSection: true,
  howItWorksHeading: 'How It Works',
  howItWorksSubtitle: 'Simple 3-Step Coordination · Fast & Transparent',
  howItWorksDescription: 'Getting your HVAC system inspected, repaired, or replaced is straightforward. Follow these three steps to restore optimal heating and cooling.',
  howItWorksSteps: [
    { id: 's-1', stepNumber: '01', title: 'Contact Us', subtitle: 'Call or submit a service request', description: 'Reach out via phone at (888) 445-5423 or submit our free online quote form with your HVAC needs and timing.', actionLabel: 'Call (888) 445-5423', order: 1 },
    { id: 's-2', stepNumber: '02', title: 'Discuss Your Needs', subtitle: 'Explain your HVAC problem or installation requirements', description: 'We review your equipment type, symptoms, or project scope and coordinate a convenient dispatch window.', actionLabel: 'Describe Equipment', order: 2 },
    { id: 's-3', stepNumber: '03', title: 'Get Your HVAC Solution', subtitle: 'Our team will coordinate the next steps', description: 'Our qualified technician arrives on site, performs thorough diagnostics or installation prep, and executes service.', actionLabel: 'Enjoy Reliable Comfort', order: 3 },
  ],
  showHowItWorksSection: true,
  contactCtaHeading: 'Contact Iwebpro',
  contactCtaDescription: 'Need emergency repair, an installation estimate, or routine maintenance? Call our dispatch team directly or submit our service booking form below.',
  contactCtaPhone: '(888) 445-5423',
  contactCtaButtonText: 'Request a Free Quote',
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SERVICES: CmsService[] = [
  {
    id: 'ac-installation',
    name: 'Air Conditioning Installation',
    slug: 'ac-installation',
    tagline: 'Precision Cooling Systems Sized for Optimal Comfort',
    shortDescription: 'Professional AC installation for residential and commercial properties. Help customers choose suitable cooling systems.',
    fullDescription: 'Our certified cooling specialists evaluate your square footage, insulation, and airflow requirements to recommend and install the right air conditioning unit for your home or business.',
    category: 'cooling',
    highlights: ['Tailored cooling load calculation', 'High-efficiency central AC and ductless split systems', 'Complete electrical and drain line setup', 'Airflow balancing'],
    commonSigns: ['Unit is over 10–15 years old', 'Frequent costly breakdowns', 'Inconsistent temperatures or high electric bills'],
    imageSrc: '/src/assets/images/ac_cooling_interior_1794427371083.jpg',
    iconName: 'Snowflake',
    order: 1,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ac-repair',
    name: 'Air Conditioning Repair',
    slug: 'ac-repair',
    tagline: 'Rapid Diagnostics & Resolution for System Malfunctions',
    shortDescription: 'Troubleshooting and repair for AC systems. Address cooling problems, unusual noises, and system malfunctions.',
    fullDescription: 'When your air conditioner fails during high temperatures, our technicians arrive equipped to diagnose electrical faults, sensor glitches, compressor issues, or refrigerant leaks.',
    category: 'cooling',
    highlights: ['Diagnostic testing for compressors and capacitors', 'Refrigerant leak detection', 'Thermostat recalibration', 'Clearing condensate drains'],
    commonSigns: ['Blowing warm air from vents', 'Grinding, clicking, or squealing sounds', 'Water pooling around unit'],
    imageSrc: '/src/assets/images/hero_hvac_technician_1794427369059.jpg',
    iconName: 'Wrench',
    order: 2,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'heating-installation',
    name: 'Heating System Installation',
    slug: 'heating-installation',
    tagline: 'Dependable Heat Pumps & Heating Systems Built for Cold Seasons',
    shortDescription: 'Heating system installation for comfortable indoor environments.',
    fullDescription: 'Keep your property warm throughout cold months with modern heating solutions. We install high-efficiency heat pumps, packaged units, and dual-fuel configurations.',
    category: 'heating',
    highlights: ['Heat-loss property assessment', 'High-efficiency heat pump systems', 'Seamless ductwork integration', 'Smart thermostat setup'],
    commonSigns: ['Heating system struggles to maintain set temperature', 'Rising winter energy costs', 'Cold spots in rooms'],
    imageSrc: '/src/assets/images/furnace_installation_1794427370552.jpg',
    iconName: 'Flame',
    order: 3,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'heating-repair',
    name: 'Heating System Repair',
    slug: 'heating-repair',
    tagline: 'Accurate Heating System Diagnostics & Restoration',
    shortDescription: 'Diagnose and resolve common heating system issues.',
    fullDescription: 'From malfunctioning blowers and faulty igniters to defective thermostats, our technicians pinpoint the root cause of heating failures and perform reliable repairs.',
    category: 'heating',
    highlights: ['Blower motor and burner diagnostics', 'Defrost cycle and valve troubleshooting', 'Safety limit switch testing', 'Airflow safety inspections'],
    commonSigns: ['System blows cold air while on heat', 'Furnace runs continuously', 'Strange burning odors'],
    imageSrc: '/src/assets/images/furnace_installation_1794427370552.jpg',
    iconName: 'ShieldAlert',
    order: 4,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hvac-maintenance',
    name: 'HVAC Maintenance',
    slug: 'hvac-maintenance',
    tagline: 'Preventive Care to Maximize Longevity & Energy Efficiency',
    shortDescription: 'Preventive maintenance to help improve system performance and reliability.',
    fullDescription: 'Regular scheduled inspections identify minor wear before it causes equipment failure. Multi-point HVAC maintenance includes coil cleaning, refrigerant checks, and electrical tightening.',
    category: 'maintenance',
    highlights: ['Multi-point heating and cooling inspection', 'Evaporator and condenser coil cleaning', 'Capacitor and connection checks', 'Air filter inspection'],
    commonSigns: ['Over 12 months since last tune-up', 'Gradual decline in cooling power', 'Slight rise in utility bills'],
    imageSrc: '/src/assets/images/hero_hvac_technician_1794427369059.jpg',
    iconName: 'CheckCircle2',
    order: 5,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'furnace-service',
    name: 'Furnace Installation & Repair',
    slug: 'furnace-service',
    tagline: 'Gas & Electric Furnace Solutions for Safe, Consistent Warmth',
    shortDescription: 'Professional furnace installation, inspection, and repair services.',
    fullDescription: 'Furnaces require meticulous safety compliance. We handle high-efficiency gas furnaces and electric models, inspecting heat exchangers, flue drafting, and ignition systems.',
    category: 'heating',
    highlights: ['AFUE-rated gas and electric replacements', 'Cracked heat exchanger safety testing', 'Flame sensor cleaning', 'Ventilation draft checks'],
    commonSigns: ['Yellow burner flame instead of steady blue', 'Frequent short-cycling', 'Rattling or banging noises on start'],
    imageSrc: '/src/assets/images/furnace_installation_1794427370552.jpg',
    iconName: 'Thermometer',
    order: 6,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ductwork-service',
    name: 'Ductwork Installation & Repair',
    slug: 'ductwork-service',
    tagline: 'Sealed, Balanced Air Ducts Delivering Clean Airflow',
    shortDescription: 'Air duct installation, inspection, and repair solutions.',
    fullDescription: 'Leaky or poorly sized ducts can waste up to 30% of conditioned air. We assess static pressure, seal hidden leaks, and balance delivery dampers so every room stays comfortable.',
    category: 'ductwork',
    highlights: ['Duct inspection and airflow restriction diagnosis', 'Mastic sealing and insulation', 'Damaged duct replacement', 'Custom sheet metal transitions'],
    commonSigns: ['Rooms are noticeably warmer or colder', 'Excessive dust despite filter changes', 'Whistling air sounds in walls'],
    imageSrc: '/src/assets/images/ac_cooling_interior_1794427371083.jpg',
    iconName: 'Wind',
    order: 7,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'commercial-hvac',
    name: 'Commercial HVAC Services',
    slug: 'commercial-hvac',
    tagline: 'Engineered Climate Control for Facilities, Retail & Offices',
    shortDescription: 'HVAC installation, repair, and maintenance solutions for commercial properties.',
    fullDescription: 'Commercial spaces demand heavy-duty, dependable climate systems. We service rooftop package units (RTUs), split systems, VRF units, and make-up air systems.',
    category: 'commercial',
    highlights: ['Rooftop unit (RTU) installation and crane lifts', 'Planned preventative maintenance agreements', 'Emergency response for critical cooling', 'Ventilation code compliance'],
    commonSigns: ['Rooftop unit vibration or compressor noise', 'Tenant complaints of stuffy spaces', 'High commercial utility bills'],
    imageSrc: '/src/assets/images/commercial_rooftop_hvac_1794427369351.jpg',
    iconName: 'Building2',
    order: 8,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_ABOUT_US: CmsAboutUs = {
  pageHeading: 'About Iwebpro HVAC Services',
  companyIntro: 'Dedicated to delivering reliable heating, ventilation, and air conditioning craftsmanship across residential communities and commercial commercial properties.',
  companyDescription: 'Iwebpro was founded with a singular commitment: provide honest, transparent, and technically sound HVAC services without confusing jargon or high-pressure sales. From simple seasonal tune-ups to major commercial rooftop overhauls, our technicians bring precision diagnostic gear and respect to every job site.',
  missionStatement: 'To ensure every homeowner and facility manager enjoys consistent indoor comfort, safe breathing air, and optimal energy efficiency through dependable HVAC installation, repair, and proactive maintenance.',
  visionStatement: 'To be the most trusted, responsive, and technologically capable climate care partner in the regions we serve.',
  companyValues: [
    { title: 'Technical Integrity', description: 'We accurately diagnose root problems and explain all repair options before performing work.', icon: 'ShieldCheck' },
    { title: 'Transparent Communication', description: 'Clear pricing, punctual arrival windows, and respectful treatment of client property.', icon: 'Headphones' },
    { title: 'Long-term Reliability', description: 'Every repair and installation is executed to manufacturer standards for maximum equipment lifespan.', icon: 'CheckCircle' },
  ],
  aboutImage: '/src/assets/images/hero_hvac_technician_1794427369059.jpg',
  primaryCtaText: 'Contact Our Dispatch Team',
  primaryCtaUrl: '#contact',
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SERVICE_AREAS: CmsServiceArea[] = [
  {
    id: 'area-1',
    regionName: 'Central Metro & Downtown Corridor',
    countyOrZone: 'Zone A - Primary Urban District',
    coveredCities: ['Metro Central', 'Northside District', 'West End', 'Bayside Heights', 'River Valley'],
    responseStandard: 'Same-Day / Next-Day Dispatch Available',
    description: 'Primary urban territory with high-density technician coverage.',
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'area-2',
    regionName: 'Northern Suburbs & Tech Park',
    countyOrZone: 'Zone B - North Region',
    coveredCities: ['Highland Park', 'Oakridge', 'Pine Valley', 'Sunnyvale Heights', 'Clear Creek'],
    responseStandard: 'Standard Daily Routes',
    description: 'Residential suburban neighborhoods and office parks.',
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'area-3',
    regionName: 'Southern & Eastern Commercial Zone',
    countyOrZone: 'Zone C - South & East Industrial Corridor',
    coveredCities: ['Southgate', 'Industrial Parkway', 'Lakeside Hills', 'Eastview Plaza', 'Valley Junction'],
    responseStandard: 'Commercial & Residential Dispatch',
    description: 'Commercial facilities, distribution hubs, and single-family homes.',
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_TESTIMONIALS: CmsTestimonial[] = [
  {
    id: 'test-1',
    customerName: 'Robert H.',
    clientType: 'Residential Homeowner',
    serviceReceived: 'Air Conditioning Installation',
    reviewText: '[Verified Customer Feedback Placeholder] – The Iwebpro technician arrived on time, conducted a thorough assessment of our cooling load, and completed the installation cleanly with clear instruction on our new thermostat.',
    rating: 5,
    displayInitials: 'R.H.',
    isFeatured: true,
    isPublished: true,
    date: '2026-10-15',
  },
  {
    id: 'test-2',
    customerName: 'Claire P.',
    clientType: 'Commercial Property Manager',
    serviceReceived: 'Commercial HVAC Maintenance & Repair',
    reviewText: '[Verified Customer Feedback Placeholder] – Prompt response to our rooftop package unit inquiry. Diagnostics were transparent with itemized repair options that prevented downtime in our office suite.',
    rating: 5,
    displayInitials: 'C.P.',
    isFeatured: true,
    isPublished: true,
    date: '2026-10-28',
  },
  {
    id: 'test-3',
    customerName: 'Mark K.',
    clientType: 'Residential Customer',
    serviceReceived: 'Furnace Inspection & Repair',
    reviewText: '[Verified Customer Feedback Placeholder] – Heating system was restored before freezing temperatures hit. Professional communication over the phone and respectful in-home service throughout.',
    rating: 5,
    displayInitials: 'M.K.',
    isFeatured: true,
    isPublished: true,
    date: '2026-11-04',
  },
];

export const DEFAULT_FAQS: CmsFaq[] = [
  {
    id: 'faq-1',
    question: 'How do I know if my AC needs repair?',
    answer: 'Common indicators include blowing warm air, unusual screeching or buzzing sounds, weak airflow, water leaks around the unit, frequent short-cycling, and unexpected surges in electricity bills.',
    category: 'Air Conditioning',
    order: 1,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    question: 'How often should HVAC systems be maintained?',
    answer: 'We recommend professional maintenance at least twice a year: cooling system inspection in spring and heating tune-up in fall. Regular service prevents mid-season breakdowns and preserves energy efficiency.',
    category: 'Maintenance',
    order: 2,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-3',
    question: 'Do you provide HVAC installation services?',
    answer: 'Yes. Iwebpro provides complete heating, air conditioning, and heat pump installation services for both residential homes and commercial buildings.',
    category: 'Installation',
    order: 3,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-4',
    question: 'Do you handle commercial HVAC systems?',
    answer: 'Yes, we service commercial offices, retail buildings, and industrial facilities with rooftop package units (RTUs), commercial split systems, and large-duct air handlers.',
    category: 'Commercial',
    order: 4,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-5',
    question: 'When should I replace my air conditioning system?',
    answer: 'Consider replacement if the unit is over 10 to 15 years old, requires frequent costly repairs, still runs on phased-out R-22 refrigerant, or fails to maintain comfortable temperatures.',
    category: 'Replacement',
    order: 5,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'faq-6',
    question: 'How can I request an HVAC service appointment?',
    answer: 'Call Iwebpro directly at (888) 445-5423, email iwebnext.com@gmail.com, or submit the service booking form on our website.',
    category: 'Booking',
    order: 6,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_NAVIGATION: NavigationConfig = {
  logoText: 'Iwebpro',
  headerLinks: [
    { id: 'nl-1', label: 'Services', url: '#services', order: 1 },
    { id: 'nl-2', label: 'Why Iwebpro', url: '#why-us', order: 2 },
    { id: 'nl-3', label: 'How It Works', url: '#how-it-works', order: 3 },
    { id: 'nl-4', label: 'Service Areas', url: '#service-areas', order: 4 },
    { id: 'nl-5', label: 'FAQs', url: '#faqs', order: 5 },
    { id: 'nl-6', label: 'Contact', url: '#contact', order: 6 },
  ],
  callButtonText: 'Call: (888) 445-5423',
  callButtonPhone: '+18884455423',
  isSticky: true,
  footerDescription: 'Professional heating, ventilation, and air conditioning installation, repair, and maintenance for residential and commercial spaces. Reliable climate solutions you can trust year-round.',
  footerLinks: [
    { id: 'fl-1', label: 'Air Conditioning Installation', url: '#services', order: 1 },
    { id: 'fl-2', label: 'AC Repair Services', url: '#services', order: 2 },
    { id: 'fl-3', label: 'Furnace & Heating Systems', url: '#services', order: 3 },
    { id: 'fl-4', label: 'Commercial HVAC Solutions', url: '#services', order: 4 },
    { id: 'fl-5', label: 'Service Territory Matrix', url: '#service-areas', order: 5 },
  ],
  copyrightText: '© 2026 Iwebpro. All rights reserved. Professional heating, ventilation, and air conditioning services.',
  socialLinks: {},
  updatedAt: new Date().toISOString(),
};

// ----------------- Real-time Firestore Service ----------------- //

export const cmsService = {
  // 1. Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const snap = await getDoc(doc(db, 'siteSettings', 'global'));
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      }
      return DEFAULT_SITE_SETTINGS;
    } catch (e) {
      console.warn('Using default site settings:', e);
      return DEFAULT_SITE_SETTINGS;
    }
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    try {
      await setDoc(doc(db, 'siteSettings', 'global'), {
        ...DEFAULT_SITE_SETTINGS,
        ...settings,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'siteSettings/global');
    }
  },

  subscribeSiteSettings(cb: (settings: SiteSettings) => void) {
    return onSnapshot(
      doc(db, 'siteSettings', 'global'),
      (snap) => {
        if (snap.exists()) {
          cb(snap.data() as SiteSettings);
        } else {
          cb(DEFAULT_SITE_SETTINGS);
        }
      },
      (err) => {
        console.warn('SiteSettings snapshot listener notice:', err.message);
      }
    );
  },

  // 2. Homepage Configuration
  async getHomepageConfig(): Promise<HomepageConfig> {
    try {
      const snap = await getDoc(doc(db, 'homepageSections', 'homepage'));
      if (snap.exists()) {
        return snap.data() as HomepageConfig;
      }
      return DEFAULT_HOMEPAGE_CONFIG;
    } catch (e) {
      return DEFAULT_HOMEPAGE_CONFIG;
    }
  },

  async updateHomepageConfig(config: Partial<HomepageConfig>): Promise<void> {
    try {
      await setDoc(doc(db, 'homepageSections', 'homepage'), {
        ...DEFAULT_HOMEPAGE_CONFIG,
        ...config,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'homepageSections/homepage');
    }
  },

  subscribeHomepageConfig(cb: (config: HomepageConfig) => void) {
    return onSnapshot(
      doc(db, 'homepageSections', 'homepage'),
      (snap) => {
        if (snap.exists()) {
          cb(snap.data() as HomepageConfig);
        } else {
          cb(DEFAULT_HOMEPAGE_CONFIG);
        }
      },
      (err) => {
        console.warn('HomepageConfig listener notice:', err.message);
      }
    );
  },

  // 3. Services CRUD
  async getServices(): Promise<CmsService[]> {
    try {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (snap.empty) return DEFAULT_SERVICES;
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsService));
    } catch (e) {
      return DEFAULT_SERVICES;
    }
  },

  async saveService(service: CmsService): Promise<void> {
    try {
      await setDoc(doc(db, 'services', service.id), {
        ...service,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `services/${service.id}`);
    }
  },

  async deleteService(serviceId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `services/${serviceId}`);
    }
  },

  subscribeServices(cb: (services: CmsService[]) => void) {
    const q = query(collection(db, 'services'));
    return onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsService));
          items.sort((a, b) => a.order - b.order);
          cb(items);
        } else {
          cb(DEFAULT_SERVICES);
        }
      },
      (err) => {
        console.warn('Services snapshot listener notice:', err.message);
      }
    );
  },

  // 4. Pages Management CRUD
  async getPages(): Promise<CmsPage[]> {
    try {
      const snap = await getDocs(collection(db, 'pages'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsPage));
    } catch (e) {
      return [];
    }
  },

  async savePage(page: CmsPage): Promise<void> {
    try {
      await setDoc(doc(db, 'pages', page.id), {
        ...page,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `pages/${page.id}`);
    }
  },

  async deletePage(pageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'pages', pageId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `pages/${pageId}`);
    }
  },

  subscribePages(cb: (pages: CmsPage[]) => void) {
    return onSnapshot(
      collection(db, 'pages'),
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsPage));
        cb(items);
      },
      (err) => console.warn('Pages listener notice:', err.message)
    );
  },

  // 5. About Us
  async getAboutUs(): Promise<CmsAboutUs> {
    try {
      const snap = await getDoc(doc(db, 'pages', 'aboutUs'));
      if (snap.exists()) {
        return snap.data() as CmsAboutUs;
      }
      return DEFAULT_ABOUT_US;
    } catch {
      return DEFAULT_ABOUT_US;
    }
  },

  async updateAboutUs(data: Partial<CmsAboutUs>): Promise<void> {
    try {
      await setDoc(doc(db, 'pages', 'aboutUs'), {
        ...DEFAULT_ABOUT_US,
        ...data,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'pages/aboutUs');
    }
  },

  // 6. Service Areas CRUD
  async getServiceAreas(): Promise<CmsServiceArea[]> {
    try {
      const snap = await getDocs(collection(db, 'serviceAreas'));
      if (snap.empty) return DEFAULT_SERVICE_AREAS;
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsServiceArea));
    } catch {
      return DEFAULT_SERVICE_AREAS;
    }
  },

  async saveServiceArea(area: CmsServiceArea): Promise<void> {
    try {
      await setDoc(doc(db, 'serviceAreas', area.id), {
        ...area,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `serviceAreas/${area.id}`);
    }
  },

  async deleteServiceArea(areaId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'serviceAreas', areaId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `serviceAreas/${areaId}`);
    }
  },

  subscribeServiceAreas(cb: (areas: CmsServiceArea[]) => void) {
    return onSnapshot(
      collection(db, 'serviceAreas'),
      (snap) => {
        if (!snap.empty) {
          cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsServiceArea)));
        } else {
          cb(DEFAULT_SERVICE_AREAS);
        }
      },
      (err) => console.warn('Service areas listener notice:', err.message)
    );
  },

  // 7. Testimonials CRUD
  async getTestimonials(): Promise<CmsTestimonial[]> {
    try {
      const snap = await getDocs(collection(db, 'testimonials'));
      if (snap.empty) return DEFAULT_TESTIMONIALS;
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsTestimonial));
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  },

  async saveTestimonial(t: CmsTestimonial): Promise<void> {
    try {
      await setDoc(doc(db, 'testimonials', t.id), t);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `testimonials/${t.id}`);
    }
  },

  async deleteTestimonial(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `testimonials/${id}`);
    }
  },

  subscribeTestimonials(cb: (testimonials: CmsTestimonial[]) => void) {
    return onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        if (!snap.empty) {
          cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsTestimonial)));
        } else {
          cb(DEFAULT_TESTIMONIALS);
        }
      },
      (err) => console.warn('Testimonials listener notice:', err.message)
    );
  },

  // 8. FAQs CRUD
  async getFaqs(): Promise<CmsFaq[]> {
    try {
      const snap = await getDocs(collection(db, 'faqs'));
      if (snap.empty) return DEFAULT_FAQS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsFaq));
      items.sort((a, b) => a.order - b.order);
      return items;
    } catch {
      return DEFAULT_FAQS;
    }
  },

  async saveFaq(faq: CmsFaq): Promise<void> {
    try {
      await setDoc(doc(db, 'faqs', faq.id), {
        ...faq,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `faqs/${faq.id}`);
    }
  },

  async deleteFaq(faqId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'faqs', faqId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `faqs/${faqId}`);
    }
  },

  subscribeFaqs(cb: (faqs: CmsFaq[]) => void) {
    return onSnapshot(
      collection(db, 'faqs'),
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CmsFaq));
          items.sort((a, b) => a.order - b.order);
          cb(items);
        } else {
          cb(DEFAULT_FAQS);
        }
      },
      (err) => console.warn('FAQs listener notice:', err.message)
    );
  },

  // 9. Navigation Config
  async getNavigation(): Promise<NavigationConfig> {
    try {
      const snap = await getDoc(doc(db, 'navigation', 'global'));
      if (snap.exists()) return snap.data() as NavigationConfig;
      return DEFAULT_NAVIGATION;
    } catch {
      return DEFAULT_NAVIGATION;
    }
  },

  async updateNavigation(config: Partial<NavigationConfig>): Promise<void> {
    try {
      await setDoc(doc(db, 'navigation', 'global'), {
        ...DEFAULT_NAVIGATION,
        ...config,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'navigation/global');
    }
  },

  subscribeNavigation(cb: (nav: NavigationConfig) => void) {
    return onSnapshot(
      doc(db, 'navigation', 'global'),
      (snap) => {
        if (snap.exists()) {
          cb(snap.data() as NavigationConfig);
        } else {
          cb(DEFAULT_NAVIGATION);
        }
      },
      (err) => console.warn('Navigation listener notice:', err.message)
    );
  },

  // 10. Media Library
  async getMedia(): Promise<MediaItem[]> {
    try {
      const snap = await getDocs(collection(db, 'media'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaItem));
    } catch {
      return [];
    }
  },

  async saveMedia(item: MediaItem): Promise<void> {
    try {
      await setDoc(doc(db, 'media', item.id), item);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `media/${item.id}`);
    }
  },

  async deleteMedia(mediaId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'media', mediaId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `media/${mediaId}`);
    }
  },

  // 11. Contact Submissions (Leads)
  async submitLead(
    submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'referenceNo'> & { referenceNo?: string }
  ): Promise<ContactSubmission> {
    const id = 'lead-' + Date.now();
    const referenceNo = submission.referenceNo || ('IP-' + Math.floor(100000 + Math.random() * 900000));
    const fullItem: ContactSubmission = {
      ...submission,
      id,
      referenceNo,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'contactSubmissions', id), fullItem);
      return fullItem;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `contactSubmissions/${id}`);
    }
  },

  async getSubmissions(): Promise<ContactSubmission[]> {
    try {
      const snap = await getDocs(collection(db, 'contactSubmissions'));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission));
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return items;
    } catch {
      return [];
    }
  },

  async updateSubmission(id: string, patch: Partial<ContactSubmission>): Promise<void> {
    try {
      await updateDoc(doc(db, 'contactSubmissions', id), patch);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `contactSubmissions/${id}`);
    }
  },

  async deleteSubmission(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'contactSubmissions', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `contactSubmissions/${id}`);
    }
  },

  subscribeSubmissions(cb: (items: ContactSubmission[]) => void) {
    return onSnapshot(
      collection(db, 'contactSubmissions'),
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission));
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        cb(items);
      },
      (err) => console.warn('Submissions listener notice:', err.message)
    );
  },

  // 12. Activity Logs
  async logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    try {
      const id = 'log-' + Date.now();
      await setDoc(doc(db, 'activityLogs', id), {
        ...log,
        id,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Log activity error:', e);
    }
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      const snap = await getDocs(collection(db, 'activityLogs'));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return items;
    } catch {
      return [];
    }
  },

  // 13. Auto-Seed Initial Data into Firestore if collection is pristine
  async seedInitialDataIfEmpty(): Promise<void> {
    try {
      const settingsSnap = await getDoc(doc(db, 'siteSettings', 'global'));
      if (!settingsSnap.exists()) {
        await setDoc(doc(db, 'siteSettings', 'global'), DEFAULT_SITE_SETTINGS);
      }

      const homepageSnap = await getDoc(doc(db, 'homepageSections', 'homepage'));
      if (!homepageSnap.exists()) {
        await setDoc(doc(db, 'homepageSections', 'homepage'), DEFAULT_HOMEPAGE_CONFIG);
      }

      const navSnap = await getDoc(doc(db, 'navigation', 'global'));
      if (!navSnap.exists()) {
        await setDoc(doc(db, 'navigation', 'global'), DEFAULT_NAVIGATION);
      }

      const servicesSnap = await getDocs(collection(db, 'services'));
      if (servicesSnap.empty) {
        for (const s of DEFAULT_SERVICES) {
          await setDoc(doc(db, 'services', s.id), s);
        }
      }

      const areasSnap = await getDocs(collection(db, 'serviceAreas'));
      if (areasSnap.empty) {
        for (const a of DEFAULT_SERVICE_AREAS) {
          await setDoc(doc(db, 'serviceAreas', a.id), a);
        }
      }

      const testSnap = await getDocs(collection(db, 'testimonials'));
      if (testSnap.empty) {
        for (const t of DEFAULT_TESTIMONIALS) {
          await setDoc(doc(db, 'testimonials', t.id), t);
        }
      }

      const faqsSnap = await getDocs(collection(db, 'faqs'));
      if (faqsSnap.empty) {
        for (const f of DEFAULT_FAQS) {
          await setDoc(doc(db, 'faqs', f.id), f);
        }
      }

      // Add pre-loaded media assets so media library has files immediately
      const mediaSnap = await getDocs(collection(db, 'media'));
      if (mediaSnap.empty) {
        const initialAssets: MediaItem[] = [
          {
            id: 'med-1',
            fileName: 'hero_hvac_technician.jpg',
            fileUrl: '/src/assets/images/hero_hvac_technician_1794427369059.jpg',
            fileType: 'image/jpeg',
            fileSize: 420000,
            dimensions: '1920x1080',
            folder: 'hero',
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 'med-2',
            fileName: 'commercial_rooftop_hvac.jpg',
            fileUrl: '/src/assets/images/commercial_rooftop_hvac_1794427369351.jpg',
            fileType: 'image/jpeg',
            fileSize: 380000,
            dimensions: '1440x1080',
            folder: 'commercial',
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 'med-3',
            fileName: 'furnace_installation.jpg',
            fileUrl: '/src/assets/images/furnace_installation_1794427370552.jpg',
            fileType: 'image/jpeg',
            fileSize: 360000,
            dimensions: '1440x1080',
            folder: 'heating',
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 'med-4',
            fileName: 'ac_cooling_interior.jpg',
            fileUrl: '/src/assets/images/ac_cooling_interior_1794427371083.jpg',
            fileType: 'image/jpeg',
            fileSize: 390000,
            dimensions: '1440x1080',
            folder: 'cooling',
            uploadedAt: new Date().toISOString(),
          },
        ];
        for (const m of initialAssets) {
          await setDoc(doc(db, 'media', m.id), m);
        }
      }
    } catch (e) {
      console.warn('Auto-seed notice (permissions or network):', e);
    }
  },
};
