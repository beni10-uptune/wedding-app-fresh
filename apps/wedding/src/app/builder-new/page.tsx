'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/SupabaseAuthProvider';
import { weddingHelpers } from '@/lib/supabase/wedding-helpers';
import Link from 'next/link';
import { 
  Music, 
  MapPin,
  Sparkles,
  Heart,
  Users,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronRight,
  Link2,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { 
  generateSlugFromNames, 
  isValidSlug, 
  isSlugAvailable, 
  sanitizeSlug,
  suggestAlternativeSlugs 
} from '@/lib/supabase/slug-utils';

export default function BuilderPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weddings, setWeddings] = useState<any[]>([]);
  
  // Form state
  const [coupleNames, setCoupleNames] = useState('');
  const [partner1Name, setPartner1Name] = useState('');
  const [partner2Name, setPartner2Name] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venueType, setVenueType] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  
  // Custom URL state
  const [customSlug, setCustomSlug] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
  const [useCustomUrl, setUseCustomUrl] = useState(true);

  useEffect(() => {
    if (user) {
      loadWeddings();
    }
  }, [user]);

  const loadWeddings = async () => {
    try {
      const myWeddings = await weddingHelpers.getMyWeddings();
      setWeddings(myWeddings);
    } catch (err) {
      console.error('Error loading weddings:', err);
    }
  };

  // Auto-generate slug when couple names change
  useEffect(() => {
    if (coupleNames && !customSlug) {
      const generatedSlug = generateSlugFromNames(coupleNames);
      setCustomSlug(generatedSlug);
    }
  }, [coupleNames]);

  // Check slug availability with debouncing
  useEffect(() => {
    if (!customSlug || customSlug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    const checkSlug = async () => {
      setIsCheckingSlug(true);
      const sanitized = sanitizeSlug(customSlug);
      
      if (!isValidSlug(sanitized)) {
        setSlugAvailable(false);
        setIsCheckingSlug(false);
        return;
      }

      const available = await isSlugAvailable(sanitized);
      setSlugAvailable(available);
      
      if (!available) {
        const suggestions = suggestAlternativeSlugs(sanitized);
        setSlugSuggestions(suggestions);
      }
      
      setIsCheckingSlug(false);
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [customSlug]);

  const handleCreateWedding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (useCustomUrl && !slugAvailable) {
      setError('Please choose an available URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalSlug = useCustomUrl ? sanitizeSlug(customSlug) : undefined;
      
      const wedding = await weddingHelpers.createWedding({
        couple_names: coupleNames,
        partner1_name: partner1Name,
        partner2_name: partner2Name,
        wedding_date: weddingDate || undefined,
        venue_type: venueType || undefined,
        guest_count: guestCount || undefined,
        slug: finalSlug
      });

      // Redirect to the wedding builder
      router.push(`/wedding/${wedding.slug}/builder`);
    } catch (err: any) {
      setError(err.message || 'Failed to create wedding');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card rounded-2xl p-8">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
              <p className="text-white/80 mb-6">
                Please sign in to create and manage your wedding playlists.
              </p>
              <Link href="/auth/login" className="btn-primary inline-block">
                Sign In to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Create Your Wedding Playlist
          </h1>
          <p className="text-xl text-white/80">
            Let's build the perfect soundtrack for your special day
          </p>
        </div>

        {/* Existing Weddings */}
        {weddings.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Weddings</h2>
            <div className="grid gap-4">
              {weddings.map((wedding) => (
                <Link
                  key={wedding.id}
                  href={`/wedding/${wedding.slug}/builder`}
                  className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {wedding.couple_names}
                      </h3>
                      {wedding.wedding_date && (
                        <p className="text-white/60 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(wedding.wedding_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/40" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Create New Wedding Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {weddings.length > 0 ? 'Create Another Wedding' : 'Get Started'}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateWedding} className="space-y-6">
              {/* Couple Names */}
              <div>
                <label className="block text-white mb-2">
                  Couple Names <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="John & Jane"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                  required
                />
                <p className="text-white/60 text-sm mt-1">
                  This will be displayed on your wedding page
                </p>
              </div>

              {/* Custom Wedding URL - Special Touch */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-white">
                    <Link2 className="w-4 h-4 text-purple-400" />
                    Your Wedding URL
                    <span className="text-purple-400 text-xs font-medium px-2 py-0.5 bg-purple-500/20 rounded-full">✨ Special Touch</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomUrl(!useCustomUrl)}
                    className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {useCustomUrl ? 'Auto-generate' : 'Customize'}
                  </button>
                </div>
                
                {useCustomUrl && (
                  <>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
                      <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
                        <span className="px-4 py-3 bg-white/5 border-r border-white/10 text-white/60 text-sm">
                          weddings.uptune.xyz/
                        </span>
                        <input
                          type="text"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(sanitizeSlug(e.target.value))}
                          placeholder="your-wedding-url"
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                          required={useCustomUrl}
                        />
                        <div className="px-3">
                          {isCheckingSlug ? (
                            <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                          ) : slugAvailable === true ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : slugAvailable === false ? (
                            <X className="w-5 h-5 text-red-400" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    
                    {/* Availability Status */}
                    {slugAvailable === true && customSlug && (
                      <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Perfect! This URL is available
                      </p>
                    )}
                    
                    {slugAvailable === false && (
                      <div className="mt-2">
                        <p className="text-sm text-red-400 flex items-center gap-1 mb-2">
                          <X className="w-4 h-4" />
                          This URL is already taken
                        </p>
                        {slugSuggestions.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-white/60">Try one of these:</p>
                            <div className="flex flex-wrap gap-2">
                              {slugSuggestions.map((suggestion) => (
                                <button
                                  key={suggestion}
                                  type="button"
                                  onClick={() => setCustomSlug(suggestion)}
                                  className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="mt-2 text-xs text-white/50">
                      Share this link with your guests for easy access to your wedding page
                    </p>
                  </>
                )}
              </div>

              {/* Partner Names */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Partner 1 Name</label>
                  <input
                    type="text"
                    value={partner1Name}
                    onChange={(e) => setPartner1Name(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Partner 2 Name</label>
                  <input
                    type="text"
                    value={partner2Name}
                    onChange={(e) => setPartner2Name(e.target.value)}
                    placeholder="Jane"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Wedding Date */}
              <div>
                <label className="block text-white mb-2">Wedding Date</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                />
              </div>

              {/* Venue Type */}
              <div>
                <label className="block text-white mb-2">Venue Type</label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                >
                  <option value="">Select venue type</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="indoor">Indoor</option>
                  <option value="beach">Beach</option>
                  <option value="garden">Garden</option>
                  <option value="ballroom">Ballroom</option>
                  <option value="barn">Barn/Rustic</option>
                  <option value="church">Church</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-white mb-2">
                  Estimated Guest Count
                </label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  min="1"
                  max="1000"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !coupleNames}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Wedding Playlist
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 text-center">
              <Music className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Smart Playlists
              </h3>
              <p className="text-white/60 text-sm">
                AI-powered song recommendations for every wedding moment
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Guest Submissions
              </h3>
              <p className="text-white/60 text-sm">
                Let guests suggest their favorite songs for your playlist
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Spotify Integration
              </h3>
              <p className="text-white/60 text-sm">
                Export your perfect playlist directly to Spotify
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}