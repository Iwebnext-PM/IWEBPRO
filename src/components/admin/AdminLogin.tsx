import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth, CONFIGURED_ADMIN_CREDENTIALS } from '../../firebase/authContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export default function AdminLogin({ onSuccess, onBackToSite }: AdminLoginProps) {
  const { signInWithGoogle, signInWithEmail, sendPasswordReset, loginAsDemoAdmin, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState(CONFIGURED_ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(CONFIGURED_ADMIN_CREDENTIALS.password);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      onSuccess();
    } catch {
      // Error handled in auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch {
      // Error handled in auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Please enter your email to receive password reset instructions.');
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setResetSent(true);
    } catch {
      // Error handled in auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSignIn = async () => {
    setEmail(CONFIGURED_ADMIN_CREDENTIALS.email);
    setPassword(CONFIGURED_ADMIN_CREDENTIALS.password);
    setIsSubmitting(true);
    try {
      await signInWithEmail(CONFIGURED_ADMIN_CREDENTIALS.email, CONFIGURED_ADMIN_CREDENTIALS.password);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-orange-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
            I
          </div>
          <div className="text-left">
            <span className="text-2xl font-extrabold text-white tracking-tight block">
              Iwebpro Admin
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Content Management System
            </span>
          </div>
        </div>

        <h2 className="mt-6 text-center text-xl font-bold tracking-tight text-white">
          Sign in to Website Administrator Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Control website content, services, pages, media, and leads.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800 space-y-6">
          {/* Active Admin Credentials Card */}
          <div className="p-3.5 bg-orange-950/40 border border-orange-500/40 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-orange-400" />
                <span>Admin Login Credentials</span>
              </span>
              <span className="text-[10px] text-orange-300 font-mono bg-orange-900/60 px-2 py-0.5 rounded border border-orange-700/50">
                Authorized Access
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
              <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">
                  Admin ID / Email
                </span>
                <span className="text-white font-bold select-all break-all">
                  {CONFIGURED_ADMIN_CREDENTIALS.email}
                </span>
              </div>
              <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">
                  Password
                </span>
                <span className="text-white font-bold select-all">
                  {CONFIGURED_ADMIN_CREDENTIALS.password}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickSignIn}
              disabled={isSubmitting}
              className="w-full mt-1 py-2 px-3 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 hover:text-white border border-orange-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Auto-Fill &amp; Enter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {resetSent && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Password reset instructions have been sent to your email.</span>
            </div>
          )}

          {showForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@iwebpro.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="text202@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-orange-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="2026"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Sign In with Password</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900 px-3 text-slate-500 uppercase font-bold text-[10px]">
                    Or Authenticate via
                  </span>
                </div>
              </div>

              {/* Google Sign-in */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onBackToSite}
              className="hover:text-white transition-colors cursor-pointer"
            >
              &larr; Back to Public Website
            </button>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SSL / Firebase Protected</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
