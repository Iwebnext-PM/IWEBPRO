import { HvacService, FaqItem, ServiceAreaZone, Lead, DispatchAppointment } from '../types/hvac';

export const COMPANY_INFO = {
  name: 'Iwebpro',
  tagline: 'Reliable HVAC Installation & Repair Services You Can Trust',
  phoneDisplay: '(888) 445-5423',
  phoneTel: '+18884455423',
  phoneLink: 'tel:+18884455423',
  emailDisplay: 'iwebnext.com@gmail.com',
  emailLink: 'mailto:iwebnext.com@gmail.com',
  hours: 'Monday – Sunday: 7:00 AM – 8:00 PM (Emergency Dispatch Available)',
  emergencyNotice: 'Emergency HVAC breakdown services available upon inquiry',
};

// Exact 8 services required by prompt
export const HVAC_SERVICES: HvacService[] = [
  {
    id: 'ac-installation',
    name: 'Air Conditioning Installation',
    tagline: 'Precision Cooling Systems Sized for Optimal Comfort',
    category: 'cooling',
    shortDescription: 'Professional AC installation for residential and commercial properties. Help customers choose suitable cooling systems.',
    fullDescription: 'Our certified cooling specialists evaluate your square footage, insulation, and airflow requirements to recommend and install the right air conditioning unit for your home or business. We ensure precise refrigerant charging, electrical connections, and duct integration for maximum seasonal efficiency.',
    highlights: [
      'Tailored cooling load calculation and equipment sizing',
      'High-efficiency central AC and ductless split systems',
      'Complete electrical, drain line, and thermostat setup',
      'System balancing and post-installation airflow testing'
    ],
    commonSigns: [
      'Existing unit is over 10–15 years old',
      'Frequent costly breakdowns during peak summer',
      'Inconsistent room temperatures or high electric bills',
      'Outdated R-22 refrigerant system requiring replacement'
    ],
    imageSrc: '/assets/images/ac_cooling_interior_1794427371083.jpg',
    iconName: 'Snowflake'
  },
  {
    id: 'ac-repair',
    name: 'Air Conditioning Repair',
    tagline: 'Rapid Diagnostics & Resolution for System Malfunctions',
    category: 'cooling',
    shortDescription: 'Troubleshooting and repair for AC systems. Address cooling problems, unusual noises, and system malfunctions.',
    fullDescription: 'When your air conditioner fails during high temperatures, our technicians arrive equipped to diagnose electrical faults, sensor glitches, compressor issues, or refrigerant leaks. We focus on transparent diagnostics and durable repairs to restore cold airflow quickly.',
    highlights: [
      'Diagnostic testing for compressors, fans, and capacitors',
      'Refrigerant leak detection and approved pressure restoration',
      'Thermostat recalibration and control board diagnostics',
      'Clearing blocked condensate drains and frozen coils'
    ],
    commonSigns: [
      'Blowing lukewarm or warm air from vents',
      'Grinding, clicking, squealing, or buzzing sounds',
      'Water pooling around the indoor or outdoor unit',
      'Unit short-cycling or tripping the electrical breaker'
    ],
    imageSrc: '/assets/images/hero_hvac_technician_1794427369059.jpg',
    iconName: 'Wrench'
  },
  {
    id: 'heating-installation',
    name: 'Heating System Installation',
    tagline: 'Dependable Heat Pumps & Heating Systems Built for Cold Seasons',
    category: 'heating',
    shortDescription: 'Heating system installation for comfortable indoor environments.',
    fullDescription: 'Keep your property warm throughout cold months with modern heating solutions. We install high-efficiency heat pumps, packaged heating units, and dual-fuel configurations calibrated to maintain steady, even heat across every room with optimal energy usage.',
    highlights: [
      'Heating capacity and heat-loss property assessment',
      'High-efficiency heat pump and central heating systems',
      'Seamless integration with existing ventilation ductwork',
      'Smart thermostat and multi-zone heating configuration'
    ],
    commonSigns: [
      'Existing heating system struggles to maintain set temperature',
      'Rising winter energy costs without weather change',
      'Uneven heating with cold spots in specific rooms',
      'System age exceeding safe operational lifespan'
    ],
    imageSrc: '/assets/images/furnace_installation_1794427370552.jpg',
    iconName: 'Flame'
  },
  {
    id: 'heating-repair',
    name: 'Heating System Repair',
    tagline: 'Accurate Heating System Diagnostics & Restoration',
    category: 'heating',
    shortDescription: 'Diagnose and resolve common heating system issues.',
    fullDescription: 'From malfunctioning blowers and faulty pilot igniters to failed heat pumps and defective thermostats, our technicians pinpoint the root cause of heating failures and perform reliable repairs that restore dependable warmth.',
    highlights: [
      'Blower motor, heat exchanger, and burner diagnostics',
      'Defrost cycle and reversing valve troubleshooting for heat pumps',
      'Safety limit switch and electrical component testing',
      'Carbon monoxide and airflow safety inspections'
    ],
    commonSigns: [
      'System blows cold air while set to heat mode',
      'Furnace or heat pump runs continuously without shutting off',
      'Strange burning odors or unusual metallic noises',
      'Thermostat fails to trigger heating cycles properly'
    ],
    imageSrc: '/assets/images/furnace_installation_1794427370552.jpg',
    iconName: 'ShieldAlert'
  },
  {
    id: 'hvac-maintenance',
    name: 'HVAC Maintenance',
    tagline: 'Preventive Care to Maximize Longevity & Energy Efficiency',
    category: 'maintenance',
    shortDescription: 'Preventive maintenance to help improve system performance and reliability.',
    fullDescription: 'Regular scheduled inspections identify minor wear before it causes catastrophic equipment failure. Our multi-point HVAC maintenance includes coil cleaning, refrigerant checks, electrical tightening, and airflow verification to keep your system running at peak performance.',
    highlights: [
      'Comprehensive multi-point heating and cooling inspection',
      'Evaporator and condenser coil hygiene cleaning',
      'Electrical connection tightening and capacitor health checks',
      'Lubrication of moving parts and air filter inspection'
    ],
    commonSigns: [
      'More than 12 months since the last professional tune-up',
      'Gradual decline in airflow or cooling strength',
      'Slight increase in monthly utility bills',
      'Dust accumulation around supply registers'
    ],
    imageSrc: '/assets/images/hero_hvac_technician_1794427369059.jpg',
    iconName: 'CheckCircle2'
  },
  {
    id: 'furnace-service',
    name: 'Furnace Installation & Repair',
    tagline: 'Gas & Electric Furnace Solutions for Safe, Consistent Warmth',
    category: 'heating',
    shortDescription: 'Professional furnace installation, inspection, and repair services.',
    fullDescription: 'Furnaces require meticulous safety compliance and venting expertise. We handle modern high-efficiency gas furnaces and electric models, inspecting heat exchangers, flue drafting, gas lines, and electronic ignition systems to ensure reliable and safe operation.',
    highlights: [
      'AFUE-rated gas and electric furnace replacements',
      'Cracked heat exchanger safety testing',
      'Flame sensor cleaning and electronic igniter replacement',
      'Combustion analysis and ventilation draft checks'
    ],
    commonSigns: [
      'Yellow or flickering burner flame instead of steady blue',
      'Frequent cycling on and off within minutes',
      'Rattling, popping, or banging noises on start-up',
      'Persistent dry air, stale odor, or carbon detector alerts'
    ],
    imageSrc: '/assets/images/furnace_installation_1794427370552.jpg',
    iconName: 'Thermometer'
  },
  {
    id: 'ductwork-service',
    name: 'Ductwork Installation & Repair',
    tagline: 'Sealed, Balanced Air Ducts Delivering Clean Airflow',
    category: 'ductwork',
    shortDescription: 'Air duct installation, inspection, and repair solutions.',
    fullDescription: 'Leaky or poorly sized ducts can waste up to 30% of conditioned air. We assess static pressure, identify hidden duct leaks, replace deteriorated flexible or sheet metal ducts, and balance delivery dampers so every room receives adequate conditioned air.',
    highlights: [
      'Duct inspection and airflow restriction diagnosis',
      'Mastic sealing and insulation for energy conservation',
      'Replacement of damaged, crushed, or disconnected ducting',
      'Custom sheet metal transitions and return air additions'
    ],
    commonSigns: [
      'Specific rooms are always noticeably warmer or colder',
      'Excessive dust in living areas despite filter changes',
      'Whistling or rattling air sounds inside wall cavities',
      'Visible gaps or disconnected flexible ducts in attic or crawl space'
    ],
    imageSrc: '/assets/images/ac_cooling_interior_1794427371083.jpg',
    iconName: 'Wind'
  },
  {
    id: 'commercial-hvac',
    name: 'Commercial HVAC Services',
    tagline: 'Engineered Climate Control for Facilities, Retail & Offices',
    category: 'commercial',
    shortDescription: 'HVAC installation, repair, and maintenance solutions for commercial properties.',
    fullDescription: 'Commercial spaces demand heavy-duty, dependable climate systems to protect merchandise, keep staff productive, and welcome patrons. We service rooftop package units (RTUs), split systems, multi-zone VRF/VRV units, and make-up air systems tailored to commercial operational demands.',
    highlights: [
      'Rooftop unit (RTU) installation, crane lifts, and replacements',
      'Planned preventative maintenance agreements for business sites',
      'Emergency response for critical cooling and server environments',
      'Building economizer and ventilation code compliance'
    ],
    commonSigns: [
      'Rooftop unit vibration or unusual compressor groan',
      'Tenant complaints regarding hot or stuffy conference spaces',
      'High seasonal utility bills on commercial power tariffs',
      'Compliance or inspection issues with commercial air exchange'
    ],
    imageSrc: '/assets/images/commercial_rooftop_hvac_1794427369351.jpg',
    iconName: 'Building2'
  }
];

