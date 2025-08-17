/**
 * Wedding Music Expertise Knowledge Base
 * The ultimate guide for DJ Harmony's wedding music intelligence
 */

export interface MomentExpertise {
  moment: string;
  duration: string;
  purpose: string;
  energy_level: number; // 1-10
  bpm_range: [number, number];
  key_characteristics: string[];
  song_requirements: string[];
  avoid: string[];
  pro_tips: string[];
  transitions: {
    from?: string;
    to?: string;
    technique: string;
  };
  cultural_considerations?: Record<string, string>;
}

export interface BPMProgression {
  phase: string;
  time: string;
  target_bpm: [number, number];
  energy: number;
  mixing_technique: string;
  crowd_psychology: string;
}

// Complete Wedding Day Timeline Expertise
export const WEDDING_MOMENT_EXPERTISE: MomentExpertise[] = [
  {
    moment: "getting-ready",
    duration: "30-45 min",
    purpose: "Set a positive, excited mood while the wedding party prepares",
    energy_level: 4,
    bpm_range: [100, 120],
    key_characteristics: [
      "Uplifting and positive",
      "Not too energetic to cause stress",
      "Familiar songs that everyone can sing along",
      "Mix of current and classic feel-good songs"
    ],
    song_requirements: [
      "Clean lyrics (photographers/videographers present)",
      "Songs about love, friendship, and celebration",
      "Mix female and male vocals for mixed wedding parties"
    ],
    avoid: [
      "Breakup songs",
      "Overly emotional ballads",
      "Heavy/aggressive music",
      "Songs with explicit content"
    ],
    pro_tips: [
      "Include the couple's favorite upbeat songs",
      "Consider songs that mention getting ready or morning",
      "Add songs that were popular during the couple's dating years",
      "Keep energy consistent - no major tempo drops"
    ],
    transitions: {
      to: "ceremony",
      technique: "Fade out 10 minutes before ceremony for final preparations"
    }
  },
  {
    moment: "ceremony-prelude",
    duration: "20-30 min",
    purpose: "Welcome guests and set the romantic tone as they find their seats",
    energy_level: 2,
    bpm_range: [60, 80],
    key_characteristics: [
      "Instrumental or very soft vocals",
      "Romantic and elegant",
      "Volume low enough for conversation",
      "Timeless, not trendy"
    ],
    song_requirements: [
      "Primarily instrumental (classical, acoustic, piano)",
      "If vocals, should be subtle and romantic",
      "Nothing that will distract from guest arrival",
      "Consider live musician repertoire if applicable"
    ],
    avoid: [
      "Songs with prominent lyrics about breakups",
      "Anything too upbeat or party-like",
      "Religious songs unless specifically requested",
      "Songs strongly associated with other weddings/movies"
    ],
    pro_tips: [
      "Start 30 minutes before ceremony time",
      "Have 45 minutes of music ready (ceremonies often start late)",
      "Vitamin String Quartet versions work beautifully",
      "Consider the venue acoustics - outdoor vs church vs ballroom"
    ],
    transitions: {
      to: "processional",
      technique: "Smooth fade to silence, then processional begins"
    }
  },
  {
    moment: "processional",
    duration: "3-5 min",
    purpose: "Accompany the wedding party's entrance with building anticipation",
    energy_level: 4,
    bpm_range: [60, 76],
    key_characteristics: [
      "Steady, walking tempo",
      "Building emotional intensity",
      "Often instrumental",
      "Formal and ceremonial"
    ],
    song_requirements: [
      "Consistent tempo for walking pace",
      "Long enough for entire wedding party",
      "Separate song option for bride's entrance",
      "Consider venue aisle length"
    ],
    avoid: [
      "Songs with tempo changes",
      "Anything with negative associations",
      "Overly popular/cliché unless specifically wanted",
      "Songs that are too short"
    ],
    pro_tips: [
      "Time the aisle walk - typically 30-60 seconds per person",
      "Have the DJ/musician ready to loop if needed",
      "Consider different songs for wedding party vs bride",
      "Pachelbel's Canon tempo: 60-64 BPM perfect for walking"
    ],
    transitions: {
      from: "ceremony-prelude",
      to: "ceremony",
      technique: "Clear pause between prelude and processional"
    }
  },
  {
    moment: "recessional",
    duration: "2-3 min",
    purpose: "Celebrate the newly married couple's exit with joy and energy",
    energy_level: 8,
    bpm_range: [110, 140],
    key_characteristics: [
      "Upbeat and celebratory",
      "Triumphant feeling",
      "Can be fun and playful",
      "Sets tone for reception"
    ],
    song_requirements: [
      "Immediately energetic from the start",
      "Clear, happy message",
      "Long enough for full exit",
      "Gets guests excited for reception"
    ],
    avoid: [
      "Slow build-ups (need immediate energy)",
      "Songs about dating/uncertainty",
      "Anything that could be seen as ironic",
      "Songs that are too mellow"
    ],
    pro_tips: [
      "This is where you can be playful - movie themes, sports anthems OK",
      "Consider cultural traditions (Jewish: Siman Tov, Irish: Celtic music)",
      "Have backup ready in case recessional takes longer",
      "This transitions the mood from ceremony to party"
    ],
    transitions: {
      from: "ceremony",
      to: "cocktail-hour",
      technique: "Can continue into cocktail hour or fade for venue change"
    }
  },
  {
    moment: "cocktail-hour",
    duration: "60-90 min",
    purpose: "Provide sophisticated background music for mingling and conversation",
    energy_level: 3,
    bpm_range: [90, 120],
    key_characteristics: [
      "Sophisticated and classy",
      "Background volume level",
      "Mix of genres to please all ages",
      "Smooth transitions between songs"
    ],
    song_requirements: [
      "Nothing too loud or aggressive",
      "Mix of jazz, acoustic, soft pop, R&B",
      "Some familiar songs but not sing-along level",
      "Consider cocktail hour location (indoor/outdoor)"
    ],
    avoid: [
      "Dance music (save for reception)",
      "Overly emotional songs",
      "Anything that demands attention",
      "Songs with long instrumental breaks"
    ],
    pro_tips: [
      "Rat Pack and Motown always work well",
      "Modern songs in jazz/acoustic arrangements are perfect",
      "Plan for 90 minutes even if scheduled for 60",
      "Volume should allow normal conversation at 3 feet"
    ],
    transitions: {
      from: "ceremony",
      to: "grand-entrance",
      technique: "Build energy in last 10 minutes toward entrance"
    }
  },
  {
    moment: "grand-entrance",
    duration: "5-10 min",
    purpose: "Build excitement as wedding party and couple enter reception",
    energy_level: 9,
    bpm_range: [120, 140],
    key_characteristics: [
      "High energy from the start",
      "Gets everyone on their feet",
      "Can be choreographed",
      "Sets party tone"
    ],
    song_requirements: [
      "Instant energy and recognition",
      "Clean versions for all ages",
      "Long enough for all introductions",
      "Consider if wedding party will dance"
    ],
    avoid: [
      "Slow starts or long intros",
      "Obscure songs guests won't know",
      "Anything controversial",
      "Songs that lose energy midway"
    ],
    pro_tips: [
      "Sports arena anthems work great",
      "Consider separate songs for wedding party vs couple",
      "Have DJ/MC coordinate timing with introductions",
      "This is a great place for the couple's personality to shine"
    ],
    transitions: {
      from: "cocktail-hour",
      to: "dinner",
      technique: "Quick fade after couple is seated"
    }
  },
  {
    moment: "dinner",
    duration: "60-90 min",
    purpose: "Enhance dining experience without overwhelming conversation",
    energy_level: 2,
    bpm_range: [70, 100],
    key_characteristics: [
      "Background volume",
      "Comfortable for all ages",
      "Smooth and pleasant",
      "No jarring transitions"
    ],
    song_requirements: [
      "Volume at 30-40% of dance level",
      "Mix of soft rock, soul, acoustic, standards",
      "Some songs grandparents will enjoy",
      "Nothing that will offend any generation"
    ],
    avoid: [
      "Heavy bass or drums",
      "Rap or hard rock",
      "Anything too upbeat that suggests dancing",
      "Songs with dramatic volume changes"
    ],
    pro_tips: [
      "Start softer during salad, slightly louder during mains",
      "Include songs from couple's parents' era",
      "Soft versions of popular songs work well",
      "Watch the room - adjust if people are straining to talk"
    ],
    transitions: {
      from: "grand-entrance",
      to: "first-dance",
      technique: "Fade out completely for speeches, then first dance announcement"
    }
  },
  {
    moment: "first-dance",
    duration: "3-4 min",
    purpose: "Spotlight the couple's first dance as married partners",
    energy_level: 5,
    bpm_range: [60, 100],
    key_characteristics: [
      "Deeply personal to couple",
      "Full song or edited version",
      "Clear sound quality essential",
      "Emotional high point"
    ],
    song_requirements: [
      "Couple's chosen song",
      "Consider dance lessons tempo needs",
      "May need edited version (radio edit)",
      "Backup version ready"
    ],
    avoid: [
      "Don't suggest changes unless asked",
      "Don't play wrong version",
      "Avoid poor quality audio files",
      "Don't cut off abruptly"
    ],
    pro_tips: [
      "Discuss if couple wants full song or shortened",
      "Have couple practice with exact version",
      "Consider if others join midway through",
      "Lighting changes can enhance moment"
    ],
    transitions: {
      from: "dinner/speeches",
      to: "parent-dances",
      technique: "Brief pause for applause, then parent dance announcement"
    }
  },
  {
    moment: "parent-dances",
    duration: "6-10 min",
    purpose: "Honor parent-child relationships with special dances",
    energy_level: 4,
    bpm_range: [60, 96],
    key_characteristics: [
      "Sentimental and meaningful",
      "Often classic songs",
      "May be cultural specific",
      "Can be combined or separate"
    ],
    song_requirements: [
      "Songs chosen by parents/couple",
      "Consider shortening if two separate dances",
      "May need cultural specific music",
      "Clear vocals important"
    ],
    avoid: [
      "Songs about romantic love (unless appropriate)",
      "Anything too long without editing",
      "Poor audio quality",
      "Controversial artists/lyrics"
    ],
    pro_tips: [
      "Suggest 90-120 seconds if doing both dances",
      "Can invite all parents/children to dance midway",
      "Have tissues ready - these get emotional",
      "Consider combined parent dance to save time"
    ],
    transitions: {
      from: "first-dance",
      to: "open-dancing",
      technique: "Build energy immediately after into party music"
    }
  },
  {
    moment: "open-dancing-warmup",
    duration: "30-45 min",
    purpose: "Ease guests from dinner into dancing with familiar, accessible songs",
    energy_level: 6,
    bpm_range: [100, 124],
    key_characteristics: [
      "Widely known songs",
      "Multiple generation appeal",
      "Not too fast initially",
      "Build confidence on dance floor"
    ],
    song_requirements: [
      "Classic wedding songs everyone knows",
      "Mix of decades",
      "Some line dances or group dances",
      "Songs that get people singing"
    ],
    avoid: [
      "Obscure or polarizing music",
      "Too high energy too fast",
      "Long songs (keep to 3-4 min)",
      "Anything that clears the floor"
    ],
    pro_tips: [
      "Start with Motown, 70s disco, 80s hits",
      "'September' by Earth Wind & Fire always works",
      "Watch who's dancing and adjust accordingly",
      "Group dances help break the ice"
    ],
    transitions: {
      from: "parent-dances",
      to: "peak-party",
      technique: "Gradually increase BPM and energy"
    }
  },
  {
    moment: "peak-party",
    duration: "90-120 min",
    purpose: "Maintain high energy dancing with current hits and crowd favorites",
    energy_level: 9,
    bpm_range: [120, 140],
    key_characteristics: [
      "High energy throughout",
      "Current hits mixed with classics",
      "Quick mixing between songs",
      "Reading the crowd crucial"
    ],
    song_requirements: [
      "Mix of genres (pop, hip-hop, rock, Latin)",
      "Both current and classic hits",
      "Songs that mix well together",
      "Some surprising throwbacks"
    ],
    avoid: [
      "Too many slow songs",
      "Obscure album tracks",
      "Losing energy for too long",
      "Playing too much of one genre"
    ],
    pro_tips: [
      "Use BPM matching for smooth transitions",
      "Save absolute bangers for when floor is packed",
      "Mix in one slower song every 20-30 minutes",
      "Watch for different age groups and play to them"
    ],
    transitions: {
      from: "open-dancing-warmup",
      to: "wind-down",
      technique: "Start slowing tempo in last 20 minutes"
    }
  },
  {
    moment: "cake-cutting",
    duration: "5 min",
    purpose: "Provide background for cake cutting ceremony",
    energy_level: 5,
    bpm_range: [80, 110],
    key_characteristics: [
      "Sweet and romantic",
      "Often playful",
      "Not too loud",
      "Photo moment music"
    ],
    song_requirements: [
      "Songs about sweetness/sugar work well",
      "Should loop if needed",
      "Consider if couple wants funny or romantic",
      "Easy to fade out"
    ],
    avoid: [
      "Songs about food fights",
      "Anything too loud",
      "Songs that distract from moment",
      "Explicit versions"
    ],
    pro_tips: [
      "'How Sweet It Is' classic choice",
      "Can be funny - 'Pour Some Sugar on Me'",
      "Keep it short - ceremony is quick",
      "Have music ready for background after"
    ],
    transitions: {
      from: "peak-party",
      to: "peak-party",
      technique: "Quick photo op, then back to dancing"
    }
  },
  {
    moment: "bouquet-garter",
    duration: "10-15 min",
    purpose: "Create fun, playful atmosphere for traditions",
    energy_level: 7,
    bpm_range: [110, 130],
    key_characteristics: [
      "Playful and fun",
      "Can be cheeky for garter",
      "Build anticipation",
      "Interactive with crowd"
    ],
    song_requirements: [
      "Different songs for bouquet vs garter",
      "Songs that can be cut short",
      "Consider if doing both traditions",
      "May need striptease-style for garter"
    ],
    avoid: [
      "Anything too inappropriate",
      "Songs that go on too long",
      "Music that's too subtle",
      "Confusing lyrics"
    ],
    pro_tips: [
      "'Single Ladies' for bouquet is classic",
      "'Another One Bites the Dust' for garter works",
      "Can make garter removal comedic or sexy",
      "Have backup songs if tradition takes longer"
    ],
    transitions: {
      from: "peak-party",
      to: "peak-party",
      technique: "Jump right back into dance music"
    }
  },
  {
    moment: "cultural-dances",
    duration: "15-30 min",
    purpose: "Honor cultural traditions with specific music and dances",
    energy_level: 8,
    bpm_range: [100, 180], // Varies greatly by culture
    key_characteristics: [
      "Culturally authentic music",
      "May require specific versions",
      "Often involves group participation",
      "Can be teaching moment"
    ],
    song_requirements: [
      "Authentic versions important",
      "May need specific recordings",
      "Consider if instruction needed",
      "Multiple songs for sets"
    ],
    avoid: [
      "Westernized versions (unless preferred)",
      "Wrong dialect or region",
      "Cutting sacred songs",
      "Missing key songs"
    ],
    pro_tips: [
      "Jewish: Hora starts slow, builds fast",
      "Greek: Multiple songs for different dances",
      "Latino: Variety of styles (salsa, merengue, bachata)",
      "Irish: Mix traditional and modern Celtic"
    ],
    transitions: {
      from: "peak-party",
      to: "peak-party",
      technique: "Can be woven throughout or dedicated section"
    },
    cultural_considerations: {
      jewish: "Hava Nagila, Siman Tov, Od Yishama - build energy",
      greek: "Never on Sunday, Zorba - prepare for plate breaking",
      italian: "Tarantella - very fast, need space",
      irish: "Celtic music - consider live musicians",
      latino: "Variety of rhythms - salsa, merengue, reggaeton",
      indian: "Bollywood hits, Bhangra - very high energy",
      chinese: "Mix traditional and modern C-pop/Mandopop"
    }
  },
  {
    moment: "anniversary-dance",
    duration: "4-5 min",
    purpose: "Honor married couples and longest marriage",
    energy_level: 3,
    bpm_range: [70, 90],
    key_characteristics: [
      "Romantic and nostalgic",
      "Classic love song",
      "Timeless appeal",
      "Emotional moment"
    ],
    song_requirements: [
      "Song all generations know",
      "Long enough for elimination process",
      "Clear for MC to talk over",
      "Romantic but not sad"
    ],
    avoid: [
      "Modern songs older couples won't know",
      "Anything about breakups",
      "Too fast for older couples",
      "Poor sound quality"
    ],
    pro_tips: [
      "At Last, The Way You Look Tonight are perfect",
      "MC eliminates by years married",
      "Have photographer ready for longest married",
      "Can transition into slow dance set"
    ],
    transitions: {
      from: "peak-party",
      to: "slow-dance-set",
      technique: "Keep romantic mood for 2-3 more slow songs"
    }
  },
  {
    moment: "last-dance",
    duration: "4-5 min",
    purpose: "End the night on a high note with memorable final song",
    energy_level: 7,
    bpm_range: [70, 130], // Can be slow or upbeat
    key_characteristics: [
      "Memorable and meaningful",
      "Can be private or group",
      "Often sentimental",
      "Clear ending to night"
    ],
    song_requirements: [
      "Something special to couple",
      "Consider if private or all guests",
      "May want lights up",
      "Strong ending"
    ],
    avoid: [
      "Songs about the party continuing",
      "Anything too sad",
      "Unclear endings",
      "New songs people don't know"
    ],
    pro_tips: [
      "Can do private last dance after guests leave",
      "'Closing Time' or 'Save the Last Dance' work",
      "Consider sparkler exit if going outside",
      "New York, New York classic for group finale"
    ],
    transitions: {
      from: "wind-down",
      to: "after-party",
      technique: "Clear end, then after-party playlist if continuing"
    }
  },
  {
    moment: "after-party",
    duration: "60+ min",
    purpose: "Keep energy going for younger crowd wanting to continue celebrating",
    energy_level: 8,
    bpm_range: [120, 150],
    key_characteristics: [
      "Less formal music choices",
      "Can play explicit versions",
      "Requests welcome",
      "Bar/club atmosphere"
    ],
    song_requirements: [
      "Current hits and guilty pleasures",
      "Songs that were too edgy for main reception",
      "Sing-along anthems",
      "Can repeat earlier hits"
    ],
    avoid: [
      "Slow songs unless requested",
      "Formality of main reception",
      "Censoring (if adults only)",
      "Playing it too safe"
    ],
    pro_tips: [
      "This is where 2000s throwbacks thrive",
      "Rap and hip-hop that was avoided earlier",
      "Mr. Brightside will definitely be requested",
      "Have phone charger for playlist requests"
    ],
    transitions: {
      from: "last-dance",
      to: "end",
      technique: "Can go until venue closes or energy dies"
    }
  }
];

