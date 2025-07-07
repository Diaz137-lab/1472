import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

export default function Status() {
  const services = [
    {
      name: "Trading Platform",
      status: "operational",
      uptime: "99.9%",
      lastChecked: "2 minutes ago"
    },
    {
      name: "Wallet Services",
      status: "operational",
      uptime: "99.8%",
      lastChecked: "1 minute ago"
    },
    {
      name: "API Services",
      status: "operational",
      uptime: "99.9%",
      lastChecked: "30 seconds ago"
    },
    {
      name: "P2P Trading",
      status: "operational",
      uptime: "99.7%",
      lastChecked: "1 minute ago"
    },
    {
      name: "Mobile App",
      status: "operational",
      uptime: "99.6%",
      lastChecked: "3 minutes ago"
    },
    {
      name: "Customer Support",
      status: "operational",
      uptime: "99.9%",
      lastChecked: "1 minute ago"
    }
  ];

  const incidents = [
    {
      title: "Scheduled Maintenance - Trading Platform",
      status: "resolved",
      date: "July 5, 2025",
      time: "02:00 - 02:30 UTC",
      description: "Routine maintenance completed successfully with no impact on user funds."
    },
    {
      title: "API Rate Limiting Issues",
      status: "resolved",
      date: "July 3, 2025",
      time: "14:15 - 14:45 UTC",
      description: "Brief API slowdown resolved. All services operating normally."
    },
    {
      title: "Mobile App Login Issues",
      status: "resolved",
      date: "July 1, 2025",
      time: "09:20 - 09:35 UTC",
      description: "Mobile authentication temporarily unavailable. Issue resolved."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Degraded</Badge>;
      case "outage":
        return <Badge className="bg-red-500 hover:bg-red-600">Outage</Badge>;
      case "resolved":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Resolved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
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
              System Status
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time status and uptime information for all QuotexWallet services.
            </p>
          </div>

          {/* Overall Status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Overall System Status</CardTitle>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-green-500 font-semibold">All Systems Operational</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                All services are running smoothly. Last updated: {new Date().toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* Service Status */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Service Status</h2>
            <div className="grid gap-4">
              {services.map((service, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                          <p className="text-sm text-gray-300">Last checked: {service.lastChecked}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-300">Uptime (30 days)</p>
                          <p className="text-lg font-semibold text-white">{service.uptime}</p>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{incident.title}</CardTitle>
                      {getStatusBadge(incident.status)}
                    </div>
                    <CardDescription className="text-gray-300">
                      {incident.date} • {incident.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{incident.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Subscribe to Updates */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white">Stay Informed</CardTitle>
              <CardDescription className="text-gray-300">
                Subscribe to status updates and get notified about any service disruptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}