// Why Choose Iwebpro (6 requested points without unsupported claims or fabricated stats)
export const WHY_CHOOSE_POINTS = [
  {
    title: 'Comprehensive HVAC Solutions',
    description: 'From routine seasonal tune-ups and complex diagnostic repairs to complete system replacements and new installations, we handle the full spectrum of heating and cooling requirements under one roof.',
    iconName: 'Layers'
  },
  {
    title: 'Residential & Commercial Expertise',
    description: 'Equipped to service single-family homes, multi-story residences, retail storefronts, and commercial facilities with equipment-appropriate protocols and safety standards.',
    iconName: 'Building'
  },
  {
    title: 'Professional Service Approach',
    description: 'We respect your property and schedule. Our technicians arrive with diagnostic equipment, clearly explain technical findings before proceeding, and ensure tidy work environments.',
    iconName: 'ShieldCheck'
  },
  {
    title: 'Dependable Customer Support',
    description: 'Transparent communication from initial inquiry through project completion. We provide prompt updates on service schedules, replacement parts availability, and transparent pricing.',
    iconName: 'Headphones'
  },
  {
    title: 'Convenient Service Requests',
    description: 'Reach our team directly by phone at (888) 445-5423, or submit our online request form anytime with your preferred schedule and service details for prompt coordination.',
    iconName: 'Clock'
  },
  {
    title: 'Focus on Comfort and Efficiency',
    description: 'Every recommendation is designed to optimize indoor air quality, maintain balanced temperatures across your rooms, and maximize the energy efficiency of your equipment.',
    iconName: 'Zap'
  }
];

