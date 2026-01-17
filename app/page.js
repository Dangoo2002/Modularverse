'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Check, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext'; 
function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth(); // Get auth state

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Users", path: "/users" },
    { label: "Our Team", path: "/team" },
  ];

  // Function to get user initials
  const getUserInitials = () => {
    if (!user) return '';
    
    // Try to get from user data
    if (user.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    // Fallback to email first letter
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U'; // Default
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 25 } },
  };

  const menuItemVariants = {
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, type: 'spring', stiffness: 250, damping: 20 },
    }),
    closed: { opacity: 0, x: 20 },
  };


  return (
   <nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] max-w-4xl z-50 transition-all duration-300 touch-none ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border border-gray-100/50'
          : 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-100/30'
      }`}
      style={{ borderRadius: '1.5rem' }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left aligned */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="/logo.jpeg"
                  alt="ModularVerse CMS Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover transform group-hover:scale-105 transition-all duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">ModularVerse</span>
                <span className="text-xs font-light tracking-wider text-gray-600">CMS</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`relative px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all duration-200 group touch-none ${
                    isActive ? 'text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.span
                      className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-full bg-gradient-to-r from-gray-900 to-gray-800"
                      initial={{ width: 0 }}
                      animate={{ width: '1.5rem' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}
                  {!isActive && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 rounded-full bg-gradient-to-r from-gray-900/50 to-gray-800/50 group-hover:w-6 transition-all duration-200"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section - Auth Only */}
          <div className="flex items-center space-x-3">
            {loading ? (
              // Loading state
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              // User is logged in - show user avatar
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center text-white font-semibold text-sm md:text-base cursor-pointer">
                    {getUserInitials()}
                  </div>
                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900 text-sm truncate">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // User is not logged in - show auth links
              <>
                <Link
                  href="/login"
                  className="hidden md:block relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 touch-none"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-200"></span>
                </Link>
                <Link
                  href="/register"
                  className="hidden md:block relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 touch-none"
                >
                  <span className="relative z-10">Register</span>
                  <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-200"></span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu();
                }}
                className="relative inline-flex items-center justify-center p-2 w-10 h-10 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-200 touch-none"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Toggle menu</span>
                <div className="relative w-6 h-5">
                  <span className={`absolute left-0 block h-0.5 w-6 bg-current rounded-full transform transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-2' : 'top-0'}`} />
                  <span className={`absolute left-0 block h-0.5 w-6 bg-current rounded-full transform transition-all duration-200 ${isOpen ? 'opacity-0' : 'top-2'}`} />
                  <span className={`absolute left-0 block h-0.5 w-6 bg-current rounded-full transform transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-2' : 'top-4'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed top-0 right-0 w-full sm:w-80 h-screen bg-gradient-to-b from-gray-50 to-gray-100 shadow-2xl z-50 md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <img src="/logo.jpeg" alt="Logo" className="w-9 h-9 object-cover rounded-md shadow-sm" />
                    <span className="text-xl font-semibold text-gray-900">ModularVerse</span>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-full hover:bg-gray-200/50 transition-all duration-150 touch-none"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 px-3 py-6 overflow-y-auto">
                  <motion.div
                    className="flex flex-col space-y-2"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{ open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                  >
                    {navItems.map((item, i) => {
                      const isActive = pathname === item.path;
                      return (
                        <motion.div key={item.label} custom={i} variants={menuItemVariants}>
                          <Link
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`relative block w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 touch-none ${
                              isActive
                                ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 font-semibold shadow-sm'
                                : 'text-gray-800 hover:bg-gray-100/50 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{item.label}</span>
                            </div>
                            {isActive && (
                              <motion.span
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-1.5 h-8 rounded-full bg-gradient-to-b from-gray-900 to-gray-800"
                                initial={{ height: 0 }}
                                animate={{ height: '2rem' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                    
                    {/* Mobile Auth Links */}
                    {user ? (
                      <motion.div custom={navItems.length} variants={menuItemVariants} className="mt-6 pt-4 border-t border-gray-200/50">
                        <div className="flex items-center px-4 py-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center text-white font-semibold mr-3">
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name || user.email}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium bg-gray-900 text-white mb-2"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium bg-red-600 text-white"
                        >
                          Logout
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div custom={navItems.length} variants={menuItemVariants} className="mt-6 pt-4 border-t border-gray-200/50">
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="block w-full px-4 py-3.5 rounded-xl text-center text-base font-medium bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 touch-none"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsOpen(false)}
                          className="block w-full px-4 py-3.5 rounded-xl text-center text-base font-medium bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 touch-none mt-2"
                        >
                          Register
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Footer Component (Adapted from provided)
function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-8 sm:py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4 group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/logo.jpeg" // Placeholder for your logo
                  alt="ModularVerse CMS Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8 object-cover transform group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900">ModularVerse</span>
                <span className="text-[10px] sm:text-xs font-light tracking-wider text-gray-600">CMS</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 max-w-[200px] sm:max-w-xs">
              Simple, fast CMS for managing content with roles, authentication, and publishing workflows.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.272 2.69.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zM12 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://facebook.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://x.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.95 17.52h1.834L7.84 4.126H5.914L16.294 19.77z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-600 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300">Dashboard</a>
              </li>
              <li>
                <a href="/login" className="text-gray-600 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300">Login</a>
              </li>
              <li>
                <a href="/register" className="text-gray-600 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300">Register</a>
              </li>
              <li>
                <a href="/users" className="text-gray-600 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300">Users</a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Reach Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+254757448651" className="text-gray-600 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300">
                  +254 757 448651
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@modularverse.com" className="text-gray-600 text-sm sm:text-base hover:text-blue-600 transition-colors duration-300">
                  support@modularverse.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">Mon-Sat: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-gray-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} ModularVerse CMS. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/privacy" className="text-gray-600 text-xs sm:text-sm hover:text-blue-600 transition-colors duration-300">Privacy Policy</a>
            <a href="/terms" className="text-gray-600 text-xs sm:text-sm hover:text-blue-600 transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Icon Components (from provided)
const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4", filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

// Platform features cards (Adapted to CMS)
const features = [
  {
    title: 'Secure Authentication',
    description: 'JWT-based login with roles for admins, editors, and viewers.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: 'from-gray-800 to-gray-600',
  },
  {
    title: 'Content Workflow',
    description: 'Draft and publish content with easy management tools.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-gray-800 to-gray-600',
  },
  {
    title: 'Role-Based Access',
    description: 'Control permissions for different user types.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'from-gray-800 to-gray-600',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track content and user metrics in real-time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    ),
    color: 'from-gray-800 to-gray-600',
  },
];

// How It Works steps (Adapted to CMS)
const steps = [
  {
    number: '01',
    title: 'Sign Up & Login',
    description: 'Create an account and login with secure credentials.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Create Content',
    description: 'Draft new posts and manage existing ones.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Publish & Manage',
    description: 'Review and publish content with workflow controls.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Analyze & Collaborate',
    description: 'View analytics and manage users by roles.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

// Testimonials (Adapted)
const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Admin User',
    review: 'ModularVerse CMS makes content management effortless with its intuitive interface.',
    rating: 5,
    initials: 'AJ',
  },
  {
    name: 'Sarah Lee',
    role: 'Editor',
    review: 'The publishing workflow is seamless and secure.',
    rating: 5,
    initials: 'SL',
  },
  {
    name: 'Mike Chen',
    role: 'Viewer',
    review: 'Easy to use and reliable for viewing published content.',
    rating: 4,
    initials: 'MC',
  },
];

// FAQ Data (Adapted to CMS)
const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'Sign up with email and password, choose your role.',
  },
  {
    question: 'What are the user roles?',
    answer: 'Admin (full access), Editor (content management), Viewer (read-only).',
  },
  {
    question: 'How does publishing work?',
    answer: 'Create drafts, review, and publish with one click.',
  },
  {
    question: 'Is it secure?',
    answer: 'Yes, with JWT auth, HttpOnly cookies, and rate limiting.',
  },
  {
    question: 'Can I manage users?',
    answer: 'Admins can CRUD users and assign roles.',
  },
];

// Stats Data (Adapted to CMS)
const stats = [
  { value: '3+', label: 'Active Users', description: 'Managed accounts' },
  { value: '3+', label: 'Published Posts', description: 'Content items' },
  { value: '99.9%', label: 'Uptime', description: 'Reliable service' },
  { value: '24/7', label: 'Support', description: 'Available help' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    setEmailError('');
    setShowSuccessPopup(true);
    setEmail('');
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section - Fully Responsive */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
              {/* Left Content */}
              <motion.div
                className="lg:w-1/2 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-600 rounded-full"></div>
                  Modern CMS Platform
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                  Your Content{' '}
                  <span className="text-gray-900">
                    Management
                  </span>{' '}
                  Solution
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl">
                  ModularVerse CMS provides secure, role-based content management for teams. Create, publish, and analyze content effortlessly.
                </p>
                {/* CTA Buttons */}
                <div className="relative z-20 pointer-events-auto flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="relative z-20 inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span className="mr-3">Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="relative z-20 inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Register Now
                  </button>
                </div>
              </motion.div>
              {/* Right - Stacked Device Showcase - Responsive */}
              <motion.div
                className="lg:w-1/2 relative mt-8 md:mt-12 lg:mt-0 w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative max-w-md mx-auto">
                  {/* Main Device (iPad style) */}
                  <div className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-4 md:border-8 border-white">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-200/10 to-gray-400/10">
                      <img
                        src="/1.webp" // Placeholder image for CMS dashboard
                        alt="ModularVerse CMS Dashboard"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="%23f3f4f6"><rect width="400" height="300"/></svg>';
                        }}
                      />
                    </div>
                  </div>
                  {/* Floating Phone - Responsive positioning and size */}
                  <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 z-20 w-20 h-32 md:w-32 md:h-52 lg:w-40 lg:h-64">
                    <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border-2 md:border-4 border-white">
                      <div className="aspect-[9/16] bg-gradient-to-br from-gray-900 to-gray-800">
                        <img
                          src="/1.webp" // Placeholder for mobile view
                          alt="Mobile CMS View"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Decorative Elements - Responsive */}
                  <div className="absolute -top-3 -left-3 w-16 h-16 md:-top-4 md:-left-4 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl md:rounded-2xl -z-10"></div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 md:-bottom-8 md:-left-8 md:w-32 md:h-32 bg-gradient-to-br from-gray-100 to-white rounded-xl md:rounded-2xl -z-10 shadow-md md:shadow-lg"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section - Responsive */}
        <section className="py-8 md:py-12 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="text-center p-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">{stat.value}</div>
                  <div className="font-medium text-gray-900 text-sm md:text-base mb-0.5 md:mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-xs md:text-sm">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Responsive */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                Why Choose ModularVerse CMS?
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto px-4">
                Our CMS is designed for efficient content management with modern features.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 sm:px-0">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 h-full">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white mb-3 md:mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-2 md:mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Discover Our CMS - Responsive */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                Discover Our CMS
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Explore powerful features for content creation and management.
              </p>
              {/* CTA Button - Explore Dashboard */}
              <div className="mt-4 md:mt-6">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="mr-3">Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <motion.div
              className="relative max-w-4xl mx-auto px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Larger Main Device - Responsive */}
              <div className="relative z-10 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-4 md:border-8 border-white">
                <div className="aspect-[16/9] bg-gradient-to-br from-gray-200/10 to-gray-400/10">
                  <img
                    src="/2.png" // Placeholder
                    alt="CMS Overview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Floating Phone - Responsive */}
              <div className="absolute -bottom-3 -right-3 md:-bottom-6 md:-right-6 lg:-bottom-8 lg:-right-8 z-20 w-16 h-28 sm:w-20 sm:h-36 md:w-32 md:h-56 lg:w-40 lg:h-72">
                <div className="relative rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border-2 md:border-4 border-white">
                  <div className="aspect-[9/16] bg-gradient-to-br from-gray-900 to-gray-800">
                    <img
                      src="/2.png" // Placeholder
                      alt="Mobile CMS View"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative Elements - Responsive */}
              <div className="absolute -top-2 -left-2 w-12 h-12 sm:w-16 sm:h-16 sm:w-16 sm:h-16 md:-top-4 md:-left-4 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg md:rounded-xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 md:-bottom-8 md:-left-8 md:w-32 md:h-32 lg:-bottom-12 lg:-left-12 lg:w-48 lg:h-48 bg-gradient-to-br from-gray-100 to-white rounded-lg md:rounded-xl lg:rounded-2xl -z-10 shadow-md md:shadow-lg"></div>
            </motion.div>
          </div>
        </section>

        {/* How It Works - Responsive */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                How It Works
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Simple steps to manage your content
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 h-full">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm md:text-base lg:text-lg font-bold">
                        {step.number}
                      </div>
                      <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-2 md:mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <>
                      <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-0.5 bg-gray-200"></div>
                      </div>
                      <div className="hidden sm:block lg:hidden absolute top-full left-1/2 transform -translate-x-1/2 mt-4">
                        <div className="h-6 w-0.5 bg-gray-200"></div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Seamless Experience Section (Adapted from PWA) */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                Seamless Experience
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Access your CMS from any device with responsive design.
              </p>
            </div>
            <motion.div
              className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2 p-4 md:p-6 lg:p-8">
                  <div className="relative mx-auto max-w-md">
                    {/* iPhone Frame Container */}
                    <div className="relative bg-black rounded-[3rem] md:rounded-[3.5rem] p-3 md:p-4 shadow-2xl">
                      {/* Screen Bezel */}
                      <div className="bg-black rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative">
                        {/* Dynamic Island */}
                        <div className="absolute top-2 md:top-3 left-1/2 transform -translate-x-1/2 w-[5rem] md:w-[7rem] h-4 md:h-6 bg-black rounded-full z-10"></div>
                        {/* Screen Content */}
                        <div className="aspect-[9/19.5] bg-white relative overflow-hidden">
                          <img
                            src="/cms-seamless-screenshot.jpg" // Placeholder
                            alt="Seamless CMS View"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" fill="%23f3f4f6"><rect width="390" height="844"/><rect x="20" y="20" width="350" height="804" fill="%23ffffff"/><text x="50%" y="50%" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="16">CMS View</text></svg>';
                            }}
                          />
                          {/* Status Bar Overlay */}
                          <div className="absolute top-0 left-0 right-0 h-8 md:h-12 bg-gradient-to-b from-black/30 to-transparent pointer-events-none">
                            <div className="flex items-center justify-between px-6 md:px-8 pt-2 md:pt-3">
                              <div className="text-white text-xs md:text-sm font-semibold">9:41</div>
                              <div className="flex items-center space-x-1 md:space-x-2">
                                <div className="w-3 h-3 md:w-4 md:h-4">
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                    <path d="M18 10h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v4H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z" />
                                  </svg>
                                </div>
                                <div className="w-12 h-2 md:w-16 md:h-3 bg-white/90 rounded-full relative overflow-hidden">
                                  <div className="absolute inset-0 bg-green-500 w-3/4"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Home Indicator */}
                          <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 w-20 md:w-32 h-0.5 md:h-1 bg-white/60 rounded-full"></div>
                        </div>
                      </div>
                      {/* Volume Buttons */}
                      <div className="absolute -left-0.5 md:-left-1 top-20 md:top-24 w-0.5 md:w-1 h-10 md:h-14 bg-gray-800 rounded-l-sm"></div>
                      <div className="absolute -left-0.5 md:-left-1 top-36 md:top-48 w-0.5 md:w-1 h-10 md:h-14 bg-gray-800 rounded-l-sm"></div>
                      {/* Power Button */}
                      <div className="absolute -right-0.5 md:-right-1 top-28 md:top-32 w-0.5 md:w-1 h-14 md:h-20 bg-gray-800 rounded-r-sm"></div>
                      {/* Speaker Grill */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 md:w-20 h-0.5 md:h-1 bg-gray-900 rounded-b-sm"></div>
                    </div>
                  </div>
                </div>
                {/* Features Section */}
                <div className="lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium mb-4 md:mb-6 self-start">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    Responsive Design
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                    Seamless Experience
                  </h3>
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-1">Mobile Friendly</h4>
                        <p className="text-gray-600 text-sm md:text-base">
                          Access dashboard from any device.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-1">Secure Access</h4>
                        <p className="text-gray-600 text-sm md:text-base">
                          Role-based login on all devices.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-1">Real-Time Sync</h4>
                        <p className="text-gray-600 text-sm md:text-base">
                          Content updates in real-time across devices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials - Responsive */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                What Users Say
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Hear from users who have used our CMS
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 h-full"
                >
                  <div className="flex mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        filled={i < testimonial.rating}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-sm md:text-base mb-4 md:mb-6 leading-relaxed">"{testimonial.review}"</p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-sm md:text-base">
                      {testimonial.initials}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900 text-sm md:text-base">{testimonial.name}</div>
                      <div className="text-gray-500 text-xs md:text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Responsive */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Find answers to common questions about our CMS
              </p>
            </div>
            <div className="max-w-3xl mx-auto px-2 sm:px-0">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-3 md:mb-4 last:mb-0"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-4 md:p-6 bg-gray-50 rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors duration-200 text-left"
                  >
                    <span className="font-medium text-gray-900 text-sm md:text-base pr-4">{faq.question}</span>
                    <svg
                      className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${activeFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 bg-gray-50 rounded-b-lg md:rounded-b-xl">
                          <p className="text-gray-700 text-sm md:text-base">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter - Light Background */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                Stay Updated
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">
                Get CMS updates and tips directly in your inbox
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 px-2 sm:px-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm md:text-base"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 md:px-8 md:py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm md:text-base"
                >
                  Subscribe
                </button>
              </form>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 mt-2 md:mt-3 text-sm"
                >
                  {emailError}
                </motion.p>
              )}
              <p className="text-gray-500 text-xs md:text-sm mt-3 md:mt-4">
                No spam, unsubscribe at any time
              </p>
            </div>
          </div>
        </section>

        {/* WhatsApp Button - Responsive (Adapted, optional for CMS) */}
        <motion.a
          href="https://wa.me/254757448651?text=Hello%20ModularVerse,%20I%20wanted%20to%20inquire%20about%20"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
          </svg>
        </motion.a>

        {/* Back to Top Button - Responsive */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-800"
              aria-label="Scroll to top"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Success Popup - Responsive */}
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 max-w-xs md:max-w-md mx-4"
            >
              <CheckIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Thank you for subscribing!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}