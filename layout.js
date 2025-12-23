import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Zap, Menu, X, Plus, Package, User, Settings, LogOut, 
  Home, ShoppingBag, Heart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await base44.auth.isAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const navLinks = [
    { label: 'Browse', page: 'Home', icon: Home },
    { label: 'Pricing', page: 'Pricing', icon: Zap },
    { label: 'My Listings', page: 'MyListings', icon: Package, auth: true }
  ];

  const isHomePage = currentPageName === 'Home';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHomePage 
            ? 'bg-white/95 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                scrolled || !isHomePage ? 'bg-violet-600' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Zap className={`w-5 h-5 ${scrolled || !isHomePage ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`text-xl font-bold ${
                scrolled || !isHomePage ? 'text-slate-900' : 'text-white'
              }`}>
                GadgetX
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                (!link.auth || isAuthenticated) && (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPageName === link.page
                        ? scrolled || !isHomePage
                          ? 'bg-violet-50 text-violet-600'
                          : 'bg-white/20 text-white'
                        : scrolled || !isHomePage
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to={createPageUrl('CreateListing')} className="hidden sm:block">
                    <Button 
                      size="sm"
                      className={`rounded-lg ${
                        scrolled || !isHomePage 
                          ? 'bg-violet-600 hover:bg-violet-700' 
                          : 'bg-white text-violet-700 hover:bg-violet-50'
                      }`}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Sell
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 focus:outline-none">
                        <Avatar className="w-9 h-9 border-2 border-white/20">
                          <AvatarImage src={user?.avatar_url} />
                          <AvatarFallback className="bg-violet-100 text-violet-600 text-sm">
                            {user?.full_name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-slate-900">{user?.full_name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <Link to={createPageUrl('Profile')}>
                        <DropdownMenuItem>
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link to={createPageUrl('MyListings')}>
                        <DropdownMenuItem>
                          <Package className="w-4 h-4 mr-2" />
                          My Listings
                        </DropdownMenuItem>
                      </Link>
                      <Link to={createPageUrl('Settings')}>
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={handleLogin}
                  className={`rounded-lg ${
                    scrolled || !isHomePage 
                      ? 'bg-violet-600 hover:bg-violet-700' 
                      : 'bg-white text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${
                  scrolled || !isHomePage ? 'text-slate-600' : 'text-white'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  (!link.auth || isAuthenticated) && (
                    <Link
                      key={link.page}
                      to={createPageUrl(link.page)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                        currentPageName === link.page
                          ? 'bg-violet-50 text-violet-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  )
                ))}
                {isAuthenticated && (
                  <Link
                    to={createPageUrl('CreateListing')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white"
                  >
                    <Plus className="w-5 h-5" />
                    Sell Your Gadget
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className={isHomePage ? '' : 'pt-16'}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">GadgetX</span>
              </div>
              <p className="text-sm text-slate-500">
                Your trusted marketplace for buying and selling quality electronics.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to={createPageUrl('Home')} className="hover:text-violet-600">Browse Gadgets</Link></li>
                <li><Link to={createPageUrl('CreateListing')} className="hover:text-violet-600">Sell a Gadget</Link></li>
                <li><Link to={createPageUrl('Pricing')} className="hover:text-violet-600">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to={createPageUrl('About')} className="hover:text-violet-600">About Us</Link></li>
                <li><Link to={createPageUrl('PrivacyPolicy')} className="hover:text-violet-600">Privacy Policy</Link></li>
                <li><Link to={createPageUrl('TermsOfService')} className="hover:text-violet-600">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><span className="cursor-default">Email: support@gadgetx.com</span></li>
                <li><span className="cursor-default">Payments: PayPal & EcoCash</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8">
            <div className="text-center text-sm text-slate-500 mb-2">
              Founded by <span className="font-semibold text-slate-700">Theophilus T Sithole</span> (Owner) & <span className="font-semibold text-slate-700">Amos B Nyamaropa</span>
            </div>
            <div className="text-center text-sm text-slate-500">
              © {new Date().getFullYear()} GadgetX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}