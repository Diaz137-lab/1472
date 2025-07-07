import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ArrowLeft, Wallet, Plus, CreditCard } from "lucide-react";

export default function SmartWallet() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  // If user is authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  // If not authenticated, show wallet creation prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          {/* Main Content */}
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12 border border-blue-100">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Wallet className="text-white text-4xl" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Your Wallet</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                To access your cryptocurrency wallet, you need to create an account or sign in to your existing account.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-semibold text-lg flex items-center space-x-2">
                    <Plus size={20} />
                    <span>Create Account</span>
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-lg transition-all duration-300 font-semibold text-lg flex items-center space-x-2">
                    <CreditCard size={20} />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Wallet className="text-blue-600" size={24} />
                    </div>
                    <CardTitle className="text-lg text-gray-900">Secure Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Your crypto is protected with industry-leading security</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="text-blue-600" size={24} />
                    </div>
                    <CardTitle className="text-lg text-gray-900">Easy Trading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Buy, sell, and swap cryptocurrencies with ease</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Plus className="text-blue-600" size={24} />
                    </div>
                    <CardTitle className="text-lg text-gray-900">Portfolio Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Monitor your investments and track performance</p>
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

  // This shouldn't render as useEffect redirects authenticated users
  return null;
}