// BPM and Energy Flow Throughout the Day
export const IDEAL_BPM_PROGRESSION: BPMProgression[] = [
  {
    phase: "Pre-Ceremony",
    time: "2:00 PM - 3:00 PM",
    target_bpm: [60, 80],
    energy: 2,
    mixing_technique: "Smooth crossfades, no beat matching needed",
    crowd_psychology: "Guests arriving, finding seats, emotional preparation"
  },
  {
    phase: "Cocktail Hour",
    time: "3:30 PM - 5:00 PM",
    target_bpm: [90, 110],
    energy: 3,
    mixing_technique: "Smooth transitions, genre mixing OK",
    crowd_psychology: "Social mixing, alcohol starting, energy building"
  },
  {
    phase: "Dinner",
    time: "5:00 PM - 6:30 PM",
    target_bpm: [70, 95],
    energy: 2,
    mixing_technique: "Long crossfades, focus on mood consistency",
    crowd_psychology: "Eating, conversation, relaxation"
  },
  {
    phase: "First Dances",
    time: "7:00 PM - 7:15 PM",
    target_bpm: [60, 96],
    energy: 4,
    mixing_technique: "Clean stops and starts, no mixing",
    crowd_psychology: "Emotional peak, photo moments, anticipation"
  },
  {
    phase: "Dance Floor Opening",
    time: "7:15 PM - 8:00 PM",
    target_bpm: [100, 120],
    energy: 6,
    mixing_technique: "Start longer mixes, building BPM gradually",
    crowd_psychology: "Overcoming dance floor anxiety, group participation"
  },
  {
    phase: "Peak Party Hour 1",
    time: "8:00 PM - 9:00 PM",
    target_bpm: [118, 128],
    energy: 8,
    mixing_technique: "Quick cuts, beat matching, mashups OK",
    crowd_psychology: "Peak alcohol effect, maximum energy, everyone dancing"
  },
  {
    phase: "Peak Party Hour 2",
    time: "9:00 PM - 10:00 PM",
    target_bpm: [125, 135],
    energy: 9,
    mixing_technique: "Aggressive mixing, drops, build-ups",
    crowd_psychology: "Sustained energy, requests coming, core dancers"
  },
  {
    phase: "Wind Down",
    time: "10:00 PM - 10:30 PM",
    target_bpm: [110, 125],
    energy: 7,
    mixing_technique: "Gradual BPM reduction, nostalgic hits",
    crowd_psychology: "Tiredness setting in, emotional songs work"
  },
  {
    phase: "Last Dance",
    time: "10:30 PM - 11:00 PM",
    target_bpm: [80, 120],
    energy: 5,
    mixing_technique: "Clean ending, possible group circle",
    crowd_psychology: "Sentimental, saying goodbyes, final memories"
  }
];

