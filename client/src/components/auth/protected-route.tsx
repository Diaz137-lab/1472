
import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  if (requireAdmin && !isAdmin) {
    setLocation('/admin-login');
    return null;
  }

  if (!requireAdmin && !isAuthenticated) {
    setLocation('/auth/login');
    return null;
  }

  return <>{children}</>;
}
