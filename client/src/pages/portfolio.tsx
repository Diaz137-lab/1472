import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { mockPortfolioData, mockTransactions } from "@/lib/mock-data";

const COLORS = ['#f7931a', '#627eea', '#8884d8', '#82ca9d', '#ffc658'];

export default function Portfolio() {
  const totalValue = mockPortfolioData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600">Track your investments and performance.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockPortfolioData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {mockPortfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {mockPortfolioData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">
                          ${item.value.toLocaleString()} ({((item.value / totalValue) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockPortfolioData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill="hsl(var(--fw-blue))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                  <p className="text-sm text-fw-success">+$1,250 (1.5%) today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Gain/Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-fw-success">+$12,500</p>
                  <p className="text-sm text-fw-success">+17.3% all time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Best Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold">Bitcoin</p>
                  <p className="text-sm text-fw-success">+24.5% this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPortfolioData.map((asset) => (
                    <div key={asset.name} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: asset.color }}
                        >
                          {asset.name.slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{asset.name}</h3>
                          <p className="text-sm text-gray-600">
                            {asset.name === 'Bitcoin' ? '0.5 BTC' : 
                             asset.name === 'Ethereum' ? '10 ETH' : '25 Various'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${asset.value.toLocaleString()}</p>
                        <p className="text-sm text-fw-success">+5.2%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'buy' ? 'bg-fw-success text-white' : 'bg-red-500 text-white'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{transaction.asset}</p>
                          <p className="text-sm text-gray-600">{transaction.amount} {transaction.asset}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{transaction.price}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Portfolio Risk Score</span>
                        <span className="font-semibold">Medium</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Diversification</span>
                        <span className="font-semibold">Good</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-fw-success h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Sharpe Ratio</span>
                      <span className="font-semibold">1.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown</span>
                      <span className="font-semibold text-red-500">-15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility (30d)</span>
                      <span className="font-semibold">18.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beta</span>
                      <span className="font-semibold">0.85</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
