'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiChevronDown, FiLogOut, FiSettings } from 'react-icons/fi';
import gsap from 'gsap';
import { ThemeSwitch } from './ThemeSwitch';
import { authClient } from '@/lib/auth-client';

const NAV_LINKS = [
  {
    label: 'Men',
    dropdown: [
      { label: 'Punjabi', href: '/men/punjabi' },
    ],
  },
  {
    label: 'Women',
    dropdown: [
      { label: 'Top Crop', href: '/women/topcrop' },
    ],
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);

  // Reactive session hook — auto updates on sign in/out
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const user = session?.user || null;
  const isLoading = isSessionLoading;

  // ✅ শুধু admin হলে true হবে
  const isAdmin = user?.role === 'admin';

  const navRef = useRef(null);
  const linksContainerRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const avatarDropdownRef = useRef(null);
  const dropdownRefs = useRef({});

  // Mount check for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showAvatarDropdown &&
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(e.target)
      ) {
        setShowAvatarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAvatarDropdown]);

  // Menu animation with GSAP
  useEffect(() => {
    if (isMenuOpen && linksContainerRef.current) {
      gsap.to(linksContainerRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.from(linksContainerRef.current.children, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        stagger: 0.08,
        ease: 'back.out',
      });
    }
  }, [isMenuOpen]);

  // Dropdown hover handlers (desktop)
  const handleDropdownEnter = (label) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // Toggle dropdown on click (for mobile/touch)
  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  // Link hover animation
  const handleLinkHover = (e) => {
    gsap.to(e.currentTarget, {
      letterSpacing: '0.05em',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleLinkHoverEnd = (e) => {
    gsap.to(e.currentTarget, {
      letterSpacing: '0em',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setShowAvatarDropdown(false);
      setIsMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Navbar variants
  const navbarVariants = {
    initial: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      backdropFilter: 'blur(0px)',
      borderColor: 'rgba(229, 231, 235, 0)',
    },
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderColor: 'rgba(229, 231, 235, 1)',
    },
  };

  // Mobile menu variants
  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: { duration: 0.15, ease: 'easeIn' },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  // Avatar dropdown variants
  const avatarDropdownVariants = {
    hidden: {
      opacity: 0,
      y: -12,
      scale: 0.95,
      transition: { duration: 0.15, ease: 'easeIn' },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  // Icon button variants
  const iconVariants = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
  };

  if (!mounted) return null;

  return (
    <motion.nav
      ref={navRef}
      className="sticky top-0 z-40 w-full border-b border-gray-200 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-950/95"
      animate={scrolled ? 'scrolled' : 'initial'}
      variants={navbarVariants}
    >
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Left - Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link
              href="/"
              className="text-xl font-light tracking-widest text-gray-900 transition-all duration-300 hover:tracking-[0.3em] dark:text-white sm:text-2xl"
            >
              LazaShops
            </Link>
          </motion.div>

          {/* Center - Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden items-center gap-8 lg:flex"
          >
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="relative"
                ref={(el) => {
                  if (el) dropdownRefs.current[link.label] = el;
                }}
                onMouseEnter={() => link.dropdown && handleDropdownEnter(link.label)}
                onMouseLeave={handleDropdownLeave}
              >
                {link.dropdown ? (
                  <button
                    type="button"
                    onClick={() => toggleDropdown(link.label)}
                    onMouseEnter={handleLinkHover}
                    onMouseLeave={handleLinkHoverEnd}
                    className="relative flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {link.label}
                    <motion.span
                      animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <FiChevronDown className="h-3.5 w-3.5" />
                    </motion.span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400"
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onMouseEnter={handleLinkHover}
                    onMouseLeave={handleLinkHoverEnd}
                    className="relative flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {link.label}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400"
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </Link>
                )}

                {link.dropdown && (
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="py-2">
                          {link.dropdown.map((item, i) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                            >
                              <Link
                                href={item.href}
                                className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                              >
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Right - Icons and Buttons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:block">
              <ThemeSwitch />
            </div>

            <motion.button
              variants={iconVariants}
              whileHover="whileHover"
              whileTap="whileTap"
              className="relative text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Shopping cart"
            >
              <FiShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-5 sm:w-5"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Auth Section - Desktop */}
            {!isLoading && (
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                  <div className="relative" ref={avatarDropdownRef}>
                    <motion.button
                      onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <motion.span
                        animate={{ rotate: showAvatarDropdown ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                      >
                        <FiChevronDown className="h-4 w-4" />
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {showAvatarDropdown && (
                        <motion.div
                          variants={avatarDropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>

                          <div className="py-2">
                            {/* ✅ শুধু admin হলে Admin Dashboard দেখাবে */}
                            {isAdmin && (
                              <Link
                                href="/dashboard"
                                onClick={() => setShowAvatarDropdown(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                              >
                                <FiSettings className="h-4 w-4" />
                                Admin Dashboard
                              </Link>
                            )}

                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <FiLogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Link
                        href="/signin"
                        className="relative px-5 py-2 text-xs font-medium uppercase tracking-wider text-gray-700 transition-all duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                      >
                        Sign In
                        <motion.span
                          className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400"
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.35 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/signup"
                          className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 dark:from-white dark:to-gray-200 dark:text-gray-900 dark:hover:from-gray-100 dark:hover:to-gray-300"
                        >
                          Get Started
                        </Link>
                      </motion.div>
                    </motion.div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          animate={isMenuOpen ? 'visible' : 'hidden'}
          variants={mobileMenuVariants}
          className="overflow-hidden lg:hidden"
        >
          <div
            ref={linksContainerRef}
            className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
          >
            {NAV_LINKS.map((link) => (
              <motion.div key={link.label}>
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 text-left text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <span>{link.label}</span>
                      <motion.span
                        animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden bg-gray-50 dark:bg-gray-800/50"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                              className="block border-b border-gray-100 px-8 py-3 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block border-b border-gray-100 px-4 py-4 text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}

            <div className="border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Theme
                </span>
                <ThemeSwitch />
              </div>
            </div>

            {!isLoading && (
              <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-800">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium overflow-hidden">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* ✅ শুধু admin হলে Admin Dashboard দেখাবে (mobile) */}
                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <FiSettings className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-50 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-red-600 transition-colors duration-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg border border-gray-300 px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-all duration-200 hover:from-gray-800 hover:to-gray-600 dark:from-white dark:to-gray-200 dark:text-gray-900 dark:hover:from-gray-100 dark:hover:to-gray-300"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}