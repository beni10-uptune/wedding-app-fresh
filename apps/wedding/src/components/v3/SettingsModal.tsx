'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Music, Save, Trash2, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface SettingsModalProps {
  onClose: () => void;
  weddingData: any;
  onUpdate: (data: any) => void;
}

export function SettingsModal({ onClose, weddingData, onUpdate }: SettingsModalProps) {
  const [formData, setFormData] = useState({
    weddingName: weddingData?.weddingName || '',
    weddingDate: weddingData?.weddingDate || '',
    venue: weddingData?.venue || '',
    city: weddingData?.city || '',
    guestCount: weddingData?.guestCount || '',
    djName: weddingData?.djName || '',
    bandName: weddingData?.bandName || '',
  });

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
          <h2 className="text-2xl font-bold text-white mb-2">Wedding Settings</h2>
          <p className="text-white/60">Manage your wedding details and preferences</p>
        </div>

        {/* Wedding Details */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-white mb-1 block">Wedding Name</label>
            <input
              type="text"
              value={formData.weddingName}
              onChange={(e) => setFormData({ ...formData, weddingName: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              placeholder="John & Jane's Wedding"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-1 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Wedding Date
            </label>
            <input
              type="date"
              value={formData.weddingDate}
              onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-1 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              placeholder="The Grand Ballroom"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-1 block">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              placeholder="New York, NY"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-1 block flex items-center gap-2">
              <Users className="w-4 h-4" />
              Expected Guests
            </label>
            <input
              type="number"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              placeholder="150"
            />
          </div>
        </div>

        {/* Music Vendors */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Music className="w-4 h-4" />
            Music Vendors
          </h3>
          
          <div>
            <label className="text-xs text-white/60 mb-1 block">DJ Name</label>
            <input
              type="text"
              value={formData.djName}
              onChange={(e) => setFormData({ ...formData, djName: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              placeholder="DJ Amazing"
            />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Band Name</label>
            <input
              type="text"
              value={formData.bandName}
              onChange={(e) => setFormData({ ...formData, bandName: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              placeholder="The Wedding Singers"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <button
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                if (confirm('Are you sure you want to delete this wedding? This cannot be undone.')) {
                  // Handle deletion
                  console.log('Delete wedding');
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40">
            Signed in as: {auth.currentUser?.email}
          </p>
        </div>
      </div>
    </div>
  );
}