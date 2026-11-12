import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Download,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Wrench,
  ChevronRight,
  X
} from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { ContactSubmission } from '../../../types/cms';

export default function FormSubmissionsTab() {
  const { submissions, updateSubmissionStatus, deleteSubmission } = useCms();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<ContactSubmission | null>(null);
  const [techNotes, setTechNotes] = useState('');
  const [assignedTech, setAssignedTech] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.serviceRequired.toLowerCase().includes(search.toLowerCase()) ||
      (s.referenceNo && s.referenceNo.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectLead = (lead: ContactSubmission) => {
    setSelectedLead(lead);
    setTechNotes(lead.technicianNotes || '');
    setAssignedTech(lead.assignedTechnician || 'Marcus Vance (Senior Tech)');
  };

  const handleStatusUpdate = async (status: ContactSubmission['status']) => {
    if (!selectedLead) return;
    await updateSubmissionStatus(selectedLead.id, status, techNotes, assignedTech);
    setSelectedLead({
      ...selectedLead,
      status,
      technicianNotes: techNotes,
      assignedTechnician: assignedTech,
    });
    setToastMessage(`Updated lead ${selectedLead.referenceNo} to ${status}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = async (id: string, refNo: string) => {
    if (confirm(`Delete submission ${refNo}?`)) {
      await deleteSubmission(id);
      if (selectedLead?.id === id) setSelectedLead(null);
      setToastMessage(`Deleted submission ${refNo}`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Reference No',
      'Date',
      'Name',
      'Phone',
      'Email',
      'Service',
      'Property',
      'Urgency',
      'Status',
      'Technician',
      'Notes',
      'Message',
    ];
    const rows = submissions.map((s) => [
      s.referenceNo,
      new Date(s.createdAt).toLocaleDateString(),
      `"${s.customerName.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      `"${s.serviceRequired}"`,
      s.propertyType,
      s.urgency,
      s.status,
      `"${(s.assignedTechnician || '').replace(/"/g, '""')}"`,
      `"${(s.technicianNotes || '').replace(/"/g, '""')}"`,
      `"${s.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iwebpro_submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Inbound Leads &amp; CRM
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Form Submissions Management ({submissions.length})
          </h2>
          <p className="text-xs text-slate-400">
            Realtime customer quote requests stored securely in Cloud Firestore.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export Submissions to CSV</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by customer name, phone, or reference number..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'new', 'contacted', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Ref &amp; Caller</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No submissions matching current search filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const isSelected = selectedLead?.id === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => handleSelectLead(s)}
                        className={`hover:bg-slate-850/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-slate-850 border-l-2 border-orange-500' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-mono text-[11px] text-orange-400 font-bold">{s.referenceNo}</div>
                          <div className="font-bold text-white text-xs">{s.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{s.phone}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <div>{s.serviceRequired}</div>
                          <div className="text-[10px] text-slate-500 capitalize">{s.propertyType}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              s.status === 'new'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : s.status === 'contacted'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(s.id, s.referenceNo);
                            }}
                            className="p-1 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Lead Detail Card */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
          {selectedLead ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 font-bold">
                    {selectedLead.referenceNo}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {selectedLead.customerName}
                  </h3>
                </div>
                <span className="capitalize text-xs font-bold px-2.5 py-1 rounded bg-slate-950 text-white border border-slate-800">
                  {selectedLead.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 flex items-center gap-2 font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">{selectedLead.phone}</span>
                </a>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 flex items-center gap-2 truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{selectedLead.email}</span>
                </a>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Customer Message:</div>
                <p className="text-slate-300 italic">"{selectedLead.message}"</p>
                {selectedLead.serviceCity && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    City / ZIP: {selectedLead.serviceCity}
                  </div>
                )}
              </div>

              {/* Status Update Controls */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Assigned Technician
                  </label>
                  <select
                    value={assignedTech}
                    onChange={(e) => setAssignedTech(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="Marcus Vance (Senior HVAC Tech)">Marcus Vance (Senior HVAC Tech)</option>
                    <option value="Dave Ramirez (Commercial Specialist)">Dave Ramirez (Commercial Specialist)</option>
                    <option value="Carlos Mendez (Furnace Specialist)">Carlos Mendez (Furnace Specialist)</option>
                    <option value="Lisa Chen (Air Quality & Duct)">Lisa Chen (Air Quality &amp; Duct)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Internal Dispatcher / Tech Notes
                  </label>
                  <textarea
                    rows={2}
                    value={techNotes}
                    onChange={(e) => setTechNotes(e.target.value)}
                    placeholder="Enter notes on customer call, required parts..."
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('new')}
                    className="py-2 bg-slate-950 hover:bg-slate-800 text-orange-400 text-xs font-semibold rounded-lg border border-slate-800 cursor-pointer"
                  >
                    Mark New
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('contacted')}
                    className="py-2 bg-sky-950 hover:bg-sky-900 text-sky-400 text-xs font-semibold rounded-lg border border-sky-800 cursor-pointer"
                  >
                    Mark Contacted
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('completed')}
                    className="py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-800 cursor-pointer"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">
                Select any customer submission from the list on the left to view full message, assign technician, and update inquiry status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