// Key Mixing and Harmonic Compatibility
export const HARMONIC_MIXING_RULES = {
  // Camelot Wheel for key compatibility
  camelot_wheel: {
    "1A": ["12A", "1A", "2A", "1B"], // Ab minor
    "1B": ["12B", "1B", "2B", "1A"], // B major
    "2A": ["1A", "2A", "3A", "2B"],  // Eb minor
    "2B": ["1B", "2B", "3B", "2A"],  // F# major
    "3A": ["2A", "3A", "4A", "3B"],  // Bb minor
    "3B": ["2B", "3B", "4B", "3A"],  // Db major
    "4A": ["3A", "4A", "5A", "4B"],  // F minor
    "4B": ["3B", "4B", "5B", "4A"],  // Ab major
    "5A": ["4A", "5A", "6A", "5B"],  // C minor
    "5B": ["4B", "5B", "6B", "5A"],  // Eb major
    "6A": ["5A", "6A", "7A", "6B"],  // G minor
    "6B": ["5B", "6B", "7B", "6A"],  // Bb major
    "7A": ["6A", "7A", "8A", "7B"],  // D minor
    "7B": ["6B", "7B", "8B", "7A"],  // F major
    "8A": ["7A", "8A", "9A", "8B"],  // A minor
    "8B": ["7B", "8B", "9B", "8A"],  // C major
    "9A": ["8A", "9A", "10A", "9B"], // E minor
    "9B": ["8B", "9B", "10B", "9A"], // G major
    "10A": ["9A", "10A", "11A", "10B"], // B minor
    "10B": ["9B", "10B", "11B", "10A"], // D major
    "11A": ["10A", "11A", "12A", "11B"], // F# minor
    "11B": ["10B", "11B", "12B", "11A"], // A major
    "12A": ["11A", "12A", "1A", "12B"], // Db minor
    "12B": ["11B", "12B", "1B", "12A"]  // E major
  },
  mixing_tips: [
    "Same key = Perfect mix every time",
    "+1 or -1 on wheel = Smooth energy boost or reduction",
    "Switch between major/minor (A to B) = Mood change",
    "+2 or -2 = More dramatic but still harmonic",
    "Opposite side of wheel = Dramatic change, use for impact"
  ]
};

