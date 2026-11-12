import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Wrench,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { leadStore } from '../services/leadStorage';
import { Lead, DispatchAppointment, LeadStatus, UrgencyLevel, PropertyType } from '../types/hvac';
import { HVAC_SERVICES } from '../data/hvacData';

interface LeadDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDashboardModal({ isOpen, onClose }: LeadDashboardModalProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<DispatchAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'calendar' | 'new-intake'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Quick scheduler / technician update state
  const [assignedTech, setAssignedTech] = useState('');
  const [dispatchDate, setDispatchDate] = useState('');
  const [dispatchTimeSlot, setDispatchTimeSlot] = useState('09:00 AM - 11:00 AM');
  const [technicianNotes, setTechnicianNotes] = useState('');

  // Manual intake state
  const [intakeForm, setIntakeForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    serviceRequired: HVAC_SERVICES[0].name,
    propertyType: 'residential' as PropertyType,
    urgency: 'standard' as UrgencyLevel,
    serviceCity: '',
    message: ''
  });
  const [intakeSuccess, setIntakeSuccess] = useState(false);

  useEffect(() => {
    const updateData = () => {
      setLeads(leadStore.getLeads());
      setAppointments(leadStore.getAppointments());
    };
    updateData();
    const unsubscribe = leadStore.subscribe(updateData);
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleExportCsv = () => {
    const csvData = leadStore.exportCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `iwebpro_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setAssignedTech(lead.assignedTechnician || 'Marcus Vance (Senior Tech)');
    setDispatchDate(lead.dispatchDate || new Date().toISOString().slice(0, 10));
    setDispatchTimeSlot(lead.dispatchTimeSlot || '09:00 AM - 11:00 AM');
    setTechnicianNotes(lead.technicianNotes || '');
  };

  const handleSaveLeadScheduling = (status: LeadStatus) => {
    if (!selectedLead) return;
    const updated = leadStore.updateLeadStatus(selectedLead.id, status, {
      assignedTechnician: assignedTech,
      dispatchDate: dispatchDate,
      dispatchTimeSlot: dispatchTimeSlot,
      technicianNotes: technicianNotes
    });
    if (updated) {
      setSelectedLead(updated);
    }
  };

  const handleManualIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeForm.customerName || !intakeForm.phone) return;

    leadStore.addLead({
      customerName: intakeForm.customerName,
      phone: intakeForm.phone,
      email: intakeForm.email || 'pending@dispatch.local',
      serviceRequired: intakeForm.serviceRequired,
      propertyType: intakeForm.propertyType,
      urgency: intakeForm.urgency,
      serviceCity: intakeForm.serviceCity || 'Local Service Zone',
      message: intakeForm.message || 'Direct Phone Call intake on (888) 445-5423'
    });

    setIntakeSuccess(true);
    setTimeout(() => {
      setIntakeSuccess(false);
      setActiveTab('pipeline');
      setIntakeForm({
        customerName: '',
        phone: '',
        email: '',
        serviceRequired: HVAC_SERVICES[0].name,
        propertyType: 'residential',
        urgency: 'standard',
        serviceCity: '',
        message: ''
      });
    }, 1200);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.serviceRequired.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = leads.filter((l) => l.status === 'new').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const scheduledCount = leads.filter((l) => l.status === 'scheduled').length;
  const completedCount = leads.filter((l) => l.status === 'completed').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                Iwebpro HVAC Lead Engine &amp; Dispatcher
              </span>
            </div>
            <h2 id="dashboard-title" className="text-xl sm:text-2xl font-extrabold text-white">
              Lead Tracking &amp; Real-Time Scheduling System
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download CSV of all leads"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => leadStore.resetToDefaults()}
              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800/80 border-b border-slate-800 shrink-0">
          <div className="bg-slate-900/95 p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Inquiries
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
                {leads.length}
              </div>
            </div>
            <Users className="w-5 h-5 text-slate-500" />
          </div>

          <div className="bg-slate-900/95 p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                New Actionable
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-orange-400 font-mono tabular-nums">
                {newCount}
              </div>
            </div>
            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded font-bold">
              Unassigned
            </span>
          </div>

          <div className="bg-slate-900/95 p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                Scheduled Slots
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono tabular-nums">
                {scheduledCount}
              </div>
            </div>
            <Calendar className="w-5 h-5 text-sky-500" />
          </div>

          <div className="bg-slate-900/95 p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Completed Jobs
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
                {completedCount}
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Lead Inquiries Pipeline ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Dispatch Schedule Matrix ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('new-intake')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'new-intake'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            + Manual Phone Intake
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone, or reference number..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" /> Status:
                  </span>
                  {['all', 'new', 'contacted', 'scheduled', 'completed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-xs rounded-md capitalize font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-orange-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads Table / Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="py-3 px-4">Ref &amp; Customer</th>
                          <th className="py-3 px-3">Service</th>
                          <th className="py-3 px-3">Urgency</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredLeads.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-500">
                              No leads matching current filters.
                            </td>
                          </tr>
                        ) : (
                          filteredLeads.map((lead) => {
                            const isSelected = selectedLead?.id === lead.id;
                            return (
                              <tr
                                key={lead.id}
                                onClick={() => handleSelectLead(lead)}
                                className={`hover:bg-slate-900/80 transition-colors cursor-pointer ${
                                  isSelected ? 'bg-slate-900 border-l-2 border-orange-500' : ''
                                }`}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-mono text-[11px] text-orange-400 font-bold">
                                    {lead.referenceNo}
                                  </div>
                                  <div className="font-bold text-white text-xs">
                                    {lead.customerName}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {lead.phone}
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-slate-300">
                                  <div className="font-medium">{lead.serviceRequired}</div>
                                  <div className="text-[10px] text-slate-500 capitalize">
                                    {lead.propertyType}
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  {lead.urgency === 'emergency_24_7' ? (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/70 border border-rose-800/80 px-2 py-0.5 rounded">
                                      24/7 Urgent
                                    </span>
                                  ) : lead.urgency === 'priority' ? (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded">
                                      Priority
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-medium text-slate-400">
                                      Standard
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                      lead.status === 'new'
                                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                        : lead.status === 'contacted'
                                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                        : lead.status === 'scheduled'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-700 text-slate-300'
                                    }`}
                                  >
                                    {lead.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectLead(lead);
                                    }}
                                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lead Detail & Dispatch Scheduling Card */}
                <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-5">
                  {selectedLead ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                        <div>
                          <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">
                            Dispatch Ticket · {selectedLead.referenceNo}
                          </span>
                          <h3 className="text-base font-bold text-white">
                            {selectedLead.customerName}
                          </h3>
                        </div>
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            selectedLead.status === 'new'
                              ? 'bg-orange-600 text-white'
                              : selectedLead.status === 'scheduled'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {selectedLead.status}
                        </span>
                      </div>

                      {/* Contact Channels */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 flex items-center gap-2"
                        >
                          <Phone className="w-3.5 h-3.5 text-orange-400" />
                          <span className="font-mono">{selectedLead.phone}</span>
                        </a>
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 flex items-center gap-2 truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">{selectedLead.email}</span>
                        </a>
                      </div>

                      {/* Client Message */}
                      <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-xs space-y-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Customer Issue Note:
                        </div>
                        <p className="text-slate-300 italic">
                          "{selectedLead.message}"
                        </p>
                        {selectedLead.serviceCity && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                            <MapPin className="w-3 h-3 text-orange-400" />
                            <span>Location: {selectedLead.serviceCity}</span>
                          </div>
                        )}
                      </div>

                      {/* Dispatcher Actions: Scheduling & Tech Assignment */}
                      <div className="space-y-3 pt-2 border-t border-slate-850">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Technician Dispatch &amp; Route Assignment
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Assign Technician
                          </label>
                          <select
                            value={assignedTech}
                            onChange={(e) => setAssignedTech(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          >
                            <option value="Marcus Vance (Senior HVAC Tech)">Marcus Vance (Senior HVAC Tech)</option>
                            <option value="Dave Ramirez (Commercial Specialist)">Dave Ramirez (Commercial Specialist)</option>
                            <option value="Carlos Mendez (Furnace & Heat Pumps)">Carlos Mendez (Furnace &amp; Heat Pumps)</option>
                            <option value="Lisa Chen (Air Quality & Duct Specialist)">Lisa Chen (Air Quality &amp; Duct)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Dispatch Date
                            </label>
                            <input
                              type="date"
                              value={dispatchDate}
                              onChange={(e) => setDispatchDate(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Time Window
                            </label>
                            <select
                              value={dispatchTimeSlot}
                              onChange={(e) => setDispatchTimeSlot(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            >
                              <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                              <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                              <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Internal Dispatcher / Tech Notes
                          </label>
                          <textarea
                            rows={2}
                            value={technicianNotes}
                            onChange={(e) => setTechnicianNotes(e.target.value)}
                            placeholder="Add diagnostic notes, required replacement filters or capacitor specs..."
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                          />
                        </div>

                        {/* Status Change Buttons */}
                        <div className="pt-2 grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveLeadScheduling('contacted')}
                            className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold rounded-lg border border-slate-700 text-center transition-colors cursor-pointer"
                          >
                            Mark Contacted
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveLeadScheduling('scheduled')}
                            className="py-2 px-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg text-center transition-colors cursor-pointer shadow-sm"
                          >
                            Schedule Slot
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveLeadScheduling('completed')}
                            className="py-2 px-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg text-center transition-colors cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-slate-500 space-y-2">
                      <Wrench className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="text-xs">
                        Select any lead inquiry on the left to inspect customer details, assign a technician, or coordinate dispatch scheduling.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Live Dispatch Schedule Matrix
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time technician assignments for confirmed residential and commercial appointments.
                  </p>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Real-time Active Schedule</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-orange-400 font-bold">
                          {appt.referenceNo}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          {appt.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white">{appt.customerName}</h4>
                        <p className="text-xs text-slate-400">{appt.serviceType}</p>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>{appt.date} · {appt.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-3.5 h-3.5 text-orange-400" />
                          <span className="font-semibold text-white">{appt.technician}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{appt.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                      <a
                        href={`tel:${appt.phone}`}
                        className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{appt.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'new-intake' && (
            <div className="max-w-2xl mx-auto bg-slate-950 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
              <div className="space-y-1 pb-3 border-b border-slate-850">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Dispatcher Intake Terminal
                </span>
                <h3 className="text-lg font-bold text-white">
                  Add Lead From Direct Call to (888) 445-5423
                </h3>
                <p className="text-xs text-slate-400">
                  Log customer details received during inbound telephone inquiries.
                </p>
              </div>

              {intakeSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lead successfully added to queue! Redirecting to pipeline...</span>
                </div>
              )}

              <form onSubmit={handleManualIntake} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Caller Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={intakeForm.customerName}
                      onChange={(e) => setIntakeForm({ ...intakeForm, customerName: e.target.value })}
                      placeholder="e.g. David Miller"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Caller Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={intakeForm.phone}
                      onChange={(e) => setIntakeForm({ ...intakeForm, phone: e.target.value })}
                      placeholder="e.g. (555) 345-9921"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Service Requested
                    </label>
                    <select
                      value={intakeForm.serviceRequired}
                      onChange={(e) => setIntakeForm({ ...intakeForm, serviceRequired: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      {HVAC_SERVICES.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={intakeForm.serviceCity}
                      onChange={(e) => setIntakeForm({ ...intakeForm, serviceCity: e.target.value })}
                      placeholder="e.g. Metro Central"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Problem Description
                  </label>
                  <textarea
                    rows={3}
                    value={intakeForm.message}
                    onChange={(e) => setIntakeForm({ ...intakeForm, message: e.target.value })}
                    placeholder="Describe equipment malfunction or installation request..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Create &amp; Log Inbound Lead
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
