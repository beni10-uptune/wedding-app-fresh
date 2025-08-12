'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Download, Users, Music, FileText, TrendingUp } from 'lucide-react';

interface UpgradePromptProps {
  trigger: 'export' | 'add-coowner' | 'guests' | 'ai-suggest' | 'song-limit' | 'pdf-export';
  weddingId?: string;
  onClose?: () => void;
  onUpgrade?: () => void;
}

const TRIGGER_CONFIG = {
  'export': {
    icon: Download,
    title: 'Export to Spotify',
    subtitle: 'Create real Spotify playlists instantly',
    benefits: [
      'One-click Spotify playlist creation',
      'Organize by wedding moments',
      'Share with your DJ',
      'Unlimited exports'
    ],
    cta: 'Upgrade to Export'
  },
  'add-coowner': {
    icon: Users,
    title: 'Add Your Partner',
    subtitle: 'Plan your music together',
    benefits: [
      'Collaborate in real-time',
      'Both can add and remove songs',
      'See who added what',
      'Perfect harmony'
    ],
    cta: 'Upgrade to Collaborate'
  },
  'guests': {
    icon: Users,
    title: 'Guest Song Requests',
    subtitle: 'Let your guests contribute',
    benefits: [
      'Custom request form',
      'Vote on submissions',
      'Auto-filter inappropriate songs',
      'Guest analytics'
    ],
    cta: 'Upgrade for Guest Features'
  },
  'ai-suggest': {
    icon: Sparkles,
    title: 'AI DJ Recommendations',
    subtitle: 'Smart suggestions based on your taste',
    benefits: [
      'Personalized recommendations',
      'Fill gaps automatically',
      'Discover hidden gems',
      'Perfect flow guaranteed'
    ],
    cta: 'Upgrade for AI Magic'
  },
  'song-limit': {
    icon: Music,
    title: 'Unlimited Songs',
    subtitle: 'No limits on your perfect playlist',
    benefits: [
      'Add unlimited songs',
      'Build complete timeline',
      'Multiple playlist versions',
      'Never compromise'
    ],
    cta: 'Upgrade for Unlimited'
  },
  'pdf-export': {
    icon: FileText,
    title: 'DJ-Ready Export',
    subtitle: 'Professional formats for your vendors',
    benefits: [
      'PDF timeline for DJ',
      'CSV for spreadsheets',
      'Print-ready formats',
      'Vendor communication tools'
    ],
    cta: 'Upgrade for Pro Exports'
  }
};

export default function UpgradePrompt({ trigger, weddingId, onClose, onUpgrade }: UpgradePromptProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const config = TRIGGER_CONFIG[trigger];
  const Icon = config.icon;

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    // Track conversion event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'upgrade_prompt_click', {
        trigger,
        wedding_id: weddingId
      });
    }

    // Navigate to pricing with context
    const params = new URLSearchParams({
      from: trigger,
      ...(weddingId && { wedding: weddingId })
    });
    
    if (onUpgrade) onUpgrade();
    router.push(`/pricing?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{config.title}</h3>
              <p className="text-white/90">{config.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">£25</span>
              <span className="text-gray-500 line-through">£50</span>
            </div>
            <p className="text-sm text-gray-600">One-time payment • Lifetime access</p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span>{config.cta}</span>
                </>
              )}
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span>14-day guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}