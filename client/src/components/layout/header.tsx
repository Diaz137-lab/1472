import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Wallet", href: "/dashboard" },
    { name: "Exchange", href: "/exchange" },
    { name: "Institutional", href: "/institutional" },
    { name: "Explore", href: "/explorer" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-fw-blue cursor-pointer">
                  FutureWallet
                </h1>
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors ${
                    location === item.href
                      ? "text-fw-blue"
                      : "text-gray-700 hover:text-fw-blue"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-700 hover:text-fw-blue">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-fw-blue text-white hover:bg-blue-700">
                Sign Up
              </Button>
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-700 hover:text-fw-blue transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-fw-blue transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-fw-blue hover:text-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}