#!/usr/bin/env npx tsx

import { VertexAI } from '@google-cloud/vertexai'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Image generation configurations for genre wedding blog posts
const imageConfigs = [
  // Hip Hop Wedding Songs
  {
    name: 'hip-hop-wedding-songs',
    prompt: 'Professional wedding photography: Stylish diverse couple dancing at modern urban wedding reception, DJ booth with turntables visible, purple and gold lighting, contemporary ballroom, hip hop wedding celebration, guests dancing enthusiastically, authentic joyful moment, high-end production quality',
    aspectRatio: '16:9'
  },
  
  // Country Wedding Songs  
  {
    name: 'country-wedding-songs',
    prompt: 'Professional wedding photography: Romantic couple dancing in rustic barn wedding venue, string lights overhead, wooden beams, acoustic guitar player in background, boots and formal wear, warm golden hour lighting, authentic country wedding atmosphere, hay bales decorated with flowers',
    aspectRatio: '16:9'
  },
  
  // R&B Wedding Songs
  {
    name: 'rnb-wedding-songs',
    prompt: 'Professional wedding photography: Elegant couple slow dancing at sophisticated wedding reception, live soul band performing on stage, warm mood lighting, luxury ballroom with crystal chandeliers, romantic atmosphere, rich purple and gold decor, intimate moment captured',
    aspectRatio: '16:9'
  },
  
  // Rock Wedding Songs
  {
    name: 'rock-wedding-songs',
    prompt: 'Professional wedding photography: Energetic wedding reception with live rock band performing, couple and guests dancing enthusiastically, stage lighting effects, modern industrial chic venue, authentic celebration moment, mix of formal wear and rock style elements',
    aspectRatio: '16:9'
  },
  
  // Indie Wedding Songs
  {
    name: 'indie-wedding-songs',
    prompt: 'Professional wedding photography: Bohemian outdoor wedding celebration, acoustic performers under fairy lights, vintage-inspired decor, garden party atmosphere, couples dancing on grass, mason jar lighting, wildflower arrangements, authentic indie wedding aesthetic, golden hour natural lighting',
    aspectRatio: '16:9'
  }
]

async function generateGenreBlogImages() {
  console.log('🎨 Starting genre blog image generation with Imagen 3...\n')

  // Initialize Vertex AI
  const vertexAI = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id',
    location: 'us-central1',
  })

  const generativeModel = vertexAI.preview.getGenerativeModel({
    model: 'imagen-3',
  })

  // Create output directory
  const outputDir = join(process.cwd(), 'public', 'images', 'blog')
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
        number_of_images: 4, // Generate 4 variations for better selection
        aspect_ratio: config.aspectRatio || '16:9',
        safety_filter_level: 'block_few',
        person_generation: 'allow_all',
      }

      const response = await generativeModel.generateImages(request)
      
      if (response.images && response.images.length > 0) {
        // Save all variations for review
        for (let i = 0; i < response.images.length; i++) {
          const imageData = response.images[i]
          const fileName = i === 0 
            ? `${config.name}.jpg` 
            : `${config.name}-variant-${i}.jpg`
          const filePath = join(outputDir, fileName)
          
          // Convert base64 to buffer and save
          const buffer = Buffer.from(imageData, 'base64')
          writeFileSync(filePath, buffer)
          
          console.log(`   ✅ Saved: ${fileName} (${(buffer.length / 1024).toFixed(1)}KB)`)
        }
      }
    } catch (error) {
      console.error(`   ❌ Error generating ${config.name}:`, error)
    }
    
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  console.log('\n✨ Genre blog image generation complete!')
  console.log('📁 Images saved to:', outputDir)
  console.log('\nNext steps:')
  console.log('1. Review all variants and select the best one for each genre')
  console.log('2. Delete unused variants')
  console.log('3. Run optimize script to compress selected images')
  console.log('4. Update blog post frontmatter with correct image paths')
}

// Run the script
generateGenreBlogImages()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })

// Export for use in other scripts
export { generateGenreBlogImages }