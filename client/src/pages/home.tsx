import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PriceTicker from "@/components/crypto/price-ticker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Play, 
  Shield, 
  TrendingUp, 
  ChartLine, 
  Box, 
  Code, 
  AreaChart, 
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  DollarSign,
  BarChart3,
  CreditCard,
  Globe,
  Zap,
  MessageCircle,
  Link as LinkIcon,
  Bitcoin,
  Coins
} from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional Bitcoin-themed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-bitcoin-orange rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gold rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-purple-500 rounded-full blur-3xl animate-pulse delay-3000"></div>
          <div className="absolute top-60 left-1/2 w-20 h-20 bg-green-500 rounded-full blur-2xl animate-pulse delay-4000"></div>
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
          <div className="absolute top-1/2 right-1/4 text-purple-400/20 bitcoin-float" style={{ animationDelay: '3s' }}>
            <Coins size={40} />
          </div>
        </div>
        {/* Quotex Logo Pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="text-9xl font-bold text-white transform rotate-12">Q</div>
        </div>
      </div>
      
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Be early to the future<br />of <span className="text-bitcoin-orange">finance</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Buy Bitcoin, Ethereum, and other leading cryptocurrencies on a platform trusted by millions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Input
              type="email"
              placeholder="Your email address"
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-bitcoin-orange min-w-80 text-white placeholder-white/60 backdrop-blur-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-bitcoin-orange to-gold text-white px-8 py-3 rounded-lg hover:from-gold hover:to-bitcoin-orange transition-all duration-300 font-semibold bitcoin-glow">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        </section>

        <PriceTicker />

        {/* Create Account Section */}
        <section id="create-account" className="py-20 bg-black/20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-12 border border-white/20 bitcoin-glow">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-bitcoin-orange to-gold rounded-full flex items-center justify-center bitcoin-glow">
                <Users className="text-white text-3xl" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Create Your Account</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join millions of users who trust QuotexWallet with their cryptocurrency investments. Get started in just minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-bitcoin-orange to-gold text-white px-10 py-4 rounded-lg hover:from-gold hover:to-bitcoin-orange transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold text-lg bitcoin-glow">
                  Create Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-lg transition-all duration-300 font-semibold text-lg backdrop-blur-md">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <CheckCircle className="text-green-400 mx-auto mb-2" size={24} />
                <p className="text-sm text-white/70">Secure & Trusted</p>
              </div>
              <div>
                <CheckCircle className="text-green-400 mx-auto mb-2" size={24} />
                <p className="text-sm text-white/70">Easy Setup</p>
              </div>
              <div>
                <CheckCircle className="text-green-400 mx-auto mb-2" size={24} />
                <p className="text-sm text-white/70">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Wallet Section */}
        <section id="wallet" className="py-20 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Wallet</h2>
            <h3 className="text-2xl font-semibold text-gray-700">The only crypto wallet you'll ever need</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <CreditCard className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Buy, sell, and swap with ease</h4>
                  <p className="text-gray-600">Use a card or bank account to buy BTC, ETH, stablecoins, and other assets.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Earn rewards on your crypto</h4>
                  <p className="text-gray-600">Get up to 10% in annual rewards by putting your crypto to work.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <Shield className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Self-custody your crypto</h4>
                  <p className="text-gray-600">Sleep better at night knowing only you can access your funds.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <LinkIcon className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Connect to DeFi</h4>
                  <p className="text-gray-600">Use dapps, collect NFTs, and unlock the power of web3.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold">
                    Open Wallet
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg transition-all duration-300 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern wallet interface showcase"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fw-blue/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Section */}
      <section id="exchange" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Exchange</h2>
            <h3 className="text-2xl font-semibold text-gray-700">Lightning-fast crypto trading</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Financial trading dashboard interface"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fw-blue/20 to-transparent rounded-2xl"></div>
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Globe className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Trade in 3 fiat currencies</h4>
                  <p className="text-gray-600">The Exchange supports USD, EUR, and GBP.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">A matching engine that can keep up with you</h4>
                  <p className="text-gray-600">The world's fastest crypto matching engine, built by and for traders.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <MessageCircle className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">24/7 live chat support</h4>
                  <p className="text-gray-600">Chat with customer support directly in the Exchange, anytime.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <BarChart3 className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Margin Trading</h4>
                  <p className="text-gray-600">Integrated margin trading tools for advanced strategies.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href="/exchange">
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold">
                    Start Trading
                  </Button>
                </Link>
                <Link href="/trading">
                  <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg transition-all duration-300 font-semibold">
                    View Markets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* P2P Trading Section */}
      <section id="p2p" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">P2P Trading</h2>
            <h3 className="text-2xl font-semibold text-gray-700">Trade directly with users worldwide</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Direct peer-to-peer trading</h4>
                  <p className="text-gray-600">Connect with verified traders and exchange crypto using your preferred payment methods.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure escrow protection</h4>
                  <p className="text-gray-600">Your funds are safely held in escrow until both parties complete the transaction.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time chat support</h4>
                  <p className="text-gray-600">Communicate with traders through our secure messaging system with dispute resolution.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Multiple payment options</h4>
                  <p className="text-gray-600">Bank transfers, PayPal, Cash App, Venmo, Zelle, and more payment methods supported.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href="/p2p">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold">
                    Start P2P Trading
                  </Button>
                </Link>
                <Link href="/exchange">
                  <Button variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg transition-all duration-300 font-semibold">
                    View Marketplace
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="People connecting and trading globally"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Section */}
      <section id="institutional" className="py-20 bg-fw-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Institutional</h2>
            <h3 className="text-2xl font-semibold text-gray-300 mb-8">High-touch crypto solutions for institutions</h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Spot OTC, derivatives, structured products, and margin lending.
            </p>
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400"
              alt="Financial technology and institutional services"
              className="rounded-2xl shadow-2xl w-full h-64 object-cover mb-8"
            />
            <div className="flex space-x-4 justify-center">
              <Link href="/institutional">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold">
                  Become a Client
                </Button>
              </Link>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-fw-dark px-8 py-3 rounded-lg transition-all duration-300 font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section id="explore" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore</h2>
            <h3 className="text-2xl font-semibold text-gray-700">Financial data is in our DNA</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChartLine className="text-fw-blue text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time crypto prices</h4>
              <p className="text-gray-600">Get the latest prices and charts along with key market signals.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Box className="text-fw-blue text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Explore the top blockchains</h4>
              <p className="text-gray-600">Confirm transactions, analyze the market, or simply learn more about crypto.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="text-fw-blue text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Powerful Data API</h4>
              <p className="text-gray-600">We've powered exchanges, data analysts, enthusiasts, and more.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AreaChart className="text-fw-blue text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Industry leading charts</h4>
              <p className="text-gray-600">From hashrate, to block details, to mining information, and more.</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=500"
              alt="Investment charts and graphs showcase"
              className="rounded-2xl shadow-2xl w-full h-80 object-cover mb-8"
            />
            <div className="flex space-x-4 justify-center">
              <Link href="/explorer">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold">
                  Start Exploring
                </Button>
              </Link>
              <Link href="/trading">
                <Button variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-lg transition-all duration-300 font-semibold">
                  View Charts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section id="admin" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Admin</h2>
            <h3 className="text-2xl font-semibold text-gray-700">System Administration</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-red-600 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">User Management</h4>
              <p className="text-gray-600">Manage user accounts, permissions, and access controls.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-red-600 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Balance Management</h4>
              <p className="text-gray-600">Credit, debit, and monitor user wallet balances across all currencies.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-red-600 text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">System Analytics</h4>
              <p className="text-gray-600">View comprehensive reports and system performance metrics.</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=500"
              alt="Admin dashboard and analytics interface"
              className="rounded-2xl shadow-2xl w-full h-80 object-cover mb-8"
            />
            <Link href="/admin">
              <Button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Access Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-fw-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Let us take you from zero to crypto</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of users who trust QuotexWallet for their cryptocurrency journey.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-white text-fw-blue px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
              Get started
            </Button>
          </Link>
        </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}