export interface HvacService {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: 'cooling' | 'heating' | 'maintenance' | 'commercial' | 'ductwork';
  highlights: string[];
  commonSigns: string[];
  imageSrc: string;
  iconName: string;
}

export type LeadStatus = 'new' | 'contacted' | 'estimate_sent' | 'scheduled' | 'completed';
export type UrgencyLevel = 'standard' | 'priority' | 'emergency_24_7';
export type PropertyType = 'residential' | 'commercial';

export interface Lead {
  id: string;
  referenceNo: string;
  customerName: string;
  phone: string;
  email: string;
  serviceRequired: string;
  propertyType: PropertyType;
  urgency: UrgencyLevel;
  preferredDate?: string;
  preferredTime?: string;
  serviceCity?: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
  assignedTechnician?: string;
  dispatchDate?: string;
  dispatchTimeSlot?: string;
  technicianNotes?: string;
  estimatedCost?: string;
}

export interface DispatchAppointment {
  id: string;
  leadId: string;
  referenceNo: string;
  customerName: string;
  phone: string;
  serviceType: string;
  propertyType: PropertyType;
  date: string;
  timeSlot: string;
  technician: string;
  location: string;
  status: 'confirmed' | 'in_transit' | 'on_site' | 'completed';
}

export interface ServiceAreaZone {
  regionName: string;
  countyOrZone: string;
  coveredCities: string[];
  responseStandard: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}
