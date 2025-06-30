import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TradingInterface from "@/components/trading/trading-interface";
import PriceChart from "@/components/crypto/price-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Trading() {
  const { data: assets } = useQuery({
    queryKey: ["/api/crypto/assets"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trading</h1>
          <p className="text-gray-600">Buy and sell cryptocurrencies with ease.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trading Interface */}
          <div className="lg:col-span-1">
            <TradingInterface />
          </div>

          {/* Price Chart and Market Data */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bitcoin Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart />
              </CardContent>
            </Card>

            {/* Market Data */}
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">24h Volume</p>
                    <p className="text-lg font-semibold">$45.2B</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Market Cap</p>
                    <p className="text-lg font-semibold">$2.1T</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">24h High</p>
                    <p className="text-lg font-semibold">$109,245</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">24h Low</p>
                    <p className="text-lg font-semibold">$107,892</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Book */}
            <Card>
              <CardHeader>
                <CardTitle>Order Book</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-fw-success mb-2">Bids</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>$108,520</span>
                        <span>0.5 BTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>$108,515</span>
                        <span>1.2 BTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>$108,510</span>
                        <span>0.8 BTC</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-500 mb-2">Asks</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>$108,525</span>
                        <span>0.3 BTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>$108,530</span>
                        <span>0.7 BTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>$108,535</span>
                        <span>1.1 BTC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
