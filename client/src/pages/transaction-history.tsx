import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Search, 
  Download,
  Upload,
  ArrowUpDown,
  Users2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllTransactionHistories, 
  formatCurrencyAmount, 
  getStatusColor,
  TransactionHistory 
} from "@/lib/transaction-histories";

export default function TransactionHistoryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("all");

  const allTransactions = getAllTransactionHistories();

  // Filter transactions
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = tx.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (tx.txHash && tx.txHash.includes(searchQuery)) ||
                         (tx.toAddress && tx.toAddress.includes(searchQuery)) ||
                         (tx.fromAddress && tx.fromAddress.includes(searchQuery));
    
    const matchesType = selectedType === "all" || tx.type === selectedType;
    const matchesStatus = selectedStatus === "all" || tx.status === selectedStatus;
    const matchesCurrency = selectedCurrency === "all" || tx.currency === selectedCurrency;
    
    return matchesSearch && matchesType && matchesStatus && matchesCurrency;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit": return <Download className="text-green-400" size={16} />;
      case "withdrawal": return <Upload className="text-red-400" size={16} />;
      case "trade": return <ArrowUpDown className="text-blue-400" size={16} />;
      case "p2p": return <Users2 className="text-orange-400" size={16} />;
      default: return <ArrowUpDown className="text-gray-400" size={16} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="text-green-400" size={16} />;
      case "failed": return <XCircle className="text-red-400" size={16} />;
      case "pending": return <AlertCircle className="text-yellow-400" size={16} />;
      default: return <Clock className="text-gray-400" size={16} />;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Bitcoin-themed animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-bitcoin-orange/10 animate-spin-slow">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
          </svg>
        </div>
        <div className="absolute top-32 right-20 text-bitcoin-orange/5 animate-bounce">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-1/4 text-bitcoin-orange/8 animate-pulse">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
          </svg>
        </div>
      </div>

      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search size={20} />
              Filter Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
                  <Input
                    placeholder="Username, currency, address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="trade">Trades</SelectItem>
                    <SelectItem value="p2p">P2P</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Currency</label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                    <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                    <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                    <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-400">{allTransactions.filter(tx => tx.status === "completed").length}</div>
              <div className="text-sm text-white/60">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-400">{allTransactions.filter(tx => tx.status === "pending").length}</div>
              <div className="text-sm text-white/60">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-400">{allTransactions.filter(tx => tx.status === "failed").length}</div>
              <div className="text-sm text-white/60">Failed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white">{allTransactions.length}</div>
              <div className="text-sm text-white/60">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:border-bitcoin-orange/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* User & Type */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(tx.type)}
                        {getStatusIcon(tx.status)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{tx.username}</div>
                        <div className="text-sm text-white/60 capitalize">{tx.type}</div>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Currency */}
                  <div className="lg:col-span-2 text-center">
                    <div className="font-bold text-white">{formatCurrencyAmount(tx.amount, tx.currency)}</div>
                    <div className="text-sm text-white/60">${tx.amountUSD.toLocaleString()}</div>
                  </div>

                  {/* Status & Payment Method */}
                  <div className="lg:col-span-2 text-center">
                    <Badge variant="outline" className={`mb-1 ${getStatusColor(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </Badge>
                    <div className="text-xs text-white/60">{tx.paymentMethod}</div>
                  </div>

                  {/* Addresses */}
                  <div className="lg:col-span-3">
                    {tx.fromAddress && (
                      <div className="mb-1">
                        <div className="text-xs text-white/50">From:</div>
                        <div className="flex items-center space-x-1">
                          <code className="text-xs text-white/80 font-mono bg-white/10 px-2 py-1 rounded">
                            {tx.fromAddress.slice(0, 8)}...{tx.fromAddress.slice(-6)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(tx.fromAddress!, "From address")}
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      </div>
                    )}
                    {tx.toAddress && (
                      <div>
                        <div className="text-xs text-white/50">To:</div>
                        <div className="flex items-center space-x-1">
                          <code className="text-xs text-white/80 font-mono bg-white/10 px-2 py-1 rounded">
                            {tx.toAddress.slice(0, 8)}...{tx.toAddress.slice(-6)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(tx.toAddress!, "To address")}
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date & Actions */}
                  <div className="lg:col-span-2 text-center">
                    <div className="text-sm text-white">{formatDate(tx.timestamp)}</div>
                    {tx.txHash && (
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => copyToClipboard(tx.txHash!, "Transaction hash")}
                        >
                          <Copy size={12} className="mr-1" />
                          Hash
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => window.open(`https://blockchair.com/search?q=${tx.txHash}`, '_blank')}
                        >
                          <ExternalLink size={12} className="mr-1" />
                          View
                        </Button>
                      </div>
                    )}
                    {tx.status === "failed" && tx.reason && (
                      <div className="text-xs text-red-400 mt-2 max-w-32">
                        {tx.reason}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTransactions.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <div className="text-white/60 mb-4">No transactions found matching your criteria</div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedStatus("all");
                    setSelectedCurrency("all");
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}