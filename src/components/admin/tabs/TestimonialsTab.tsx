import React, { useState } from 'react';
import { MessageSquareQuote, Plus, Edit, Trash2, Star, CheckCircle2, X } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { CmsTestimonial } from '../../../types/cms';

export default function TestimonialsTab() {
  const { testimonials, saveTestimonial, deleteTestimonial } = useCms();
  const [editingItem, setEditingItem] = useState<CmsTestimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenAdd = () => {
    const newItem: CmsTestimonial = {
      id: 'test-' + Date.now(),
      customerName: '',
      clientType: 'Residential Homeowner',
      serviceReceived: 'Air Conditioning Repair',
      reviewText: '',
      rating: 5,
      displayInitials: '',
      isFeatured: true,
      isPublished: true,
      date: new Date().toISOString().slice(0, 10),
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: CmsTestimonial) => {
    setEditingItem({ ...t });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.customerName.trim()) return;

    const initials = editingItem.displayInitials || editingItem.customerName.split(' ').map((n) => n[0]).join('.').toUpperCase();
    await saveTestimonial({
      ...editingItem,
      displayInitials: initials,
    });

    setIsModalOpen(false);
    setToastMessage(`Saved review from "${editingItem.customerName}"`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete testimonial from "${name}"?`)) {
      await deleteTestimonial(id);
      setToastMessage(`Deleted testimonial from "${name}"`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Social Proof &amp; Verification
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Customer Testimonials ({testimonials.length})
          </h2>
          <p className="text-xs text-slate-400">
            Manage verified feedback, ratings, client roles, and publish status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    t.isPublished ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-amber-950/80 text-amber-400'
                  }`}
                >
                  {t.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{t.reviewText}"
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                  {t.displayInitials || 'C'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{t.customerName}</div>
                  <div className="text-[11px] text-slate-400">{t.clientType} · {t.serviceReceived}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(t)}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Review</span>
              </button>
              <button
                onClick={() => handleDelete(t.id, t.customerName)}
                className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
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
              <h3 className="text-base font-bold text-white">Edit Testimonial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.customerName}
                    onChange={(e) => setEditingItem({ ...editingItem, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Client Role / Property</label>
                  <input
                    type="text"
                    value={editingItem.clientType}
                    onChange={(e) => setEditingItem({ ...editingItem, clientType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Service Received</label>
                  <input
                    type="text"
                    value={editingItem.serviceReceived}
                    onChange={(e) => setEditingItem({ ...editingItem, serviceReceived: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.reviewText}
                  onChange={(e) => setEditingItem({ ...editingItem, reviewText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span>Published on public website</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span>Featured priority</span>
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
