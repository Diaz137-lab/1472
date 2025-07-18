import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PriceChart from "@/components/crypto/price-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { TrendingUp, DollarSign, Activity, CreditCard, Bitcoin, ArrowLeft, Clock, User, Shield, CheckCircle } from "lucide-react";
import { useBitcoinConversion } from "@/hooks/use-bitcoin-price";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

// Enhanced Bitcoin Display Component for Dashboard
function DashboardBitcoinDisplay({ usdAmount }: { usdAmount: number }) {
  const { data: conversion, isLoading } = useBitcoinConversion(usdAmount);

  if (isLoading || !conversion) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-orange-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-2xl font-bold text-orange-600 mb-1">
        ₿ {conversion.formattedBtc}
      </div>
      <p className="text-sm text-gray-600">
        @ ${conversion.btcPrice.toLocaleString()} per BTC
      </p>
      <div className={`text-xs font-medium ${conversion.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {conversion.change24h >= 0 ? '+' : ''}{conversion.change24h.toFixed(2)}% (24h)
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch real portfolio data
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: () => fetch(`/api/portfolio/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  // Fetch user balance actions (admin actions on user account)
  const { data: balanceActions, isLoading: actionsLoading } = useQuery({
    queryKey: ['user-balance-actions', user?.id],
    queryFn: () => fetch(`/api/user/${user?.id}/balance-actions`).then(res => res.json()),
    enabled: !!user?.id,
  });

  // Remove broken transaction API call since balance actions provide the transaction history
  const transactions = balanceActions || [];

  const portfolioValue = portfolio ? parseFloat(portfolio.totalValue || portfolio.totalBalance || '0') : 0;
  const dailyChange = 1250; // This would come from transaction history analysis
  const dailyChangePercent = portfolioValue > 0 ? (dailyChange / portfolioValue) * 100 : 0;

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
        
        {/* Personalized Welcome */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Kelly'}!
              </h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Account</span>
                <Shield className="w-4 h-4 text-blue-500 ml-4" />
                <span>Secure Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bitcoin Portfolio Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 border-orange-200 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bitcoin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}'s Portfolio
                    </CardTitle>
                    <p className="text-base text-gray-600">Premium Bitcoin-focused digital assets</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <p className="text-base font-semibold text-gray-700">Total USD Value</p>
                  </div>
                  <div className="text-5xl font-bold text-gray-900 mb-3">
                    ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-base text-green-600 font-semibold">
                      +${dailyChange.toLocaleString()} ({dailyChangePercent.toFixed(2)}%) today
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="w-5 h-5 text-orange-600" />
                    <p className="text-base font-semibold text-orange-600">Bitcoin Equivalent</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-4 shadow-inner">
                    <DashboardBitcoinDisplay usdAmount={portfolioValue} />
                    <div className="flex items-center mt-3 text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Live market conversion</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-gray-800">Portfolio Value</CardTitle>
              <DollarSign className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${portfolioValue.toLocaleString()}</div>
              <p className="text-sm text-gray-600 mt-1">Total account balance</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-gray-800">24h Change</CardTitle>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">+{dailyChangePercent.toFixed(2)}%</div>
              <p className="text-sm text-gray-600 mt-1">
                ${dailyChange.toLocaleString()} increase
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-gray-800">Active Assets</CardTitle>
              <Activity className="h-6 w-6 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">5</div>
              <p className="text-xs text-muted-foreground">
                Assets in portfolio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History Section */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Account Activity</CardTitle>
                    <p className="text-sm text-gray-600">Recent transactions and account actions</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {balanceActions?.length || 0} transactions
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {actionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : balanceActions && balanceActions.length > 0 ? (
                <div className="space-y-3">
                  {balanceActions.slice(0, 10).map((action: any, index: number) => (
                    <div key={action.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                          action.action === 'credit' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gradient-to-br from-red-400 to-red-600 text-white'
                        }`}>
                          {action.action === 'credit' ? <TrendingUp className="w-6 h-6" /> : <DollarSign className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <p className="font-bold text-gray-900 text-lg">
                              {action.action === 'credit' ? 'Account Credit' : 'Account Debit'}
                            </p>
                            <Badge variant="outline" className={`text-xs font-medium ${
                              action.action === 'credit' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {action.action === 'credit' ? 'Deposit' : 'Withdrawal'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{action.reason}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(action.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Bitcoin className="w-3 h-3 text-orange-500" />
                              <DashboardBitcoinDisplay usdAmount={parseFloat(action.amount)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          action.action === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {action.action === 'credit' ? '+' : '-'}{formatCurrency(action.amount)}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">{action.currency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Portfolio Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart />
            </CardContent>
          </Card>

          {/* Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold">Bitcoin</p>
                      <p className="text-sm text-gray-600">0.5 BTC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$54,262</p>
                    <p className="text-sm text-fw-success">+2.1%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold">Ethereum</p>
                      <p className="text-sm text-gray-600">10 ETH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$25,014</p>
                    <p className="text-sm text-fw-success">+3.2%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold">Solana</p>
                      <p className="text-sm text-gray-600">35 SOL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$5,331</p>
                    <p className="text-sm text-red-500">-1.2%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/trading">
                <Button className="w-full bg-fw-blue hover:bg-blue-700">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Crypto
                </Button>
              </Link>
              <Link href="/trading">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Sell
                </Button>
              </Link>
              <Link href="/exchange">
                <Button variant="outline" className="w-full">
                  <Activity className="mr-2 h-4 w-4" />
                  Swap
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Portfolio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
