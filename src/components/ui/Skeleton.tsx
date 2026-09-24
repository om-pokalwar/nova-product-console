import React from "react";

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 gap-4"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-slate-800 shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-3 bg-slate-800/60 rounded w-1/4" />
            </div>
          </div>
          <div className="h-4 bg-slate-800 rounded w-20 hidden md:block" />
          <div className="h-4 bg-slate-800 rounded w-16 hidden md:block" />
          <div className="h-6 bg-slate-800 rounded-full w-24 hidden md:block" />
          <div className="h-8 bg-slate-800 rounded-lg w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-4"
        >
          <div className="w-full h-40 bg-slate-800 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded w-1/2" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-slate-800 rounded w-20" />
            <div className="h-6 bg-slate-800 rounded-full w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="space-y-4">
        <div className="w-full h-80 bg-slate-800 rounded-2xl" />
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-slate-800 rounded-xl" />
          <div className="w-20 h-20 bg-slate-800 rounded-xl" />
          <div className="w-20 h-20 bg-slate-800 rounded-xl" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
          <div className="h-4 bg-slate-800 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};
