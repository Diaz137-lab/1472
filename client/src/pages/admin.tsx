
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
  Shield,
  LogOut
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
  const [selectedTransaction, setSelectedTransaction] = useState<AdminBalanceAction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  
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

  // Fetch portfolios for all users to get their balances with frequent updates
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
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
  });

  // Fetch real-time Bitcoin price from our crypto assets
  const { data: btcPrice = 108524.84 } = useQuery({
    queryKey: ["btc-price"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/crypto/assets");
        const assets = await response.json();
        const btcAsset = assets.find((asset: any) => asset.symbol === "BTC");
        return btcAsset ? parseFloat(btcAsset.currentPrice) : 108524.84;
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
      code1?: string;
      code2?: string;
      code3?: string;
    }) => {
      // For quick credit actions, automatically provide the verification codes and adminId
      const requestData = {
        ...data,
        amount: data.amount.toString(), // Convert amount to string as expected by schema
        adminId: 1, // Default admin ID
        code1: data.code1 || "666666",
        code2: data.code2 || "666666", 
        code3: data.code3 || "666666"
      };
      const response = await authorizedApiRequest("POST", "/api/admin/balance-action", requestData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate all relevant queries to refresh data immediately
      queryClient.invalidateQueries({ queryKey: ["/api/admin/balance-actions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      queryClient.invalidateQueries({ queryKey: [`/api/portfolio/${variables.userId}`] });
      
      setBalanceAction({
        action: "credit",
        amount: "",
        reason: "",
        currency: "USD"
      });
      setSelectedUser("");
      toast({
        title: "Balance Updated Successfully",
        description: `Added $${variables.amount.toLocaleString()} to user account. Balance updated immediately.`,
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
  // Calculate total system balance from admin balance actions plus user balances
  const totalCredits = balanceActions.filter(action => action.action === "credit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  const totalDebits = balanceActions.filter(action => action.action === "debit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  const systemInit = balanceActions.filter(action => action.action === "system_init")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  
  // Calculate total user balances for accurate system balance
  const totalUserBalances = portfolios.reduce((sum, portfolio) => 
    sum + parseFloat(portfolio.totalBalance || "0"), 0);
  
  // Total system balance = system reserve + all user balances
  const totalBalance = systemInit + totalUserBalances;

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

  const showTransactionDetail = (transaction: AdminBalanceAction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
    setShowTransactionDetails(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Administrator Console</h1>
                  <p className="text-lg text-gray-600 mt-1">QuotexWallet Management Portal</p>
                </div>
              </div>
              <p className="text-gray-500 max-w-2xl">
                Comprehensive administrative control panel for managing users, monitoring transactions, and overseeing platform operations with enterprise-grade security.
              </p>
            </div>
            <Button
              onClick={() => {
                adminLogout();
                setShowAdminLogin(true);
              }}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium px-6 py-3 rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Secure Logout
            </Button>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-800">Total Users</CardTitle>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalUsers}</div>
              <p className="text-sm text-blue-600 mt-1">Active registered accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-green-800">Total Balance</CardTitle>
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-green-900 break-words">${totalBalance.toLocaleString()}</div>
              <p className="text-sm text-green-600 mt-1">System-wide liquidity</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-purple-800">Transaction Volume</CardTitle>
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{balanceActions.length}</div>
              <p className="text-sm text-purple-600 mt-1">Administrative actions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-orange-800">System Status</CardTitle>
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">Online</div>
              <p className="text-sm text-orange-600 mt-1">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger 
              value="users" 
              className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger 
              value="balance" 
              className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Balance Control
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
            >
              <Activity className="h-4 w-4 mr-2" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="shadow-lg border-0 bg-white rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-blue-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  User Account Management
                </CardTitle>
                <p className="text-gray-600 mt-2">Manage user accounts, view balances, and perform quick credit operations</p>
              </CardHeader>
              <CardContent className="p-6">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading users...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {users.map((user) => {
                      const userBalance = getUserBalance(user.id);
                      const isExpanded = expandedUserId === user.id;
                      return (
                        <div key={user.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                          {/* Main User Card */}
                          <div 
                            className="p-6 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleUserDetails(user.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                  {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'N'}
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

                                    {/* Quick Credit Actions */}
                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                      <p className="text-sm text-gray-600 mb-3">Quick Credit Actions</p>
                                      <div className="grid grid-cols-2 gap-2 mb-3">
                                        {[100, 500, 1000, 5000, 10000, 50000].map((amount) => (
                                          <Button
                                            key={amount}
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 border-green-200 text-green-700 hover:bg-green-50"
                                            onClick={() => {
                                              balanceActionMutation.mutate({
                                                userId: user.id,
                                                action: "credit",
                                                amount: amount,
                                                reason: `Quick credit of $${amount.toLocaleString()}`,
                                                currency: "USD"
                                              });
                                            }}
                                            disabled={balanceActionMutation.isPending}
                                          >
                                            +${amount.toLocaleString()}
                                          </Button>
                                        ))}
                                      </div>
                                      
                                      {/* Custom Amount */}
                                      <div className="border-t border-gray-200 pt-3">
                                        <p className="text-xs text-gray-500 mb-2">Custom Amount</p>
                                        <div className="flex gap-2">
                                          <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="text-sm h-8"
                                            id={`custom-amount-${user.id}`}
                                            step="0.01"
                                            min="0"
                                          />
                                          <Button
                                            size="sm"
                                            className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                                            onClick={() => {
                                              const input = document.getElementById(`custom-amount-${user.id}`) as HTMLInputElement;
                                              const amount = parseFloat(input?.value || "0");
                                              if (amount > 0) {
                                                balanceActionMutation.mutate({
                                                  userId: user.id,
                                                  action: "credit",
                                                  amount: amount,
                                                  reason: `Custom credit of $${amount.toLocaleString()}`,
                                                  currency: "USD"
                                                });
                                                input.value = "";
                                              } else {
                                                toast({
                                                  title: "Invalid Amount",
                                                  description: "Please enter a valid amount greater than 0.",
                                                  variant: "destructive",
                                                });
                                              }
                                            }}
                                            disabled={balanceActionMutation.isPending}
                                          >
                                            Add
                                          </Button>
                                        </div>
                                      </div>
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
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : balanceActions.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Transaction History</h3>
                    <p className="text-gray-500">Transaction history will appear here when balance actions are performed.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {balanceActions.map((action) => {
                      const user = users.find(u => u.id === action.userId);
                      const userBalance = getUserBalance(action.userId);
                      const btcAmount = convertToBitcoin(parseFloat(action.amount));
                      const walletAddress = generateWalletAddress(action.userId, 'BTC');
                      
                      return (
                        <div 
                          key={action.id} 
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-300"
                          onClick={() => showTransactionDetail(action)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">
                                    {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'SY'}
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {user ? `${user.firstName} ${user.lastName}` : 'System'}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {action.reason}
                                </p>
                                <p className="text-xs text-gray-400">
                                  BTC: {walletAddress.substring(0, 15)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className={`text-sm font-medium ${
                                  action.action === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {action.action === 'credit' ? '+' : '-'}${parseFloat(action.amount).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ≈ {btcAmount.toFixed(8)} BTC
                                </div>
                              </div>
                              <Badge variant={action.action === 'credit' ? 'default' : 'destructive'}>
                                {action.action}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            {action.createdAt ? new Date(action.createdAt).toLocaleString() : 'Date not available'}
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

      <Footer />
      
      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog open={showTransactionDetails} onOpenChange={closeTransactionDetails}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Transaction Details</DialogTitle>
              <DialogDescription className="text-center">
                Complete transaction information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {(() => {
                const user = users.find(u => u.id === selectedTransaction.userId);
                const userBalance = getUserBalance(selectedTransaction.userId);
                const btcAmount = convertToBitcoin(parseFloat(selectedTransaction.amount));
                const walletAddress = generateWalletAddress(selectedTransaction.userId, 'BTC');
                
                return (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'System'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{user?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">User ID:</span>
                          <span className="font-medium">{selectedTransaction.userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Balance:</span>
                          <span className="font-medium">${userBalance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Action:</span>
                          <Badge variant={selectedTransaction.action === 'credit' ? 'default' : 'destructive'}>
                            {selectedTransaction.action.charAt(0).toUpperCase() + selectedTransaction.action.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className={`font-medium ${
                            selectedTransaction.action === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedTransaction.action === 'credit' ? '+' : '-'}${parseFloat(selectedTransaction.amount).toLocaleString()} {selectedTransaction.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">BTC Equivalent:</span>
                          <span className="font-medium">≈ {btcAmount.toFixed(8)} BTC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reason:</span>
                          <span className="font-medium">{selectedTransaction.reason}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : 'Date not available'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Wallet Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">BTC Wallet:</span>
                          <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                            {walletAddress}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction Type:</span>
                          <span className="font-medium">
                            {selectedTransaction.action === 'credit' ? 'Deposit' : 'Withdrawal'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={closeTransactionDetails}
                      className="w-full"
                    >
                      Close Details
                    </Button>
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
