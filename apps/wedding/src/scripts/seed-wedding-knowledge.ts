#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { 
  WEDDING_MOMENT_EXPERTISE, 
  IDEAL_BPM_PROGRESSION,
  HARMONIC_MIXING_RULES,
  DJ_MIXING_TECHNIQUES,
  CROWD_PSYCHOLOGY_RULES,
  GENRE_EXPERTISE,
  CULTURAL_TRADITIONS,
  COMMON_DJ_MISTAKES,
  SPECIAL_SITUATIONS,
  TECHNICAL_EXPERTISE,
  SONG_SUCCESS_METRICS
} from '../data/wedding-music-expertise';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedWeddingKnowledge() {
  console.log('🎵 Seeding wedding music expertise into Supabase...\n');

  try {
    // 1. Seed moment expertise
    console.log('📍 Seeding wedding moment expertise...');
    for (const moment of WEDDING_MOMENT_EXPERTISE) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'moment',
          subcategory: moment.moment,
          title: `${moment.moment} - ${moment.purpose}`,
          content: moment.purpose,
          bpm_range: moment.bpm_range,
          energy_level: moment.energy_level,
          duration: moment.duration,
          key_points: {
            characteristics: moment.key_characteristics,
            requirements: moment.song_requirements
          },
          pro_tips: moment.pro_tips,
          avoid_list: moment.avoid,
          transitions: moment.transitions,
          cultural_notes: moment.cultural_considerations || {},
          keywords: [
            moment.moment,
            ...moment.key_characteristics,
            `${moment.energy_level} energy`
          ]
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${moment.moment}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${moment.moment}`);
      }
    }

    // 2. Seed BPM progression
    console.log('\n🎚️ Seeding BPM progression rules...');
    for (let i = 0; i < IDEAL_BPM_PROGRESSION.length; i++) {
      const progression = IDEAL_BPM_PROGRESSION[i];
      const { data, error } = await supabase
        .from('bpm_progression')
        .upsert({
          phase: progression.phase,
          time_range: progression.time,
          sequence_order: i,
          bpm_min: progression.target_bpm[0],
          bpm_max: progression.target_bpm[1],
          energy_level: progression.energy,
          mixing_technique: progression.mixing_technique,
          crowd_psychology: progression.crowd_psychology
        }, {
          onConflict: 'phase'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${progression.phase}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${progression.phase}`);
      }
    }

    // 3. Seed harmonic mixing rules
    console.log('\n🎼 Seeding harmonic mixing (Camelot wheel)...');
    for (const [code, compatible] of Object.entries(HARMONIC_MIXING_RULES.camelot_wheel)) {
      const keyMap: Record<string, string> = {
        '1A': 'Ab minor', '1B': 'B major',
        '2A': 'Eb minor', '2B': 'F# major',
        '3A': 'Bb minor', '3B': 'Db major',
        '4A': 'F minor', '4B': 'Ab major',
        '5A': 'C minor', '5B': 'Eb major',
        '6A': 'G minor', '6B': 'Bb major',
        '7A': 'D minor', '7B': 'F major',
        '8A': 'A minor', '8B': 'C major',
        '9A': 'E minor', '9B': 'G major',
        '10A': 'B minor', '10B': 'D major',
        '11A': 'F# minor', '11B': 'A major',
        '12A': 'Db minor', '12B': 'E major'
      };

      const { data, error } = await supabase
        .from('harmonic_mixing')
        .upsert({
          camelot_code: code,
          musical_key: keyMap[code],
          compatible_keys: compatible as string[],
          energy_change: code.endsWith('B') ? 'boost' : 'maintain',
          mood_shift: code.endsWith('B') ? 'brighter' : 'darker'
        }, {
          onConflict: 'camelot_code'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${code}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${code} - ${keyMap[code]}`);
      }
    }

    // 4. Seed DJ techniques
    console.log('\n🎛️ Seeding DJ mixing techniques...');
    for (const [technique, details] of Object.entries(DJ_MIXING_TECHNIQUES)) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'technique',
          subcategory: technique,
          title: `DJ Technique: ${technique}`,
          content: details.description,
          key_points: {
            when_to_use: details.when_to_use,
            tips: details.tips,
            bpm_tolerance: (details as any).bpm_tolerance
          },
          pro_tips: details.tips,
          keywords: [technique, 'mixing', 'dj', 'technique']
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${technique}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${technique}`);
      }
    }

    // 5. Seed genre expertise
    console.log('\n🎸 Seeding genre expertise...');
    for (const [genre, details] of Object.entries(GENRE_EXPERTISE)) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'genre',
          subcategory: genre,
          title: `Genre Guide: ${genre}`,
          content: details.why,
          energy_level: details.energy,
          best_time: details.when,
          key_points: {
            when: details.when,
            why: details.why,
            must_plays: details.must_plays,
            mixing: details.mixing
          },
          keywords: [genre, ...details.must_plays]
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${genre}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${genre}`);
      }
    }

    // 6. Seed cultural traditions
    console.log('\n🌍 Seeding cultural wedding traditions...');
    for (const [culture, details] of Object.entries(CULTURAL_TRADITIONS)) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'culture',
          subcategory: culture,
          title: `Cultural Tradition: ${culture}`,
          content: `Essential songs and traditions for ${culture} weddings`,
          key_points: {
            essential_songs: details.essential_songs,
            key_moments: details.key_moments,
            timing: details.timing
          },
          pro_tips: [details.tips],
          cultural_notes: details,
          keywords: [culture, ...details.essential_songs]
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${culture}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${culture}`);
      }
    }

    // 7. Seed crowd psychology rules
    console.log('\n🧠 Seeding crowd psychology rules...');
    for (const [aspect, rules] of Object.entries(CROWD_PSYCHOLOGY_RULES)) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'psychology',
          subcategory: aspect,
          title: `Crowd Psychology: ${aspect.replace('_', ' ')}`,
          content: `Understanding and managing ${aspect.replace('_', ' ')}`,
          key_points: { rules },
          pro_tips: rules,
          keywords: [aspect, 'crowd', 'psychology', 'dj']
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${aspect}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${aspect}`);
      }
    }

    // 8. Seed common mistakes
    console.log('\n⚠️ Seeding common DJ mistakes...');
    for (const [category, mistakes] of Object.entries(COMMON_DJ_MISTAKES)) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'mistakes',
          subcategory: category,
          title: `Common Mistakes: ${category}`,
          content: `Avoid these common ${category} mistakes`,
          avoid_list: mistakes,
          keywords: ['mistakes', 'avoid', category]
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${category}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${category}`);
      }
    }

    // 9. Seed special situations
    console.log('\n🎯 Seeding special situation handling...');
    for (const [situation, details] of Object.entries(SPECIAL_SITUATIONS)) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'special',
          subcategory: situation,
          title: `Special Situation: ${situation.replace('_', ' ')}`,
          content: `How to handle ${situation.replace('_', ' ')}`,
          key_points: details,
          keywords: [situation, 'special', 'situation']
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${situation}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${situation}`);
      }
    }

    // 10. Seed technical expertise
    console.log('\n🔊 Seeding technical expertise...');
    for (const [aspect, details] of Object.entries(TECHNICAL_EXPERTISE)) {
      const { data, error } = await supabase
        .from('wedding_knowledge')
        .upsert({
          category: 'technical',
          subcategory: aspect,
          title: `Technical: ${aspect.replace('_', ' ')}`,
          content: `Technical knowledge for ${aspect.replace('_', ' ')}`,
          technical_specs: details,
          keywords: [aspect, 'technical', 'equipment']
        }, {
          onConflict: 'title'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${aspect}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${aspect}`);
      }
    }

    // 11. Seed song success metrics
    console.log('\n📊 Seeding song success metrics...');
    for (const song of SONG_SUCCESS_METRICS.guaranteed_floor_fillers) {
      const [title, artist] = song.song.split(' - ');
      const { data, error } = await supabase
        .from('song_success_metrics')
        .upsert({
          song_id: `spotify:${title.toLowerCase().replace(/\s+/g, '-')}`, // Mock ID
          title: title,
          artist: artist,
          success_rate: song.success_rate,
          best_moment: song.best_time,
          energy_impact: 3,
          times_played: Math.floor(song.success_rate * 1000),
          average_rating: song.success_rate * 5
        }, {
          onConflict: 'song_id'
        });

      if (error) {
        console.error(`  ❌ Error seeding ${title}:`, error.message);
      } else {
        console.log(`  ✅ Seeded ${title}`);
      }
    }

    console.log('\n✨ Successfully seeded wedding music expertise!');
    console.log('📚 Knowledge base is ready for DJ Harmony to provide expert advice.\n');

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
seedWeddingKnowledge().then(() => {
  console.log('🎉 Seeding complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Seeding failed:', error);
  process.exit(1);
});