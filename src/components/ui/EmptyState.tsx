import React from "react";
import { PackageSearch, RefreshCw, FilterX, AlertOctagon } from "lucide-react";
import { AppError } from "@/types/product";

interface EmptyStateProps {
  type?: "empty" | "error";
  error?: AppError | null;
  onResetFilters?: () => void;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "empty",
  error,
  onResetFilters,
  onRetry,
}) => {
  if (type === "error") {
    return (
      <div className="p-12 text-center rounded-2xl bg-rose-950/20 border border-rose-900/30 flex flex-col items-center justify-center gap-4 max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertOctagon className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-rose-200">Unable to Load Products</h3>
          <p className="text-xs text-rose-300/80 mt-1 max-w-md">
            {error?.message || "An error occurred while fetching product data from the server."}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center gap-4 max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
        <PackageSearch className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-100">No Products Found</h3>
        <p className="text-xs text-slate-400 mt-1">
          No matching products were found for your current search or filter criteria.
        </p>
      </div>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition active:scale-95 cursor-pointer"
        >
          <FilterX className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );
};
