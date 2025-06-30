import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  Clock
} from "lucide-react";
import { useState } from "react";

export default function Institutional() {
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
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-fw-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Institutional</h1>
            <h2 className="text-3xl font-semibold text-gray-300 mb-8">
              High-touch crypto solutions for institutions
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Spot OTC, derivatives, structured products, and margin lending designed for institutional-grade requirements.
            </p>
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400"
              alt="Financial technology and institutional services"
              className="rounded-2xl shadow-2xl w-full h-64 object-cover mb-8"
            />
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
            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="text-fw-blue text-2xl" />
                </div>
                <CardTitle className="text-xl">OTC Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Large block trades with minimal market impact. Access deep liquidity pools for institutional-size transactions.
                </p>
                <Badge variant="secondary">$100M+ daily volume</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-fw-blue text-2xl" />
                </div>
                <CardTitle className="text-xl">Derivatives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Futures, options, and structured products for sophisticated hedging and trading strategies.
                </p>
                <Badge variant="secondary">Multi-asset exposure</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-fw-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-fw-blue text-2xl" />
                </div>
                <CardTitle className="text-xl">Lending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Margin lending and borrowing services with competitive rates and flexible terms.
                </p>
                <Badge variant="secondary">Up to 10x leverage</Badge>
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
                    "FutureWallet's OTC desk provides the liquidity and execution quality we need for our large crypto allocations."
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
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                    <Mail className="text-fw-blue text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">institutional@futurewallet.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fw-light-blue rounded-xl flex items-center justify-center">
                    <Building2 className="text-fw-blue text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Office</p>
                    <p className="text-gray-600">New York • London • Singapore</p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Company name"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Your position/title"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aum">Assets Under Management</Label>
                    <Select onValueChange={(value) => handleInputChange("assetsUnderManagement", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                        <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                        <SelectItem value="100m-500m">$100M - $500M</SelectItem>
                        <SelectItem value="500m-1b">$500M - $1B</SelectItem>
                        <SelectItem value="1b+">$1B+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="services">Services of Interest</Label>
                    <Select onValueChange={(value) => handleInputChange("services", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="otc">OTC Trading</SelectItem>
                        <SelectItem value="derivatives">Derivatives</SelectItem>
                        <SelectItem value="lending">Lending</SelectItem>
                        <SelectItem value="custody">Custody</SelectItem>
                        <SelectItem value="prime">Prime Services</SelectItem>
                        <SelectItem value="all">All Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your requirements..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-fw-blue hover:bg-blue-700">
                    Submit Request
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
