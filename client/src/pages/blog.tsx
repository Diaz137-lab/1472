import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Blog() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">QuotexWallet Blog</h1>
          <p className="text-xl text-gray-600">Stay updated with the latest cryptocurrency news and insights.</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>Recent Articles</h2>
          <ul>
            <li>Understanding Bitcoin: A Beginner's Guide</li>
            <li>P2P Trading: Benefits and Best Practices</li>
            <li>Cryptocurrency Security: Protecting Your Assets</li>
            <li>Market Analysis: Bitcoin Price Predictions</li>
          </ul>
          <p>Subscribe to our newsletter to get the latest updates delivered to your inbox.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}