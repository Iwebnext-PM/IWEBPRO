import React, { useState } from 'react';
import { Upload, Search, Trash2, Copy, Check, Image as ImageIcon, AlertTriangle, FileCode } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import { MediaItem } from '../../../types/cms';
import { normalizeImageUrl, handleImageError } from '../../../utils/imageUtils';

export default function MediaLibraryTab() {
  const { media, addMediaItem, deleteMediaItem, services, homepageConfig } = useCms();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filtered = media.filter((m) =>
    m.fileName.toLowerCase().includes(search.toLowerCase()) || (m.folder && m.folder.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const newItem: MediaItem = {
        id: 'med-' + Date.now(),
        fileName: file.name.replace(/[^a-zA-Z0-9._-]/g, '_'),
        fileUrl: dataUrl,
        fileType: file.type,
        fileSize: file.size,
        dimensions: '1920x1080',
        folder: 'uploads',
        uploadedAt: new Date().toISOString(),
      };
      await addMediaItem(newItem);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (item: MediaItem) => {
    // Check if image is used in services or hero
    const isUsedInHero = homepageConfig.heroBgImage === item.fileUrl;
    const isUsedInService = services.some((s) => s.imageSrc === item.fileUrl);

    if (isUsedInHero || isUsedInService) {
      alert(`Warning: This asset is currently active on the live website (in Hero or a Service card). Please replace it on the page before deleting.`);
      return;
    }

    if (confirm(`Are you sure you want to delete ${item.fileName}?`)) {
      await deleteMediaItem(item.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Digital Asset Management
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Media Library ({media.length})
          </h2>
          <p className="text-xs text-slate-400">
            Upload, replace, and organize high-resolution HVAC equipment and technician photography.
          </p>
        </div>

        <label className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Processing File...' : 'Upload Image / Asset'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media by filename or folder..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="relative h-40 bg-slate-950 overflow-hidden flex items-center justify-center">
              <img
                src={normalizeImageUrl(item.fileUrl)}
                alt={item.fileName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 justify-between">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.fileUrl, item.id)}
                  className="px-2 py-1 bg-slate-900/90 text-white text-[11px] font-semibold rounded flex items-center gap-1"
                >
                  {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="p-1 bg-slate-900/90 hover:bg-rose-900 text-rose-400 hover:text-white rounded"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-1">
              <div className="font-bold text-xs text-white truncate" title={item.fileName}>
                {item.fileName}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{(item.fileSize / 1024).toFixed(0)} KB</span>
                <span>{item.dimensions || '1920x1080'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
