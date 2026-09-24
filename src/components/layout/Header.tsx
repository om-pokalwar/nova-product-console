"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMutationStore } from "@/context/MutationContext";
import { LogOut, RotateCcw, User, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { clearMutations, mutations } = useMutationStore();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const hasMutations =
    mutations.addedProducts.length > 0 ||
    Object.keys(mutations.updatedProducts).length > 0 ||
    mutations.deletedProductIds.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-cyan-400 text-sm tracking-wider">
            N
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-slate-100 tracking-tight">NOVA</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              OPS CONSOLE
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {hasMutations && (
          <button
            onClick={() => {
              if (showConfirmReset) {
                clearMutations();
                setShowConfirmReset(false);
              } else {
                setShowConfirmReset(true);
                setTimeout(() => setShowConfirmReset(false), 4000);
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title="Reset session CRUD mutations to API defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{showConfirmReset ? "Confirm Reset?" : "Reset Session Edits"}</span>
          </button>
        )}

        {user && (
          <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 rounded-full pl-1.5 pr-3 py-1 text-xs">
            {user.image ? (
              <img
                src={user.image}
                alt={user.username}
                className="w-6 h-6 rounded-full object-cover bg-slate-800 border border-slate-700"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-semibold">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="font-medium text-slate-200 hidden sm:inline">{user.username}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        )}

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition active:scale-95 cursor-pointer"
          title="Sign out of NOVA Console"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
