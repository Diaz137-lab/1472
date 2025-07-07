import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SmartAddressInput from "@/components/ui/smart-address-input";
import BitcoinFormValidator from "@/components/ui/bitcoin-form-validator";
import BitcoinPriceDisplay from "@/components/ui/bitcoin-price-display";
import { 
  Building2, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap, 
  Phone, 
  Mail, 
  CheckCircle,
  BarChart3,
  DollarSign,
  Clock,
  Bitcoin,
  Coins,
  TrendingDown,
  Sparkles,
  Star,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Institutional() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    assetsUnderManagement: "",
    services: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.company || !formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Company, Name, Email, Message).",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Request Submitted Successfully",
      description: "Our institutional team will contact you within 24 hours.",
    });

    // Reset form
    setFormData({
      company: "",
      name: "",
      email: "",
      phone: "",
      position: "",
      assetsUnderManagement: "",
      services: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-fw-dark via-black to-bitcoin-dark text-white py-20 overflow-hidden">
        {/* Floating Bitcoin animations */}
        <div className="absolute inset-0 overflow-hidden">
          <Bitcoin className="absolute top-20 left-10 w-8 h-8 text-bitcoin-orange/20 bitcoin-float" style={{animationDelay: '0s'}} />
          <Coins className="absolute top-40 right-20 w-6 h-6 text-gold/30 bitcoin-float" style={{animationDelay: '1s'}} />
          <Bitcoin className="absolute bottom-32 left-1/4 w-4 h-4 text-bitcoin-orange/15 bitcoin-float" style={{animationDelay: '2s'}} />
          <Sparkles className="absolute top-60 right-1/3 w-5 h-5 text-gold/25 bitcoin-float" style={{animationDelay: '0.5s'}} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <div className="mb-8 text-left">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-3 bg-bitcoin-gradient rounded-2xl bitcoin-glow">
                <Bitcoin className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-bitcoin-orange to-gold bg-clip-text text-transparent">
                Institutional
              </h1>
            </div>
            
            <h2 className="text-4xl font-semibold text-gray-300 mb-8">
              High-touch <span className="text-bitcoin-orange">Bitcoin</span> solutions for institutions
            </h2>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional Bitcoin trading, custody, and financial services designed for institutional-grade requirements. 
              Powered by cutting-edge blockchain technology.
            </p>

            {/* Live Bitcoin price ticker */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="bg-bitcoin-gradient/20 backdrop-blur-sm rounded-xl px-8 py-4 border border-bitcoin-orange/30 shadow-lg">
                <BitcoinPriceDisplay 
                  className="text-white" 
                  showDetails={true}
                  animated={true}
                />
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 bitcoin-glow">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"
                alt="Bitcoin and institutional trading technology"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-orange/20 to-gold/20"></div>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <Badge className="bg-bitcoin-gradient text-white border-0 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Bitcoin Native
              </Badge>
              <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Institutional Grade
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                24/7 Trading
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Institutional Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive crypto solutions tailored for banks, hedge funds, family offices, and other institutional clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-bitcoin-orange/20 hover:border-bitcoin-orange/40 bitcoin-glow">
              <CardHeader>
                <div className="w-16 h-16 bg-bitcoin-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 bitcoin-float">
                  <Bitcoin className="text-white text-2xl" />
                </div>
                <CardTitle className="text-xl text-gray-900">Bitcoin OTC Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Large Bitcoin block trades with minimal market impact. Access deep liquidity pools for institutional-size Bitcoin transactions.
                </p>
                <Badge className="bg-bitcoin-gradient text-white border-0">$100M+ daily volume</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-gold/20 hover:border-gold/40">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 bitcoin-float" style={{animationDelay: '0.2s'}}>
                  <TrendingUp className="text-white text-2xl" />
                </div>
                <CardTitle className="text-xl text-gray-900">Bitcoin Derivatives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Bitcoin futures, options, and structured products for sophisticated hedging and trading strategies in the crypto market.
                </p>
                <Badge className="bg-gold text-white border-0">Multi-crypto exposure</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-green-500/20 hover:border-green-500/40">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 bitcoin-float" style={{animationDelay: '0.4s'}}>
                  <Coins className="text-white text-2xl" />
                </div>
                <CardTitle className="text-xl text-gray-900">Crypto Lending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Bitcoin and crypto margin lending services with competitive rates and flexible terms backed by digital assets.
                </p>
                <Badge className="bg-green-500 text-white border-0">Up to 10x leverage</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-fw-blue text-2xl" />
                </div>
                <CardTitle className="text-xl">Custody</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Institutional-grade custody solutions with multi-signature security and insurance coverage.
                </p>
                <Badge variant="secondary">$2B+ in custody</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-fw-blue text-2xl" />
                </div>
                <CardTitle className="text-xl">Prime Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive trading infrastructure with direct market access and portfolio management tools.
                </p>
                <Badge variant="secondary">White-glove service</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-fw-blue text-2xl" />
                </div>
                <CardTitle className="text-xl">API Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Enterprise-grade APIs for seamless integration with existing trading and risk management systems.
                </p>
                <Badge variant="secondary">99.99% uptime</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Leading Institutions Choose Us</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <Shield className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Regulatory Compliance</h3>
                  <p className="text-gray-600">
                    Full compliance with global financial regulations including AML, KYC, and institutional reporting requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <Clock className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Dedicated relationship managers and round-the-clock technical support for uninterrupted operations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Deep Liquidity</h3>
                  <p className="text-gray-600">
                    Access to the deepest liquidity pools in the market with minimal slippage on large orders.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                  <Building2 className="text-fw-blue text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Institutional Infrastructure</h3>
                  <p className="text-gray-600">
                    Enterprise-grade technology built for the demands of institutional trading and risk management.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Institutional trading environment"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Leading Institutions</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="w-5 h-5 text-fw-success" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "QuotexWallet's OTC desk provides the liquidity and execution quality we need for our large crypto allocations."
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm text-gray-600">CIO, Quantum Capital</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="w-5 h-5 text-fw-success" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "The derivatives platform has enabled us to implement sophisticated hedging strategies for our crypto portfolio."
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Michael Rodriguez</p>
                  <p className="text-sm text-gray-600">Head of Trading, Alpine Hedge Fund</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="w-5 h-5 text-fw-success" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "Their custody solution gives us the security and compliance framework required for institutional crypto investing."
                  </p>
                </div>
                <div>
                  <p className="font-semibold">David Thompson</p>
                  <p className="text-sm text-gray-600">CEO, Sterling Family Office</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Become a Client</h2>
              <p className="text-xl text-gray-600 mb-8">
                Ready to access institutional-grade crypto services? Our team will work with you to develop a customized solution.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                    <Phone className="text-fw-blue text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">(573) 401-4160 • (940) 618-3710</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                    <Mail className="text-fw-blue text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">support.quotex@quotexes.online</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                    <Building2 className="text-fw-blue text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Office</p>
                    <p className="text-gray-600">8666 Nolan Loop, Belton, Texas 76513</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-bitcoin-orange/20 shadow-xl">
              <CardHeader className="bg-bitcoin-gradient/5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-bitcoin-gradient rounded-lg">
                    <Bitcoin className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Request Bitcoin Institutional Services</CardTitle>
                </div>
                <p className="text-gray-600">Get started with our premium Bitcoin trading and custody solutions</p>
              </CardHeader>
              <CardContent className="p-6">
                {/* Enhanced Contact Information */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-bitcoin-orange" />
                      <span>Company Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company"
                      placeholder="Your company name..."
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      required
                      className="border-bitcoin-orange/30 focus:border-bitcoin-orange"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-bitcoin-orange" />
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name..."
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="border-bitcoin-orange/30 focus:border-bitcoin-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-bitcoin-orange" />
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="border-bitcoin-orange/30 focus:border-bitcoin-orange"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-bitcoin-orange" />
                      <span>Phone Number</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-bitcoin-orange/30 focus:border-bitcoin-orange"
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="position" className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-bitcoin-orange" />
                      <span>Position/Title</span>
                    </Label>
                    <Input
                      id="position"
                      placeholder="CEO, CTO, Fund Manager, etc."
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      className="border-bitcoin-orange/30 focus:border-bitcoin-orange"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aum" className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-bitcoin-orange" />
                      <span>Assets Under Management</span>
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("assetsUnderManagement", value)}>
                      <SelectTrigger className="border-bitcoin-orange/30 focus:border-bitcoin-orange">
                        <SelectValue placeholder="Select your AUM range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                        <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                        <SelectItem value="100m-500m">$100M - $500M</SelectItem>
                        <SelectItem value="500m-1b">$500M - $1B</SelectItem>
                        <SelectItem value="1b+">$1B+ (Whale Status 🐋)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="services" className="flex items-center space-x-2">
                      <Bitcoin className="w-4 h-4 text-bitcoin-orange" />
                      <span>Bitcoin Services of Interest</span>
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("services", value)}>
                      <SelectTrigger className="border-bitcoin-orange/30 focus:border-bitcoin-orange">
                        <SelectValue placeholder="Select Bitcoin services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="otc">Bitcoin OTC Trading</SelectItem>
                        <SelectItem value="derivatives">Bitcoin Derivatives</SelectItem>
                        <SelectItem value="lending">Bitcoin Lending</SelectItem>
                        <SelectItem value="custody">Bitcoin Custody</SelectItem>
                        <SelectItem value="prime">Bitcoin Prime Services</SelectItem>
                        <SelectItem value="all">All Bitcoin Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-bitcoin-orange" />
                      <span>Message</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your Bitcoin trading requirements, expected volume, and institutional needs..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={4}
                      required
                      className="border-bitcoin-orange/30 focus:border-bitcoin-orange resize-none"
                    />
                  </div>

                  <div className="bg-bitcoin-gradient/10 p-4 rounded-lg border border-bitcoin-orange/20 mb-6">
                    <div className="flex items-center space-x-3">
                      <Bitcoin className="w-6 h-6 text-bitcoin-orange bitcoin-float" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Bitcoin-First Approach</h4>
                        <p className="text-sm text-gray-600">Our institutional services are designed specifically for Bitcoin trading and custody with enterprise-grade security.</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-bitcoin-gradient hover:opacity-90 text-white font-semibold py-3 text-lg bitcoin-glow transition-all duration-300"
                  >
                    <Bitcoin className="w-5 h-5 mr-2" />
                    Submit Bitcoin Service Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
