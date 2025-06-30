import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { adminLogin } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/auth/login", data);
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      return response.json();
    },
    onSuccess: (data) => {
      adminLogin(data.admin, data.token);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin console.",
      });
      setLocation("/admin-console");
    },
    onError: () => {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md border-gray-700 bg-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-white">Admin Console</CardTitle>
          <CardDescription className="text-gray-400">
            Restricted access - Authorized personnel only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Admin Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter admin username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Authenticating..." : "Access Console"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This is a restricted area. Unauthorized access is prohibited.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}