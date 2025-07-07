import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Careers() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Careers at QuotexWallet</h1>
          <p className="text-xl text-gray-600">Join our team and help shape the future of finance.</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p>We're always looking for talented individuals to join our growing team. At QuotexWallet, you'll work on cutting-edge technology that's transforming how people interact with money.</p>
          <h2>Open Positions</h2>
          <ul>
            <li>Senior Frontend Developer</li>
            <li>Backend Engineer</li>
            <li>Security Engineer</li>
            <li>Product Manager</li>
            <li>DevOps Engineer</li>
          </ul>
          <p>Interested in working with us? Send your resume to careers@quotexwallet.com</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}