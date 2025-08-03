#!/usr/bin/env npx tsx

import { VertexAI } from '@google-cloud/vertexai'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Image generation configurations for landing pages
const imageConfigs = [
  // US Market Pages
  {
    name: 'wedding-playlist-maker-hero',
    prompt: 'Professional wedding photography: Young diverse couple using a tablet together, planning their wedding music playlist, soft romantic lighting, modern minimalist setting, shallow depth of field, warm color tones, authentic candid moment, high-end wedding planning atmosphere',
    aspectRatio: '16:9'
  },
  {
    name: 'wedding-music-checklist-guide',
    prompt: 'Professional wedding photography: Elegant wedding planner notebook with music notes, checklist items, golden pen, soft flowers in background, overhead flat lay style, bright natural lighting, organized and sophisticated, luxury wedding planning aesthetic',
    aspectRatio: '16:9'
  },
  {
    name: 'wedding-ceremony-music-order',
    prompt: 'Professional wedding photography: Beautiful outdoor wedding ceremony setup with string quartet performing, golden hour lighting, guests seated in white chairs, romantic garden venue, professional musicians in formal attire, emotional atmosphere',
    aspectRatio: '16:9'
  },
  {
    name: 'wedding-music-app-hero',
    prompt: 'Professional wedding photography: Happy couple dancing at their wedding reception, DJ setup visible in background, colorful dance floor lighting, joyful celebration moment, guests dancing around them, modern elegant ballroom, dynamic movement captured',
    aspectRatio: '16:9'
  },
  
  // UK Market Pages
  {
    name: 'wedding-band-cost-uk-guide',
    prompt: 'Professional wedding photography: Live wedding band performing at elegant UK manor house reception, chandeliers and classic architecture visible, guests enjoying the music, sophisticated British wedding atmosphere, warm indoor lighting',
    aspectRatio: '16:9'
  },
  {
    name: 'wedding-dj-cost-uk-guide',
    prompt: 'Professional wedding photography: Professional DJ at modern UK wedding venue, impressive lighting setup, packed dance floor, contemporary British wedding reception, dynamic party atmosphere, high-end equipment visible',
    aspectRatio: '16:9'
  }
]

async function generateImages() {
  console.log('🎨 Starting image generation with Imagen 3...\n')

  // Initialize Vertex AI
  const vertexAI = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id',
    location: 'us-central1',
  })

  const generativeModel = vertexAI.preview.getGenerativeModel({
    model: 'imagen-3',
  })

  // Create output directory
  const outputDir = join(process.cwd(), 'public', 'images', 'lp')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Generate each image
  for (const config of imageConfigs) {
    try {
      console.log(`📸 Generating: ${config.name}`)
      console.log(`   Prompt: ${config.prompt.substring(0, 80)}...`)

      const request = {
        prompt: config.prompt,
        number_of_images: 3, // Generate 3 variations
        aspect_ratio: config.aspectRatio || '16:9',
        safety_filter_level: 'block_few',
        person_generation: 'allow_all',
      }

      const response = await generativeModel.generateImages(request)
      
      if (response.images && response.images.length > 0) {
        // Save the best image (first one)
        const imageData = response.images[0]
        const fileName = `${config.name}.jpg`
        const filePath = join(outputDir, fileName)
        
        // Convert base64 to buffer and save
        const buffer = Buffer.from(imageData, 'base64')
        writeFileSync(filePath, buffer)
        
        console.log(`   ✅ Saved: ${fileName}`)
        console.log(`   📏 Size: ${(buffer.length / 1024).toFixed(1)}KB`)
        
        // Save other variations for review
        for (let i = 1; i < response.images.length; i++) {
          const variantPath = join(outputDir, `${config.name}-variant-${i}.jpg`)
          writeFileSync(variantPath, Buffer.from(response.images[i], 'base64'))
        }
      }
    } catch (error) {
      console.error(`   ❌ Error generating ${config.name}:`, error)
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log('\n✨ Image generation complete!')
  console.log('📁 Images saved to:', outputDir)
  console.log('\nNext steps:')
  console.log('1. Review generated images and select the best ones')
  console.log('2. Run optimize-blog-images.ts to compress for web')
  console.log('3. Update landing pages with optimized images')
}

// Export for use in other scripts
export { generateImages }

// Run the script if called directly
if (require.main === module) {
  generateImages()
    .then(() => {
      console.log('\n✅ Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}