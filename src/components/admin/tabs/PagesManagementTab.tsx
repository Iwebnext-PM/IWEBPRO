import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Copy, Eye, CheckCircle2, Globe } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { CmsPage } from '../../../types/cms';

export default function PagesManagementTab() {
  const { pages, savePage, deletePage } = useCms();
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddPage = () => {
    const newPage: CmsPage = {
      id: 'page-' + Date.now(),
      title: 'New Page',
      slug: 'new-page',
      metaTitle: 'New Page | Iwebpro HVAC',
      metaDescription: 'Custom page for Iwebpro HVAC services.',
      isPublished: true,
      sections: [
        {
          id: 'sec-1',
          type: 'hero',
          title: 'Custom Page Heading',
          content: 'Add your introductory text or paragraphs here.',
        },
      ],
      order: pages.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingPage(newPage);
    setIsModalOpen(true);
  };

  const handleDuplicatePage = async (page: CmsPage) => {
    const copy: CmsPage = {
      ...page,
      id: 'page-' + Date.now(),
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await savePage(copy);
    setToastMessage(`Duplicated page "${page.title}"`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeletePage = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the page "${title}"?`)) {
      await deletePage(id);
      setToastMessage(`Deleted page "${title}"`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    await savePage({
      ...editingPage,
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(false);
    setToastMessage(`Saved page "${editingPage.title}" to Cloud Firestore!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Structure &amp; Hierarchy
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Website Pages Management
          </h2>
          <p className="text-xs text-slate-400">
            Build, edit, duplicate, and publish website landing pages and custom sections.
          </p>
        </div>

        <button
          onClick={handleAddPage}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pages List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
            <tr>
              <th className="py-3.5 px-4">Page Title</th>
              <th className="py-3.5 px-3">URL Slug</th>
              <th className="py-3.5 px-3">Sections</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {/* System Homepage row */}
            <tr className="bg-slate-950/40">
              <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-400" />
                <span>Homepage (Main Root)</span>
              </td>
              <td className="py-3.5 px-3 font-mono text-slate-400">/</td>
              <td className="py-3.5 px-3 text-slate-400">8 Sections</td>
              <td className="py-3.5 px-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  Published
                </span>
              </td>
              <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                Managed via Homepage Tab
              </td>
            </tr>

            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-slate-850/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  {p.title}
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-400">
                  /{p.slug}
                </td>
                <td className="py-3.5 px-3 text-slate-300">
                  {p.sections?.length || 1} Blocks
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      p.isPublished
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPage({ ...p });
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-slate-800 rounded text-sky-400"
                      title="Edit Page"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicatePage(p)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                      title="Duplicate Page"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePage(p.id, p.title)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400"
                      title="Delete Page"
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

      {/* Page Modal Editor */}
      {isModalOpen && editingPage && (
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
              <h3 className="text-base font-bold text-white">Edit Page: {editingPage.title}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">SEO Meta Title</label>
                <input
                  type="text"
                  value={editingPage.metaTitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={editingPage.metaDescription || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              {/* Sections Editor */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Content Sections</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...(editingPage.sections || [])];
                      next.push({ id: 'sec-' + Date.now(), type: 'text', title: 'New Section', content: 'Enter paragraph text...' });
                      setEditingPage({ ...editingPage, sections: next });
                    }}
                    className="text-xs font-bold text-orange-400 hover:underline"
                  >
                    + Add Section Block
                  </button>
                </div>

                {(editingPage.sections || []).map((sec, idx) => (
                  <div key={sec.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">Block #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = editingPage.sections.filter((_, i) => i !== idx);
                          setEditingPage({ ...editingPage, sections: next });
                        }}
                        className="text-slate-500 hover:text-rose-400 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={sec.title || ''}
                      onChange={(e) => {
                        const next = [...editingPage.sections];
                        next[idx].title = e.target.value;
                        setEditingPage({ ...editingPage, sections: next });
                      }}
                      placeholder="Section Heading"
                      className="w-full px-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white font-bold"
                    />
                    <textarea
                      rows={2}
                      value={sec.content || ''}
                      onChange={(e) => {
                        const next = [...editingPage.sections];
                        next[idx].content = e.target.value;
                        setEditingPage({ ...editingPage, sections: next });
                      }}
                      placeholder="Content text..."
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pagePublish"
                  checked={editingPage.isPublished}
                  onChange={(e) => setEditingPage({ ...editingPage, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <label htmlFor="pagePublish" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Publish page immediately
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
