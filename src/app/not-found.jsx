'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { FiArrowRight, FiHome, FiShoppingCart } from 'react-icons/fi';

export default function NotFound() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const orbsRef = useRef([]);

  // Floating orbs animation
  useEffect(() => {
    orbsRef.current.forEach((orb, index) => {
      if (!orb) return;
      gsap.to(orb, {
        y: Math.sin(index) * 50,
        x: Math.cos(index) * 50,
        duration: 4 + index,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => {
      orbsRef.current.forEach((orb) => {
        if (orb) gsap.killTweensOf(orb);
      });
    };
  }, []);

  // Text animation
  useEffect(() => {
    if (textRef.current) {
      gsap.from(textRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
      });
    }
  }, []);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.2 },
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

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) orbsRef.current[index] = el;
            }}
            className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 dark:opacity-10 ${
              index === 0
                ? 'bg-blue-500 top-20 left-10'
                : index === 1
                ? 'bg-purple-500 top-40 right-10'
                : 'bg-pink-500 bottom-10 left-1/2'
            }`}
          />
        ))}
      </div>

      {/* Content Container */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-2xl mx-auto w-full text-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* 404 Text */}
        <motion.div ref={textRef} className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-4">
            404
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        {/* Message */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
            Sorry! The page you are looking for does not exist or has been removed. Let us bring you back.
          </p>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2 my-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"
              style={{ width: `${60 - i * 15}px` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
        >
          {/* Home Button */}
          <Link href="/">
            <motion.button
              variants={buttonVariants}
              className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 group overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-600 rounded-lg"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                <FiHome className="h-5 w-5" />
                Go to Home
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiArrowRight className="h-5 w-5" />
                </motion.span>
              </span>
            </motion.button>
          </Link>

          {/* Shop Button */}
          <Link href="/shop-all">
            <motion.button
              variants={buttonVariants}
              transition={{ delay: 0.1 }}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium uppercase tracking-wider rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 group"
            >
              <FiShoppingCart className="h-5 w-5" />
              Continue Shopping
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <FiArrowRight className="h-5 w-5" />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-6">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'New Arrivals', href: '/new-arrivals' },
              { label: 'Men', href: '/men' },
              { label: 'Women', href: '/women' },
              { label: 'Offers', href: '/offers' },
            ].map((link) => (
              <motion.div key={link.href} whileHover={{ scale: 1.05 }}>
                <Link
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-xs sm:text-sm text-gray-500 dark:text-gray-500"
        >
          <p>
            Having trouble?{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Contact us
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}