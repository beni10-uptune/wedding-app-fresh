'use client';

import React, { useState } from 'react';
import { X, Copy, Share2, Users, Mail, Link2, Check } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
  weddingId?: string;
}

export function ShareModal({ onClose, weddingId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    "We're excited to have you help us build our wedding playlist! Click the link below to add your favorite songs."
  );
  
  const shareLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/guest/${weddingId || 'demo'}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailInvite = () => {
    const subject = encodeURIComponent('Help us build our wedding playlist!');
    const body = encodeURIComponent(`${message}\n\n${shareLink}`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setEmail('');
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
          <p className="text-white/60">Invite your partner and guests to collaborate on your wedding playlist</p>
        </div>

        {/* Share Link */}
        <div className="mb-6">
          <label className="text-sm font-medium text-white mb-2 block">Your Wedding Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Email Invite */}
        <div className="mb-6">
          <label className="text-sm font-medium text-white mb-2 block">Invite by Email</label>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter email address"
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
              Send Invitation
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white mb-2">Quick Share</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const text = encodeURIComponent(`Help us build our wedding playlist! ${shareLink}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              WhatsApp
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent('Help us build our wedding playlist!');
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${text}`, '_blank');
              }}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              Facebook
            </button>
          </div>
        </div>

        {/* Guest Access Info */}
        <div className="mt-6 p-4 bg-purple-600/20 rounded-lg">
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
      </div>
    </div>
  );
}