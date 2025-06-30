import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PriceTicker from "@/components/crypto/price-ticker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CreditCard, TrendingUp, Shield, Link as LinkIcon, Globe, Zap, MessageCircle, BarChart3, ChartLine, Box, Code, AreaChart } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-fw-light-blue to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Be early to the future<br />of finance
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Buy Bitcoin, Ethereum, and other leading cryptocurrencies on a platform trusted by millions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Input
              type="email"
              placeholder="Your email address"
              className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fw-blue min-w-80"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Link href="/auth/signup">
              <Button className="bg-fw-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PriceTicker />

      {/* Wallet Section */}
      <section id="wallet" className="py-20 bg-white">
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
              <Link href="/auth/signup">
                <Button className="bg-fw-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Get started
                </Button>
              </Link>
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
              <Link href="/trading">
                <Button className="bg-fw-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Trade Now
                </Button>
              </Link>
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
            <Link href="/institutional">
              <Button className="bg-white text-fw-dark px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                Become a client
              </Button>
            </Link>
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
            <Link href="/explorer">
              <Button className="bg-fw-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Explore now
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
  );
}
