'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Users, Mail, Link2, Check, Edit2, UserPlus } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ShareModalProps {
  onClose: () => void;
  weddingId?: string;
  weddingData?: any;
}

export function ShareModal({ onClose, weddingId, weddingData }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'guests' | 'partner'>('guests');
  const [copied, setCopied] = useState(false);
  const [copiedPartner, setCopiedPartner] = useState(false);
  const [email, setEmail] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [customSlug, setCustomSlug] = useState(weddingData?.slug || '');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [message, setMessage] = useState(
    "We're excited to have you help us build our wedding playlist! Click the link below to add your favorite songs."
  );
  
  // Guest link (uses custom slug if available)
  const guestLink = typeof window !== 'undefined' 
    ? customSlug 
      ? `${window.location.origin}/${customSlug}`
      : `${window.location.origin}/guest/${weddingId || 'demo'}`
    : '';
    
  // Partner collaboration link (direct access to builder)
  const partnerLink = typeof window !== 'undefined'
    ? `${window.location.origin}/builder?partner=${weddingId || 'demo'}`
    : '';

  useEffect(() => {
    if (weddingData?.slug) {
      setCustomSlug(weddingData.slug);
    }
  }, [weddingData]);

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(false);
      return;
    }
    
    setCheckingSlug(true);
    try {
      // Check if slug is already taken
      const { getWeddingBySlug } = await import('@/lib/slug-utils');
      const existingWedding = await getWeddingBySlug(slug);
      setSlugAvailable(!existingWedding || existingWedding.id === weddingId);
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugAvailable(true);
    }
    setCheckingSlug(false);
  };

  const handleSaveSlug = async () => {
    if (!slugAvailable || !weddingId) return;
    
    try {
      await updateDoc(doc(db, 'weddings', weddingId), {
        slug: customSlug
      });
      setIsEditingSlug(false);
    } catch (error) {
      console.error('Error saving slug:', error);
    }
  };

  const handleCopyGuest = () => {
    navigator.clipboard.writeText(guestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCopyPartner = () => {
    navigator.clipboard.writeText(partnerLink);
    setCopiedPartner(true);
    setTimeout(() => setCopiedPartner(false), 2000);
  };

  const handleEmailInvite = () => {
    const subject = encodeURIComponent('Help us build our wedding playlist!');
    const body = encodeURIComponent(`${message}\n\n${guestLink}`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setEmail('');
  };
  
  const handlePartnerInvite = () => {
    const subject = encodeURIComponent("Let's build our wedding playlist together!");
    const body = encodeURIComponent(
      `I've started building our wedding playlist! You can join me and help create the perfect soundtrack for our big day.\n\n` +
      `Click here to collaborate: ${partnerLink}\n\n` +
      `You'll be able to add songs, organize the timeline, and invite our guests to contribute their favorites.`
    );
    window.open(`mailto:${partnerEmail}?subject=${subject}&body=${body}`);
    setPartnerEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-gradient rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Share & Invite</h2>
          <p className="text-white/60">Collaborate with your partner and collect song suggestions from guests</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'guests'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Guest Invites
          </button>
          <button
            onClick={() => setActiveTab('partner')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'partner'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Partner Access
            <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">FREE</span>
          </button>
        </div>

        {activeTab === 'guests' ? (
          <>
            {/* Custom URL */}
            <div className="mb-6">
              <label className="text-sm font-medium text-white mb-2 block">Custom Wedding URL</label>
              {isEditingSlug ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center bg-white/10 border border-white/20 rounded-lg px-3">
                      <span className="text-white/60 text-sm">weddings.uptune.xyz/</span>
                      <input
                        type="text"
                        value={customSlug}
                        onChange={(e) => {
                          const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                          setCustomSlug(slug);
                          checkSlugAvailability(slug);
                        }}
                        className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2"
                        placeholder="john-and-jane"
                      />
                    </div>
                    <button
                      onClick={handleSaveSlug}
                      disabled={!slugAvailable || checkingSlug}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingSlug(false)}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {customSlug && !slugAvailable && (
                    <p className="text-xs text-red-400">This URL is already taken</p>
                  )}
                  {customSlug && slugAvailable && customSlug.length >= 3 && (
                    <p className="text-xs text-green-400">✓ This URL is available</p>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guestLink}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={() => setIsEditingSlug(true)}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    title="Customize URL"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyGuest}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            {/* Email Invite */}
            <div className="mb-6">
              <label className="text-sm font-medium text-white mb-2 block">Invite Guests by Email</label>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter guest email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 h-20 resize-none"
                  placeholder="Personal message..."
                />
                <button
                  onClick={handleEmailInvite}
                  disabled={!email}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Guest Invitation
                </button>
              </div>
            </div>

            {/* Guest Access Info */}
            <div className="p-4 bg-purple-600/20 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                What guests can do:
              </h3>
              <ul className="text-xs text-white/80 space-y-1">
                <li>• Suggest up to 5 songs each</li>
                <li>• Vote on other suggestions</li>
                <li>• Leave dedications and messages</li>
                <li>• RSVP for the wedding</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Partner Collaboration */}
            <div className="mb-6">
              <label className="text-sm font-medium text-white mb-2 block">Partner Collaboration Link</label>
              <p className="text-xs text-white/60 mb-3">
                Share this link with your partner to build your playlist together
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={partnerLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                />
                <button
                  onClick={handleCopyPartner}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  {copiedPartner ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedPartner ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Partner Email Invite */}
            <div className="mb-6">
              <label className="text-sm font-medium text-white mb-2 block">Invite Partner by Email</label>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your partner's email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40"
                />
                <button
                  onClick={handlePartnerInvite}
                  disabled={!partnerEmail}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Partner Invitation
                </button>
              </div>
            </div>

            {/* Partner Access Info */}
            <div className="p-4 bg-green-600/20 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Partner collaboration includes:
              </h3>
              <ul className="text-xs text-white/80 space-y-1">
                <li>• Full access to add and organize songs</li>
                <li>• Manage the wedding timeline together</li>
                <li>• Invite and manage guest contributions</li>
                <li>• Export playlists to Spotify or DJ</li>
                <li className="text-green-400 font-medium">✓ No payment required - Free for partners!</li>
              </ul>
            </div>
          </>
        )}
        
        {/* Share Options */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-white mb-2">Quick Share</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const link = activeTab === 'guests' ? guestLink : partnerLink;
                const text = activeTab === 'guests' 
                  ? `Help us build our wedding playlist! ${link}`
                  : `Let's build our wedding playlist together! ${link}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              WhatsApp
            </button>
            <button
              onClick={() => {
                const link = activeTab === 'guests' ? guestLink : partnerLink;
                const text = activeTab === 'guests'
                  ? 'Help us build our wedding playlist!'
                  : "Let's build our wedding playlist together!";
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}