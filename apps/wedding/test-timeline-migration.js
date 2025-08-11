#!/usr/bin/env node

/**
 * Test script to verify timeline migration from old to new format
 * Run with: node test-timeline-migration.js <weddingId>
 */

async function testMigration(weddingId) {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Checking wedding timeline status...');
  
  // First check the current status
  const checkResponse = await fetch(`${baseUrl}/api/migrate-wedding-timeline?weddingId=${weddingId}`);
  const status = await checkResponse.json();
  
  console.log('\n📊 Current Status:');
  console.log(`- Has old timeline: ${status.hasTimeline}`);
  console.log(`- Has V2 timeline: ${status.hasTimelineV2}`);
  console.log(`- Old timeline is array: ${status.timelineIsArray}`);
  console.log(`- V2 timeline is object: ${status.timelineV2IsObject}`);
  console.log(`- Old timeline moments: ${status.oldTimelineMoments}`);
  console.log(`- Old timeline songs: ${status.oldTimelineSongs}`);
  console.log(`- V2 timeline moments: ${status.v2TimelineMoments}`);
  console.log(`- V2 timeline songs: ${status.v2TimelineSongs}`);
  
  if (status.hasTimelineV2 && status.timelineV2IsObject) {
    console.log('\n✅ Wedding already has V2 timeline format!');
    return;
  }
  
  if (!status.hasTimeline || !status.timelineIsArray) {
    console.log('\n❌ Wedding does not have old format timeline to migrate');
    return;
  }
  
  console.log('\n🔄 Migrating timeline to V2 format...');
  
  // Perform migration
  const migrateResponse = await fetch(`${baseUrl}/api/migrate-wedding-timeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weddingId })
  });
  
  const result = await migrateResponse.json();
  
  if (result.success) {
    console.log('\n✅ Migration successful!');
    console.log(`- Total songs: ${result.totalSongs}`);
    console.log(`- Moments migrated:`);
    result.moments.forEach(m => {
      console.log(`  • ${m.name}: ${m.songCount} songs`);
    });
  } else {
    console.log('\n❌ Migration failed:', result.error);
  }
}

// Get wedding ID from command line
const weddingId = process.argv[2];

if (!weddingId) {
  console.log('Usage: node test-timeline-migration.js <weddingId>');
  console.log('Example: node test-timeline-migration.js user123');
  process.exit(1);
}

testMigration(weddingId).catch(console.error);