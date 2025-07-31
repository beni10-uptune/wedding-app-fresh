export interface WeddingTip {
  category: 'do' | 'dont' | 'pro-tip' | 'timing' | 'energy';
  content: string;
}

export interface SongRecommendation {
  title: string;
  artist: string;
  reason: string;
  spotifyId?: string;
}

export interface WeddingStageGuide {
  id: string;
  name: string;
  description: string;
  duration: string;
  energyLevel: 'low' | 'medium' | 'high' | 'varies';
  tips: WeddingTip[];
  songRecommendations: SongRecommendation[];
  expertAdvice: string;
}

export const weddingStageGuides: WeddingStageGuide[] = [
  {
    id: 'pre-ceremony',
    name: 'Pre-Ceremony',
    description: 'Sets the tone as guests arrive and find their seats',
    duration: '30-45 minutes',
    energyLevel: 'low',
    tips: [
      {
        category: 'do',
        content: 'Choose instrumental or acoustic versions of popular songs for a sophisticated touch'
      },
      {
        category: 'do',
        content: 'Keep volume low enough for guests to chat comfortably'
      },
      {
        category: 'dont',
        content: 'Avoid songs with lyrics about breakups or heartbreak'
      },
      {
        category: 'pro-tip',
        content: 'Create a playlist 20% longer than needed - delays happen!'
      },
      {
        category: 'timing',
        content: 'Start music 30 minutes before the ceremony time on invitations'
      }
    ],
    songRecommendations: [
      {
        title: 'Marry Me',
        artist: 'Train',
        reason: 'Romantic and recognizable, perfect for setting the mood'
      },
      {
        title: 'A Thousand Years',
        artist: 'Christina Perri (Piano Version)',
        reason: 'Beautiful instrumental version that guests will recognize'
      },
      {
        title: 'Canon in D',
        artist: 'Pachelbel',
        reason: 'Classic choice that never goes out of style'
      },
      {
        title: 'Thinking Out Loud',
        artist: 'Ed Sheeran (Acoustic)',
        reason: 'Modern favorite that appeals to all generations'
      }
    ],
    expertAdvice: 'This is your first impression! Keep it elegant and timeless. The music should enhance the anticipation without overwhelming the moment.'
  },
  {
    id: 'processional',
    name: 'Processional',
    description: 'The wedding party\'s grand entrance',
    duration: '5-10 minutes',
    energyLevel: 'medium',
    tips: [
      {
        category: 'do',
        content: 'Time your processional song to match the walking pace and venue length'
      },
      {
        category: 'do',
        content: 'Have a backup plan if the song ends before everyone is in place'
      },
      {
        category: 'dont',
        content: 'Don\'t choose a song with a long intro - you need immediate impact'
      },
      {
        category: 'pro-tip',
        content: 'Practice the walk with your chosen song during rehearsal'
      },
      {
        category: 'energy',
        content: 'Build anticipation with each member of the wedding party'
      }
    ],
    songRecommendations: [
      {
        title: 'Bridal Chorus',
        artist: 'Wagner',
        reason: 'The traditional "Here Comes the Bride" - instantly recognizable'
      },
      {
        title: 'Pachelbel\'s Canon',
        artist: 'Pachelbel',
        reason: 'Elegant and timeless, perfect pacing for processional'
      },
      {
        title: 'Somewhere Over the Rainbow',
        artist: 'Israel Kamakawiwoʻole',
        reason: 'Beautiful ukulele version that adds warmth'
      },
      {
        title: 'Perfect',
        artist: 'Ed Sheeran (Orchestral)',
        reason: 'Modern choice with classical arrangement'
      }
    ],
    expertAdvice: 'The processional is all about the reveal. Choose something that builds emotion and allows for that magical moment when the bride appears.'
  },
  {
    id: 'ceremony',
    name: 'Ceremony',
    description: 'Background music during the vows and rituals',
    duration: '20-30 minutes',
    energyLevel: 'low',
    tips: [
      {
        category: 'do',
        content: 'Prepare specific songs for unity ceremonies (candle, sand, etc.)'
      },
      {
        category: 'do',
        content: 'Keep music very subtle - the focus should be on the vows'
      },
      {
        category: 'dont',
        content: 'Avoid songs with prominent lyrics during speaking portions'
      },
      {
        category: 'pro-tip',
        content: 'Have your DJ/musician ready to adjust volume on the fly'
      },
      {
        category: 'timing',
        content: 'Typical ceremony music needs: 2-3 songs for rituals, soft background otherwise'
      }
    ],
    songRecommendations: [
      {
        title: 'The Wedding Song',
        artist: 'Kenny G',
        reason: 'Instrumental that won\'t compete with spoken vows'
      },
      {
        title: 'Ave Maria',
        artist: 'Schubert',
        reason: 'Classical choice for religious ceremonies'
      },
      {
        title: 'Make You Feel My Love',
        artist: 'Adele (Instrumental)',
        reason: 'Emotional without being distracting'
      },
      {
        title: 'All of Me',
        artist: 'John Legend (Piano)',
        reason: 'Modern love song in gentle arrangement'
      }
    ],
    expertAdvice: 'Less is more during the ceremony. Music should support, not dominate. Consider having no music during the actual vow exchange.'
  },
  {
    id: 'recessional',
    name: 'Recessional',
    description: 'The celebration begins as the couple exits',
    duration: '3-5 minutes',
    energyLevel: 'high',
    tips: [
      {
        category: 'do',
        content: 'Choose something upbeat and celebratory - you\'re married!'
      },
      {
        category: 'do',
        content: 'Make sure the song is long enough for the entire wedding party to exit'
      },
      {
        category: 'dont',
        content: 'Don\'t go too modern if you have traditional family members'
      },
      {
        category: 'pro-tip',
        content: 'This sets the tone for your reception - make it count!'
      },
      {
        category: 'energy',
        content: 'This is your victory lap - choose something that makes everyone smile'
      }
    ],
    songRecommendations: [
      {
        title: 'Signed, Sealed, Delivered',
        artist: 'Stevie Wonder',
        reason: 'Upbeat, celebratory, and loved by all ages'
      },
      {
        title: 'Love on Top',
        artist: 'Beyoncé',
        reason: 'Modern celebration anthem that gets everyone excited'
      },
      {
        title: 'Wedding March',
        artist: 'Mendelssohn',
        reason: 'Traditional choice with built-in celebration feel'
      },
      {
        title: 'Happy',
        artist: 'Pharrell Williams',
        reason: 'Impossible not to smile when this plays'
      }
    ],
    expertAdvice: 'The recessional is your first moment as a married couple - choose something that reflects your joy and gets your guests excited for the party ahead!'
  },
  {
    id: 'cocktail-hour',
    name: 'Cocktail Hour',
    description: 'Background music while guests mingle and enjoy appetizers',
    duration: '60-90 minutes',
    energyLevel: 'medium',
    tips: [
      {
        category: 'do',
        content: 'Mix genres to appeal to all your guests'
      },
      {
        category: 'do',
        content: 'Keep energy upbeat but not dance-worthy yet'
      },
      {
        category: 'dont',
        content: 'Don\'t play your special songs (first dance, etc.) during cocktail hour'
      },
      {
        category: 'pro-tip',
        content: 'Jazz, acoustic covers, and light pop create perfect ambiance'
      },
      {
        category: 'timing',
        content: 'Plan for 20-25 songs to cover a full cocktail hour'
      }
    ],
    songRecommendations: [
      {
        title: 'Fly Me to the Moon',
        artist: 'Frank Sinatra',
        reason: 'Classic cocktail hour vibes that never fail'
      },
      {
        title: 'Sunday Morning',
        artist: 'Maroon 5',
        reason: 'Light, upbeat, and familiar'
      },
      {
        title: 'Valerie',
        artist: 'Amy Winehouse',
        reason: 'Retro soul that appeals to multiple generations'
      },
      {
        title: 'Better Days',
        artist: 'OneRepublic',
        reason: 'Optimistic and contemporary'
      }
    ],
    expertAdvice: 'Cocktail hour sets the social tone. Think of it as a warmup - you want people relaxed, chatting, and ready to celebrate when dinner begins.'
  },
  {
    id: 'dinner',
    name: 'Dinner',
    description: 'Background music during the meal service',
    duration: '60-90 minutes',
    energyLevel: 'low',
    tips: [
      {
        category: 'do',
        content: 'Choose music that allows conversation - think restaurant ambiance'
      },
      {
        category: 'do',
        content: 'Include songs meaningful to your families'
      },
      {
        category: 'dont',
        content: 'Avoid anything too energetic that makes people want to dance'
      },
      {
        category: 'pro-tip',
        content: 'Great time for Rat Pack, Motown, and easy listening'
      },
      {
        category: 'timing',
        content: 'Lower volume during speeches, raise slightly between courses'
      }
    ],
    songRecommendations: [
      {
        title: 'At Last',
        artist: 'Etta James',
        reason: 'Soulful and romantic dinner music'
      },
      {
        title: 'L-O-V-E',
        artist: 'Nat King Cole',
        reason: 'Sweet and timeless'
      },
      {
        title: 'Stand by Me',
        artist: 'Ben E. King',
        reason: 'Classic that spans generations'
      },
      {
        title: 'Everything',
        artist: 'Michael Bublé',
        reason: 'Modern crooner perfect for dinner'
      }
    ],
    expertAdvice: 'Dinner music should be the soundtrack to conversation, not the main event. Think elegance and familiarity without being intrusive.'
  },
  {
    id: 'first-dance',
    name: 'First Dance',
    description: 'The couple\'s special moment in the spotlight',
    duration: '3-4 minutes',
    energyLevel: 'low',
    tips: [
      {
        category: 'do',
        content: 'Practice dancing to your song beforehand - know when to dip!'
      },
      {
        category: 'do',
        content: 'Consider fading out after 2 minutes if the song is long'
      },
      {
        category: 'dont',
        content: 'Don\'t choose a song just because it\'s popular - make it meaningful'
      },
      {
        category: 'pro-tip',
        content: 'Tell your photographer/videographer the song choice in advance'
      },
      {
        category: 'timing',
        content: 'Most couples dance for 1.5-2 minutes before inviting others to join'
      }
    ],
    songRecommendations: [
      {
        title: 'Perfect',
        artist: 'Ed Sheeran',
        reason: 'Modern classic written specifically for weddings'
      },
      {
        title: 'All of Me',
        artist: 'John Legend',
        reason: 'Heartfelt lyrics perfect for the moment'
      },
      {
        title: 'Can\'t Help Falling in Love',
        artist: 'Elvis Presley',
        reason: 'Timeless romance that works for any couple'
      },
      {
        title: 'Amazed',
        artist: 'Lonestar',
        reason: 'Country option with universal appeal'
      }
    ],
    expertAdvice: 'Your first dance is one of the most photographed moments. Choose a song that tells your story, not just what\'s trending.'
  },
  {
    id: 'parent-dances',
    name: 'Parent Dances',
    description: 'Special dances with parents',
    duration: '6-8 minutes total',
    energyLevel: 'low',
    tips: [
      {
        category: 'do',
        content: 'Coordinate with parents on song choice - avoid surprises'
      },
      {
        category: 'do',
        content: 'Consider having all parent dances back-to-back'
      },
      {
        category: 'dont',
        content: 'Avoid overly sentimental songs if parents are emotional'
      },
      {
        category: 'pro-tip',
        content: 'Have tissues ready - these moments get emotional!'
      },
      {
        category: 'timing',
        content: 'Keep each dance to 2-3 minutes or invite others to join midway'
      }
    ],
    songRecommendations: [
      {
        title: 'My Girl',
        artist: 'The Temptations',
        reason: 'Upbeat father-daughter option that keeps things light'
      },
      {
        title: 'What a Wonderful World',
        artist: 'Louis Armstrong',
        reason: 'Beautiful for any parent dance'
      },
      {
        title: 'The Way You Look Tonight',
        artist: 'Frank Sinatra',
        reason: 'Classic mother-son choice'
      },
      {
        title: 'I Hope You Dance',
        artist: 'Lee Ann Womack',
        reason: 'Meaningful father-daughter favorite'
      }
    ],
    expertAdvice: 'Parent dances celebrate the families that raised you. Balance emotion with celebration - you want tears of joy, not sadness.'
  },
  {
    id: 'party-dancing',
    name: 'Party & Dancing',
    description: 'Time to celebrate with all your guests',
    duration: '2-4 hours',
    energyLevel: 'high',
    tips: [
      {
        category: 'do',
        content: 'Start with crowd-pleasers to get everyone on the floor'
      },
      {
        category: 'do',
        content: 'Mix eras and genres - something for everyone'
      },
      {
        category: 'dont',
        content: 'Don\'t play too many slow songs in a row'
      },
      {
        category: 'pro-tip',
        content: 'Read the room - a good DJ adapts to the crowd\'s energy'
      },
      {
        category: 'energy',
        content: 'Build energy gradually, peak mid-party, then wind down'
      }
    ],
    songRecommendations: [
      {
        title: 'Uptown Funk',
        artist: 'Bruno Mars',
        reason: 'Guaranteed floor-filler for all ages'
      },
      {
        title: 'September',
        artist: 'Earth, Wind & Fire',
        reason: 'Classic party starter that never fails'
      },
      {
        title: 'Shut Up and Dance',
        artist: 'Walk the Moon',
        reason: 'Modern hit with retro appeal'
      },
      {
        title: 'I Wanna Dance with Somebody',
        artist: 'Whitney Houston',
        reason: 'Gets everyone singing and dancing'
      }
    ],
    expertAdvice: 'The dance floor is where memories are made. Start strong with songs everyone knows, read the crowd, and keep the energy flowing. Your DJ should take requests but stay true to your vision.'
  },
  {
    id: 'last-dance',
    name: 'Last Dance',
    description: 'The final song to end your perfect day',
    duration: '3-5 minutes',
    energyLevel: 'varies',
    tips: [
      {
        category: 'do',
        content: 'Choose something meaningful or fun - it\'s your last impression'
      },
      {
        category: 'do',
        content: 'Consider a group dance with all guests in a circle'
      },
      {
        category: 'dont',
        content: 'Don\'t let the venue choose - this should be your decision'
      },
      {
        category: 'pro-tip',
        content: 'Have sparklers or bubbles ready for your exit after'
      },
      {
        category: 'timing',
        content: 'Announce "last dance" so everyone joins you on the floor'
      }
    ],
    songRecommendations: [
      {
        title: 'Time of My Life',
        artist: 'Black Eyed Peas',
        reason: 'Celebratory and literally perfect for the moment'
      },
      {
        title: 'Don\'t Stop Believin\'',
        artist: 'Journey',
        reason: 'Epic sing-along to end the night'
      },
      {
        title: 'Save the Last Dance for Me',
        artist: 'The Drifters',
        reason: 'Romantic and fitting title'
      },
      {
        title: 'Closing Time',
        artist: 'Semisonic',
        reason: 'Cheeky choice that guests will appreciate'
      }
    ],
    expertAdvice: 'Your last dance is how guests will remember the end of your celebration. Whether romantic or rocking, make it authentically you.'
  }
];

export const getGuideForStage = (stageId: string): WeddingStageGuide | undefined => {
  return weddingStageGuides.find(guide => guide.id === stageId);
};

export const getAllTipsByCategory = (category: WeddingTip['category']): { stage: string; tips: WeddingTip[] }[] => {
  return weddingStageGuides.map(guide => ({
    stage: guide.name,
    tips: guide.tips.filter(tip => tip.category === category)
  }));
};