import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Bitcoin, Zap } from "lucide-react";
import { SiEthereum, SiDogecoin, SiSolana } from "react-icons/si";

const cryptoIcons = {
  BTC: Bitcoin,
  ETH: SiEthereum,
  DOGE: SiDogecoin,
  SOL: SiSolana,
};

const cryptoColors = {
  BTC: "bg-orange-500",
  ETH: "bg-blue-500",
  DOGE: "bg-yellow-500",
  SOL: "bg-purple-500",
};

export default function PriceTicker() {
  const { data: assets, isLoading } = useQuery({
    queryKey: ["/api/crypto/assets"],
  });

  if (isLoading) {
    return (
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const popularAssets = assets?.slice(0, 4) || [];

  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularAssets.map((asset) => {
            const Icon = cryptoIcons[asset.symbol as keyof typeof cryptoIcons] || Zap;
            const colorClass = cryptoColors[asset.symbol as keyof typeof cryptoColors] || "bg-gray-500";
            const isPositive = parseFloat(asset.priceChange24h) >= 0;

            return (
              <Link key={asset.symbol} href="/trading">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}>
                        <Icon className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Buy • Trade</p>
                        <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{asset.symbol}</span>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${parseFloat(asset.currentPrice).toLocaleString()}
                      </p>
                      <p
                        className={`text-sm ${
                          isPositive ? "text-fw-success" : "text-red-500"
                        }`}
                      >
                        {isPositive ? "+" : ""}{asset.priceChange24h}%
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Link href="/explorer" className="text-fw-blue hover:text-blue-700 font-semibold">
            More Prices
          </Link>
        </div>
      </div>
    </section>
  );
}
