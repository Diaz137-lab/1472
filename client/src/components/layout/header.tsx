import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, admin, logout, adminLogout } = useAuth();

  const navigation = [
    { name: "Wallet", href: "/dashboard" },
    { name: "Exchange", href: "/exchange" },
    { name: "Institutional", href: "/institutional" },
    { name: "Explore", href: "/explorer" },
  ];

  const handleLogout = () => {
    if (isAdmin) {
      adminLogout();
    } else {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-fw-blue cursor-pointer">
                  QuotexWallet
                </h1>
              </Link>
            </div>
            <nav className="hidden md:ml-12 md:flex md:space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 hover:scale-105 transform cursor-pointer ${
                    location === item.href || (item.name === "Wallet" && location === "/dashboard")
                      ? "text-fw-blue border-b-2 border-fw-blue pb-1"
                      : "text-gray-700 hover:text-fw-blue"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className="font-medium text-gray-700 hover:text-fw-blue transition-colors duration-200">
                    Dashboard
                  </Link>
                </>
              )}
              <div className="border-l border-gray-300 pl-6 ml-4">
                <Link href="/admin" className="font-medium text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg">
                  Administrator
                </Link>
              </div>
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated || isAdmin ? (
              <>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Welcome back,</p>
                  <p className="font-semibold text-gray-900">
                    {isAdmin ? admin?.name || 'Administrator' : user?.firstName}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="font-medium text-gray-700 hover:text-fw-blue hover:bg-blue-50">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-fw-blue text-white hover:bg-blue-700 font-medium px-6 py-2 rounded-lg shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
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
                      className={`text-lg font-medium transition-colors duration-200 hover:scale-105 transform cursor-pointer ${
                        location === item.href || (item.name === "Wallet" && location === "/dashboard")
                          ? "text-fw-blue font-bold"
                          : "text-gray-700 hover:text-fw-blue"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-gray-700 hover:text-fw-blue transition-colors"
                      >
                        Dashboard
                      </Link>
                      {/* <Link
                        href="/trading"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-gray-700 hover:text-fw-blue transition-colors"
                      >
                        Trading
                      </Link>
                      <Link
                        href="/portfolio"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-gray-700 hover:text-fw-blue transition-colors"
                      >
                        Portfolio
                      </Link> */}
                    </>
                  )}
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Admin
                  </Link>
                  <hr className="my-4" />
                  {isAuthenticated || isAdmin ? (
                    <>
                      <Button
                        variant="ghost"
                        className="text-lg font-medium text-gray-700 hover:text-fw-blue transition-colors"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}