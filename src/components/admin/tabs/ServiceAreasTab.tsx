import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, CheckCircle2, X } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { CmsServiceArea } from '../../../types/cms';

export default function ServiceAreasTab() {
  const { serviceAreas, saveServiceArea, deleteServiceArea } = useCms();
  const [editingArea, setEditingArea] = useState<CmsServiceArea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [citiesInput, setCitiesInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenAdd = () => {
    const newArea: CmsServiceArea = {
      id: 'area-' + Date.now(),
      regionName: 'New Service District',
      countyOrZone: 'Zone D - Expanded Coverage',
      coveredCities: ['New City', 'Surrounding Area'],
      responseStandard: 'Daily Routes',
      description: 'Regional residential and commercial service zone.',
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    setEditingArea(newArea);
    setCitiesInput(newArea.coveredCities.join(', '));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (area: CmsServiceArea) => {
    setEditingArea({ ...area });
    setCitiesInput(area.coveredCities.join(', '));
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArea) return;

    const cities = citiesInput.split(',').map((c) => c.trim()).filter(Boolean);
    await saveServiceArea({
      ...editingArea,
      coveredCities: cities,
      updatedAt: new Date().toISOString(),
    });

    setIsModalOpen(false);
    setToastMessage(`Saved service territory: ${editingArea.regionName}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete service area "${name}"?`)) {
      await deleteServiceArea(id);
      setToastMessage(`Deleted ${name}`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Territory &amp; Dispatch
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Service Areas Management ({serviceAreas.length})
          </h2>
          <p className="text-xs text-slate-400">
            Define cities, counties, and zones served by Iwebpro technicians.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service Area</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceAreas.map((area) => (
          <div
            key={area.id}
            className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                  {area.countyOrZone}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    area.isPublished ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-amber-950/80 text-amber-400'
                  }`}
                >
                  {area.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{area.regionName}</span>
              </h3>

              <div className="text-xs text-emerald-400 font-semibold">
                {area.responseStandard}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Covered Municipalities:</span>
                <div className="flex flex-wrap gap-1">
                  {area.coveredCities.map((city, idx) => (
                    <span key={idx} className="text-[11px] text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(area)}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Zone</span>
              </button>
              <button
                onClick={() => handleDelete(area.id, area.regionName)}
                className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingArea && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl text-slate-100 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Edit Service Area</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Region / District Name *</label>
                <input
                  type="text"
                  required
                  value={editingArea.regionName}
                  onChange={(e) => setEditingArea({ ...editingArea, regionName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">County / Zone Identifier</label>
                <input
                  type="text"
                  value={editingArea.countyOrZone}
                  onChange={(e) => setEditingArea({ ...editingArea, countyOrZone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Response Standard</label>
                <input
                  type="text"
                  value={editingArea.responseStandard}
                  onChange={(e) => setEditingArea({ ...editingArea, responseStandard: e.target.value })}
                  placeholder="e.g. Same-Day / Next-Day Dispatch Available"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Covered Cities (comma-separated)</label>
                <textarea
                  rows={2}
                  value={citiesInput}
                  onChange={(e) => setCitiesInput(e.target.value)}
                  placeholder="Metro Central, West End, Highland Park"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="areaPublish"
                  checked={editingArea.isPublished}
                  onChange={(e) => setEditingArea({ ...editingArea, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="areaPublish" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Publish this area to public territory matrix
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-xs rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  Save Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
