import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute, { AdminProtectedRoute } from "@/components/auth/protected-route";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import SmartWallet from "@/pages/smart-wallet";
import Trading from "@/pages/trading";
import Portfolio from "@/pages/portfolio";
import Exchange from "@/pages/exchange";
import Explorer from "@/pages/explorer";
import Institutional from "@/pages/institutional";
import P2P from "@/pages/p2p";
import TransactionHistory from "@/pages/transaction-history";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-auth/admin-login";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import About from "@/pages/about";
import Careers from "@/pages/careers";
import Press from "@/pages/press";
import Blog from "@/pages/blog";
import Help from "@/pages/help";
import Contact from "@/pages/contact";
import Status from "@/pages/status";
import Security from "@/pages/security";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/institutional" component={Institutional} />
      <Route path="/p2p" component={P2P} />
      <Route path="/transaction-history" component={TransactionHistory} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/wallet" component={SmartWallet} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/trading" component={Trading} />
      <Route path="/portfolio">
        <ProtectedRoute>
          <Portfolio />
        </ProtectedRoute>
      </Route>
      <Route path="/exchange" component={Exchange} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-console" component={Admin} />
      <Route path="/about" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/press" component={Press} />
      <Route path="/blog" component={Blog} />
      <Route path="/help" component={Help} />
      <Route path="/contact" component={Contact} />
      <Route path="/status" component={Status} />
      <Route path="/security" component={Security} />
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