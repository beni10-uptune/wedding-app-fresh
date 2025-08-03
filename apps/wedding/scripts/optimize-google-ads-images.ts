#!/usr/bin/env npx tsx

import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

interface OptimizationResult {
  file: string
  originalSize: number
  optimizedSize: number
  reduction: string
}

async function optimizeGoogleAdsImages() {
  console.log('🔧 Starting Google Ads image optimization...\n')

  const baseDir = join(process.cwd(), 'public', 'images', 'google-ads')
  const campaigns = ['discovery', 'performance-max', 'brand']
  const results: OptimizationResult[] = []

  // Process each campaign directory
  for (const campaign of campaigns) {
    const inputDir = join(baseDir, campaign)
    const outputDir = join(baseDir, campaign, 'optimized')
    
    try {
      const files = readdirSync(inputDir).filter(file => 
        ['.jpg', '.jpeg', '.png'].includes(extname(file).toLowerCase()) &&
        !file.includes('optimized')
      )

      if (files.length === 0) {
        console.log(`⚠️  No images found in ${campaign} directory`)
        continue
      }

      console.log(`\n📁 Processing ${campaign} campaign images...`)

      // Create optimized directory
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
      }

      for (const file of files) {
        const inputPath = join(inputDir, file)
        const outputPath = join(outputDir, file.replace(extname(file), '.jpg'))
        
        try {
          const stats = statSync(inputPath)
          const originalSize = stats.size

          // Optimize based on image dimensions
          const metadata = await sharp(inputPath).metadata()
          const isLargeImage = (metadata.width || 0) > 1500 || (metadata.height || 0) > 1500

          await sharp(inputPath)
            .jpeg({
              quality: isLargeImage ? 85 : 90, // Higher quality for smaller images
              progressive: true,
              mozjpeg: true,
            })
            .toFile(outputPath)

          const optimizedStats = statSync(outputPath)
          const optimizedSize = optimizedStats.size
          const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1)

          results.push({
            file: `${campaign}/${file}`,
            originalSize,
            optimizedSize,
            reduction: `${reduction}%`
          })

          console.log(`   ✅ ${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (-${reduction}%)`)
        } catch (error) {
          console.error(`   ❌ Error optimizing ${file}:`, error)
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${campaign} directory:`, error)
    }
  }

  // Generate summary report
  console.log('\n📊 Optimization Summary:')
  console.log('━'.repeat(80))
  
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0)
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0)
  const totalReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1)

  console.log(`Total files processed: ${results.length}`)
  console.log(`Total size before: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`)
  console.log(`Total size after: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`)
  console.log(`Total reduction: ${totalReduction}%`)

  console.log('\n✨ Optimization complete!')
  console.log('\n📝 Google Ads Image Requirements:')
  console.log('   - Maximum file size: 5MB per image')
  console.log('   - Recommended: Under 150KB for fast loading')
  console.log('   - Formats: JPG, PNG (JPG recommended)')
  console.log('   - Text on images: Max 20% of image area')
  console.log('\n🎯 Next steps:')
  console.log('1. Review optimized images for quality')
  console.log('2. Upload to Google Ads Asset Library')
  console.log('3. Create responsive ads with multiple assets')
  console.log('4. Monitor performance and iterate')
}

// Add missing import
import { existsSync, mkdirSync } from 'fs'

// Export for use in other scripts
export { optimizeGoogleAdsImages }