import React, { useState } from 'react';
import { Settings, Database, Download, RotateCcw, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';
import firebaseConfig from '../../../../firebase-applet-config.json';
import { testConnection } from '../../../firebase/config';

export default function SettingsTab() {
  const {
    siteSettings,
    homepageConfig,
    services,
    serviceAreas,
    testimonials,
    faqs,
    navigation,
    refreshAllData,
  } = useCms();

  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('connected');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setDbStatus('checking');
    const ok = await testConnection();
    setDbStatus(ok ? 'connected' : 'error');
    setToastMessage(ok ? 'Database connection verified with Cloud Firestore.' : 'Connection check failed.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleExportFullBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      siteSettings,
      homepageConfig,
      services,
      serviceAreas,
      testimonials,
      faqs,
      navigation,
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iwebpro_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            System Infrastructure &amp; Maintenance
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            System Settings &amp; Backups
          </h2>
          <p className="text-xs text-slate-400">
            Monitor Cloud Firestore status, perform full site backups, and verify database security.
          </p>
        </div>

        <button
          onClick={handleExportFullBackup}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Complete CMS JSON Backup</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Backend Infrastructure Overview */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-400" />
          <span>Cloud Firestore &amp; Firebase Backend Architecture</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Google Cloud Project ID:</span>
            <div className="font-mono text-white text-sm font-bold">{firebaseConfig.projectId}</div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Firestore Database ID:</span>
            <div className="font-mono text-white text-sm font-bold truncate">{firebaseConfig.firestoreDatabaseId}</div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white">Database Health &amp; Security Rules</span>
            <p className="text-[11px] text-slate-400">
              ABAC rules active with attribute validation on all lead mutations and admin gates.
            </p>
          </div>
          <button
            type="button"
            onClick={handleTestConnection}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
            <span>Verify Live Ping</span>
          </button>
        </div>
      </div>

      {/* Cache & Sync Controls */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
          <Settings className="w-4 h-4 text-orange-400" />
          <span>Content Sync &amp; Reload Controls</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white">Force Synchronize CMS State</span>
            <p className="text-[11px] text-slate-400">
              Re-queries all Firestore collections and refreshes live listeners.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await refreshAllData();
              setToastMessage('CMS data re-synchronized successfully.');
              setTimeout(() => setToastMessage(null), 2500);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 cursor-pointer"
          >
            Force Sync All Collections
          </button>
        </div>
      </div>
    </div>
  );
}
