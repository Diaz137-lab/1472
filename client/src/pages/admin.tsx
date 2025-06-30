import { useState } from "react";
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
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Settings,
  UserPlus,
  Wallet,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User, AdminBalanceAction } from "@shared/schema";

export default function Admin() {
  const [selectedUser, setSelectedUser] = useState("");
  const [balanceAction, setBalanceAction] = useState({
    action: "credit",
    amount: "",
    reason: "",
    currency: "USD"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: balanceActions = [], isLoading: actionsLoading } = useQuery<AdminBalanceAction[]>({
    queryKey: ["/api/admin/balance-actions"],
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
      const response = await apiRequest("POST", "/api/admin/balance-action", data);
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
      adminId: 1, // Mock admin ID - in real app this would come from auth context
      action: balanceAction.action,
      amount: balanceAction.amount,
      currency: balanceAction.currency,
      reason: balanceAction.reason,
    });
  };

  const totalUsers = users.length;
  const totalCredits = balanceActions.filter(action => action.action === "credit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);
  const totalDebits = balanceActions.filter(action => action.action === "debit")
    .reduce((sum, action) => sum + parseFloat(action.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3" />
            Admin Panel
          </h1>
          <p className="text-gray-600">Manage users and financial operations</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fw-success">${totalCredits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Money added to accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">${totalDebits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Money removed from accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalCredits - totalDebits).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total platform balance
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="balance">Balance Actions</TabsTrigger>
            <TabsTrigger value="history">Action History</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2" />
                  User Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-fw-blue rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={user.isVerified ? "default" : "secondary"}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                          <Badge variant={user.isAdmin ? "destructive" : "outline"}>
                            {user.isAdmin ? "Admin" : "User"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            ID: {user.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2" />
                  Manage User Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
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
                      <Label htmlFor="action">Action Type</Label>
                      <Select value={balanceAction.action} onValueChange={(value) => 
                        setBalanceAction(prev => ({ ...prev, action: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit">Credit (Add Money)</SelectItem>
                          <SelectItem value="debit">Debit (Remove Money)</SelectItem>
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
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={balanceAction.currency} onValueChange={(value) => 
                        setBalanceAction(prev => ({ ...prev, currency: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Explain the reason for this balance adjustment..."
                        value={balanceAction.reason}
                        onChange={(e) => setBalanceAction(prev => ({ ...prev, reason: e.target.value }))}
                        rows={4}
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
                        ? "bg-fw-success hover:bg-green-600" 
                        : "bg-red-500 hover:bg-red-600"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2" />
                  Balance Action History
                </CardTitle>
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
                ) : (
                  <div className="space-y-4">
                    {balanceActions.map((action) => {
                      const user = users.find(u => u.id === action.userId);
                      return (
                        <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              action.action === "credit" ? "bg-fw-success text-white" : "bg-red-500 text-white"
                            }`}>
                              {action.action.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {user ? `${user.firstName} ${user.lastName}` : `User ID: ${action.userId}`}
                              </p>
                              <p className="text-sm text-gray-600">{action.reason}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(action.createdAt!).toLocaleDateString()} at{" "}
                                {new Date(action.createdAt!).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              action.action === "credit" ? "text-fw-success" : "text-red-500"
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

      <Footer />
    </div>
  );
}