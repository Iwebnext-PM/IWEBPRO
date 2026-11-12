import React, { useState } from 'react';
import { Users, Shield, Plus, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { useAuth } from '../../../firebase/authContext';
import { AdminUser } from '../../../types/cms';

export default function UserManagementTab() {
  const { user } = useAuth();
  const [adminList, setAdminList] = useState<AdminUser[]>([
    {
      uid: user?.email === 'text202@gmail.com' ? user.uid : 'admin-text202',
      email: 'text202@gmail.com',
      role: 'super_admin',
      displayName: 'Iwebpro Administrator',
      createdAt: '2026-11-11T12:00:00Z',
      lastLogin: new Date().toISOString(),
    },
    {
      uid: 'admin-root',
      email: 'rituparno.tnts@gmail.com',
      role: 'super_admin',
      displayName: 'System Developer / Super Admin',
      createdAt: '2026-11-01T10:00:00Z',
      lastLogin: new Date().toISOString(),
    },
    {
      uid: 'admin-dispatch',
      email: 'iwebnext.com@gmail.com',
      role: 'editor',
      displayName: 'HVAC Dispatch Coordinator',
      createdAt: '2026-11-01T10:00:00Z',
      lastLogin: '2026-11-10T14:30:00Z',
    },
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'super_admin' | 'editor' | 'viewer'>('editor');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const newAdmin: AdminUser = {
      uid: 'admin-' + Date.now(),
      email: newEmail.trim(),
      role: newRole,
      displayName: newEmail.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    setAdminList([...adminList, newAdmin]);
    setShowInviteModal(false);
    setNewEmail('');
    setToastMessage(`Added administrator permission for ${newAdmin.email}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Access Control &amp; RBAC
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            User &amp; Administrator Management
          </h2>
          <p className="text-xs text-slate-400">
            Control authenticated administrator accounts authorized to modify Iwebpro website content.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Authorize Admin User</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
            <tr>
              <th className="py-3.5 px-4">Administrator</th>
              <th className="py-3.5 px-3">Role &amp; Permissions</th>
              <th className="py-3.5 px-3">Access Level</th>
              <th className="py-3.5 px-3">Created Date</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {adminList.map((admin) => (
              <tr key={admin.uid} className="hover:bg-slate-850/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white text-xs">{admin.displayName || admin.email}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{admin.email}</div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="capitalize font-semibold text-orange-400 bg-orange-950/60 border border-orange-800/80 px-2 py-0.5 rounded text-[10px]">
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-300">
                  {admin.role === 'super_admin' ? 'Full CMS & Database CRUD' : 'Content & Submissions Editor'}
                </td>
                <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Authorized</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl text-slate-100 p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Authorize Admin User</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="editor@iwebpro.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="editor">Editor (Can edit services, pages, blog, testimonials)</option>
                  <option value="super_admin">Super Administrator (Full CMS &amp; User access)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-800 text-xs rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  Authorize User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
