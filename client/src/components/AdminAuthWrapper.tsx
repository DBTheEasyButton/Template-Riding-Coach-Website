import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface AdminSession {
  authenticated: boolean;
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

interface AdminAuthWrapperProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export function useAdminAuth() {
  const { data, isLoading, refetch } = useQuery<AdminSession>({
    queryKey: ['/api/admin/session'],
    staleTime: 30000,
    retry: false,
  });

  return {
    isAuthenticated: data?.authenticated || false,
    user: data?.user,
    isLoading,
    isSuperAdmin: data?.user?.role === 'super_admin',
    refetch
  };
}

export default function AdminAuthWrapper({ children, requireSuperAdmin = false }: AdminAuthWrapperProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isSuperAdmin, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation("/admin/login");
      } else if (requireSuperAdmin && !isSuperAdmin) {
        setLocation("/admin/clinics");
      }
    }
  }, [isAuthenticated, isSuperAdmin, isLoading, requireSuperAdmin, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}
