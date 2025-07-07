import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";

export default function Press() {
  const pressReleases = [
    {
      title: "QuotexWallet Launches Revolutionary P2P Trading Platform",
      date: "July 1, 2025",
      excerpt: "New peer-to-peer trading feature enables secure cryptocurrency exchanges between users with built-in escrow protection.",
      link: "#"
    },
    {
      title: "QuotexWallet Reaches $20 Million in Platform Volume",
      date: "June 15, 2025",
      excerpt: "Platform celebrates major milestone with enhanced security features and expanded cryptocurrency support.",
      link: "#"
    },
    {
      title: "QuotexWallet Partners with Major Financial Institutions",
      date: "May 30, 2025",
      excerpt: "Strategic partnerships bring institutional-grade security and compliance to retail cryptocurrency trading.",
      link: "#"
    }
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
              Press & Media
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest QuotexWallet announcements, partnerships, and industry insights.
            </p>
          </div>

          {/* Press Releases */}
          <div className="grid gap-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Latest Press Releases</h2>
            
            {pressReleases.map((release, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      {release.date}
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read Full Story
                    </Button>
                  </div>
                  <CardTitle className="text-xl text-white">{release.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base">
                    {release.excerpt}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Media Contact */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">Media Contact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Press Inquiries</h3>
                <p className="text-gray-300 mb-4">
                  For media inquiries, interviews, and press materials, please contact our media relations team.
                </p>
                <div className="space-y-2">
                  <p className="text-white">
                    <strong>Email:</strong> press@quotexes.online
                  </p>
                  <p className="text-white">
                    <strong>Phone:</strong> (672) 380-5729
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Brand Assets</h3>
                <p className="text-gray-300 mb-4">
                  Download our official logos, brand guidelines, and media kit.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Download Media Kit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}