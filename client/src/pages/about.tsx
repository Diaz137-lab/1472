import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function About() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About QuotexWallet</h1>
          <p className="text-xl text-gray-600">Learn about our mission to make cryptocurrency accessible to everyone.</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p>QuotexWallet is a leading cryptocurrency trading platform that makes it easy for anyone to buy, sell, and manage digital assets.</p>
          <p>Founded with the mission to democratize access to cryptocurrency, we provide secure, user-friendly tools for both beginners and experienced traders.</p>
          <h2>Our Values</h2>
          <ul>
            <li>Security: Your funds and data are protected with industry-leading security measures</li>
            <li>Transparency: Clear pricing and open communication</li>
            <li>Innovation: Constantly improving our platform with cutting-edge features</li>
            <li>Accessibility: Making crypto simple for everyone</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}