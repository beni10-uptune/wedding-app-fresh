'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Check, X, Sparkles, Users, Music, Download, Heart, Zap } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const PricingPage = () => {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'GBP' | 'EUR'>('USD');
  const [user, setUser] = useState<any>(null);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  
  const pricing = {
    free: selectedCurrency === 'GBP' ? '£0' : selectedCurrency === 'EUR' ? '€0' : '$0',
    professional: selectedCurrency === 'GBP' ? '£25' : selectedCurrency === 'EUR' ? '€29' : '$29'
  };

  useEffect(() => {
    // Detect user's currency based on locale
    const userLocale = navigator.language;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (userLocale.includes('en-GB') || userTimezone.includes('London')) {
      setSelectedCurrency('GBP');
    } else if (userLocale.includes('en-US') || userTimezone.includes('America')) {
      setSelectedCurrency('USD');
    } else if (userTimezone.includes('Europe')) {
      setSelectedCurrency('EUR');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Get user tier from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentTier(userData.tier || 'free');
          }
        } catch (error) {
          console.error('Error fetching user tier:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectPlan = (tier: string) => {
    if (!user) {
      router.push('/auth/signup');
    } else if (tier === 'free') {
      router.push('/builder');
    } else {
      // Navigate to builder with upgrade modal
      router.push(`/builder?upgrade=${tier}`);
    }
  };

  const tiers = [
    {
      name: 'Free',
      id: 'free',
      price: pricing.free,
      description: 'Perfect for getting started',
      features: [
        { text: 'Up to 50 songs total', included: true },
        { text: 'Basic playlist builder', included: true },
        { text: 'Timeline organizer', included: true },
        { text: 'Export to Spotify', included: false },
        { text: 'Guest song requests', included: false },
        { text: 'Partner collaboration', included: false },
        { text: 'AI DJ recommendations', included: false },
        { text: 'Unlimited songs', included: false },
      ],
      cta: currentTier === 'free' ? 'Current Plan' : 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      id: 'professional',
      price: pricing.professional,
      description: 'Everything you need for your perfect wedding',
      features: [
        { text: 'Unlimited songs', included: true },
        { text: 'Advanced playlist builder', included: true },
        { text: 'Timeline organizer', included: true },
        { text: 'Export to Spotify', included: true },
        { text: 'Guest song requests', included: true },
        { text: 'Partner collaboration', included: true },
        { text: 'AI DJ recommendations', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: currentTier === 'professional' ? 'Current Plan' : 'Upgrade Now',
      popular: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Music className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold text-white">Uptune</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Currency Selector */}
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as 'USD' | 'GBP' | 'EUR')}
                className="bg-white/10 text-white px-3 py-1 rounded-lg border border-white/20 focus:outline-none focus:border-purple-400"
              >
                <option value="USD">$ USD</option>
                <option value="GBP">£ GBP</option>
                <option value="EUR">€ EUR</option>
              </select>

              {user ? (
                <Link href="/builder" className="text-white hover:text-purple-200 transition">
                  Back to Builder
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-white hover:text-purple-200 transition">
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-white mb-4">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-purple-200 max-w-2xl mx-auto">
          Create the ultimate wedding playlist with our powerful tools and AI recommendations
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border ${
                tier.popular
                  ? 'border-purple-400 shadow-2xl shadow-purple-500/20'
                  : 'border-white/20'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{tier.name}</h2>
                <p className="text-purple-200 mb-4">{tier.description}</p>
                <div className="text-4xl font-bold text-white">
                  {tier.price}
                  {tier.id !== 'free' && (
                    <span className="text-lg font-normal text-purple-200"> one-time</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-white' : 'text-white/40'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(tier.id)}
                disabled={currentTier === tier.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                  currentTier === tier.id
                    ? 'bg-white/20 text-white cursor-not-allowed'
                    : tier.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Uptune?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Made for Weddings</h3>
              <p className="text-purple-200">
                Designed specifically for wedding planning with timeline-based organization
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Guest Collaboration</h3>
              <p className="text-purple-200">
                Let your guests request songs and vote on their favorites
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-purple-200">
                Get intelligent song recommendations based on your preferences
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-purple-200">
                You can upgrade from Free to Professional at any time. Your progress and playlists will be saved.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do I need a Spotify account?
              </h3>
              <p className="text-purple-200">
                A Spotify account is recommended for full functionality, but you can still build and organize your playlist without one.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is this a subscription?
              </h3>
              <p className="text-purple-200">
                No! Professional is a one-time payment that gives you access until your wedding date plus 30 days after.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;