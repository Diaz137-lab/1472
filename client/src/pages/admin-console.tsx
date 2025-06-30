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
    currency: "USD",
    code1: "",
    code2: "",
    code3: ""
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

  // Fetch portfolios for all users to get their balances
  const { data: portfolios = [] } = useQuery({
    queryKey: ["/api/portfolios"],
    queryFn: async () => {
      const portfolioPromises = users.map(async (user) => {
        try {
          const response = await fetch(`/api/portfolio/${user.id}`);
          if (response.ok) {
            const portfolio = await response.json();
            return { userId: user.id, ...portfolio };
          }
          return { userId: user.id, totalBalance: "0.00", totalValue: "0.00" };
        } catch {
          return { userId: user.id, totalBalance: "0.00", totalValue: "0.00" };
        }
      });
      return Promise.all(portfolioPromises);
    },
    enabled: users.length > 0,
  });

  const balanceActionMutation = useMutation({
    mutationFn: async (data: {
      userId: number;
      adminId: number;
      action: string;
      amount: string;
      currency: string;
      reason: string;
      code1: string;
      code2: string;
      code3: string;
    }) => {
      const response = await authorizedApiRequest("POST", "/api/admin/balance-action", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/balance-actions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setBalanceAction({
        action: "credit",
        amount: "",
        reason: "",
        currency: "USD",
        code1: "",
        code2: "",
        code3: ""
      });
      setSelectedUser("");
      toast({
        title: "Balance Updated",
        description: `Successfully ${balanceAction.action}ed ${balanceAction.amount} ${balanceAction.currency}.`,
      });
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

    if (balanceAction.code1.length !== 6 || balanceAction.code2.length !== 6 || balanceAction.code3.length !== 6) {
      toast({
        title: "Security Codes Required",
        description: "All three 6-digit security codes are required to authorize fund transfers.",
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
      code1: balanceAction.code1,
      code2: balanceAction.code2,
      code3: balanceAction.code3,
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
  const systemInit = balanceActions.filter(action => action.action === "system_init")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  
  // Calculate total system balance: initial system funds + credits - debits
  const totalSystemBalance = systemInit + totalCredits - totalDebits;

  // Helper function to get user portfolio balance
  const getUserBalance = (userId: number) => {
    const userPortfolio = portfolios.find(p => p.userId === userId);
    return userPortfolio ? parseFloat(userPortfolio.totalBalance || "0") : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 shadow-lg">
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
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-blue-200">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Balance</CardTitle>
              <DollarSign className="h-5 w-5 text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalSystemBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-green-200">System-wide balance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Recent Actions</CardTitle>
              <Activity className="h-5 w-5 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{balanceActions.length}</div>
              <p className="text-xs text-purple-200">Balance modifications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">System Status</CardTitle>
              <Settings className="h-5 w-5 text-emerald-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">Online</div>
              <p className="text-xs text-emerald-200">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 shadow-lg rounded-lg">
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-gray-300 font-medium transition-all duration-200">User Management</TabsTrigger>
            <TabsTrigger value="balance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white text-gray-300 font-medium transition-all duration-200">Balance Actions</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-gray-300 font-medium transition-all duration-200">Action History</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-t-lg">
                <CardTitle className="flex items-center text-white text-xl">
                  <UserPlus className="mr-3 h-6 w-6 text-blue-300" />
                  User Management
                </CardTitle>
                <p className="text-blue-200 text-sm mt-2">Manage user accounts and view individual balances</p>
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
                    {users.map((user) => {
                      const userBalance = getUserBalance(user.id);
                      return (
                        <div key={user.id} className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-6 border border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-400">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-lg">{user.firstName} {user.lastName}</h3>
                                <p className="text-sm text-blue-300">{user.email}</p>
                                <p className="text-xs text-gray-400">@{user.username} • ID: {user.id}</p>
                                {user.firstName === "Kelly Ann" && user.lastName === "James" && (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-xs text-yellow-300 bg-yellow-900/30 px-2 py-1 rounded-md">
                                      Address: 58 Benjamina Drive, Red Bank Plains, QLD, Australia
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Balance</p>
                                <p className="text-xl font-bold text-green-400">
                                  ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                  {user.isVerified ? "Verified" : "Unverified"}
                                </Badge>
                                <Badge variant={user.isAdmin ? "destructive" : "outline"} className="text-xs">
                                  {user.isAdmin ? "Admin" : "User"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                      <p className="text-xs text-green-400">Admin limit: Up to $10,000,000.00 per transaction</p>
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
                      <Label className="text-gray-300 flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Codes (Required)
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="code1" className="text-xs text-gray-400">First Code</Label>
                          <Input
                            id="code1"
                            type="text"
                            maxLength={6}
                            placeholder="6 digits"
                            value={balanceAction.code1}
                            onChange={(e) => setBalanceAction(prev => ({ ...prev, code1: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-center font-mono"
                          />
                        </div>
                        <div>
                          <Label htmlFor="code2" className="text-xs text-gray-400">Second Code</Label>
                          <Input
                            id="code2"
                            type="text"
                            maxLength={6}
                            placeholder="6 digits"
                            value={balanceAction.code2}
                            onChange={(e) => setBalanceAction(prev => ({ ...prev, code2: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-center font-mono"
                          />
                        </div>
                        <div>
                          <Label htmlFor="code3" className="text-xs text-gray-400">Third Code</Label>
                          <Input
                            id="code3"
                            type="text"
                            maxLength={6}
                            placeholder="6 digits"
                            value={balanceAction.code3}
                            onChange={(e) => setBalanceAction(prev => ({ ...prev, code3: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-center font-mono"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-yellow-400 flex items-center mt-2">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        All three 6-digit codes are required to authorize fund transfers
                      </p>
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
                    disabled={
                      balanceActionMutation.isPending || 
                      !selectedUser || 
                      !balanceAction.amount || 
                      balanceAction.code1.length !== 6 ||
                      balanceAction.code2.length !== 6 ||
                      balanceAction.code3.length !== 6
                    }
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