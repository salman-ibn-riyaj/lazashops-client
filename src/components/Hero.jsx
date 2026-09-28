'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const rotatingTextRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotating text animation
  useEffect(() => {
    if (rotatingTextRef.current) {
      gsap.to(rotatingTextRef.current, {
        rotationZ: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });
    }

    return () => {
      if (rotatingTextRef.current) {
        gsap.killTweensOf(rotatingTextRef.current);
      }
    };
  }, []);

  // Parallax effect on mouse move
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const leftImage = heroRef.current.querySelector('[data-parallax="left"]');
    const rightImage = heroRef.current.querySelector('[data-parallax="right"]');

    if (leftImage) {
      gsap.to(leftImage, {
        x: x * 20,
        y: y * 20,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    if (rightImage) {
      gsap.to(rightImage, {
        x: -x * 20,
        y: -y * 20,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  if (!mounted) return null;

  return (
    <motion.section
      ref={heroRef}
      className="relative w-full min-h-screen bg-white dark:bg-gray-950 overflow-hidden pt-20 sm:pt-24"
      onMouseMove={handleMouseMove}
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center min-h-[calc(100vh-120px)]">
          {/* Left Side - Product Image */}
          <motion.div
            className="col-span-1 lg:col-span-4 order-2 lg:order-1"
            variants={imageVariants}
          >
            <div
              data-parallax="left"
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Left side image (thobe model) */}
              <Image
                src="/hero-thobe-model.png"
                alt="Premium Thobe Collection"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>

          {/* Center - Rotating Text */}
          <motion.div
            className="col-span-1 lg:col-span-4 order-1 lg:order-2 flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Rotating circular text */}
              <svg
                ref={rotatingTextRef}
                className="w-full h-full"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                    fill="none"
                  />
                </defs>
                <text
                  className="text-lg font-bold fill-gray-900 dark:fill-white uppercase tracking-widest"
                  letterSpacing="8"
                >
                  <textPath href="#circlePath" startOffset="0%">
                    LAZASHOPS • LAZASHOPS • LAZASHOPS •
                  </textPath>
                </text>
              </svg>

              {/* Center dot/icon */}
              <div className="absolute w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-light">✦</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Product Details */}
          <motion.div
            className="col-span-1 lg:col-span-4 order-3"
            variants={containerVariants}
          >
            <div className="space-y-6 sm:space-y-8">
              {/* Product showcase image */}
              <motion.div
                variants={imageVariants}
                data-parallax="right"
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg mb-4 sm:mb-6"
              >
                <Image
                  src="/hero-thobe-product.png"
                  alt="Premium Thobe Product Details"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
              </motion.div>

              {/* Tagline */}
              <motion.div variants={itemVariants}>
                <p className="text-sm sm:text-base uppercase tracking-widest text-gray-600 dark:text-gray-400 font-medium">
                  Premium Traditional Wear
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mt-2 leading-tight">
                  Experience Timeless Elegance
                </h2>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                Handcrafted thobes and punjabis designed for modern lifestyle. Premium fabrics, traditional craftsmanship, and perfect comfort for every occasion.
              </motion.p>

              {/* Features */}
              <motion.div
                variants={itemVariants}
                className="space-y-2"
              >
                {[
                  '100% Pure Cotton & Premium Fabrics',
                  'Traditional Hand-Stitched Details',
                  'Breathable & Comfortable Fit',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 pt-4"
              >
                <Link href="/men/punjabi" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gray-900 text-white font-medium uppercase tracking-wider rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 group"
                  >
                    Men's Punjabi
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiArrowRight className="h-5 w-5" />
                    </motion.span>
                  </motion.button>
                </Link>

                <Link href="/women/topcrop" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 border-2 border-gray-900 text-gray-900 dark:border-white dark:text-white font-medium uppercase tracking-wider rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Women's Top Crop
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

              {/* Additional info */}
              <motion.div
                variants={itemVariants}
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                ✓ Authentic Quality • ✓ Custom Sizes • ✓ Express Delivery
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </motion.section>
  );
}