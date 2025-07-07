import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Press() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2 mb-6">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-xl text-gray-600">Latest news and media resources from QuotexWallet.</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>Recent Press Releases</h2>
          <ul>
            <li>QuotexWallet Launches P2P Trading Platform</li>
            <li>QuotexWallet Reaches 1 Million Users Milestone</li>
            <li>New Security Features Enhance User Protection</li>
          </ul>
          <h2>Media Kit</h2>
          <p>For media inquiries and press kit materials, please contact press@quotexwallet.com</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}