// How It Works (3-step process)
export const HOW_IT_WORKS_STEPS = [
  {
    stepNumber: '01',
    title: 'Contact Us',
    subtitle: 'Call or submit a service request',
    description: 'Reach out via phone at (888) 445-5423 or submit our free online quote form with your HVAC needs and preferred timing.',
    actionLabel: 'Call (888) 445-5423'
  },
  {
    stepNumber: '02',
    title: 'Discuss Your Needs',
    subtitle: 'Explain your HVAC problem or installation requirements',
    description: 'We review your equipment type, symptoms, or project scope and coordinate a convenient dispatch window for our technicians.',
    actionLabel: 'Describe Equipment'
  },
  {
    stepNumber: '03',
    title: 'Get Your HVAC Solution',
    subtitle: 'Our team will coordinate the next steps',
    description: 'Our qualified technician arrives on site, performs thorough diagnostics or installation prep, and executes the approved service plan.',
    actionLabel: 'Enjoy Reliable Comfort'
  }
];

// FAQs (exact 6 questions required by prompt)
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I know if my AC needs repair?',
    answer: 'Common indicators include blowing warm or lukewarm air, unusual noises like screeching or buzzing, weak airflow from vents, water leaks or moisture around the unit, frequent short-cycling, and sudden spikes in your electric bill.',
    category: 'Air Conditioning'
  },
  {
    question: 'How often should HVAC systems be maintained?',
    answer: 'We recommend professional maintenance at least twice a year: a cooling system tune-up in spring before summer heat sets in, and a heating system inspection in the fall before winter demands begin. Regular maintenance helps preserve efficiency, prevent sudden breakdowns, and extend equipment life.',
    category: 'Maintenance'
  },
  {
    question: 'Do you provide HVAC installation services?',
    answer: 'Yes. Iwebpro provides comprehensive heating, cooling, and heat pump installation services for both residential and commercial properties. We assist in equipment sizing, load calculations, and energy-efficient system selection.',
    category: 'Installation'
  },
  {
    question: 'Do you handle commercial HVAC systems?',
    answer: 'Yes, we service commercial properties including offices, retail stores, warehouses, and multi-tenant buildings. Our capabilities cover rooftop package units (RTUs), commercial split systems, make-up air units, and ductwork retrofits.',
    category: 'Commercial'
  },
  {
    question: 'When should I replace my air conditioning system?',
    answer: 'Consider replacement if your air conditioning system is more than 10 to 15 years old, requires frequent or expensive repairs, still uses discontinued R-22 refrigerant, or fails to keep your space comfortable despite regular maintenance.',
    category: 'Replacement'
  },
  {
    question: 'How can I request an HVAC service appointment?',
    answer: 'You can request an appointment by calling Iwebpro directly at (888) 445-5423, emailing iwebnext.com@gmail.com, or submitting the online quote form on this website with your preferred date and time slot.',
    category: 'Booking'
  }
];

