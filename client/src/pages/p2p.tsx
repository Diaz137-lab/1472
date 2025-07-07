import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Clock, 
  MessageCircle, 
  Star,
  TrendingUp,
  Search,
  Filter,
  Bitcoin,
  CreditCard,
  Banknote,
  Smartphone
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function P2P() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [activeTab, setActiveTab] = useState("buy");

  // Mock P2P orders data with more merchants and currencies
  const p2pOrders = [
    {
      id: 1,
      merchant: "CryptoKing99",
      rating: 4.9,
      trades: 1250,
      price: 109500,
      available: 0.5,
      min: 500,
      max: 25000,
      payment: ["Bank Transfer", "PayPal"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "USA"
    },
    {
      id: 2,
      merchant: "BitcoinMaster",
      rating: 4.8,
      trades: 890,
      price: 109400,
      available: 1.2,
      min: 100,
      max: 50000,
      payment: ["Cash App", "Zelle"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "USA"
    },
    {
      id: 3,
      merchant: "SafeTrader",
      rating: 5.0,
      trades: 2100,
      price: 109600,
      available: 0.8,
      min: 1000,
      max: 30000,
      payment: ["Bank Transfer", "Wise"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "UK"
    },
    {
      id: 4,
      merchant: "QuickBuy24",
      rating: 4.7,
      trades: 650,
      price: 109200,
      available: 2.1,
      min: 200,
      max: 15000,
      payment: ["Venmo", "Cash App"],
      type: "sell",
      verified: false,
      currency: "BTC",
      country: "USA"
    },
    {
      id: 5,
      merchant: "EthereumPro",
      rating: 4.9,
      trades: 1580,
      price: 2501,
      available: 15.3,
      min: 300,
      max: 40000,
      payment: ["Bank Transfer", "Wise", "PayPal"],
      type: "sell",
      verified: true,
      currency: "ETH",
      country: "Netherlands"
    },
    {
      id: 6,
      merchant: "CryptoElite",
      rating: 4.6,
      trades: 823,
      price: 2498,
      available: 8.7,
      min: 150,
      max: 20000,
      payment: ["Cash App", "Zelle"],
      type: "sell",
      verified: true,
      currency: "ETH",
      country: "USA"
    },
    {
      id: 7,
      merchant: "SolanaTrader",
      rating: 4.8,
      trades: 945,
      price: 152,
      available: 120.5,
      min: 50,
      max: 10000,
      payment: ["Bank Transfer", "Venmo"],
      type: "sell",
      verified: true,
      currency: "SOL",
      country: "Portugal"
    },
    {
      id: 8,
      merchant: "USDTExchange",
      rating: 4.9,
      trades: 2350,
      price: 1.00,
      available: 50000,
      min: 100,
      max: 100000,
      payment: ["Bank Transfer", "Wise", "PayPal", "Zelle"],
      type: "sell",
      verified: true,
      currency: "USDT",
      country: "Hong Kong"
    },
    {
      id: 9,
      merchant: "DogeTrader",
      rating: 4.5,
      trades: 567,
      price: 0.17,
      available: 100000,
      min: 20,
      max: 5000,
      payment: ["Cash App", "Venmo"],
      type: "sell",
      verified: true,
      currency: "DOGE",
      country: "USA"
    },
    {
      id: 10,
      merchant: "ADAMaster",
      rating: 4.7,
      trades: 798,
      price: 0.45,
      available: 25000,
      min: 50,
      max: 8000,
      payment: ["Bank Transfer", "PayPal"],
      type: "sell",
      verified: true,
      currency: "ADA",
      country: "Italy"
    },
    {
      id: 11,
      merchant: "XRPTrader",
      rating: 4.6,
      trades: 1123,
      price: 0.62,
      available: 30000,
      min: 30,
      max: 12000,
      payment: ["Wise", "Zelle"],
      type: "sell",
      verified: true,
      currency: "XRP",
      country: "Spain"
    },
    {
      id: 12,
      merchant: "LTCExchange",
      rating: 4.8,
      trades: 674,
      price: 89.50,
      available: 55.2,
      min: 100,
      max: 15000,
      payment: ["Bank Transfer", "Cash App"],
      type: "sell",
      verified: true,
      currency: "LTC",
      country: "USA"
    },
    {
      id: 13,
      merchant: "TokyoBitcoin",
      rating: 4.9,
      trades: 1890,
      price: 109300,
      available: 2.3,
      min: 1000,
      max: 80000,
      payment: ["Bank Transfer", "PayPal"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "Japan"
    },
    {
      id: 14,
      merchant: "LondonCrypto",
      rating: 4.7,
      trades: 1456,
      price: 109800,
      available: 1.8,
      min: 500,
      max: 45000,
      payment: ["Bank Transfer", "Wise"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "UK"
    },
    {
      id: 15,
      merchant: "SingaporeETH",
      rating: 4.8,
      trades: 967,
      price: 2495,
      available: 12.7,
      min: 200,
      max: 35000,
      payment: ["Bank Transfer", "PayPal", "Wise"],
      type: "sell",
      verified: true,
      currency: "ETH",
      country: "Singapore"
    },
    {
      id: 16,
      merchant: "CanadianTrader",
      rating: 4.6,
      trades: 723,
      price: 109100,
      available: 0.9,
      min: 300,
      max: 25000,
      payment: ["Bank Transfer", "Interac"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "Canada"
    },
    {
      id: 17,
      merchant: "BerlinSOL",
      rating: 4.9,
      trades: 1123,
      price: 151,
      available: 89.4,
      min: 100,
      max: 18000,
      payment: ["SEPA", "Bank Transfer"],
      type: "sell",
      verified: true,
      currency: "SOL",
      country: "Germany"
    },
    {
      id: 18,
      merchant: "AussieCrypto",
      rating: 4.5,
      trades: 845,
      price: 109700,
      available: 1.5,
      min: 400,
      max: 30000,
      payment: ["Bank Transfer", "PayID"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "Australia"
    },
    {
      id: 19,
      merchant: "BrazilUSDT",
      rating: 4.7,
      trades: 1567,
      price: 1.01,
      available: 75000,
      min: 150,
      max: 50000,
      payment: ["PIX", "Bank Transfer"],
      type: "sell",
      verified: true,
      currency: "USDT",
      country: "Brazil"
    },
    {
      id: 20,
      merchant: "SwissBTC",
      rating: 5.0,
      trades: 2890,
      price: 110200,
      available: 3.2,
      min: 2000,
      max: 100000,
      payment: ["Bank Transfer", "PostFinance"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "Switzerland"
    },
    {
      id: 21,
      merchant: "KoreanETH",
      rating: 4.8,
      trades: 1234,
      price: 2503,
      available: 18.9,
      min: 250,
      max: 40000,
      payment: ["Bank Transfer", "KakaoPay"],
      type: "sell",
      verified: true,
      currency: "ETH",
      country: "South Korea"
    },
    {
      id: 22,
      merchant: "DubaiDOGE",
      rating: 4.4,
      trades: 678,
      price: 0.168,
      available: 150000,
      min: 50,
      max: 8000,
      payment: ["Bank Transfer", "Wise"],
      type: "sell",
      verified: false,
      currency: "DOGE",
      country: "UAE"
    },
    {
      id: 23,
      merchant: "FrenchADA",
      rating: 4.6,
      trades: 1089,
      price: 0.46,
      available: 45000,
      min: 80,
      max: 12000,
      payment: ["SEPA", "Bank Transfer"],
      type: "sell",
      verified: true,
      currency: "ADA",
      country: "France"
    },
    {
      id: 24,
      merchant: "NordicXRP",
      rating: 4.9,
      trades: 1456,
      price: 0.61,
      available: 55000,
      min: 100,
      max: 15000,
      payment: ["Bank Transfer", "Swish"],
      type: "sell",
      verified: true,
      currency: "XRP",
      country: "Sweden"
    },
    {
      id: 25,
      merchant: "IndianLTC",
      rating: 4.3,
      trades: 567,
      price: 88.75,
      available: 78.5,
      min: 50,
      max: 10000,
      payment: ["UPI", "Bank Transfer"],
      type: "sell",
      verified: true,
      currency: "LTC",
      country: "India"
    },
    {
      id: 26,
      merchant: "RussianBTC",
      rating: 4.7,
      trades: 1789,
      price: 109000,
      available: 2.8,
      min: 800,
      max: 60000,
      payment: ["Bank Transfer", "Qiwi"],
      type: "sell",
      verified: true,
      currency: "BTC",
      country: "Russia"
    },
    {
      id: 27,
      merchant: "MexicanUSDT",
      rating: 4.5,
      trades: 934,
      price: 1.02,
      available: 90000,
      min: 100,
      max: 25000,
      payment: ["SPEI", "Bank Transfer"],
      type: "sell",
      verified: true,
      currency: "USDT",
      country: "Mexico"
    },
    {
      id: 28,
      merchant: "TurkishSOL",
      rating: 4.4,
      trades: 612,
      price: 153.50,
      available: 67.3,
      min: 75,
      max: 12000,
      payment: ["Bank Transfer", "Papara"],
      type: "sell",
      verified: false,
      currency: "SOL",
      country: "Turkey"
    }
  ];

  const handleTrade = (orderId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start P2P trading.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Trade Initiated",
      description: "Opening trade chat with merchant...",
    });
  };

  const getPaymentIcon = (payment: string) => {
    switch (payment.toLowerCase()) {
      case 'bank transfer':
        return <Banknote className="w-4 h-4" />;
      case 'paypal':
      case 'venmo':
      case 'cash app':
      case 'zelle':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Professional Bitcoin Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-bitcoin-orange rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gold rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-purple-500 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>
        {/* Animated Bitcoin Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 text-bitcoin-orange/20 bitcoin-float">
            <Bitcoin size={48} />
          </div>
          <div className="absolute top-1/3 right-1/3 text-gold/20 bitcoin-float" style={{ animationDelay: '1s' }}>
            <Bitcoin size={36} />
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-blue-400/20 bitcoin-float" style={{ animationDelay: '2s' }}>
            <Bitcoin size={42} />
          </div>
        </div>
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300">
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-bitcoin-orange to-gold rounded-full flex items-center justify-center bitcoin-glow">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">P2P Trading</h1>
                <p className="text-xl text-white/80">Trade directly with other users</p>
              </div>
            </div>
            <p className="text-white/70 max-w-3xl">
              Connect with verified traders worldwide for secure peer-to-peer cryptocurrency transactions. 
              Choose your preferred payment method and trade at competitive rates.
            </p>
          </div>

          {/* Trading Interface */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Filter size={20} />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-white/90">Cryptocurrency</Label>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        <SelectItem value="SOL">Solana (SOL)</SelectItem>
                        <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                        <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                        <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                        <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/90">Payment Method</Label>
                    <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="cashapp">Cash App</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="zelle">Zelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/90">Search Merchant</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                      <Input
                        placeholder="Merchant name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Tips */}
              <Card className="mt-6 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Shield size={20} />
                    <span>Safety Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start space-x-2">
                    <Shield className="text-green-400 mt-0.5" size={16} />
                    <span>Only trade with verified merchants</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="text-blue-400 mt-0.5" size={16} />
                    <span>Check payment time limits</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="text-purple-400 mt-0.5" size={16} />
                    <span>Use our chat system only</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            <div className="lg:col-span-3">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">P2P Marketplace</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
                      <TabsTrigger value="buy" className="text-green-400 data-[state=active]:bg-green-400/20">Buy {selectedAsset}</TabsTrigger>
                      <TabsTrigger value="sell" className="text-red-400 data-[state=active]:bg-red-400/20">Sell {selectedAsset}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="buy" className="space-y-4">
                    {p2pOrders.filter(order => order.currency === selectedAsset).map((order) => (
                      <Card key={order.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:border-bitcoin-orange/50 transition-all duration-300 bitcoin-glow">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                            {/* Merchant Info */}
                            <div className="md:col-span-2">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.merchant}`} />
                                  <AvatarFallback className="bg-bitcoin-orange text-white">{order.merchant.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-white">{order.merchant}</span>
                                    {order.verified && (
                                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30">
                                        <Shield size={12} className="mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1 text-sm text-white/60">
                                    <Star className="text-yellow-400" size={14} />
                                    <span>{order.rating}</span>
                                    <span>({order.trades} trades)</span>
                                  </div>
                                  <div className="text-xs text-white/50 mt-1">
                                    📍 {order.country}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Price & Available */}
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">
                                ${order.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-white/60">
                                {order.available} {order.currency} available
                              </div>
                            </div>

                            {/* Limits */}
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">
                                ${order.min.toLocaleString()} - ${order.max.toLocaleString()}
                              </div>
                              <div className="text-xs text-white/60">Limit</div>
                            </div>

                            {/* Payment Methods */}
                            <div>
                              <div className="flex flex-wrap gap-1">
                                {order.payment.map((method, index) => (
                                  <Badge key={index} variant="outline" className="text-xs text-white/80 border-white/30">
                                    <div className="flex items-center space-x-1">
                                      {getPaymentIcon(method)}
                                      <span>{method}</span>
                                    </div>
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Action Button */}
                            <div>
                              <Button 
                                onClick={() => handleTrade(order.id)}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                              >
                                Buy
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4">
                    <div className="text-center py-12">
                      <Bitcoin className="mx-auto text-bitcoin-orange mb-4" size={48} />
                      <h3 className="text-xl font-semibold text-white mb-2">Create Your Sell Order</h3>
                      <p className="text-white/70 mb-6">Set your price and payment methods to start selling {selectedAsset}</p>
                      <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg">
                        Create Sell Order
                      </Button>
                    </div>
                  </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Escrow</h3>
              <p className="text-white/70">Your funds are held in secure escrow until trade completion</p>
            </Card>

            <Card className="text-center p-6 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-white/70">Communicate directly with merchants through our secure chat</p>
            </Card>

            <Card className="text-center p-6 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Settlement</h3>
              <p className="text-white/70">Quick trade execution with automated dispute resolution</p>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}