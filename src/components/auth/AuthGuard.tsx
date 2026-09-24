"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = pathname === "/login";

    if (!isAuthenticated && !isPublicPath) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (isAuthenticated && isPublicPath) {
      router.replace("/products");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-sm font-medium tracking-wide uppercase text-slate-400">Loading NOVA Console...</p>
      </div>
    );
  }

  const isPublicPath = pathname === "/login";
  if (!isAuthenticated && !isPublicPath) {
    return null; // Prevents flash before redirect
  }

  return <>{children}</>;
};
