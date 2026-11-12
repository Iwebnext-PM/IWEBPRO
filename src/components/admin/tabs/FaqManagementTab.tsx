import React, { useState } from 'react';
import { HelpCircle, Plus, Edit, Trash2, Search, CheckCircle2, X } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { CmsFaq } from '../../../types/cms';

export default function FaqManagementTab() {
  const { faqs, saveFaq, deleteFaq } = useCms();
  const [search, setSearch] = useState('');
  const [editingFaq, setEditingFaq] = useState<CmsFaq | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = faqs.filter(
    (f) => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    const newFaq: CmsFaq = {
      id: 'faq-' + Date.now(),
      question: '',
      answer: '',
      category: 'Air Conditioning',
      order: faqs.length + 1,
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    setEditingFaq(newFaq);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: CmsFaq) => {
    setEditingFaq({ ...f });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question.trim()) return;

    await saveFaq({
      ...editingFaq,
      updatedAt: new Date().toISOString(),
    });

    setIsModalOpen(false);
    setToastMessage(`Saved FAQ question!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = async (id: string, q: string) => {
    if (confirm(`Delete FAQ: "${q}"?`)) {
      await deleteFaq(id);
      setToastMessage('Deleted FAQ item');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Knowledge Base &amp; Answers
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            FAQ Management ({faqs.length})
          </h2>
          <p className="text-xs text-slate-400">
            Add unlimited questions, organize categories, and publish accordion answers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions or answers..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filtered.map((faq, index) => (
          <div
            key={faq.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-orange-400 font-bold">{index + 1}.</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  {faq.category}
                </span>
                <span className="text-sm font-bold text-white">{faq.question}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    faq.isPublished ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-amber-950/80 text-amber-400'
                  }`}
                >
                  {faq.isPublished ? 'Published' : 'Draft'}
                </span>
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-1 hover:bg-slate-800 rounded text-sky-400"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id, faq.question)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 pl-6 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingFaq && (
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
              <h3 className="text-base font-bold text-white">Edit FAQ</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  placeholder="e.g. Air Conditioning, Maintenance, Commercial"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faqPublish"
                  checked={editingFaq.isPublished}
                  onChange={(e) => setEditingFaq({ ...editingFaq, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="faqPublish" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Publish to public website accordion
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