// Professional DJ Mixing Techniques
export const DJ_MIXING_TECHNIQUES = {
  beatmatching: {
    description: "Aligning tempos of two tracks",
    when_to_use: "During peak dancing hours",
    bpm_tolerance: "±5 BPM without pitch adjustment, ±8 BPM with adjustment",
    tips: [
      "Use the pitch fader to match BPMs exactly",
      "Start the incoming track on the 1 beat",
      "Practice counting beats in 4/4 time",
      "Use the jog wheel for minor adjustments"
    ]
  },
  phrase_matching: {
    description: "Aligning musical phrases (usually 8, 16, or 32 bars)",
    when_to_use: "For smooth transitions during dancing",
    tips: [
      "Most pop songs have 8-bar phrases",
      "Start mixing at the beginning of a phrase",
      "Drop on the 1 of a new phrase for impact",
      "Use cue points to mark phrase starts"
    ]
  },
  eq_mixing: {
    description: "Using EQ to blend frequencies",
    when_to_use: "When mixing songs with similar bass lines",
    tips: [
      "Cut bass on incoming track until ready to swap",
      "Gradually swap bass frequencies between tracks",
      "Keep total bass energy consistent",
      "Use mid-range EQ to avoid vocal clashing"
    ]
  },
  harmonic_mixing: {
    description: "Mixing songs in compatible musical keys",
    when_to_use: "For longer blends and mashups",
    tips: [
      "Use Camelot wheel for key compatibility",
      "Same key = longest possible mix",
      "Adjacent keys = smooth energy change",
      "Opposite keys = dramatic moment"
    ]
  }
};

