import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PriceChart from "@/components/crypto/price-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, DollarSign, Activity, CreditCard, Bitcoin } from "lucide-react";
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

  const portfolioValue = portfolio ? parseFloat(portfolio.totalBalance) : 0;
  const dailyChange = 1250; // This would come from transaction history analysis
  const dailyChangePercent = portfolioValue > 0 ? (dailyChange / portfolioValue) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your portfolio overview.</p>
        </div>

        {/* Enhanced Bitcoin Portfolio Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <Bitcoin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}'s Portfolio
                  </CardTitle>
                  <p className="text-sm text-gray-600">Bitcoin-focused digital assets</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total USD Value</p>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    +${dailyChange.toLocaleString()} ({dailyChangePercent.toFixed(2)}%) today
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-2">Bitcoin Equivalent</p>
                  <DashboardBitcoinDisplay usdAmount={portfolioValue} />
                  <p className="text-xs text-gray-500 mt-2">Live market conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${portfolioValue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Total account balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fw-success">+{dailyChangePercent}%</div>
              <p className="text-xs text-muted-foreground">
                ${dailyChange.toLocaleString()} increase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Assets in portfolio
              </p>
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
