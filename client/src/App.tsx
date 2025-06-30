import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Trading from "@/pages/trading";
import Portfolio from "@/pages/portfolio";
import Exchange from "@/pages/exchange";
import Explorer from "@/pages/explorer";
import Institutional from "@/pages/institutional";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-auth/admin-login";
import AdminConsole from "@/pages/admin-console";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/trading" component={Trading} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/exchange" component={Exchange} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/institutional" component={Institutional} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-console" component={AdminConsole} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;