// Song Selection Psychology
export const CROWD_PSYCHOLOGY_RULES = {
  energy_management: [
    "Never drop energy more than 20% between songs",
    "Build in waves - up for 3-4 songs, brief breather, then up again",
    "Read the dance floor, not the people sitting",
    "One slow song every 30-40 minutes maximum during party time"
  ],
  age_group_cycling: [
    "Play something for each generation every 15-20 minutes",
    "Current hits → 90s/2000s → 80s → 70s/Motown → repeat",
    "Grandparent songs work best during dinner and early dancing",
    "Save explicit or edgy content for after-party only"
  ],
  request_management: [
    "Take requests but curate them",
    "If a bad request, say 'I'll see what I can do' or 'Coming up later'",
    "Bride and groom requests are priority",
    "Use requests to gauge crowd preferences"
  ],
  dance_floor_recovery: [
    "If floor clears, play a guaranteed hit within 2 songs",
    "Group dances recover empty floors (Cupid Shuffle, Wobble)",
    "Throwback hits from high school/college years always work",
    "When in doubt: Play 'September' by Earth, Wind & Fire"
  ]
};

// Genre-Specific Expertise
export const GENRE_EXPERTISE = {
  motown: {
    when: "Cocktail hour, dinner, early dancing",
    why: "Appeals to all ages, gets people singing",
    energy: 6,
    must_plays: ["Signed Sealed Delivered", "My Girl", "Ain't Too Proud to Beg"],
    mixing: "Can mix with modern soul and funk"
  },
  disco: {
    when: "Opening dance floor, keeping all ages engaged",
    why: "Familiar, fun, gets everyone moving",
    energy: 7,
    must_plays: ["September", "Le Freak", "I Will Survive"],
    mixing: "Transitions well to modern dance pop"
  },
  modern_pop: {
    when: "Peak party time",
    why: "Current, high energy, younger crowd loves it",
    energy: 8,
    must_plays: ["As It Was", "Flowers", "Anti-Hero"],
    mixing: "Quick cuts and mashups work well"
  },
  hip_hop: {
    when: "Peak party, after older guests leave",
    why: "High energy, great for dancing",
    energy: 9,
    must_plays: ["All the Small Things", "Yeah!", "Gold Digger (clean)"],
    mixing: "Beat matching essential, watch for explicit content"
  },
  country: {
    when: "Depends on crowd, great for group dances",
    why: "Regional favorite, line dancing opportunities",
    energy: 6,
    must_plays: ["Wagon Wheel", "Friends in Low Places", "Cruise"],
    mixing: "Can mix with rock and pop country"
  },
  rock: {
    when: "Late party, sing-alongs",
    why: "High energy, everyone knows the words",
    energy: 8,
    must_plays: ["Don't Stop Believin'", "Mr. Brightside", "Livin' on a Prayer"],
    mixing: "Use for high-impact moments"
  },
  latin: {
    when: "Cocktail hour, special dance section",
    why: "Great for diverse crowds, teaches new dances",
    energy: 7,
    must_plays: ["Despacito", "Danza Kuduro", "Vivir Mi Vida"],
    mixing: "Keep similar rhythms together (salsa with salsa)"
  },
  edm: {
    when: "Late night, younger crowd",
    why: "Sustained high energy, modern sound",
    energy: 10,
    must_plays: ["Clarity", "Titanium", "Animals"],
    mixing: "Build-ups and drops, beat matching crucial"
  }
};

