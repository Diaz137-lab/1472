import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Users, AlertTriangle, CheckCircle, Key, Smartphone } from "lucide-react";

export default function Security() {
  const securityFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Multi-Layer Security",
      description: "Advanced encryption and security protocols protect your funds at every level.",
      features: ["256-bit SSL encryption", "Cold storage for 95% of funds", "Regular security audits"]
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account with 2FA protection.",
      features: ["SMS verification", "Authenticator apps", "Hardware security keys"]
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description: "24/7 monitoring system detects and prevents suspicious activities.",
      features: ["Fraud detection", "Account monitoring", "Login alerts"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Regulatory Compliance",
      description: "Fully compliant with international financial regulations and standards.",
      features: ["KYC/AML compliance", "GDPR compliant", "Licensed operations"]
    }
  ];

  const securityTips = [
    {
      title: "Enable Two-Factor Authentication",
      description: "Add 2FA to your account for enhanced security",
      status: "recommended"
    },
    {
      title: "Use a Strong Password",
      description: "Create a unique, complex password for your account",
      status: "essential"
    },
    {
      title: "Verify Email Notifications",
      description: "Always verify login and transaction notifications",
      status: "recommended"
    },
    {
      title: "Keep Software Updated",
      description: "Regularly update your devices and browsers",
      status: "important"
    },
    {
      title: "Use Official Channels",
      description: "Only access QuotexWallet through official websites and apps",
      status: "critical"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "essential":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "important":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

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
              Security Center
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your security is our top priority. Learn about our security measures and how to protect your account.
            </p>
          </div>

          {/* Security Overview */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Security Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-purple-300 mb-4">
                    <Shield className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Bank-Level Security</h3>
                  <p className="text-gray-300">Same security standards as major financial institutions</p>
                </div>
                <div className="text-center">
                  <div className="text-purple-300 mb-4">
                    <Lock className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">95% Cold Storage</h3>
                  <p className="text-gray-300">Your funds are stored offline in secure vaults</p>
                </div>
                <div className="text-center">
                  <div className="text-purple-300 mb-4">
                    <Eye className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">24/7 Monitoring</h3>
                  <p className="text-gray-300">Continuous monitoring and fraud detection</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Security Features</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <div className="text-purple-300 mb-2">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Security Best Practices</h2>
            <div className="space-y-4">
              {securityTips.map((tip, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(tip.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
                          <p className="text-gray-300">{tip.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Security Issues */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white">Report Security Issues</CardTitle>
              <CardDescription className="text-gray-300">
                Found a security vulnerability? We appreciate responsible disclosure and offer rewards for valid reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Security Contact</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <strong className="text-white">Email:</strong> security@quotexes.online
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Phone:</strong> (672) 380-5729
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Response Time:</strong> Within 24 hours
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Bug Bounty Program</h3>
                  <p className="text-gray-300 mb-4">
                    We reward security researchers who help us keep QuotexWallet secure. Report valid vulnerabilities and earn rewards.
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Learn About Bug Bounty
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}