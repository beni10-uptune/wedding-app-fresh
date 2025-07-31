export interface WeddingGuide {
  id: string
  title: string
  category: 'moments' | 'planning' | 'tips' | 'traditions'
  icon: string
  readTime: number // minutes
  summary: string
  sections: GuideSection[]
  relatedMoments?: string[]
  tags: string[]
}

export interface GuideSection {
  title: string
  content: string
  tips?: string[]
  examples?: string[]
}

export const weddingGuides: WeddingGuide[] = [
  {
    id: 'first-dance-guide',
    title: 'Choosing Your Perfect First Dance Song',
    category: 'moments',
    icon: '💃',
    readTime: 5,
    summary: 'Everything you need to know about selecting a meaningful first dance song that represents your love story.',
    relatedMoments: ['first-dance'],
    tags: ['first dance', 'romantic', 'couple'],
    sections: [
      {
        title: 'Why Your First Dance Matters',
        content: `Your first dance as a married couple is one of the most photographed and remembered moments of your wedding day. It's a chance to share an intimate moment together while your loved ones celebrate your union. The song you choose will forever be associated with this special moment.`,
        tips: [
          'Choose a song that tells your story',
          'Consider the lyrics carefully',
          'Think about the dance floor and your comfort level'
        ]
      },
      {
        title: 'Finding Your Song',
        content: `Start by thinking about songs that have special meaning to your relationship. Was there a song playing during your first date? A concert you attended together? Don't feel pressured to choose a traditional "wedding song" if it doesn't feel authentic to you.`,
        examples: [
          '"Perfect" by Ed Sheeran - Modern classic',
          '"At Last" by Etta James - Timeless elegance',
          '"Thinking Out Loud" by Ed Sheeran - Contemporary romance',
          '"Make You Feel My Love" by Adele - Emotional depth'
        ]
      },
      {
        title: 'Practical Considerations',
        content: `While the emotional connection is most important, there are practical factors to consider. The ideal first dance song is between 3-4 minutes long. If your favorite song is longer, consider asking your DJ to fade it out. Also think about the tempo - can you actually dance to it?`,
        tips: [
          'Practice dancing to your song before the big day',
          'Consider taking dance lessons for confidence',
          'Have a backup plan if you get emotional',
          'Think about when to invite others to join'
        ]
      },
      {
        title: 'Making It Unique',
        content: `Want to make your first dance extra special? Consider these creative ideas: acoustic versions of your favorite songs, mashups of multiple meaningful songs, or even commissioning a custom arrangement. Some couples are choosing upbeat songs to surprise guests and show their personality.`,
        examples: [
          'Acoustic guitar version of a rock song',
          'String quartet arrangement of a pop hit',
          'Mashup transitioning from slow to upbeat',
          'Cultural fusion combining traditions'
        ]
      }
    ]
  },
  {
    id: 'processional-guide',
    title: 'Processional Music: Setting the Perfect Tone',
    category: 'moments',
    icon: '👰',
    readTime: 4,
    summary: 'Create the perfect atmosphere for your walk down the aisle with our comprehensive processional music guide.',
    relatedMoments: ['processional'],
    tags: ['ceremony', 'processional', 'entrance'],
    sections: [
      {
        title: 'The Power of the Processional',
        content: `The processional music sets the emotional tone for your entire ceremony. As guests see the wedding party enter, the music builds anticipation for the bride's entrance. This is the moment when the ceremony truly begins, and the right music can move guests to tears before you even say "I do."`,
        tips: [
          'Consider different songs for wedding party and bride',
          'Time your music to your venue\'s aisle length',
          'Have your musicians practice the transitions'
        ]
      },
      {
        title: 'Traditional vs. Contemporary',
        content: `While "Canon in D" and "Wedding March" are classics for a reason, modern couples are increasingly choosing contemporary songs that reflect their personality. The key is finding music that feels sacred and special to you, whether that's classical, contemporary, or something completely unexpected.`,
        examples: [
          '"Canon in D" by Pachelbel - Timeless classic',
          '"Bridal Chorus" by Wagner - Traditional choice',
          '"A Thousand Years" by Christina Perri - Modern favorite',
          '"Marry Me" by Train - Contemporary romance'
        ]
      },
      {
        title: 'Instrumental vs. Vocal',
        content: `Many couples prefer instrumental music for the processional to keep the focus on the visual moment. However, meaningful lyrics can add another layer of emotion. Consider your venue's acoustics and whether lyrics will be clearly heard. Live musicians can provide better control over timing.`,
        tips: [
          'Test acoustics during your venue walk-through',
          'Provide sheet music to live musicians early',
          'Have a plan for timing cues',
          'Consider guests\' musical preferences'
        ]
      }
    ]
  },
  {
    id: 'reception-flow-guide',
    title: 'Building Energy: Reception Music Flow',
    category: 'planning',
    icon: '🎉',
    readTime: 6,
    summary: 'Learn how to create the perfect musical journey from cocktail hour through the last dance.',
    relatedMoments: ['cocktail', 'dinner', 'party'],
    tags: ['reception', 'party', 'energy', 'flow'],
    sections: [
      {
        title: 'Understanding Energy Curves',
        content: `A successful reception follows a natural energy curve. Start with medium energy during cocktail hour to encourage mingling, bring it down during dinner for conversation, then gradually build to peak party energy. Understanding this flow helps you program music that enhances each moment rather than fighting against it.`,
        tips: [
          'Map out your reception timeline first',
          'Plan energy levels for each segment',
          'Build in breaks for older guests',
          'Save highest energy for after dinner'
        ]
      },
      {
        title: 'Cocktail Hour Strategy',
        content: `Cocktail hour sets the celebratory mood while allowing conversation. Choose upbeat but not overwhelming music. Jazz, acoustic covers, and light pop work well. This is a great time to incorporate cultural music or honor musical preferences of older relatives.`,
        examples: [
          'Jazz standards for sophistication',
          'Motown hits for universal appeal',
          'Acoustic covers of current hits',
          'Light classical for elegance'
        ]
      },
      {
        title: 'Dinner Music Mastery',
        content: `Dinner music should enhance conversation, not compete with it. Keep the volume lower and choose songs without heavy beats or jarring transitions. This is an opportunity to play meaningful songs that might not work on the dance floor but deserve a place in your celebration.`,
        tips: [
          'Create 20% more playlist than needed',
          'Avoid songs with dramatic dynamics',
          'Consider your menu when selecting music',
          'Include some guest favorites'
        ]
      },
      {
        title: 'Party Time Programming',
        content: `When it's time to party, build energy gradually. Start with crowd-pleasers that get everyone comfortable, then increase the tempo. Mix eras and genres to keep all generations engaged. Watch the dance floor and be ready to adjust based on what's working.`,
        examples: [
          'Start: "September" by Earth, Wind & Fire',
          'Build: "Uptown Funk" by Bruno Mars',
          'Peak: "I Wanna Dance with Somebody" by Whitney Houston',
          'Cool down: "Sweet Caroline" by Neil Diamond'
        ]
      }
    ]
  },
  {
    id: 'parent-dances-guide',
    title: 'Parent Dances: Honoring Family Bonds',
    category: 'moments',
    icon: '👨‍👩‍👧',
    readTime: 4,
    summary: 'Navigate the emotional tradition of parent dances with grace and meaning.',
    relatedMoments: ['parent-dances'],
    tags: ['family', 'tradition', 'emotional'],
    sections: [
      {
        title: 'The Significance',
        content: `Parent dances are deeply emotional moments that honor the relationships that shaped you. Whether it's father-daughter, mother-son, or any combination that reflects your family, these dances acknowledge the transition from one family unit to creating a new one.`,
        tips: [
          'Discuss song choices with parents early',
          'Consider combined or separate dances',
          'Be inclusive of step-parents if appropriate',
          'Have tissues ready'
        ]
      },
      {
        title: 'Choosing Meaningful Songs',
        content: `The best parent dance songs often have personal significance. Maybe it's a lullaby from childhood, a song you sang together on car rides, or simply one that expresses your gratitude. Don't be afraid to think outside traditional choices if something else feels more authentic.`,
        examples: [
          '"My Girl" by The Temptations - Father-daughter classic',
          '"What a Wonderful World" by Louis Armstrong - Timeless',
          '"The Way You Look Tonight" by Frank Sinatra - Elegant',
          '"God Only Knows" by The Beach Boys - Emotional'
        ]
      },
      {
        title: 'Modern Alternatives',
        content: `Some couples are reimagining parent dances to better reflect their families. This might mean dancing with both parents together, including siblings, or creating a group dance. Others are replacing the dance with a special toast or photo montage set to music.`,
        tips: [
          'Consider your parents\' mobility',
          'Practice if parents are nervous',
          'Keep dances to 2-3 minutes',
          'Plan the order thoughtfully'
        ]
      }
    ]
  },
  {
    id: 'cultural-music-guide',
    title: 'Incorporating Cultural Traditions',
    category: 'traditions',
    icon: '🌍',
    readTime: 5,
    summary: 'Blend cultural music traditions beautifully into your modern wedding celebration.',
    relatedMoments: ['ceremony', 'cocktail', 'party'],
    tags: ['cultural', 'traditions', 'heritage', 'fusion'],
    sections: [
      {
        title: 'Honoring Heritage',
        content: `Music is one of the most powerful ways to honor your cultural heritage at your wedding. Whether you're blending two cultures or celebrating one, thoughtful incorporation of traditional music can add depth and meaning to your celebration while educating and including all guests.`,
        tips: [
          'Provide context in your program',
          'Mix traditional with modern interpretations',
          'Consider live cultural musicians',
          'Balance tradition with accessibility'
        ]
      },
      {
        title: 'Fusion Strategies',
        content: `When blending multiple cultures, think about natural transition points. You might feature one culture during the ceremony and another during the reception, or alternate throughout. Modern remixes of traditional songs can bridge generational gaps while honoring heritage.`,
        examples: [
          'Bollywood-Western fusion for cocktail hour',
          'Traditional ceremony, modern reception',
          'Cultural music blocks during party',
          'Bilingual first dance songs'
        ]
      },
      {
        title: 'Guest Inclusion',
        content: `Help all guests appreciate cultural music by providing context. Consider program notes, MC explanations, or even dance lesson segments. When guests understand the significance, they're more likely to participate enthusiastically.`,
        tips: [
          'Start cultural blocks with familiar fusion',
          'Teach simple dance steps',
          'Explain significant songs briefly',
          'End with universal celebration songs'
        ]
      }
    ]
  },
  {
    id: 'do-not-play-guide',
    title: 'The "Do Not Play" List: Avoiding Musical Mishaps',
    category: 'tips',
    icon: '🚫',
    readTime: 3,
    summary: 'Learn why and how to create a "do not play" list to ensure your reception stays on track.',
    tags: ['planning', 'tips', 'dj', 'reception'],
    sections: [
      {
        title: 'Why You Need One',
        content: `A "do not play" list is just as important as your playlist. It prevents well-meaning guests from requesting songs that might kill the mood, bring up bad memories, or simply don't fit your vision. Your DJ will appreciate clear boundaries.`,
        tips: [
          'Include songs with negative associations',
          'Add overplayed wedding songs you\'re tired of',
          'List inappropriate genres or artists',
          'Consider explicit content policies'
        ]
      },
      {
        title: 'Common Exclusions',
        content: `While personal preference varies, some songs commonly make the "do not play" list. Songs about breakups, death, or infidelity are obvious exclusions. Many couples also ban overplayed wedding songs or music associated with ex-relationships.`,
        examples: [
          'Songs with breakup/sad themes',
          'Music from past relationships',
          'Politically divisive artists',
          'Overly explicit content'
        ]
      },
      {
        title: 'Handling Requests',
        content: `Give your DJ strategies for declining requests politely. They might say the song doesn't fit the current vibe, isn't available, or simply that you've requested a specific playlist. Most guests will understand when told "the couple has carefully curated tonight's music."`,
        tips: [
          'Brief your DJ on your preferences',
          'Decide on request policies in advance',
          'Consider a "requests welcome" period',
          'Have diplomatic decline phrases ready'
        ]
      }
    ]
  }
]

export function getGuidesByCategory(category: WeddingGuide['category']): WeddingGuide[] {
  return weddingGuides.filter(guide => guide.category === category)
}

export function getGuidesByMoment(momentId: string): WeddingGuide[] {
  return weddingGuides.filter(guide => guide.relatedMoments?.includes(momentId))
}

export function getRelatedGuides(guideId: string, limit: number = 3): WeddingGuide[] {
  const guide = weddingGuides.find(g => g.id === guideId)
  if (!guide) return []
  
  return weddingGuides
    .filter(g => g.id !== guideId)
    .filter(g => 
      g.tags.some(tag => guide.tags.includes(tag)) ||
      g.relatedMoments?.some(moment => guide.relatedMoments?.includes(moment))
    )
    .slice(0, limit)
}