// Service area zones (Clearly marked editable placeholder as requested)
export const SERVICE_AREA_NOTICE = {
  isPlaceholder: true,
  noticeText: 'Service territory is an editable placeholder layout ready to be configured with specific operational cities and postal regions.',
  metroPlaceholder: 'Regional Metro & Surrounding Municipalities',
  phoneNotice: 'Call (888) 445-5423 to confirm technician availability in your specific area.',
};

export const SERVICE_AREAS: ServiceAreaZone[] = [
  {
    regionName: 'Central Metro & Downtown Corridor',
    countyOrZone: 'Zone A - Primary Urban District',
    coveredCities: ['Metro Central', 'Northside District', 'West End', 'Bayside Heights', 'River Valley'],
    responseStandard: 'Same-Day / Next-Day Dispatch Available'
  },
  {
    regionName: 'Northern Suburbs & Tech Park',
    countyOrZone: 'Zone B - North Region',
    coveredCities: ['Highland Park', 'Oakridge', 'Pine Valley', 'Sunnyvale Heights', 'Clear Creek'],
    responseStandard: 'Standard Daily Routes'
  },
  {
    regionName: 'Southern & Eastern Commercial Zone',
    countyOrZone: 'Zone C - South & East Industrial Corridor',
    coveredCities: ['Southgate', 'Industrial Parkway', 'Lakeside Hills', 'Eastview Plaza', 'Valley Junction'],
    responseStandard: 'Commercial & Residential Dispatch'
  }
];

// Clearly marked placeholder testimonials (as strictly specified by prompt)
export const PLACEHOLDER_TESTIMONIALS = [
  {
    id: 'placeholder-1',
    isPlaceholder: true,
    clientType: 'Residential Homeowner',
    serviceReceived: 'Air Conditioning Installation',
    reviewText: '[Verified Customer Feedback Placeholder] – The Iwebpro technician arrived on time, conducted a thorough assessment of our cooling load, and completed the installation cleanly with clear instruction on our new thermostat.',
    displayInitials: 'R.H.',
    placeholderLabel: 'Placeholder Review · Verified Feedback To Be Added'
  },
  {
    id: 'placeholder-2',
    isPlaceholder: true,
    clientType: 'Commercial Property Manager',
    serviceReceived: 'Commercial HVAC Maintenance & Repair',
    reviewText: '[Verified Customer Feedback Placeholder] – Prompt response to our rooftop package unit inquiry. Diagnostics were transparent with itemized repair options that prevented downtime in our office suite.',
    displayInitials: 'C.P.',
    placeholderLabel: 'Placeholder Review · Verified Feedback To Be Added'
  },
  {
    id: 'placeholder-3',
    isPlaceholder: true,
    clientType: 'Residential Customer',
    serviceReceived: 'Furnace Inspection & Repair',
    reviewText: '[Verified Customer Feedback Placeholder] – heating system was restored before freezing temperatures hit. Professional communication over the phone and respectful in-home service throughout.',
    displayInitials: 'M.K.',
    placeholderLabel: 'Placeholder Review · Verified Feedback To Be Added'
  }
];

