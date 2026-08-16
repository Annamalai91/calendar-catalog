"use client";

import React from "react";
import { Lock, AlertTriangle, Loader2 } from "lucide-react";

interface AdminLoginProps {
  password: string;
  setPassword: (val: string) => void;
  authError: string;
  isLoggingIn: boolean;
  onLogin: (e: React.FormEvent) => void;
}

export default function AdminLogin({
  password,
  setPassword,
  authError,
  isLoggingIn,
  onLogin,
}: AdminLoginProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F7FBF9] dark:bg-[#0A0A0C] px-4 overflow-hidden transition-colors">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#2AA8BE]/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/60 dark:border-white/10 bg-white dark:bg-[#121215] p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1A1A1A] dark:text-slate-100 sm:text-3xl">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your password to unlock catalogue configurations
          </p>
        </div>

        <form onSubmit={onLogin} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Secret Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-3.5 text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {authError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/60 p-4 text-sm text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/50">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p>{authError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="relative w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Unlocking...</span>
              </>
            ) : (
              <span>Unlock Control Panel</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
