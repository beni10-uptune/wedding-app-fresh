'use client';

import { useState } from 'react';
import { X, Mail, Shield, Star, Users } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
  trigger: 'export' | 'save' | 'share';
  totalSongs?: number;
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  onSuccess,
  trigger,
  totalSongs = 0
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasConsent, setHasConsent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!hasConsent) {
      setError('Please agree to receive your playlist');
      return;
    }

    setIsSubmitting(true);

    try {
      // Track conversion event
      trackEvent('email_captured', {
        trigger,
        total_songs: totalSongs
      });

      // Store email in localStorage for recovery
      if (typeof window !== 'undefined') {
        const capturedEmails = JSON.parse(localStorage.getItem('captured_emails') || '[]');
        capturedEmails.push({
          email,
          trigger,
          timestamp: new Date().toISOString(),
          totalSongs
        });
        localStorage.setItem('captured_emails', JSON.stringify(capturedEmails));
      }

      // Send to API
      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          trigger,
          totalSongs,
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to capture email');
      }

      // Call the parent success handler
      onSuccess(email);
      onClose();
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Email capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTriggerContent = () => {
    switch (trigger) {
      case 'export':
        return {
          title: 'Export Your Wedding Playlist',
          subtitle: 'Get your curated playlist sent directly to your inbox',
          benefits: [
            'Export to Spotify with one click',
            'Download as PDF for your DJ',
            'Share with your partner'
          ],
          cta: 'Send My Playlist'
        };
      case 'save':
        return {
          title: 'Save Your Wedding Timeline',
          subtitle: `Don't lose your perfect ${totalSongs} song playlist!`,
          benefits: [
            'Access from any device',
            'Continue editing anytime',
            'Collaborate with your partner'
          ],
          cta: 'Save My Timeline'
        };
      case 'share':
        return {
          title: 'Share with Your Partner',
          subtitle: 'Build your wedding playlist together',
          benefits: [
            'Real-time collaboration',
            'Guest song requests',
            'Voting on favorites'
          ],
          cta: 'Get Sharing Link'
        };
      default:
        return {
          title: 'Continue Building',
          subtitle: 'Enter your email to proceed',
          benefits: [],
          cta: 'Continue'
        };
    }
  };

  const content = getTriggerContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative glass-darker rounded-2xl p-6 max-w-md w-full animate-slideIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {content.title}
          </h2>
          <p className="text-white/70">
            {content.subtitle}
          </p>
        </div>

        {/* Benefits */}
        {content.benefits.length > 0 && (
          <div className="mb-6 space-y-2">
            {content.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-sm text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Social Proof */}
        <div className="mb-6 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center justify-center gap-4 text-center">
            <div>
              <div className="flex items-center gap-1 justify-center mb-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-lg font-semibold text-white">2,847</span>
              </div>
              <span className="text-xs text-white/60">Happy Couples</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="flex items-center gap-1 justify-center mb-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-lg font-semibold text-white">100%</span>
              </div>
              <span className="text-xs text-white/60">Secure</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
              autoFocus
              required
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
              className="mt-1 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-400"
            />
            <span className="text-xs text-white/60">
              I'd like to receive my playlist and occasional wedding planning tips. 
              You can unsubscribe anytime.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !email || !hasConsent}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Processing...' : content.cta}
          </button>
        </form>

        {/* Trust Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/40">
            🔒 Your email is secure and will never be shared
          </p>
        </div>

        {/* Skip Option - Less prominent */}
        <button
          onClick={() => {
            trackEvent('email_capture_skipped', { trigger });
            onClose();
          }}
          className="w-full mt-3 text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}