// Seeded leads for the automated lead tracking system and real-time scheduling dashboard
export const SEED_LEADS: Lead[] = [
  {
    id: 'lead-1',
    referenceNo: 'IWB-2026-9041',
    customerName: 'Robert Vance',
    phone: '(555) 234-8891',
    email: 'rvance@example.com',
    serviceRequired: 'Air Conditioning Repair',
    propertyType: 'residential',
    urgency: 'priority',
    preferredDate: '2026-11-12',
    preferredTime: 'Morning (8am - 12pm)',
    serviceCity: 'Metro Central',
    message: 'Outdoor condenser fan is humming loudly and the air inside is blowing lukewarm.',
    status: 'scheduled',
    createdAt: '2026-11-11T09:15:00Z',
    assignedTechnician: 'Marcus Vance (Senior HVAC Tech)',
    dispatchDate: '2026-11-12',
    dispatchTimeSlot: '09:00 AM - 11:00 AM',
    technicianNotes: 'Capacitor and dual-run electrical check requested. Bring standard 45/5 MFD capacitors.'
  },
  {
    id: 'lead-2',
    referenceNo: 'IWB-2026-9042',
    customerName: 'Sarah Jenkins',
    phone: '(555) 872-4103',
    email: 'sjenkins@commercialspace.com',
    serviceRequired: 'Commercial HVAC Services',
    propertyType: 'commercial',
    urgency: 'standard',
    preferredDate: '2026-11-14',
    preferredTime: 'Afternoon (12pm - 4pm)',
    serviceCity: 'Industrial Parkway',
    message: 'Rooftop unit on building B needs quarterly maintenance check and filter replacement.',
    status: 'contacted',
    createdAt: '2026-11-11T10:30:00Z',
    assignedTechnician: 'Dave Ramirez (Commercial Specialist)',
    technicianNotes: 'Customer requested written commercial preventive maintenance proposal.'
  },
  {
    id: 'lead-3',
    referenceNo: 'IWB-2026-9043',
    customerName: 'Elena Rostova',
    phone: '(555) 612-9932',
    email: 'elena.rostova@example.com',
    serviceRequired: 'Furnace Installation & Repair',
    propertyType: 'residential',
    urgency: 'emergency_24_7',
    preferredDate: '2026-11-11',
    preferredTime: 'Anytime / ASAP',
    serviceCity: 'Highland Park',
    message: 'Gas furnace clicked off and is not reigniting. Outside temperature is dropping.',
    status: 'new',
    createdAt: '2026-11-11T11:45:00Z'
  }
];

export const SEED_APPOINTMENTS: DispatchAppointment[] = [
  {
    id: 'appt-1',
    leadId: 'lead-1',
    referenceNo: 'IWB-2026-9041',
    customerName: 'Robert Vance',
    phone: '(555) 234-8891',
    serviceType: 'Air Conditioning Repair',
    propertyType: 'residential',
    date: '2026-11-12',
    timeSlot: '09:00 AM - 11:00 AM',
    technician: 'Marcus Vance (Senior Tech)',
    location: '142 Oakridge Blvd, Metro Central',
    status: 'confirmed'
  },
  {
    id: 'appt-2',
    leadId: 'lead-2',
    referenceNo: 'IWB-2026-9042',
    customerName: 'Sarah Jenkins (Apex Retail)',
    phone: '(555) 872-4103',
    serviceType: 'Commercial HVAC Services',
    propertyType: 'commercial',
    date: '2026-11-14',
    timeSlot: '01:00 PM - 03:00 PM',
    technician: 'Dave Ramirez (Commercial Lead)',
    location: '880 Industrial Way, Bldg B',
    status: 'confirmed'
  }
];
