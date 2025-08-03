#!/usr/bin/env npx tsx

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

interface OptimizationConfig {
  maxWidth: number
  quality: number
  format: 'jpeg' | 'webp'
}

const configs: Record<string, OptimizationConfig> = {
  hero: {
    maxWidth: 1920,
    quality: 85,
    format: 'jpeg'
  },
  content: {
    maxWidth: 1200,
    quality: 80,
    format: 'jpeg'
  },
  thumbnail: {
    maxWidth: 600,
    quality: 75,
    format: 'jpeg'
  }
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n')

  const inputDir = join(process.cwd(), 'public', 'images', 'lp')
  const outputDir = join(process.cwd(), 'public', 'images', 'lp', 'optimized')

  // Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  try {
    const files = await readdir(inputDir)
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.includes('-variant-')
    )

    for (const file of imageFiles) {
      const filePath = join(inputDir, file)
      const stats = await stat(filePath)
      const fileSizeKB = stats.size / 1024

      console.log(`📸 Processing: ${file} (${fileSizeKB.toFixed(1)}KB)`)

      // Generate optimized versions
      for (const [sizeName, config] of Object.entries(configs)) {
        try {
          const outputName = file.replace(/\.(jpg|jpeg|png|webp)$/i, `-${sizeName}.${config.format}`)
          const outputPath = join(outputDir, outputName)

          await sharp(filePath)
            .resize(config.maxWidth, null, {
              withoutEnlargement: true,
              fit: 'inside'
            })
            .jpeg({ quality: config.quality, progressive: true })
            .toFile(outputPath)

          const outputStats = await stat(outputPath)
          const outputSizeKB = outputStats.size / 1024
          const reduction = ((fileSizeKB - outputSizeKB) / fileSizeKB * 100).toFixed(1)

          console.log(`   ✅ ${sizeName}: ${outputSizeKB.toFixed(1)}KB (-${reduction}%)`)
        } catch (error) {
          console.error(`   ❌ Error creating ${sizeName} version:`, error)
        }
      }

      // Also create a WebP version for modern browsers
      try {
        const webpPath = join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'))
        await sharp(filePath)
          .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
          .webp({ quality: 85 })
          .toFile(webpPath)
        
        const webpStats = await stat(webpPath)
        console.log(`   ✅ WebP: ${(webpStats.size / 1024).toFixed(1)}KB`)
      } catch (error) {
        console.error(`   ❌ Error creating WebP version:`, error)
      }

      console.log('')
    }

    console.log('✨ Optimization complete!')
    console.log(`📁 Optimized images saved to: ${outputDir}`)
    console.log('\nNext steps:')
    console.log('1. Update landing pages to use optimized images')
    console.log('2. Implement <picture> tags for WebP with JPEG fallback')
    console.log('3. Add proper alt text for SEO')

  } catch (error) {
    console.error('Error during optimization:', error)
  }
}

// Run if called directly
if (require.main === module) {
  optimizeImages().catch(console.error)
}

export { optimizeImages }