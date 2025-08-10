'use client';

import React, { useMemo } from 'react';
import { AlertTriangle, TrendingUp, Music, Zap, CheckCircle, Lock } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  bpm?: number;
  energy?: number;
  genre?: string;
}

interface FlowVisualizationProps {
  songs: Song[];
  isPro?: boolean;
  onUpgradeClick?: () => void;
}

// Simulated BPM and energy data for demo songs
const SONG_FEATURES: Record<string, { bpm: number; energy: number; genre: string }> = {
  // Party songs
  'p1': { bpm: 122, energy: 0.9, genre: 'funk' }, // September
  'p2': { bpm: 128, energy: 0.85, genre: 'funk' }, // Uptown Funk
  'p3': { bpm: 148, energy: 0.88, genre: 'rock' }, // Mr. Brightside
  'p4': { bpm: 135, energy: 0.82, genre: 'pop' }, // Shut Up and Dance
  'p5': { bpm: 113, energy: 0.75, genre: 'pop' }, // Can't Stop the Feeling
  'p6': { bpm: 118, energy: 0.92, genre: 'pop' }, // I Wanna Dance with Somebody
  'p7': { bpm: 101, energy: 0.8, genre: 'pop' }, // Dancing Queen
  'p8': { bpm: 128, energy: 0.85, genre: 'rock' }, // Sweet Caroline
  'p9': { bpm: 119, energy: 0.9, genre: 'rock' }, // Don't Stop Believin'
  'p10': { bpm: 89, energy: 0.7, genre: 'rock' }, // Wonderwall
  
  // Dinner songs
  'd1': { bpm: 95, energy: 0.4, genre: 'soul' }, // At Last
  'd2': { bpm: 96, energy: 0.35, genre: 'rock' }, // Wonderful Tonight
  'd3': { bpm: 70, energy: 0.3, genre: 'pop' }, // Your Song
  'd4': { bpm: 116, energy: 0.45, genre: 'jazz' }, // The Way You Look Tonight
  'd5': { bpm: 80, energy: 0.5, genre: 'pop' }, // Thinking Out Loud
  'd6': { bpm: 63, energy: 0.4, genre: 'soul' }, // All of Me
  
  // First dance
  'fd1': { bpm: 80, energy: 0.5, genre: 'pop' }, // Perfect
  
  // Cocktails
  'ct1': { bpm: 116, energy: 0.55, genre: 'jazz' }, // Fly Me to the Moon
  'ct2': { bpm: 123, energy: 0.65, genre: 'soul' }, // Valerie
  'ct3': { bpm: 90, energy: 0.6, genre: 'pop' }, // Golden
};

