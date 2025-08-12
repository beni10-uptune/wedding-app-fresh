'use client';

import React, { useState } from 'react';
import { X, MessageSquare, TrendingUp, Upload, Music, Users, Save, CreditCard, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

interface UpgradeModalProps {
  onClose: () => void;
  weddingId?: string;
  user?: any;
}

// Determine currency based on selected country
const getCurrency = (country?: string) => {
  if (country === 'United States') return { symbol: '$', amount: 29, code: 'usd' };
  if (country === 'Ireland') return { symbol: '€', amount: 29, code: 'eur' };
  return { symbol: '£', amount: 25, code: 'gbp' }; // Default to UK
};

export function UpgradeModal({ onClose, weddingId, user }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Get user's country from localStorage or default to UK
  const userCountry = typeof window !== 'undefined' 
    ? localStorage.getItem('selectedCountry') || 'United Kingdom'
    : 'United Kingdom';
  
  const currency = getCurrency(userCountry);

  const handleUpgrade = async () => {
    if (!user) {
      setError('Please sign in to upgrade');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the ID token for authentication
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error('Authentication required');
      }

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          weddingId: weddingId || user.uid,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Payment intent creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Provide more specific error messages
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (errorData.error) {
          throw new Error(errorData.error);
        } else {
          throw new Error('Failed to create payment session. Please try again.');
        }
      }

      const { clientSecret } = await response.json();

      // Load Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Failed to load payment system');
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?wedding=${weddingId || user.uid}`,
          receipt_email: user.email,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-gradient rounded-2xl p-8 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Unlock Pro Features</h2>
          <p className="text-white/60">Get unlimited access to all premium features</p>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">AI Assistant & Chat</p>
              <p className="text-xs text-white/60">Get personalized song recommendations and BPM matching</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Import from Spotify</p>
              <p className="text-xs text-white/60">Analyze your music taste and import playlists</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Export to Spotify & DJ</p>
              <p className="text-xs text-white/60">One-click export for your vendors</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Unlimited Guest Invites</p>
              <p className="text-xs text-white/60">Collect song suggestions from all your guests</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Priority Support</p>
              <p className="text-xs text-white/60">Get help when you need it</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-center mb-6 p-4 bg-purple-600/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-4xl font-bold text-white">
              {currency.symbol}{currency.amount}
            </span>
            <span className="text-white/60 line-through">
              {currency.symbol}{currency.amount * 2}
            </span>
          </div>
          <p className="text-sm text-white/60">One-time payment • Lifetime access</p>
          <p className="text-xs text-green-400 mt-1">Limited time: 50% off!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Upgrade to Pro - {currency.symbol}{currency.amount}
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-6 text-xs text-white/40">
            <span>🔒 Secure payment</span>
            <span>💳 Powered by Stripe</span>
            <span>↩️ 30-day guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}