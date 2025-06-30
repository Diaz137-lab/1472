
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Settings,
  UserPlus,
  Wallet,
  Activity,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import type { User, AdminBalanceAction } from "@shared/schema";

export default function Admin() {
  const [selectedUser, setSelectedUser] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [balanceAction, setBalanceAction] = useState({
    action: "credit",
    amount: "",
    reason: "",
    currency: "USD"
  });
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: ""
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, checkAdminLogin, adminLogout } = useAuth();

  // Check if user needs to authenticate as admin
  useEffect(() => {
    if (!isAdmin) {
      setShowAdminLogin(true);
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCredentials.username || !adminCredentials.password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }

    setLoginLoading(true);
    try {
      const success = await checkAdminLogin(adminCredentials.username, adminCredentials.password);
      if (success) {
        setShowAdminLogin(false);
        setAdminCredentials({ username: "", password: "" });
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin panel.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const authorizedApiRequest = async (method: string, url: string, data?: any) => {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      adminLogout();
      setShowAdminLogin(true);
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
    enabled: isAdmin,
  });

  const { data: balanceActions = [], isLoading: actionsLoading } = useQuery<AdminBalanceAction[]>({
    queryKey: ["/api/admin/balance-actions"],
    queryFn: async () => {
      const response = await authorizedApiRequest("GET", "/api/admin/balance-actions");
      return response.json();
    },
    enabled: isAdmin,
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

  // Fetch real-time Bitcoin price
  const { data: btcPrice = 0 } = useQuery({
    queryKey: ["btc-price"],
    queryFn: async () => {
      try {
        const response = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
        const data = await response.json();
        return parseFloat(data.bpi.USD.rate.replace(/[,$]/g, ""));
      } catch {
        return 108524.84; // Fallback price
      }
    },
    refetchInterval: 30000, // Update every 30 seconds
  });

  const balanceActionMutation = useMutation({
    mutationFn: async (data: {
      userId: number;
      action: "credit" | "debit";
      amount: number;
      reason: string;
      currency: string;
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
        currency: "USD"
      });
      setSelectedUser("");
      toast({
        title: "Balance Updated",
        description: `Successfully ${balanceAction.action}ed ${balanceAction.amount} ${balanceAction.currency}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update balance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBalanceAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !balanceAction.amount || !balanceAction.reason) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    balanceActionMutation.mutate({
      userId: parseInt(selectedUser),
      action: balanceAction.action as "credit" | "debit",
      amount: parseFloat(balanceAction.amount),
      reason: balanceAction.reason,
      currency: balanceAction.currency,
    });
  };

  const totalUsers = users.length;
  // Calculate total system balance from admin balance actions
  const totalCredits = balanceActions.filter(action => action.action === "credit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  const totalDebits = balanceActions.filter(action => action.action === "debit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  const systemInit = balanceActions.filter(action => action.action === "system_init")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  
  const totalBalance = systemInit + totalCredits - totalDebits;

  // Helper function to get user portfolio balance
  const getUserBalance = (userId: number) => {
    const userPortfolio = portfolios.find(p => p.userId === userId);
    return userPortfolio ? parseFloat(userPortfolio.totalBalance || "0") : 0;
  };

  // Generate wallet address for user
  const generateWalletAddress = (userId: number, symbol: string) => {
    // Kelly Ann James (ID: 1) has specific wallet addresses
    if (userId === 1) {
      const kellyWallets: Record<string, string> = {
        BTC: '35Gxhvi8difDWX1YFSbjBgCrG5SdxUGZJA',
        ETH: '0x742d35Cc6523C0532925a3b8F36F7539000f5f74',
        DOGE: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
        SOL: '7Np41oeYqM7UnTh4iNj6D3k5r3X9k3mX8w7q4J3rM3sW',
        ADA: 'addr1qx5j8k3z9f2m7n6p4q8r2s5t7u9v1w3x4y6z8a2b4c6d'
      };
      return kellyWallets[symbol] || kellyWallets.BTC;
    }
    
    // Generate addresses for other users
    const prefixes: Record<string, string> = {
      BTC: '1',
      ETH: '0x',
      DOGE: 'D',
      SOL: '',
      ADA: 'addr1',
      DOT: '1'
    };
    
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = prefixes[symbol] || '1';
    
    // Use userId as seed for consistent addresses
    const seed = userId * 12345;
    for (let i = 0; i < (symbol === 'ETH' ? 40 : 30); i++) {
      result += chars.charAt((seed + i) % chars.length);
    }
    return result;
  };

  const toggleUserDetails = (userId: number) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  // Convert USD to Bitcoin
  const convertToBitcoin = (usdAmount: number) => {
    if (!btcPrice || btcPrice === 0) return 0;
    return usdAmount / btcPrice;
  };

  // Admin Login Dialog
  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Dialog open={showAdminLogin} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-red-500" />
              </div>
              <DialogTitle className="text-center">Admin Access Required</DialogTitle>
              <DialogDescription className="text-center">
                Please enter your admin credentials to access the admin panel.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Admin Username</Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="Enter admin username"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loginLoading}
              >
                {loginLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, balances, and system operations.</p>
          </div>
          <Button
            onClick={() => {
              adminLogout();
              setShowAdminLogin(true);
            }}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Admin Logout
          </Button>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">System-wide balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Actions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balanceActions.length}</div>
              <p className="text-xs text-muted-foreground">Balance modifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="balance">Balance Actions</TabsTrigger>
            <TabsTrigger value="history">Action History</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div>Loading users...</div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => {
                      const userBalance = getUserBalance(user.id);
                      const isExpanded = expandedUserId === user.id;
                      return (
                        <div key={user.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-400">
                          {/* Main User Card - Clickable */}
                          <div 
                            className="p-6 cursor-pointer"
                            onClick={() => toggleUserDetails(user.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900 text-lg">{user.firstName} {user.lastName}</h3>
                                  <p className="text-sm text-blue-600">{user.email}</p>
                                  <p className="text-xs text-gray-500">@{user.username} • ID: {user.id}</p>
                                  {user.firstName === "Kelly Ann" && user.lastName === "James" && (
                                    <div className="mt-2 space-y-1">
                                      <p className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                                        📍 Address: 58 Benjamina Drive, Red Bank Plains, QLD, Australia
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
                                  <p className="text-xl font-bold text-green-600">
                                    ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  {userBalance > 0 && (
                                    <div className="mt-1 text-xs text-gray-600">
                                      <span className="text-orange-600 font-semibold">
                                        ₿ {convertToBitcoin(userBalance).toFixed(8)} BTC
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        @ ${btcPrice.toLocaleString()} per BTC
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                    {user.isVerified ? "Verified" : "Unverified"}
                                  </Badge>
                                  <Badge variant={user.isAdmin ? "destructive" : "outline"} className="text-xs">
                                    {user.isAdmin ? "Admin" : "User"}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  {isExpanded ? "▼ Hide Details" : "▶ View Details"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details Section */}
                          {isExpanded && (
                            <div className="border-t border-blue-200 bg-white/70 p-6 rounded-b-xl">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Wallet Addresses */}
                                <div>
                                  <h4 className="text-gray-900 font-semibold mb-3 flex items-center">
                                    <Wallet className="mr-2 h-4 w-4 text-blue-500" />
                                    Crypto Wallet Addresses
                                  </h4>
                                  <div className="space-y-3">
                                    {['BTC', 'ETH', 'DOGE', 'SOL', 'ADA'].map((symbol) => (
                                      <div key={symbol} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm font-medium text-gray-700">{symbol}</span>
                                          <button 
                                            className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(generateWalletAddress(user.id, symbol));
                                              toast({ title: "Copied!", description: `${symbol} address copied to clipboard` });
                                            }}
                                          >
                                            Copy
                                          </button>
                                        </div>
                                        <p className="text-xs text-gray-600 font-mono mt-1 break-all">
                                          {generateWalletAddress(user.id, symbol)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Account Info & Actions */}
                                <div>
                                  <h4 className="text-gray-900 font-semibold mb-3 flex items-center">
                                    <Settings className="mr-2 h-4 w-4 text-green-500" />
                                    Account Information
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                      <p className="text-sm text-gray-600">Account Status</p>
                                      <p className="text-gray-900 font-medium">
                                        {user.isVerified ? "✅ Verified" : "⏳ Pending Verification"}
                                      </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                      <p className="text-sm text-gray-600">Account Type</p>
                                      <p className="text-gray-900 font-medium">
                                        {user.isAdmin ? "🔐 Administrator" : "👤 Standard User"}
                                      </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                      <p className="text-sm text-gray-600">Current Balance</p>
                                      <p className="text-2xl font-bold text-green-600">
                                        ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </p>
                                      {userBalance > 0 && (
                                        <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                                          <p className="text-sm text-orange-800 font-semibold">
                                            ₿ {convertToBitcoin(userBalance).toFixed(8)} BTC
                                          </p>
                                          <p className="text-xs text-orange-600">
                                            Live rate: ${btcPrice.toLocaleString()} per BTC
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Updates every 30 seconds
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    {user.address && (
                                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                        <p className="text-sm text-gray-600">Physical Address</p>
                                        <p className="text-gray-900 text-sm">{user.address}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance">
            <Card>
              <CardHeader>
                <CardTitle>Balance Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBalanceAction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user">Select User</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.firstName} {user.lastName} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="action">Action</Label>
                      <Select value={balanceAction.action} onValueChange={(value) => setBalanceAction(prev => ({ ...prev, action: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit">Credit (Add funds)</SelectItem>
                          <SelectItem value="debit">Debit (Remove funds)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={balanceAction.amount}
                        onChange={(e) => setBalanceAction(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={balanceAction.currency} onValueChange={(value) => setBalanceAction(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter reason for balance adjustment..."
                      value={balanceAction.reason}
                      onChange={(e) => setBalanceAction(prev => ({ ...prev, reason: e.target.value }))}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={balanceActionMutation.isPending}
                  >
                    {balanceActionMutation.isPending ? "Processing..." : "Execute Action"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Action History</CardTitle>
              </CardHeader>
              <CardContent>
                {actionsLoading ? (
                  <div>Loading history...</div>
                ) : (
                  <div className="space-y-4">
                    {balanceActions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {action.action === "credit" ? <TrendingUp className="inline h-4 w-4 text-green-500 mr-2" /> : <TrendingDown className="inline h-4 w-4 text-red-500 mr-2" />}
                            {action.action.charAt(0).toUpperCase() + action.action.slice(1)} Action
                          </p>
                          <p className="text-sm text-gray-600">User ID: {action.userId}</p>
                          <p className="text-sm text-gray-600">Reason: {action.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{action.amount} {action.currency}</p>
                          <p className="text-sm text-gray-500">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {action.createdAt ? new Date(action.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