// Common Mistakes to Avoid
export const COMMON_DJ_MISTAKES = {
  timing: [
    "Playing dinner music too loud",
    "Starting party music before dinner ends",
    "Not having enough music for cocktail hour",
    "Cutting special dances too short"
  ],
  song_selection: [
    "Playing explicit versions with kids present",
    "Too many slow songs during party time",
    "Obscure music that only DJ knows",
    "Ignoring the crowd that's actually dancing"
  ],
  technical: [
    "Dead air between songs during key moments",
    "Volume inconsistencies",
    "Poor quality audio files",
    "Not having backup for special songs"
  ],
  crowd_reading: [
    "Playing to empty dance floor instead of bringing people back",
    "Ignoring generational differences",
    "Not adjusting to crowd energy",
    "Being too rigid with playlist"
  ]
};

// Cultural Wedding Music Traditions
export const CULTURAL_TRADITIONS = {
  jewish: {
    essential_songs: ["Hava Nagila", "Siman Tov", "Od Yishama"],
    key_moments: ["Hora circle dance", "Chair lifting", "Mezinka"],
    timing: "Usually after dinner, before open dancing",
    tips: "Start slow and build, have strong speakers for chair lifting"
  },
  irish: {
    essential_songs: ["The Irish Rover", "Whiskey in the Jar", "Danny Boy"],
    key_moments: ["Cèilidh dancing", "Traditional toasts"],
    timing: "Mixed throughout reception",
    tips: "Consider live traditional musicians"
  },
  greek: {
    essential_songs: ["Never on Sunday", "Zorba's Dance", "Misirlou"],
    key_moments: ["Kalamatiano circle dance", "Money dance", "Plate breaking"],
    timing: "Usually dedicated section during peak party",
    tips: "Clear space for traditional dances"
  },
  italian: {
    essential_songs: ["Tarantella", "That's Amore", "Volare"],
    key_moments: ["Tarantella dance", "Cookie dance"],
    timing: "After dinner, high energy",
    tips: "Tarantella is very fast - clear the floor"
  },
  latino: {
    essential_songs: ["La Bamba", "Celia Cruz hits", "Current reggaeton"],
    key_moments: ["Dollar dance", "Las Arras", "La Vibora de La Mar"],
    timing: "Throughout party with dedicated sets",
    tips: "Mix traditional with modern Latin pop"
  },
  indian: {
    essential_songs: ["Bollywood hits", "Bhangra beats", "Garba songs"],
    key_moments: ["Baraat", "Sangeet performances", "Garba/Raas"],
    timing: "Often separate events or extended sections",
    tips: "Very high energy, need excellent sound system"
  },
  african_american: {
    essential_songs: ["Electric Slide", "Cupid Shuffle", "Before I Let Go"],
    key_moments: ["Soul train line", "Step shows", "Call and response"],
    timing: "Throughout reception",
    tips: "Line dances are essential, R&B and soul classics crucial"
  }
};

