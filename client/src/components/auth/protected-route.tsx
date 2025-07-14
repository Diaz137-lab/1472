import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function AdminProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/admin");
    }
  }, [isAdmin, setLocation]);

  if (!isAdmin) {
    return <div>Redirecting to admin login...</div>;
  }

  return <>{children}</>;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Small delay to allow auth state to settle
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setLocation("/auth/login");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}