import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Snowflake,
  Flame,
  Building2,
  Wind,
  ShieldCheck,
  Thermometer,
  Layers
} from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { CmsService } from '../../../types/cms';

export default function ServicesManagementTab() {
  const { services, saveService, deleteService, media } = useCms();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingService, setEditingService] = useState<CmsService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    const newService: CmsService = {
      id: 'service-' + Date.now(),
      name: '',
      slug: '',
      tagline: '',
      shortDescription: '',
      fullDescription: '',
      category: 'cooling',
      highlights: ['Professional load assessment', 'Certified installation'],
      commonSigns: ['System malfunction', 'Inconsistent temperatures'],
      imageSrc: '/src/assets/images/hero_hvac_technician_1794427369059.jpg',
      iconName: 'Wrench',
      order: services.length + 1,
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    setEditingService(newService);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: CmsService) => {
    setEditingService({ ...srv });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (srv: CmsService) => {
    const updated = { ...srv, isPublished: !srv.isPublished, updatedAt: new Date().toISOString() };
    await saveService(updated);
    setToastMessage(`Service "${srv.name}" ${updated.isPublished ? 'published' : 'moved to drafts'}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the service "${name}"? This will remove it from the live website.`)) {
      await deleteService(id);
      setToastMessage(`Deleted service "${name}"`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name.trim()) return;

    // Generate slug if empty
    const slug = editingService.slug || editingService.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await saveService({
      ...editingService,
      slug,
      updatedAt: new Date().toISOString(),
    });

    setIsModalOpen(false);
    setToastMessage(`Saved service "${editingService.name}" to Cloud Firestore!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Catalog &amp; Offerings
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            HVAC Services Management ({services.length})
          </h2>
          <p className="text-xs text-slate-400">
            Add, update, publish, or rearrange residential and commercial HVAC services.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search HVAC services by title or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'cooling', 'heating', 'maintenance', 'ductwork', 'commercial'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-orange-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Order &amp; Service</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Tagline</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filtered.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.imageSrc}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{srv.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">/{srv.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium">
                      {srv.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate">
                    {srv.tagline}
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(srv)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                        srv.isPublished
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {srv.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4 text-sky-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id, srv.name)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold text-white">
                {editingService.name ? `Edit: ${editingService.name}` : 'Add New HVAC Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingService.slug}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="e.g. ac-installation"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Tagline / Kicker
                </label>
                <input
                  type="text"
                  value={editingService.tagline}
                  onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="cooling">Cooling (Air Conditioning)</option>
                    <option value="heating">Heating &amp; Furnace</option>
                    <option value="maintenance">Preventive Maintenance</option>
                    <option value="ductwork">Ductwork &amp; Airflow</option>
                    <option value="commercial">Commercial HVAC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Icon Component
                  </label>
                  <select
                    value={editingService.iconName}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="Snowflake">Snowflake</option>
                    <option value="Wrench">Wrench</option>
                    <option value="Flame">Flame</option>
                    <option value="ShieldAlert">ShieldAlert</option>
                    <option value="CheckCircle2">CheckCircle2</option>
                    <option value="Thermometer">Thermometer</option>
                    <option value="Wind">Wind</option>
                    <option value="Building2">Building2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Short Description (Card)
                </label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Detailed Description (Modal / Landing)
                </label>
                <textarea
                  rows={3}
                  value={editingService.fullDescription}
                  onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={editingService.imageSrc}
                  onChange={(e) => setEditingService({ ...editingService, imageSrc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="srvPublish"
                  checked={editingService.isPublished}
                  onChange={(e) => setEditingService({ ...editingService, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="srvPublish" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Publish this service immediately to the public website
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