export function FlowVisualization({ songs, isPro = false, onUpgradeClick }: FlowVisualizationProps) {
  const analysis = useMemo(() => {
    const problems: Array<{ type: 'bpm' | 'energy' | 'genre'; index: number; message: string }> = [];
    const warnings: string[] = [];
    
    let totalBPMJumps = 0;
    let totalEnergyDrops = 0;
    let genreClashes = 0;
    
    for (let i = 1; i < songs.length; i++) {
      const prev = songs[i - 1];
      const curr = songs[i];
      
      const prevFeatures = SONG_FEATURES[prev.id] || { bpm: 120, energy: 0.5, genre: 'pop' };
      const currFeatures = SONG_FEATURES[curr.id] || { bpm: 120, energy: 0.5, genre: 'pop' };
      
      // Check BPM jump
      const bpmDiff = Math.abs(currFeatures.bpm - prevFeatures.bpm);
      if (bpmDiff > 15) {
        totalBPMJumps++;
        problems.push({
          type: 'bpm',
          index: i,
          message: `${prev.title} (${prevFeatures.bpm} BPM) → ${curr.title} (${currFeatures.bpm} BPM)`
        });
      }
      
      // Check energy drop
      const energyDiff = currFeatures.energy - prevFeatures.energy;
      if (energyDiff < -0.3) {
        totalEnergyDrops++;
        problems.push({
          type: 'energy',
          index: i,
          message: `Energy drops from ${prev.title} to ${curr.title}`
        });
      }
      
      // Check genre clash
      if (prevFeatures.genre !== currFeatures.genre && 
          !isCompatibleGenre(prevFeatures.genre, currFeatures.genre)) {
        genreClashes++;
        problems.push({
          type: 'genre',
          index: i,
          message: `${prevFeatures.genre} → ${currFeatures.genre} might feel jarring`
        });
      }
    }
    
    if (totalBPMJumps > 0) {
      warnings.push(`${totalBPMJumps} jarring BPM transitions`);
    }
    if (totalEnergyDrops > 0) {
      warnings.push(`${totalEnergyDrops} energy drops that might clear the floor`);
    }
    if (genreClashes > 0) {
      warnings.push(`${genreClashes} genre clashes`);
    }
    
    return { problems, warnings, totalBPMJumps, totalEnergyDrops, genreClashes };
  }, [songs]);
  
  const flowData = useMemo(() => {
    return songs.map(song => {
      const features = SONG_FEATURES[song.id] || { bpm: 120, energy: 0.5, genre: 'pop' };
      return {
        ...song,
        ...features,
        normalizedBPM: (features.bpm - 60) / 140, // Normalize to 0-1 range (60-200 BPM)
        normalizedEnergy: features.energy
      };
    });
  }, [songs]);
  
  const totalProblems = analysis.totalBPMJumps + analysis.totalEnergyDrops + analysis.genreClashes;
  
  if (songs.length === 0) return null;
  
  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            DJ Flow Analysis
          </h3>
          <p className="text-sm text-white/60">
            {isPro ? 'AI-optimized for perfect transitions' : 'Analyzing your playlist flow'}
          </p>
        </div>
        {!isPro && totalProblems > 0 && (
          <div className="text-right">
            <p className="text-sm text-orange-400 font-medium">{totalProblems} issues found</p>
            <p className="text-xs text-white/50">Upgrade to fix</p>
          </div>
        )}
      </div>
      
      {/* BPM Flow Chart */}
      <div className="space-y-2">
        <p className="text-xs text-white/50 uppercase">BPM Flow</p>
        <div className="h-24 bg-white/5 rounded-lg p-3 relative overflow-hidden">
          <svg className="w-full h-full" viewBox={`0 0 ${songs.length * 30} 80`}>
            {/* Grid lines */}
            <line x1="0" y1="40" x2={songs.length * 30} y2="40" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
            
            {/* BPM line */}
            <polyline
              points={flowData.map((song, i) => `${i * 30 + 15},${70 - song.normalizedBPM * 60}`).join(' ')}
              fill="none"
              stroke={isPro ? '#10b981' : '#f59e0b'}
              strokeWidth="2"
            />
            
            {/* Problem indicators */}
            {!isPro && analysis.problems
              .filter(p => p.type === 'bpm')
              .map((problem, i) => (
                <circle
                  key={i}
                  cx={problem.index * 30 + 15}
                  cy={70 - flowData[problem.index].normalizedBPM * 60}
                  r="4"
                  fill="#ef4444"
                />
              ))
            }
          </svg>
          
          {isPro && (
            <div className="absolute top-1 right-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
          )}
        </div>
      </div>
      
      {/* Energy Flow Chart */}
      <div className="space-y-2">
        <p className="text-xs text-white/50 uppercase">Energy Arc</p>
        <div className="h-24 bg-white/5 rounded-lg p-3 relative overflow-hidden">
          <svg className="w-full h-full" viewBox={`0 0 ${songs.length * 30} 80`}>
            {/* Energy area fill */}
            <defs>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPro ? '#10b981' : '#f59e0b'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPro ? '#10b981' : '#f59e0b'} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            <polygon
              points={`0,70 ${flowData.map((song, i) => `${i * 30 + 15},${70 - song.normalizedEnergy * 60}`).join(' ')} ${(songs.length - 1) * 30 + 15},70`}
              fill="url(#energyGradient)"
            />
            
            {/* Energy line */}
            <polyline
              points={flowData.map((song, i) => `${i * 30 + 15},${70 - song.normalizedEnergy * 60}`).join(' ')}
              fill="none"
              stroke={isPro ? '#10b981' : '#f59e0b'}
              strokeWidth="2"
            />
            
            {/* Problem indicators */}
            {!isPro && analysis.problems
              .filter(p => p.type === 'energy')
              .map((problem, i) => (
                <circle
                  key={i}
                  cx={problem.index * 30 + 15}
                  cy={70 - flowData[problem.index].normalizedEnergy * 60}
                  r="4"
                  fill="#ef4444"
                />
              ))
            }
          </svg>
          
          {isPro && (
            <div className="absolute top-1 right-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
          )}
        </div>
      </div>
      
      {/* Warnings or Success Messages */}
      {isPro ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-white">AI-Optimized Playlist</p>
              <ul className="text-xs text-white/70 space-y-0.5">
                <li>• Smooth BPM transitions (max 8 BPM jumps)</li>
                <li>• Perfect energy arc for your timeline</li>
                <li>• Genre clustering for natural flow</li>
                <li>• Added 3 transition songs automatically</li>
              </ul>
            </div>
          </div>
        </div>
      ) : totalProblems > 0 ? (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">Flow Issues Detected</p>
              <ul className="text-xs text-white/70 space-y-1">
                {analysis.warnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
              <button
                onClick={onUpgradeClick}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Fix with AI DJ ($25)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Good Flow!</p>
              <p className="text-xs text-white/70">Your playlist has smooth transitions</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Pro Features Preview */}
      {!isPro && (
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-white/50 uppercase mb-2">Pro Features</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 bg-white/5 rounded-lg text-xs text-white/50 flex items-center gap-2 cursor-not-allowed">
              <Lock className="w-3 h-3" />
              Auto-optimize BPM
            </button>
            <button className="p-2 bg-white/5 rounded-lg text-xs text-white/50 flex items-center gap-2 cursor-not-allowed">
              <Lock className="w-3 h-3" />
              Fix Energy Drops
            </button>
            <button className="p-2 bg-white/5 rounded-lg text-xs text-white/50 flex items-center gap-2 cursor-not-allowed">
              <Lock className="w-3 h-3" />
              Smart Genre Groups
            </button>
            <button className="p-2 bg-white/5 rounded-lg text-xs text-white/50 flex items-center gap-2 cursor-not-allowed">
              <Lock className="w-3 h-3" />
              Add Transitions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function isCompatibleGenre(genre1: string, genre2: string): boolean {
  const compatibleGenres: Record<string, string[]> = {
    'pop': ['rock', 'soul', 'funk', 'electronic'],
    'rock': ['pop', 'indie', 'punk'],
    'soul': ['funk', 'jazz', 'pop'],
    'funk': ['soul', 'pop', 'disco'],
    'jazz': ['soul', 'funk'],
    'electronic': ['pop', 'dance'],
  };
  
  return compatibleGenres[genre1]?.includes(genre2) || 
         compatibleGenres[genre2]?.includes(genre1) || 
         false;
}