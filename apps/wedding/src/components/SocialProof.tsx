'use client';

import { useState, useEffect } from 'react';
import { Star, Users, Music, Globe } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah & James",
    role: "Married Oct 2024",
    content: "The timeline builder saved us hours! Our DJ loved the organized playlist and our guests are still talking about the music.",
    rating: 5
  },
  {
    name: "Emma & Michael", 
    role: "Married Sept 2024",
    content: "Being able to collaborate with my partner on our playlist was amazing. We discovered songs we both loved!",
    rating: 5
  },
  {
    name: "Lisa & Tom",
    role: "Married Aug 2024", 
    content: "The guest request feature was brilliant - our friends added songs we'd never have thought of. Perfect mix!",
    rating: 5
  }
];

const stats = [
  { icon: Users, value: "2,847", label: "Happy Couples" },
  { icon: Music, value: "156K", label: "Songs Curated" },
  { icon: Globe, value: "24", label: "Countries" },
  { icon: Star, value: "4.9", label: "Average Rating" }
];

export function SocialProofBanner() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-y border-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial Carousel */}
          <div className="relative h-32">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <blockquote className="text-gray-700">
                  <p className="text-sm italic mb-2">"{testimonial.content}"</p>
                  <footer className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <cite className="text-sm font-semibold not-italic">
                      {testimonial.name}
                    </cite>
                    <span className="text-sm text-gray-500">• {testimonial.role}</span>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-6">
      {/* Security Badge */}
      <div className="flex items-center gap-2 text-gray-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">256-bit SSL Secure</span>
      </div>

      {/* Money Back Badge */}
      <div className="flex items-center gap-2 text-gray-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">14-Day Money Back</span>
      </div>

      {/* Spotify Official */}
      <div className="flex items-center gap-2 text-gray-600">
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span className="text-sm">Spotify Connected</span>
      </div>

      {/* Support Badge */}
      <div className="flex items-center gap-2 text-gray-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">24/7 Support</span>
      </div>
    </div>
  );
}

export function FloatingSocialProof() {
  const [isVisible, setIsVisible] = useState(false);
  const [recentActivity] = useState([
    { name: "Emma", location: "London", action: "just created their playlist", time: "2 min ago" },
    { name: "James", location: "Manchester", action: "exported to Spotify", time: "5 min ago" },
    { name: "Sophie", location: "Birmingham", action: "invited 12 guests", time: "8 min ago" }
  ]);
  const [currentActivity, setCurrentActivity] = useState(0);

  useEffect(() => {
    // Show after 3 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 3000);
    
    // Rotate activities
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % recentActivity.length);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, [recentActivity.length]);

  if (!isVisible) return null;

  const activity = recentActivity[currentActivity];

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-slideIn">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
            {activity.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">{activity.name}</span> from {activity.location}
            </p>
            <p className="text-sm text-gray-600">{activity.action}</p>
            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}