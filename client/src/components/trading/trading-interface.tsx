import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

interface TradingInterfaceProps {
  selectedAsset?: string;
}

export default function TradingInterface({ selectedAsset = "BTC" }: TradingInterfaceProps) {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState(selectedAsset);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const tradeMutation = useMutation({
    mutationFn: async (data: {
      userId: number;
      type: string;
      symbol: string;
      amount: string;
      price: string;
    }) => {
      const response = await apiRequest("POST", "/api/trade", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trade Submitted",
        description: `Your ${tradeType} order has been submitted successfully.`,
      });
      setAmount("");
      setPrice("");
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
    onError: () => {
      toast({
        title: "Trade Failed",
        description: "There was an error submitting your trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTrade = () => {
    if (!amount || !price) {
      toast({
        title: "Missing Information",
        description: "Please enter both amount and price.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make trades.",
        variant: "destructive",
      });
      return;
    }

    tradeMutation.mutate({
      userId: user.id,
      type: tradeType,
      symbol: selectedSymbol,
      amount,
      price,
    });
  };

  const total = amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : "0.00";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Trade {selectedSymbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as "buy" | "sell")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-fw-success">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="text-red-500">Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="symbol">Asset</Label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">${total}</span>
              </div>
            </div>

            <Button
              onClick={handleTrade}
              disabled={tradeMutation.isPending}
              className="w-full bg-fw-success hover:bg-green-600"
            >
              {tradeMutation.isPending ? "Processing..." : `Buy ${selectedSymbol}`}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="symbol-sell">Asset</Label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount-sell">Amount</Label>
              <Input
                id="amount-sell"
                type="number"
                step="0.00000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price-sell">Price (USD)</Label>
              <Input
                id="price-sell"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">${total}</span>
              </div>
            </div>

            <Button
              onClick={handleTrade}
              disabled={tradeMutation.isPending}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {tradeMutation.isPending ? "Processing..." : `Sell ${selectedSymbol}`}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
