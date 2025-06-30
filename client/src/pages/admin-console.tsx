import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Shield,
  LogOut,
  Settings,
  UserPlus,
  Wallet,
  Activity,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User, AdminBalanceAction } from "@shared/schema";

export default function AdminConsole() {
  const [selectedUser, setSelectedUser] = useState("");
  const [balanceAction, setBalanceAction] = useState({
    action: "credit",
    amount: "",
    reason: "",
    currency: "USD"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [adminUser, setAdminUser] = useState<any>(null);

  // Check admin authentication
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const admin = localStorage.getItem("admin_user");

    if (!token || !admin) {
      setLocation("/admin-login");
      return;
    }

    try {
      setAdminUser(JSON.parse(admin));
    } catch {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
    setLocation("/admin-login");
  };

  // Add authorization header to requests
  const authorizedApiRequest = async (method: string, url: string, data?: any) => {
    const token = localStorage.getItem("admin_token");
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setLocation("/admin-login");
      throw new Error("Unauthorized");
    }

    return response;
  };

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await authorizedApiRequest("GET", "/api/admin/users");
      return response.json();
    },
    enabled: !!adminUser,
  });

  const { data: balanceActions = [], isLoading: actionsLoading } = useQuery<AdminBalanceAction[]>({
    queryKey: ["/api/admin/balance-actions"],
    queryFn: async () => {
      const response = await authorizedApiRequest("GET", "/api/admin/balance-actions");
      return response.json();
    },
    enabled: !!adminUser,
  });

  const balanceActionMutation = useMutation({
    mutationFn: async (data: {
      userId: number;
      adminId: number;
      action: string;
      amount: string;
      currency: string;
      reason: string;
    }) => {
      const response = await authorizedApiRequest("POST", "/api/admin/balance-action", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Balance Updated",
        description: "User balance has been successfully updated.",
      });
      setBalanceAction({
        action: "credit",
        amount: "",
        reason: "",
        currency: "USD"
      });
      setSelectedUser("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/balance-actions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({
        title: "Action Failed",
        description: "Failed to update user balance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBalanceAction = () => {
    if (!selectedUser || !balanceAction.amount || !balanceAction.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    balanceActionMutation.mutate({
      userId: parseInt(selectedUser),
      adminId: adminUser?.id || 1,
      action: balanceAction.action,
      amount: balanceAction.amount,
      currency: balanceAction.currency,
      reason: balanceAction.reason,
    });
  };

  if (!adminUser) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const totalUsers = users.length;
  const totalCredits = balanceActions.filter(action => action.action === "credit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  const totalDebits = balanceActions.filter(action => action.action === "debit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Admin Console</h1>
                <p className="text-sm text-gray-400">Restricted Access Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white">Welcome, {adminUser.username}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-200 text-sm">
              You are accessing the administrative console. All actions are logged and monitored.
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-gray-400">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Credits</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${totalCredits.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Money added to accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Debits</CardTitle>
              <TrendingDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">${totalDebits.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Money removed from accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Net Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${(totalCredits - totalDebits).toLocaleString()}</div>
              <p className="text-xs text-gray-400">Total platform balance</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 text-gray-300">User Management</TabsTrigger>
            <TabsTrigger value="balance" className="data-[state=active]:bg-gray-700 text-gray-300">Balance Actions</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-700 text-gray-300">Action History</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <UserPlus className="mr-2" />
                  User Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-gray-300">{user.email}</p>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={user.isVerified ? "default" : "secondary"}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                          <Badge variant={user.isAdmin ? "destructive" : "outline"}>
                            {user.isAdmin ? "Admin" : "User"}
                          </Badge>
                          <span className="text-sm text-gray-400">ID: {user.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Wallet className="mr-2" />
                  Manage User Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user" className="text-gray-300">Select User</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Choose a user" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()} className="text-white hover:bg-gray-600">
                              {user.firstName} {user.lastName} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="action" className="text-gray-300">Action Type</Label>
                      <Select value={balanceAction.action} onValueChange={(value) => 
                        setBalanceAction(prev => ({ ...prev, action: value }))
                      }>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="credit" className="text-white hover:bg-gray-600">Credit (Add Money)</SelectItem>
                          <SelectItem value="debit" className="text-white hover:bg-gray-600">Debit (Remove Money)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={balanceAction.amount}
                        onChange={(e) => setBalanceAction(prev => ({ ...prev, amount: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-gray-300">Currency</Label>
                      <Select value={balanceAction.currency} onValueChange={(value) => 
                        setBalanceAction(prev => ({ ...prev, currency: value }))
                      }>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="USD" className="text-white hover:bg-gray-600">USD ($)</SelectItem>
                          <SelectItem value="EUR" className="text-white hover:bg-gray-600">EUR (€)</SelectItem>
                          <SelectItem value="GBP" className="text-white hover:bg-gray-600">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-gray-300">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Explain the reason for this balance adjustment..."
                        value={balanceAction.reason}
                        onChange={(e) => setBalanceAction(prev => ({ ...prev, reason: e.target.value }))}
                        rows={4}
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleBalanceAction}
                    disabled={balanceActionMutation.isPending}
                    className={`px-8 py-3 ${
                      balanceAction.action === "credit" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {balanceActionMutation.isPending ? "Processing..." : 
                     balanceAction.action === "credit" ? "Add Money" : "Remove Money"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Activity className="mr-2" />
                  Balance Action History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {actionsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {balanceActions.map((action) => {
                      const user = users.find(u => u.id === action.userId);
                      return (
                        <div key={action.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              action.action === "credit" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                            }`}>
                              {action.action.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {user ? `${user.firstName} ${user.lastName}` : `User ID: ${action.userId}`}
                              </p>
                              <p className="text-sm text-gray-300">{action.reason}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(action.createdAt!).toLocaleDateString()} at{" "}
                                {new Date(action.createdAt!).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              action.action === "credit" ? "text-green-400" : "text-red-400"
                            }`}>
                              {action.action === "credit" ? "+" : "-"}${parseFloat(action.amount).toLocaleString()} {action.currency}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}