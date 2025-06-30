import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PriceChart from "@/components/crypto/price-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ChartLine, 
  Box, 
  Code, 
  AreaChart,
  Activity,
  DollarSign,
  BarChart3
} from "lucide-react";
import { useState } from "react";

export default function Explorer() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: assets, isLoading } = useQuery({
    queryKey: ["/api/crypto/assets"],
  });

  const filteredAssets = assets?.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore</h1>
          <p className="text-xl text-gray-600 mb-6">
            Financial data is in our DNA. Explore real-time prices, blockchain data, and market insights.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChartLine className="text-fw-blue text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Prices</h3>
            <p className="text-gray-600 text-sm">Get the latest prices and charts along with key market signals.</p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Box className="text-fw-blue text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Explorer</h3>
            <p className="text-gray-600 text-sm">Confirm transactions, analyze the market, or simply learn more about crypto.</p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code className="text-fw-blue text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Powerful Data API</h3>
            <p className="text-gray-600 text-sm">We've powered exchanges, data analysts, enthusiasts, and more.</p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AreaChart className="text-fw-blue text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Charts</h3>
            <p className="text-gray-600 text-sm">From hashrate, to block details, to mining information, and more.</p>
          </Card>
        </div>

        <Tabs defaultValue="prices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prices">Prices</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="prices" className="space-y-6">
            {/* Market Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2.85T</div>
                  <p className="text-xs text-fw-success">+2.4% (24h)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$156B</div>
                  <p className="text-xs text-red-500">-5.2% (24h)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">56.8%</div>
                  <p className="text-xs text-fw-success">+0.3% (24h)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fear & Greed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72</div>
                  <p className="text-xs text-fw-success">Greed</p>
                </CardContent>
              </Card>
            </div>

            {/* Price Table */}
            <Card>
              <CardHeader>
                <CardTitle>Cryptocurrency Prices</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAssets.map((asset, index) => {
                      const isPositive = parseFloat(asset.priceChange24h) >= 0;
                      return (
                        <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-500 font-mono text-sm w-8">#{index + 1}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                              <p className="text-sm text-gray-600">{asset.symbol}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-8 items-center">
                            <div className="text-right">
                              <p className="font-semibold">${parseFloat(asset.currentPrice).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold flex items-center justify-end ${
                                isPositive ? "text-fw-success" : "text-red-500"
                              }`}>
                                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                {isPositive ? "+" : ""}{asset.priceChange24h}%
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                ${asset.marketCap ? parseFloat(asset.marketCap).toLocaleString() : "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">Market Cap</p>
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

          <TabsContent value="markets" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Gainers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assets?.filter(asset => parseFloat(asset.priceChange24h) > 0)
                      .sort((a, b) => parseFloat(b.priceChange24h) - parseFloat(a.priceChange24h))
                      .slice(0, 5)
                      .map((asset) => (
                        <div key={asset.symbol} className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{asset.name}</p>
                            <p className="text-sm text-gray-600">{asset.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${parseFloat(asset.currentPrice).toLocaleString()}</p>
                            <p className="text-sm text-fw-success">+{asset.priceChange24h}%</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Market Sentiment</h4>
                    <div className="text-3xl font-bold text-fw-success mb-2">Bullish</div>
                    <p className="text-sm text-gray-600">Based on 24h trading activity</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Volatility Index</h4>
                    <div className="text-3xl font-bold text-yellow-500 mb-2">Medium</div>
                    <p className="text-sm text-gray-600">Average volatility across top assets</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Trading Volume</h4>
                    <div className="text-3xl font-bold text-fw-blue mb-2">High</div>
                    <p className="text-sm text-gray-600">24h volume above average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Bitcoin Network</p>
                        <p className="text-sm text-gray-600">Hash Rate</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">450 EH/s</p>
                        <Badge variant="secondary" className="text-fw-success">+2.1%</Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Ethereum Network</p>
                        <p className="text-sm text-gray-600">Gas Price</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">25 Gwei</p>
                        <Badge variant="secondary" className="text-red-500">-15.2%</Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Total Transactions</p>
                        <p className="text-sm text-gray-600">Last 24h</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">2.4M</p>
                        <Badge variant="secondary" className="text-fw-success">+8.3%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Blocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-mono text-sm">#{(820000 - i).toLocaleString()}</p>
                          <p className="text-xs text-gray-600">{i + 1} min ago</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{2500 + i * 100} txns</p>
                          <p className="text-xs text-gray-600">Size: 1.2MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fw-success">99.9%</div>
                    <p className="text-sm text-gray-600">Network Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fw-blue">12.5s</div>
                    <p className="text-sm text-gray-600">Avg Block Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fw-success">45k</div>
                    <p className="text-sm text-gray-600">Active Nodes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">Low</div>
                    <p className="text-sm text-gray-600">Congestion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Data API</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">API Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-fw-success rounded-full"></div>
                        <span>Real-time price feeds</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-fw-success rounded-full"></div>
                        <span>Historical market data</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-fw-success rounded-full"></div>
                        <span>Blockchain transaction data</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-fw-success rounded-full"></div>
                        <span>Portfolio analytics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-fw-success rounded-full"></div>
                        <span>WebSocket streaming</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>API Calls Today</span>
                          <span className="font-bold">2.4M</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>Active Developers</span>
                          <span className="font-bold">15,000+</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>Uptime</span>
                          <span className="font-bold text-fw-success">99.95%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button className="bg-fw-blue hover:bg-blue-700">
                    Get API Access
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="mb-2"># Get real-time price data</div>
                  <div className="mb-4">curl -X GET "https://api.quotexwallet.com/v1/prices/BTC"</div>
                  
                  <div className="mb-2"># Response</div>
                  <div className="text-white">
                    {`{
  "symbol": "BTC",
  "price": "108524.84",
  "change_24h": "1.19",
  "volume_24h": "45000000000",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <Button variant="outline">View Full Documentation</Button>
                  <Button variant="outline">Try in Console</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-fw-blue to-blue-700 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Building with Our API</h2>
            <p className="text-xl text-blue-100 mb-6">
              Join thousands of developers using our blockchain data API
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-white text-fw-blue hover:bg-gray-100">
                Get Started
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-fw-blue">
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
