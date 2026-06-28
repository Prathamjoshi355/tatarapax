import React, { useState } from 'react';
import { GlobalSettings } from '../../types';
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PasswordGatewayProps {
  settings: GlobalSettings;
  gatewayType: 'visual' | 'admin';
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PasswordGateway({ settings, gatewayType, onSuccess, onCancel }: PasswordGatewayProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetPassword = settings.adminPassword || 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate subtle secure validation delay
    setTimeout(() => {
      if (password === targetPassword) {
        onSuccess();
      } else {
        setError('Incorrect administrator password. Please try again.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  const titleText = gatewayType === 'admin' ? 'Admin Dashboard Security Gate' : 'Visual Builder Security Gate';
  const descText = gatewayType === 'admin' 
    ? 'A password is required to access the lead management, course database, and settings panel.' 
    : 'A password is required to access the visual front-end content editor.';
  const btnText = gatewayType === 'admin' ? 'Unlock Admin Dashboard' : 'Unlock Visual Editor';

  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-slate-900 px-4 py-16 text-white font-sans">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col gap-6 text-left">
        
        {/* Decorative background ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-14 w-14 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center shadow-inner">
            <Lock className="h-7 w-7" />
          </div>
          
          <div className="flex flex-col gap-1">
            <h2 className="font-display font-extrabold text-xl tracking-tight text-white uppercase">
              {titleText}
            </h2>
            <p className="text-slate-400 text-xs px-4">
              {descText}
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-700/60" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Access Key / Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password..."
                className={`w-full pl-10 pr-10 py-3 bg-slate-950 border rounded-xl text-sm font-mono text-white transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
                  error ? 'border-rose-500' : 'border-slate-700 focus:border-rose-500'
                }`}
                disabled={isSubmitting}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-rose-400 text-xs bg-rose-950/40 border border-rose-900/40 p-3 rounded-xl animate-shake">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-2">
            <button
              id="admin-unlock-btn"
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>{isSubmitting ? 'Authenticating...' : btnText}</span>
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors text-xs"
            >
              Cancel & Return to Public Site
            </button>
          </div>
        </form>

        <div className="h-px bg-slate-700/60" />

        <div className="flex flex-col gap-1.5 p-4 bg-slate-950/40 border border-slate-700/40 rounded-2xl text-center text-[11px] text-slate-400">
          <span className="font-semibold text-amber-400 uppercase tracking-wider text-[9px]">Demo Mode Hint</span>
          <span>
            The default credential is: <code className="bg-slate-800 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold text-xs select-all">admin123</code>
          </span>
          <span className="text-[10px] text-slate-500">
            You can modify this password inside the Global branding settings in the Admin Dashboard at any time.
          </span>
        </div>
      </div>
    </div>
  );
}
