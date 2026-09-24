"use client";

import React, { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, User, AlertCircle, KeyRound, Sparkles, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const { login, isSubmitting, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/products";

  const [username, setUsername] = useState<string>("emilys");
  const [password, setPassword] = useState<string>("emilyspass");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [localValidationErr, setLocalValidationErr] = useState<string | null>(null);

  const handleQuickFill = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setLocalValidationErr(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate requests

    if (!username.trim()) {
      setLocalValidationErr("Please enter your username.");
      return;
    }
    if (!password) {
      setLocalValidationErr("Please enter your password.");
      return;
    }

    setLocalValidationErr(null);
    const success = await login({ username: username.trim(), password });

    if (success) {
      router.push(redirectPath);
    }
  };

  return (
    <div className="max-w-md w-full relative z-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-xl shadow-cyan-500/20 mb-2">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-cyan-400 text-xl tracking-wider">
            N
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">NOVA Console</h1>
        <p className="text-xs text-slate-400">Product Operations &amp; Management Control Center</p>
      </div>

      {/* Login Card */}
      <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-5">
        {/* Quick Demo Credentials Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Required Assignment Credentials</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              emilys / emilyspass
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold transition cursor-pointer"
          >
            Fill Credentials
          </button>
        </div>

        {(localValidationErr || error) && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{localValidationErr || error?.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Username Input */}
          <div>
            <label htmlFor="username-input" className="block font-semibold text-slate-300 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (localValidationErr) setLocalValidationErr(null);
                  if (error) clearError();
                }}
                disabled={isSubmitting}
                placeholder="Enter username (e.g. emilys)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                required
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div>
            <label htmlFor="password-input" className="block font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (localValidationErr) setLocalValidationErr(null);
                  if (error) clearError();
                }}
                disabled={isSubmitting}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Console</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          Protected Admin Route · Supports DummyJSON &amp; Supabase Auth
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <Suspense
        fallback={
          <div className="text-slate-400 text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