// Special Situation Handling
export const SPECIAL_SITUATIONS = {
  rain_outdoor_wedding: {
    music_adjustments: "More upbeat to counteract weather mood",
    volume_considerations: "May need to increase due to rain noise",
    equipment_protection: "Cover all equipment, have backup power"
  },
  divorced_parents: {
    parent_dance_options: "Separate songs, or skip tradition",
    seating_awareness: "Be aware of dynamics during dedications",
    song_choices: "Avoid family-focused lyrics if sensitive"
  },
  second_wedding: {
    tradition_adjustments: "May skip some traditions",
    song_themes: "Focus on future, not 'first time' themes",
    guest_expectations: "Often more relaxed, party-focused"
  },
  mixed_religion: {
    ceremony_music: "Neutral or include both traditions",
    cultural_balance: "Equal representation of both backgrounds",
    dietary_timing: "May affect dinner/dancing schedule"
  },
  elderly_heavy_guest_list: {
    volume_levels: "Lower than typical wedding",
    song_selection: "More classics, less current hits",
    pacing: "More breaks, earlier end time"
  },
  young_crowd_wedding: {
    explicit_content: "Can be more lenient after certain time",
    energy_levels: "Can sustain higher energy longer",
    technology: "Consider social media moments, hashtags"
  }
};

