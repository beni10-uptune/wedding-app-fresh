'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap,
  Music,
  MessageSquare
} from 'lucide-react';
import { WeddingStageGuide, WeddingTip } from '@/data/weddingTips';

interface TipsCardProps {
  guide: WeddingStageGuide;
  compact?: boolean;
}

const getTipIcon = (category: WeddingTip['category']) => {
  switch (category) {
    case 'do':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'dont':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'pro-tip':
      return <Lightbulb className="h-4 w-4 text-yellow-600" />;
    case 'timing':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'energy':
      return <Zap className="h-4 w-4 text-purple-600" />;
  }
};

const getEnergyBadgeColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'varies':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TipsCard({ guide, compact = false }: TipsCardProps) {
  if (compact) {
    // Compact view for dashboard
    return (
      <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              Expert Tips
            </CardTitle>
            <Badge className={getEnergyBadgeColor(guide.energyLevel)}>
              {guide.energyLevel} energy
            </Badge>
          </div>
          <CardDescription>{guide.duration}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-sm font-medium mb-2 text-purple-700">Quick Tips:</p>
            <ul className="space-y-2">
              {guide.tips.slice(0, 3).map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  {getTipIcon(tip.category)}
                  <span className="text-gray-700">{tip.content}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-sm font-medium mb-1 text-purple-700">DJ Pro Tip:</p>
            <p className="text-sm text-gray-600 italic">"{guide.expertAdvice}"</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full view for individual stage pages
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-purple-600" />
              Expert Wedding Guidance
            </CardTitle>
            <CardDescription className="mt-2">
              Professional tips to make your {guide.name.toLowerCase()} perfect
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge className={`${getEnergyBadgeColor(guide.energyLevel)} mb-2`}>
              {guide.energyLevel} energy
            </Badge>
            <p className="text-sm text-gray-600">{guide.duration}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tips" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tips">Do's & Don'ts</TabsTrigger>
            <TabsTrigger value="songs">Song Ideas</TabsTrigger>
            <TabsTrigger value="expert">Expert Advice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tips" className="space-y-4 mt-4">
            <div className="grid gap-3">
              {guide.tips.map((tip, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                >
                  {getTipIcon(tip.category)}
                  <p className="text-sm text-gray-700">{tip.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="songs" className="space-y-4 mt-4">
            <div className="space-y-3">
              {guide.songRecommendations.map((song, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Music className="h-4 w-4 text-purple-600" />
                        <p className="font-medium text-gray-900">{song.title}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">by {song.artist}</p>
                      <p className="text-sm text-gray-500 italic">{song.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="expert" className="mt-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 mb-2">From Wedding DJs & Planners:</p>
                  <p className="text-gray-700 leading-relaxed italic">"{guide.expertAdvice}"</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}