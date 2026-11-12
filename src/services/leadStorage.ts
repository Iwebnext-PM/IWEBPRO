import { Lead, DispatchAppointment, LeadStatus } from '../types/hvac';
import { SEED_LEADS, SEED_APPOINTMENTS } from '../data/hvacData';

const LEADS_STORAGE_KEY = 'iwebpro_leads_data_v1';
const APPOINTMENTS_STORAGE_KEY = 'iwebpro_appointments_data_v1';

class LeadStore {
  private leads: Lead[] = [];
  private appointments: DispatchAppointment[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
      if (storedLeads) {
        this.leads = JSON.parse(storedLeads);
      } else {
        this.leads = [...SEED_LEADS];
        this.persistLeads();
      }

      const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (storedAppointments) {
        this.appointments = JSON.parse(storedAppointments);
      } else {
        this.appointments = [...SEED_APPOINTMENTS];
        this.persistAppointments();
      }
    } catch {
      this.leads = [...SEED_LEADS];
      this.appointments = [...SEED_APPOINTMENTS];
    }
  }

  private persistLeads() {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(this.leads));
    } catch (e) {
      console.warn('LocalStorage error saving leads:', e);
    }
    this.notify();
  }

  private persistAppointments() {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(this.appointments));
    } catch (e) {
      console.warn('LocalStorage error saving appointments:', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getLeads(): Lead[] {
    return [...this.leads];
  }

  public getAppointments(): DispatchAppointment[] {
    return [...this.appointments];
  }

  public addLead(leadInput: Omit<Lead, 'id' | 'referenceNo' | 'createdAt' | 'status'>): Lead {
    const id = 'lead-' + Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `IWB-2026-${randomSuffix}`;

    const newLead: Lead = {
      ...leadInput,
      id,
      referenceNo,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    this.leads.unshift(newLead);
    this.persistLeads();
    return newLead;
  }

  public updateLeadStatus(
    leadId: string,
    status: LeadStatus,
    patch?: {
      assignedTechnician?: string;
      technicianNotes?: string;
      dispatchDate?: string;
      dispatchTimeSlot?: string;
      estimatedCost?: string;
    }
  ): Lead | undefined {
    const index = this.leads.findIndex((l) => l.id === leadId);
    if (index === -1) return undefined;

    const current = this.leads[index];
    const updated: Lead = {
      ...current,
      status,
      ...patch
    };

    this.leads[index] = updated;

    // If scheduled and has dispatch date, sync appointment
    if (status === 'scheduled' && patch?.dispatchDate && patch?.dispatchTimeSlot) {
      const existingApptIndex = this.appointments.findIndex((a) => a.leadId === leadId);
      const apptData: DispatchAppointment = {
        id: existingApptIndex >= 0 ? this.appointments[existingApptIndex].id : 'appt-' + Date.now(),
        leadId,
        referenceNo: updated.referenceNo,
        customerName: updated.customerName,
        phone: updated.phone,
        serviceType: updated.serviceRequired,
        propertyType: updated.propertyType,
        date: patch.dispatchDate,
        timeSlot: patch.dispatchTimeSlot,
        technician: patch.assignedTechnician || 'To Be Assigned',
        location: updated.serviceCity || 'Client Address on File',
        status: 'confirmed'
      };

      if (existingApptIndex >= 0) {
        this.appointments[existingApptIndex] = apptData;
      } else {
        this.appointments.push(apptData);
      }
      this.persistAppointments();
    }

    this.persistLeads();
    return updated;
  }

  public scheduleAppointment(appointmentData: Omit<DispatchAppointment, 'id'>): DispatchAppointment {
    const id = 'appt-' + Date.now();
    const newAppt: DispatchAppointment = {
      ...appointmentData,
      id
    };
    this.appointments.push(newAppt);
    this.persistAppointments();
    return newAppt;
  }

  public updateAppointmentStatus(
    id: string,
    status: DispatchAppointment['status']
  ): DispatchAppointment | undefined {
    const index = this.appointments.findIndex((a) => a.id === id);
    if (index === -1) return undefined;
    this.appointments[index].status = status;
    this.persistAppointments();
    return this.appointments[index];
  }

  public exportCsv(): string {
    const headers = [
      'Reference No',
      'Created Date',
      'Customer Name',
      'Phone',
      'Email',
      'Service Required',
      'Property Type',
      'Urgency',
      'City/Area',
      'Status',
      'Assigned Tech',
      'Dispatch Date',
      'Customer Message'
    ];

    const rows = this.leads.map((l) => [
      l.referenceNo,
      new Date(l.createdAt).toLocaleDateString(),
      `"${l.customerName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.serviceRequired}"`,
      l.propertyType,
      l.urgency,
      `"${(l.serviceCity || '').replace(/"/g, '""')}"`,
      l.status,
      `"${(l.assignedTechnician || '').replace(/"/g, '""')}"`,
      `"${l.dispatchDate || ''}"`,
      `"${l.message.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public resetToDefaults() {
    this.leads = [...SEED_LEADS];
    this.appointments = [...SEED_APPOINTMENTS];
    this.persistLeads();
    this.persistAppointments();
  }
}

export const leadStore = new LeadStore();
