'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Lenis from 'lenis';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function SignInPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const inputsRef = useRef([]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  /* ---------- Lenis Smooth Scroll ---------- */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  /* ---------- GSAP Entry Animations ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title split animation
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.1,
      });

      // Card entrance
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.25,
      });

      // Staggered inputs
      gsap.from(inputsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.6,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ---------- GSAP Floating Background Orbs ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.orb-1', {
        x: 40,
        y: -30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.orb-2', {
        x: -50,
        y: 40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.orb-3', {
        x: 30,
        y: 50,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Please enter a valid email';
    if (!formData.password) return 'Password is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      // Shake animation on error
      gsap.fromTo(
        cardRef.current,
        { x: -10 },
        { x: 10, duration: 0.08, repeat: 5, yoyo: true, ease: 'power1.inOut', onComplete: () => gsap.set(cardRef.current, { x: 0 }) }
      );
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid email or password');
        toast.error(signInError.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      toast.success('Welcome back! 👋', {
        duration: 4000,
        icon: '✨',
      });

      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      const errorMessage = 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl" />
        <div className="orb-2 absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-3xl" />
        <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-100/30 dark:bg-pink-900/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-2xl font-light tracking-widest text-gray-900 dark:text-white hover:tracking-[0.3em] transition-all duration-300"
          >
            LazaShops
          </Link>
          <h1
            ref={titleRef}
            className="mt-6 text-3xl font-light text-gray-900 dark:text-white tracking-tight"
          >
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue your journey
          </p>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-8"
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign In Button */}
          <motion.button
            ref={(el) => (inputsRef.current[0] = el)}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div
            ref={(el) => (inputsRef.current[1] = el)}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-3 text-gray-400 dark:text-gray-500">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div ref={(el) => (inputsRef.current[2] = el)}>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
              >
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div ref={(el) => (inputsRef.current[3] = el)}>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div
              ref={(el) => (inputsRef.current[4] = el)}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded transition-all duration-200 peer-checked:bg-gray-900 dark:peer-checked:bg-white peer-checked:border-gray-900 dark:peer-checked:border-white flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white dark:text-gray-900 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              ref={(el) => (inputsRef.current[5] = el)}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className="relative w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm uppercase tracking-wider rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-gray-900 dark:text-white hover:underline transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          By signing in, you agree to our{' '}
          <Link
            href="/terms"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}