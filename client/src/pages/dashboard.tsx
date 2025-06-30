import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PriceChart from "@/components/crypto/price-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, DollarSign, Activity, CreditCard } from "lucide-react";

export default function Dashboard() {
  // Mock user data - in real app this would come from API
  const portfolioValue = 85000;
  const dailyChange = 1250;
  const dailyChangePercent = 1.5;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your portfolio overview.</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +${dailyChange.toLocaleString()} ({dailyChangePercent}%) today
              </p>
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
