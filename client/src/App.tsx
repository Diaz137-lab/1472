import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute, { AdminProtectedRoute } from "@/components/auth/protected-route";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Trading from "@/pages/trading";
import Portfolio from "@/pages/portfolio";
import Exchange from "@/pages/exchange";
import Explorer from "@/pages/explorer";
import Institutional from "@/pages/institutional";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-auth/admin-login";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/institutional" component={Institutional} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/wallet">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/trading">
        <ProtectedRoute>
          <Trading />
        </ProtectedRoute>
      </Route>
      <Route path="/portfolio">
        <ProtectedRoute>
          <Portfolio />
        </ProtectedRoute>
      </Route>
      <Route path="/exchange">
        <ProtectedRoute>
          <Exchange />
        </ProtectedRoute>
      </Route>
      <Route path="/admin" component={Admin} />
      <Route path="/admin-console" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;