// Equipment and Technical Knowledge
export const TECHNICAL_EXPERTISE = {
  sound_levels: {
    ceremony: "60-70 dB - clear but not overpowering",
    cocktail: "70-75 dB - background conversation level",
    dinner: "65-70 dB - dining ambiance",
    dancing: "85-95 dB - club level but safe for extended exposure",
    speeches: "75-80 dB - clear and audible"
  },
  speaker_placement: {
    ceremony: "Front sides, aimed at back rows",
    cocktail: "Distributed for even coverage",
    reception: "Dance floor focused with dinner area coverage",
    outdoor: "Account for sound dissipation, need more power"
  },
  backup_requirements: [
    "Duplicate of all special songs",
    "Backup laptop/device",
    "Extra cables and adapters",
    "Offline copies of streaming songs",
    "Written timeline and must-play list"
  ],
  venue_acoustics: {
    ballroom: "Natural reverb, reduce bass",
    tent: "Sound absorbing, need more power",
    barn: "Echo issues, position speakers carefully",
    outdoor: "No reverb, sound dissipates quickly",
    church: "Long reverb, speak/play slowly"
  }
};

// Data-Driven Song Success Metrics
export const SONG_SUCCESS_METRICS = {
  guaranteed_floor_fillers: [
    { song: "September - Earth, Wind & Fire", success_rate: 0.98, best_time: "early_party" },
    { song: "Uptown Funk - Bruno Mars", success_rate: 0.96, best_time: "peak_party" },
    { song: "I Wanna Dance with Somebody - Whitney", success_rate: 0.95, best_time: "peak_party" },
    { song: "Don't Stop Believin' - Journey", success_rate: 0.94, best_time: "late_party" },
    { song: "Shut Up and Dance - Walk the Moon", success_rate: 0.93, best_time: "peak_party" },
    { song: "Can't Stop the Feeling - JT", success_rate: 0.92, best_time: "all_ages" },
    { song: "24K Magic - Bruno Mars", success_rate: 0.91, best_time: "peak_party" },
    { song: "Mr. Brightside - The Killers", success_rate: 0.95, best_time: "late_party" },
    { song: "Yeah! - Usher", success_rate: 0.90, best_time: "peak_party" },
    { song: "Shout - Isley Brothers", success_rate: 0.89, best_time: "group_moment" }
  ],
  risky_but_rewarding: [
    "Bohemian Rhapsody - needs right moment but amazing payoff",
    "Sweet Caroline - divides crowds but singalong potential",
    "Baby Shark - kids love it, adults hate it, use sparingly",
    "Cotton Eye Joe - either best or worst moment",
    "Mambo No. 5 - dated but can work with right crowd"
  ],
  never_play_unless_requested: [
    "Chicken Dance - overdone and cheesy",
    "Macarena - very dated",
    "Who Let the Dogs Out - annoying to most",
    "Gangnam Style - moment has passed",
    "Watch Me (Whip/Nae Nae) - overdone"
  ]
};

// Generate expertise for DJ Harmony context
export function getExpertiseForMoment(moment: string): MomentExpertise | undefined {
  return WEDDING_MOMENT_EXPERTISE.find(m => m.moment === moment);
}

export function getBPMForTime(time: string): BPMProgression | undefined {
  return IDEAL_BPM_PROGRESSION.find(p => p.time.includes(time));
}

export function getGenreExpertise(genre: string): any {
  return GENRE_EXPERTISE[genre.toLowerCase() as keyof typeof GENRE_EXPERTISE];
}

export function getCulturalTradition(culture: string): any {
  return CULTURAL_TRADITIONS[culture.toLowerCase() as keyof typeof CULTURAL_TRADITIONS];
}

// Export function to generate DJ Harmony's expert knowledge
export function generateExpertResponse(query: string, context: any) {
  // This will be used by DJ Harmony to provide expert advice
  const queryLower = query.toLowerCase();
  
  // Detect what expertise is needed
  const response = {
    expertise: [] as any[],
    advice: "",
    technical_notes: "",
    pro_tips: [] as string[]
  };
  
  // Check for moment-specific queries
  WEDDING_MOMENT_EXPERTISE.forEach(moment => {
    if (queryLower.includes(moment.moment.replace('-', ' ')) || 
        queryLower.includes(moment.purpose.toLowerCase())) {
      response.expertise.push(moment);
    }
  });
  
  // Check for BPM/energy queries
  if (queryLower.includes('bpm') || queryLower.includes('tempo') || queryLower.includes('energy')) {
    response.expertise.push(IDEAL_BPM_PROGRESSION);
  }
  
  // Check for mixing/DJ technique queries
  if (queryLower.includes('mix') || queryLower.includes('transition') || queryLower.includes('blend')) {
    response.expertise.push(DJ_MIXING_TECHNIQUES);
  }
  
  // Check for cultural queries
  Object.keys(CULTURAL_TRADITIONS).forEach(culture => {
    if (queryLower.includes(culture)) {
      response.expertise.push(CULTURAL_TRADITIONS[culture as keyof typeof CULTURAL_TRADITIONS]);
    }
  });
  
  return response;
}