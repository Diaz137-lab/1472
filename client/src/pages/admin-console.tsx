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
import { useBitcoinPrice, useBitcoinConversion } from "@/hooks/use-bitcoin-price";
import { BitcoinDisplay } from "@/components/ui/bitcoin-display";
import type { User, AdminBalanceAction } from "@shared/schema";

// Bitcoin Balance Display Component using JSX
function BitcoinBalanceDisplay({ usdBalance }: { usdBalance: number }) {
  const { data: btcPrice, isLoading: btcPriceLoading } = useBitcoinPrice();
  const { data: conversion, isLoading: conversionLoading } = useBitcoinConversion(usdBalance);

  if (btcPriceLoading || conversionLoading || !btcPrice || !conversion) {
    return (
      <div className="mt-2 animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-32"></div>
      </div>
    );
  }

  const isPositiveChange = btcPrice.change24h >= 0;

  return (
    <div className="mt-3 pt-3 border-t border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Bitcoin Equivalent</p>
          <p className="text-lg font-bold text-orange-400">
            {conversion.formattedBtc}
          </p>
          <p className="text-xs text-gray-500">
            @ ${btcPrice.price.toLocaleString()} per BTC
          </p>
        </div>
        <div className="text-right">
          <div className={`flex items-center text-xs ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
            {isPositiveChange ? 
              <TrendingUp className="h-3 w-3 mr-1" /> : 
              <TrendingDown className="h-3 w-3 mr-1" />
            }
            {Math.abs(btcPrice.change24h).toFixed(2)}% (24h)
          </div>
          <p className="text-xs text-gray-500">
            Last updated: {new Date(btcPrice.lastUpdated * 1000).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact Bitcoin Display Component for header balance using JSX
function CompactBitcoinDisplay({ usdBalance }: { usdBalance: number }) {
  const { data: conversion, isLoading } = useBitcoinConversion(usdBalance);

  if (isLoading || !conversion) {
    return (
      <div className="mt-1 animate-pulse">
        <div className="h-3 bg-gray-600 rounded w-20"></div>
      </div>
    );
  }

  return (
    <p className="text-xs text-orange-400 font-medium mt-1">
      ≈ {conversion.formattedBtc}
    </p>
  );
}

// System-wide Bitcoin Display Component for total balance card
function SystemBitcoinDisplay({ usdBalance }: { usdBalance: number }) {
  const { data: conversion, isLoading } = useBitcoinConversion(usdBalance);

  if (isLoading || !conversion) {
    return (
      <div className="animate-pulse">
        <div className="h-3 bg-green-600 rounded w-24 mt-1"></div>
      </div>
    );
  }

  return (
    <p className="text-xs text-green-300 font-medium">
      ≈ {conversion.formattedBtc}
    </p>
  );
}

export default function AdminConsole() {
  const [selectedUser, setSelectedUser] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
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
    console.log('Toggle user details clicked for user:', userId);
    setExpandedUserId(expandedUserId === userId ? null : userId);
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 cursor-pointer z-10 relative"
                style={{ pointerEvents: 'auto' }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Admin Logout
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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
            <CardContent className="pb-2">
              <div className="text-2xl font-bold text-white truncate">
                ${(totalSystemBalance / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-green-200 mt-1">
                System Balance
              </p>
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
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 shadow-lg rounded-lg p-1">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-gray-300 font-medium transition-all duration-200 cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-md"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              User Management
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white text-gray-300 font-medium transition-all duration-200 cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-md"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Manage Accounts
            </TabsTrigger>
            <TabsTrigger 
              value="balance" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white text-gray-300 font-medium transition-all duration-200 cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-md"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Balance Actions
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-gray-300 font-medium transition-all duration-200 cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-md"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Action History
            </TabsTrigger>
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
                      const isExpanded = expandedUserId === user.id;
                      return (
                        <div key={user.id} className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl border border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-400">
                          {/* Main User Card - Clickable */}
                          <div 
                            className="p-6 cursor-pointer hover:bg-gray-600/50 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleUserDetails(user.id);
                            }}
                            style={{ pointerEvents: 'auto' }}
                          >
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
                                        📍 Address: 58 Benjamina Drive, Red Bank Plains, QLD, Australia
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <div className="bg-gray-800 px-4 py-3 rounded-lg border border-gray-600 min-w-[140px]">
                                  <p className="text-xs text-gray-400 uppercase tracking-wide">Balance</p>
                                  <div className="space-y-1">
                                    <p className="text-lg lg:text-xl font-bold text-green-400 leading-tight">
                                      ${userBalance >= 1000000 
                                        ? `${(userBalance / 1000000).toFixed(1)}M`
                                        : userBalance >= 1000
                                        ? `${(userBalance / 1000).toFixed(1)}K`
                                        : userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                      }
                                    </p>
                                    {userBalance >= 1000 && (
                                      <p className="text-xs text-gray-500 font-mono">
                                        ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </p>
                                    )}
                                    {userBalance > 0 && <BitcoinDisplay usdAmount={userBalance} size="xs" showLabel={true} className="text-orange-400" />}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                    {user.isVerified ? "Verified" : "Unverified"}
                                  </Badge>
                                  <Badge variant={user.isAdmin ? "destructive" : "outline"} className="text-xs">
                                    {user.isAdmin ? "Admin" : "User"}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-xs text-gray-400">
                                  {isExpanded ? "▼ Hide Details" : "▶ View Details"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details Section */}
                          {isExpanded && (
                            <div className="border-t border-gray-600 bg-gray-800/50 p-6 rounded-b-xl">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Wallet Addresses */}
                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Wallet className="mr-2 h-4 w-4 text-blue-400" />
                                    Crypto Wallet Addresses
                                  </h4>
                                  <div className="space-y-3">
                                    {['BTC', 'ETH', 'DOGE', 'SOL', 'ADA'].map((symbol) => (
                                      <div key={symbol} className="bg-gray-700 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm font-medium text-gray-300">{symbol}</span>
                                          <button 
                                            className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer px-2 py-1 rounded bg-blue-900/30 hover:bg-blue-800/50 transition-colors"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(generateWalletAddress(user.id, symbol));
                                              toast({ title: "Copied!", description: `${symbol} address copied to clipboard` });
                                            }}
                                            style={{ pointerEvents: 'auto' }}
                                          >
                                            Copy
                                          </button>
                                        </div>
                                        <p className="text-xs text-gray-400 font-mono mt-1 break-all">
                                          {generateWalletAddress(user.id, symbol)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Account Info & Actions */}
                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Settings className="mr-2 h-4 w-4 text-green-400" />
                                    Account Information
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="bg-gray-700 p-3 rounded-lg">
                                      <p className="text-sm text-gray-300">Account Status</p>
                                      <p className="text-white font-medium">
                                        {user.isVerified ? "✅ Verified" : "⏳ Pending Verification"}
                                      </p>
                                    </div>
                                    <div className="bg-gray-700 p-3 rounded-lg">
                                      <p className="text-sm text-gray-300">Account Type</p>
                                      <p className="text-white font-medium">
                                        {user.isAdmin ? "🔐 Administrator" : "👤 Standard User"}
                                      </p>
                                    </div>
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                      <p className="text-sm text-gray-300 mb-2">Current Balance</p>
                                      <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                          <p className="text-2xl font-bold text-green-400">
                                            ${userBalance >= 1000000 
                                              ? `${(userBalance / 1000000).toFixed(1)}M`
                                              : userBalance >= 1000
                                              ? `${(userBalance / 1000).toFixed(1)}K`
                                              : userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            }
                                          </p>
                                          {userBalance >= 1000 && (
                                            <span className="text-sm text-gray-400">USD</span>
                                          )}
                                        </div>
                                        {userBalance >= 1000 && (
                                          <p className="text-sm text-gray-400 font-mono">
                                            ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </p>
                                        )}
                                        {userBalance > 0 && <BitcoinDisplay usdAmount={userBalance} size="md" showLabel={true} />}
                                      </div>
                                    </div>
                                    {user.address && (
                                      <div className="bg-gray-700 p-3 rounded-lg">
                                        <p className="text-sm text-gray-300">Physical Address</p>
                                        <p className="text-white text-sm">{user.address}</p>
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

          <TabsContent value="manage" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-t-lg">
                <CardTitle className="flex items-center text-white text-xl">
                  <Wallet className="mr-3 h-6 w-6 text-emerald-300" />
                  Manage Accounts - Credit Any Amount
                </CardTitle>
                <p className="text-emerald-200 text-sm mt-2">Select any user and credit any amount instantly</p>
              </CardHeader>
              <CardContent className="p-6">
                {/* User Cards Grid - Direct Credit Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => {
                    const userBalance = getUserBalance(user.id);
                    return (
                      <Card key={user.id} className="bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-sm truncate">{user.firstName} {user.lastName}</h3>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Current Balance Display */}
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Current Balance</p>
                            <p className="text-lg font-bold text-green-400">
                              ${userBalance >= 1000000 
                                ? `${(userBalance / 1000000).toFixed(1)}M`
                                : userBalance >= 1000
                                ? `${(userBalance / 1000).toFixed(1)}K`
                                : userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              }
                            </p>
                          </div>

                          {/* Quick Credit Buttons */}
                          <div className="space-y-2">
                            <p className="text-xs text-gray-300 font-medium">Quick Credit</p>
                            <div className="grid grid-cols-3 gap-2">
                              {[100, 500, 1000, 5000, 10000, 50000].map((amount) => (
                                <Button
                                  key={amount}
                                  size="sm"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    // Auto-fill security codes and execute
                                    const creditData = {
                                      userId: user.id,
                                      adminId: adminUser?.id || 1,
                                      action: 'credit',
                                      amount: amount.toString(),
                                      currency: 'USD',
                                      reason: `Quick credit of $${amount.toLocaleString()} to ${user.firstName} ${user.lastName}`,
                                      code1: '666666',
                                      code2: '666666',
                                      code3: '666666'
                                    };

                                    try {
                                      await balanceActionMutation.mutateAsync(creditData);
                                      // Refresh portfolios to show updated balance
                                      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
                                    } catch (error) {
                                      console.error('Credit failed:', error);
                                    }
                                  }}
                                  disabled={balanceActionMutation.isPending}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  ${amount >= 1000 ? `${amount / 1000}K` : amount}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Custom Amount Input */}
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-300 font-medium">Custom Amount</Label>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Enter amount"
                                className="bg-gray-800 border-gray-500 text-white placeholder:text-gray-400 text-sm flex-1"
                                id={`custom-amount-${user.id}`}
                                min="0"
                                max="10000000"
                                step="0.01"
                              />
                              <Button
                                size="sm"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  const input = document.getElementById(`custom-amount-${user.id}`) as HTMLInputElement;
                                  const amount = input?.value;
                                  
                                  if (!amount || parseFloat(amount) <= 0) {
                                    toast({
                                      title: "Invalid Amount",
                                      description: "Please enter a valid amount greater than 0",
                                      variant: "destructive"
                                    });
                                    return;
                                  }

                                  const creditData = {
                                    userId: user.id,
                                    adminId: adminUser?.id || 1,
                                    action: 'credit',
                                    amount: amount,
                                    currency: 'USD',
                                    reason: `Custom credit of $${parseFloat(amount).toLocaleString()} to ${user.firstName} ${user.lastName}`,
                                    code1: '666666',
                                    code2: '666666',
                                    code3: '666666'
                                  };

                                  try {
                                    await balanceActionMutation.mutateAsync(creditData);
                                    input.value = ''; // Clear the input
                                    queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
                                  } catch (error) {
                                    console.error('Credit failed:', error);
                                  }
                                }}
                                disabled={balanceActionMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                style={{ pointerEvents: 'auto' }}
                              >
                                Credit
                              </Button>
                            </div>
                          </div>

                          {/* User Details */}
                          {user.firstName === "Kelly Ann" && user.lastName === "James" && (
                            <div className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                              📍 58 Benjamina Drive, Red Bank Plains, QLD, Australia
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Transaction Status */}
                {balanceActionMutation.isPending && (
                  <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-600/50">
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                      <p className="text-blue-200">Processing transaction...</p>
                    </div>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBalanceAction();
                    }}
                    disabled={
                      balanceActionMutation.isPending || 
                      !selectedUser || 
                      !balanceAction.amount || 
                      balanceAction.code1.length !== 6 ||
                      balanceAction.code2.length !== 6 ||
                      balanceAction.code3.length !== 6
                    }
                    className={`px-8 py-3 cursor-pointer ${
                      balanceAction.action === "credit" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    style={{ pointerEvents: 'auto' }}
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
                          <div className="text-right space-y-1">
                            <p className={`text-lg font-bold ${
                              action.action === "credit" ? "text-green-400" : "text-red-400"
                            }`}>
                              {action.action === "credit" ? "+" : "-"}${parseFloat(action.amount).toLocaleString()} {action.currency}
                            </p>
                            {parseFloat(action.amount) > 0 && (
                              <BitcoinDisplay 
                                usdAmount={parseFloat(action.amount)} 
                                size="xs" 
                                showLabel={true} 
                                className={action.action === "credit" ? "text-green-300" : "text-red-300"} 
                              />
                            )}
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