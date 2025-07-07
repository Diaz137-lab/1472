import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowLeft, Search, MessageCircle, Book, Shield, CreditCard, Users, HelpCircle } from "lucide-react";

export default function Help() {
  const helpCategories = [
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Trading & Wallets",
      description: "Learn how to buy, sell, and manage your cryptocurrencies",
      articles: 45
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security & Privacy",
      description: "Keep your account and funds secure with best practices",
      articles: 32
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Account Management",
      description: "Manage your profile, settings, and verification",
      articles: 28
    },
    {
      icon: <Book className="h-8 w-8" />,
      title: "Getting Started",
      description: "New to QuotexWallet? Start with the basics",
      articles: 15
    }
  ];

  const popularArticles = [
    "How to create your first wallet",
    "Understanding cryptocurrency trading fees",
    "Setting up two-factor authentication",
    "How to verify your identity",
    "Withdrawing funds to your bank account",
    "P2P trading safety guidelines"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Find answers to your questions and get the support you need.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {helpCategories.map((category, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-purple-300 mb-2">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg text-white">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4">
                    {category.description}
                  </CardDescription>
                  <p className="text-sm text-purple-300">
                    {category.articles} articles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Popular Articles */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6">Popular Articles</h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-white">{article}</p>
                        <HelpCircle className="h-5 w-5 text-purple-300" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Need More Help?</h2>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="text-purple-300 mb-2">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-white">Contact Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4">
                    Can't find what you're looking for? Our support team is here to help.
                  </CardDescription>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-300">Email Support</p>
                      <p className="text-white font-semibold">support.quotex@quotexes.online</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Phone Support</p>
                      <p className="text-white font-semibold">(672) 380-5729</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Office Hours</p>
                      <p className="text-white font-semibold">24/7 Support Available</p>
                    </div>
                  </div>
                  <Link href="/contact">
                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}