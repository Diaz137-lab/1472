import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Exchange() {
  const { toast } = useToast();
  const [fromAmount, setFromAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("ETH");
  const [toAmount, setToAmount] = useState("");

  const handleSwap = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const calculateExchange = () => {
    if (!fromAmount) {
      setToAmount("");
      return;
    }
    
    // Mock exchange rates
    const rates: { [key: string]: number } = {
      "BTC-ETH": 43.4,
      "ETH-BTC": 0.023,
      "BTC-SOL": 712.5,
      "SOL-BTC": 0.0014,
      "ETH-SOL": 16.4,
      "SOL-ETH": 0.061,
      "BTC-DOGE": 125000,
      "DOGE-BTC": 0.000008,
      "ETH-DOGE": 2880,
      "DOGE-ETH": 0.000347,
      "SOL-DOGE": 175.5,
      "DOGE-SOL": 0.0057,
    };
    
    const rate = rates[`${fromCurrency}-${toCurrency}`] || 1;
    const result = (parseFloat(fromAmount) * rate).toFixed(6);
    setToAmount(result);
  };

  const handlePreviewSwap = () => {
    if (!fromAmount || !toAmount) {
      toast({
        title: "Invalid Swap",
        description: "Please enter an amount to swap.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Swap Preview Ready",
      description: `Swapping ${fromAmount} ${fromCurrency} for ${toAmount} ${toCurrency}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exchange</h1>
          <p className="text-gray-600">Swap between different cryptocurrencies instantly.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Exchange Interface */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Swap Crypto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={fromAmount}
                        onChange={(e) => {
                          setFromAmount(e.target.value);
                          calculateExchange();
                        }}
                        className="flex-1"
                      />
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="SOL">SOL</SelectItem>
                          <SelectItem value="DOGE">DOGE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSwap}
                      className="rounded-full"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>To</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={toAmount}
                        readOnly
                        className="flex-1 bg-gray-50"
                      />
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="SOL">SOL</SelectItem>
                          <SelectItem value="DOGE">DOGE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exchange Rate</span>
                    <span>1 {fromCurrency} = 43.4 {toCurrency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Network Fee</span>
                    <span>~$2.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>0.25%</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePreviewSwap}
                  className="w-full bg-fw-blue hover:bg-blue-700"
                >
                  Preview Swap
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Market Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exchange Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">BTC/ETH</span>
                      <span className="text-fw-success">+0.5%</span>
                    </div>
                    <p className="text-2xl font-bold">43.4</p>
                    <p className="text-sm text-gray-600">24h volume: $1.2B</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">BTC/SOL</span>
                      <span className="text-red-500">-0.3%</span>
                    </div>
                    <p className="text-2xl font-bold">712.5</p>
                    <p className="text-sm text-gray-600">24h volume: $850M</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">ETH/SOL</span>
                      <span className="text-fw-success">+1.2%</span>
                    </div>
                    <p className="text-2xl font-bold">16.4</p>
                    <p className="text-sm text-gray-600">24h volume: $650M</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">SOL/DOGE</span>
                      <span className="text-fw-success">+2.1%</span>
                    </div>
                    <p className="text-2xl font-bold">895.2</p>
                    <p className="text-sm text-gray-600">24h volume: $320M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Swaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">
                        <span className="font-semibold">0.5 BTC</span> → <span className="font-semibold">21.7 ETH</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">2 minutes ago</p>
                      <p className="text-xs text-green-600">Completed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">
                        <span className="font-semibold">10 ETH</span> → <span className="font-semibold">164 SOL</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">5 minutes ago</p>
                      <p className="text-xs text-green-600">Completed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">
                        <span className="font-semibold">100 SOL</span> → <span className="font-semibold">0.14 BTC</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">12 minutes ago</p>
                      <p className="text-xs text-yellow-600">Processing</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exchange Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-fw-light-blue rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ArrowRightLeft className="text-fw-blue" />
                    </div>
                    <h4 className="font-semibold mb-2">Instant Swaps</h4>
                    <p className="text-sm text-gray-600">Exchange crypto instantly with competitive rates</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-fw-light-blue rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ArrowRightLeft className="text-fw-blue" />
                    </div>
                    <h4 className="font-semibold mb-2">Low Fees</h4>
                    <p className="text-sm text-gray-600">Only 0.25% platform fee for all exchanges</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-fw-light-blue rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ArrowRightLeft className="text-fw-blue" />
                    </div>
                    <h4 className="font-semibold mb-2">Best Rates</h4>
                    <p className="text-sm text-gray-600">Aggregated liquidity for optimal pricing</p>
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
