'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  FiMail,
  FiArrowRight,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiPhone,
  FiMapPin,
  FiClock,
} from 'react-icons/fi';

// Footer Links Configuration
const FOOTER_LINKS = {
  shop: [
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'Men', href: '/men' },
    { label: 'Women', href: '/women' },
    { label: 'Sale', href: '/sale' },
    { label: 'Collections', href: '/collections' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Sustainability', href: '/sustainability' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refund' },
  ],
};

const SOCIAL_LINKS = [
  { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
];

const PAYMENT_METHODS = [
  'Visa',
  'Mastercard',
  'PayPal',
  'Apple Pay',
  'Google Pay',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const footerRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Newsletter subscription handler
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Link hover animation
  const handleLinkHover = (e) => {
    gsap.to(e.currentTarget, {
      x: 8,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleLinkHoverEnd = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  // Container variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const socialIconVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { scale: 1.2, rotate: 5 },
    whileTap: { scale: 0.95 },
  };

  if (!mounted) return null;

  return (
    <footer
      ref={footerRef}
      className="bg-gray-900 text-gray-300 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Newsletter Section */}
        <motion.section
          className="border-b border-gray-800 py-12 sm:py-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Newsletter Text */}
              <motion.div variants={itemVariants}>
                <h3 className="text-2xl sm:text-3xl font-light text-white mb-3">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-gray-400">
                  Get the latest updates on new arrivals, exclusive offers, and fashion tips.
                </p>
              </motion.div>

              {/* Newsletter Form */}
              <motion.form
                onSubmit={handleSubscribe}
                className="relative"
                variants={itemVariants}
              >
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FiMail className="h-5 w-5" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </motion.button>
                </div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={
                    subscribed
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -10 }
                  }
                  transition={{ duration: 0.3 }}
                  className="absolute top-12 left-0 right-0 text-center text-green-400 text-sm font-medium"
                >
                  {subscribed && '✓ Thanks for subscribing!'}
                </motion.div>
              </motion.form>
            </div>
          </div>
        </motion.section>

        {/* Links Section */}
        <motion.section
          className="border-b border-gray-800 py-12 sm:py-16"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Shop Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                  Shop
                </h4>
                <ul className="space-y-3">
                  {FOOTER_LINKS.shop.map((link) => (
                    <motion.li key={link.href}>
                      <Link
                        href={link.href}
                        onMouseEnter={handleLinkHover}
                        onMouseLeave={handleLinkHoverEnd}
                        className="text-gray-400 hover:text-white transition-colors text-sm inline-block"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Company Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                  Company
                </h4>
                <ul className="space-y-3">
                  {FOOTER_LINKS.company.map((link) => (
                    <motion.li key={link.href}>
                      <Link
                        href={link.href}
                        onMouseEnter={handleLinkHover}
                        onMouseLeave={handleLinkHoverEnd}
                        className="text-gray-400 hover:text-white transition-colors text-sm inline-block"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Support Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                  Support
                </h4>
                <ul className="space-y-3">
                  {FOOTER_LINKS.support.map((link) => (
                    <motion.li key={link.href}>
                      <Link
                        href={link.href}
                        onMouseEnter={handleLinkHover}
                        onMouseLeave={handleLinkHoverEnd}
                        className="text-gray-400 hover:text-white transition-colors text-sm inline-block"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                  Legal
                </h4>
                <ul className="space-y-3">
                  {FOOTER_LINKS.legal.map((link) => (
                    <motion.li key={link.href}>
                      <Link
                        href={link.href}
                        onMouseEnter={handleLinkHover}
                        onMouseLeave={handleLinkHoverEnd}
                        className="text-gray-400 hover:text-white transition-colors text-sm inline-block"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact & Social Section */}
        <motion.section
          className="border-b border-gray-800 py-12 sm:py-16"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Contact Info */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                  Get in Touch
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiPhone className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <a
                        href="tel:+8801234567890"
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        +880 1234 567890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiMail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <a
                        href="mailto:support@lazashops.com"
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        support@lazashops.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                  Business Hours
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-400">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-400">
                      Saturday: 10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-400">Sunday: Closed</span>
                  </div>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                  Location
                </h4>
                <div className="flex items-start gap-3">
                  <FiMapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">LazaShops Headquarters</p>
                    <p className="text-gray-400 text-sm">
                      123 Fashion Street, Dhaka 1212
                    </p>
                    <p className="text-gray-400 text-sm">Bangladesh</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div
              className="border-t border-gray-800 pt-8"
              variants={itemVariants}
            >
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
                Follow Us
              </h4>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialIconVariants}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      className="p-3 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Payment Methods Section */}
        <motion.section
          className="border-b border-gray-800 py-8 sm:py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-4">
              {PAYMENT_METHODS.map((method, index) => (
                <motion.div
                  key={method}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
                >
                  {method}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Bottom Bar */}
        <motion.section
          className="py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <p className="text-gray-400 text-sm text-center md:text-left">
                © 2024 LazaShops. All rights reserved.
              </p>

              {/* Bottom Links */}
              <div className="flex gap-6 text-sm">
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/sitemap"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sitemap
                </Link>
              </div>

              {/* Scroll to Top */}
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors text-white"
                aria-label="Scroll to top"
              >
                <FiArrowRight className="h-5 w-5 rotate-[-90deg]" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </footer>
  );
}