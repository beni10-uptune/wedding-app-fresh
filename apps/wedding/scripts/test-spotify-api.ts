#!/usr/bin/env node

/**
 * Test Spotify API connection and method names
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import SpotifyWebApi from 'spotify-web-api-node';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔧 Testing Spotify API Connection...');
console.log('  SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('  SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '✅ Set' : '❌ Missing');

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Spotify credentials missing! Please check .env.local');
  process.exit(1);
}

async function testSpotifyAPI() {
  const spotify = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });

  try {
    // Test 1: Get access token
    console.log('\n1️⃣ Testing authentication...');
    const auth = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(auth.body['access_token']);
    console.log('✅ Authentication successful!');
    console.log(`   Token expires in: ${auth.body['expires_in']} seconds`);

    // Test 2: Simple search
    console.log('\n2️⃣ Testing search API...');
    const searchResult = await spotify.searchTracks('wedding', { limit: 1 });
    const track = searchResult.body.tracks?.items[0];
    if (track) {
      console.log('✅ Search successful!');
      console.log(`   Found: "${track.name}" by ${track.artists[0].name}`);
      console.log(`   Track ID: ${track.id}`);

      // Test 3: Check available audio features methods
      console.log('\n3️⃣ Testing audio features API...');
      console.log('   Available methods on spotify object:');
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(spotify))
        .filter(name => name.includes('Audio') || name.includes('Features'))
        .sort();
      
      if (methods.length > 0) {
        methods.forEach(method => console.log(`     - ${method}`));
      }

      // Test the actual method
      try {
        console.log('\n   Testing getAudioFeaturesForTracks with track ID:', track.id);
        const features = await spotify.getAudioFeaturesForTracks([track.id]);
        console.log('✅ getAudioFeaturesForTracks works!');
        const feature = features.body.audio_features[0];
        if (feature) {
          console.log(`   Danceability: ${feature.danceability}`);
          console.log(`   Energy: ${feature.energy}`);
          console.log(`   Valence: ${feature.valence}`);
        }
      } catch (error: any) {
        console.log('❌ getAudioFeaturesForTracks failed:', error.message);
        console.log('   Full error:', error);
        
        // Try alternative method name
        console.log('\n   Trying alternative: getAudioFeaturesForSeveralTracks...');
        try {
          const features = await (spotify as any).getAudioFeaturesForSeveralTracks([track.id]);
          console.log('✅ getAudioFeaturesForSeveralTracks works!');
        } catch (altError: any) {
          console.log('❌ Alternative also failed:', altError.message);
        }
      }

      // Test 4: Check rate limiting
      console.log('\n4️⃣ Testing rate limiting (5 rapid requests)...');
      const startTime = Date.now();
      for (let i = 0; i < 5; i++) {
        await spotify.searchTracks(`test${i}`, { limit: 1 });
        console.log(`   Request ${i + 1}/5 completed`);
      }
      const elapsed = Date.now() - startTime;
      console.log(`✅ 5 requests completed in ${elapsed}ms`);
      console.log(`   Average: ${(elapsed / 5).toFixed(0)}ms per request`);

    } else {
      console.log('⚠️ No tracks found in search');
    }

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.body) {
      console.error('   Response body:', error.body);
    }
    if (error.statusCode) {
      console.error('   Status code:', error.statusCode);
    }
  }
}

// Run the test
testSpotifyAPI()
  .then(() => {
    console.log('\n✅ All tests completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });