#!/usr/bin/env node

/**
 * Script to update CLAUDE.md with current project information
 * Run: node scripts/update-claude-md.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

function updateClaudeMd() {
  const claudeMdPath = './CLAUDE.md';
  let content = readFileSync(claudeMdPath, 'utf8');
  
  // Update last updated date
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(
    /<!-- Last Updated: \d{4}-\d{2}-\d{2} -->/,
    `<!-- Last Updated: ${today} -->`
  );
  
  // Get current Next.js version from package.json
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
  const nextVersion = packageJson.dependencies.next;
  content = content.replace(
    /Next\.js \d+\.\d+\.\d+/g,
    `Next.js ${nextVersion.replace('^', '')}`
  );
  
  // Get recent git commits for the log
  try {
    const recentCommits = execSync('git log --oneline -5', { encoding: 'utf8' });
    console.log('Recent commits:', recentCommits);
  } catch (error) {
    console.log('Could not get git commits');
  }
  
  // Check for untracked files
  try {
    const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' });
    if (untrackedFiles.trim()) {
      console.log('\nUntracked files to consider adding to TODO:');
      console.log(untrackedFiles);
    }
  } catch (error) {
    console.log('Could not check untracked files');
  }
  
  writeFileSync(claudeMdPath, content);
  console.log(`\n✅ Updated CLAUDE.md with current date: ${today}`);
  console.log('📝 Remember to manually update the Development Log section with recent changes!');
}

updateClaudeMd();