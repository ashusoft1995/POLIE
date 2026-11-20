"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Check role permissions
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard
        const dashboardMap: Record<string, string> = {
          POLICE_HEAD: "/police-head",
          DETECTIVE: "/detective",
          TRAFFIC: "/traffic",
          HR: "/hr",
          SYSTEM_ADMIN: "/admin",
          PREVENTIVE: "/preventive",
        };
        router.push(dashboardMap[user.role] || "/citizen");
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Role not allowed - show nothing (will redirect)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Authenticated and authorized - show content
  return <>{children}</>;
}
