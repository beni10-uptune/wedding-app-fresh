#!/usr/bin/env node

/**
 * Test different approaches to get audio features
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import SpotifyWebApi from 'spotify-web-api-node';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function testAudioFeatures() {
  const spotify = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });

  try {
    // Authenticate with client credentials
    console.log('🔑 Authenticating with Client Credentials...');
    const auth = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(auth.body['access_token']);
    console.log('✅ Authenticated!');

    // Search for a popular track
    console.log('\n🔍 Searching for a popular track...');
    const searchResult = await spotify.searchTracks('perfect ed sheeran', { limit: 1 });
    const track = searchResult.body.tracks?.items[0];
    
    if (!track) {
      console.log('❌ No tracks found');
      return;
    }

    console.log(`✅ Found: "${track.name}" by ${track.artists[0].name}`);
    console.log(`   Track ID: ${track.id}`);
    console.log(`   Popularity: ${track.popularity}`);

    // Try method 1: getAudioFeaturesForTrack (singular)
    console.log('\n📊 Method 1: getAudioFeaturesForTrack (singular)...');
    try {
      const features = await spotify.getAudioFeaturesForTrack(track.id);
      console.log('✅ Success with singular method!');
      console.log('   Features:', {
        danceability: features.body.danceability,
        energy: features.body.energy,
        valence: features.body.valence,
        tempo: features.body.tempo
      });
    } catch (error: any) {
      console.log('❌ Failed:', error.statusCode, error.body?.error);
    }

    // Try method 2: getAudioFeaturesForTracks (plural)
    console.log('\n📊 Method 2: getAudioFeaturesForTracks (plural)...');
    try {
      const features = await spotify.getAudioFeaturesForTracks([track.id]);
      console.log('✅ Success with plural method!');
      const feature = features.body.audio_features[0];
      if (feature) {
        console.log('   Features:', {
          danceability: feature.danceability,
          energy: feature.energy,
          valence: feature.valence,
          tempo: feature.tempo
        });
      }
    } catch (error: any) {
      console.log('❌ Failed:', error.statusCode, error.body?.error);
    }

    // Try with multiple tracks
    console.log('\n📊 Testing with multiple tracks...');
    const multiSearch = await spotify.searchTracks('wedding', { limit: 5 });
    const trackIds = multiSearch.body.tracks?.items.map(t => t.id) || [];
    
    if (trackIds.length > 0) {
      console.log(`   Testing with ${trackIds.length} track IDs...`);
      
      // Try singular method for each
      console.log('\n   Using singular method for each:');
      let successCount = 0;
      for (const id of trackIds) {
        try {
          await spotify.getAudioFeaturesForTrack(id);
          successCount++;
        } catch (error) {
          // Silent fail
        }
      }
      console.log(`   ${successCount}/${trackIds.length} successful`);

      // Try plural method for all
      console.log('\n   Using plural method for all:');
      try {
        const features = await spotify.getAudioFeaturesForTracks(trackIds);
        const validFeatures = features.body.audio_features.filter(f => f !== null);
        console.log(`   ${validFeatures.length}/${trackIds.length} features retrieved`);
      } catch (error: any) {
        console.log(`   Failed: ${error.statusCode} ${error.body?.error?.status}`);
      }
    }

    // Check what scopes are available with client credentials
    console.log('\n🔐 Note about Client Credentials:');
    console.log('   Client Credentials flow grants access to public data only.');
    console.log('   Audio features endpoint may require user authorization.');
    console.log('   Consider using Authorization Code flow for full access.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.body) {
      console.error('   Body:', error.body);
    }
  }
}

// Run the test
testAudioFeatures()
  .then(() => {
    console.log('\n✅ Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });