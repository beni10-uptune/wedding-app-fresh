#!/usr/bin/env npx tsx

import { aiplatform } from '@google-cloud/aiplatform'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import https from 'https'

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

// Helper function to download image from URL
async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks: Buffer[] = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    })
  })
}

async function generateBlogImagesWithVertexAI() {
  console.log('🎨 Starting genre blog image generation with Vertex AI...\n')

  const project = 'weddings-uptune-d12fa'
  const location = 'us-central1'
  const endpoint = 'projects/weddings-uptune-d12fa/locations/us-central1/publishers/google/models/imagen-3'

  // Initialize the client
  const { PredictionServiceClient } = aiplatform
  const predictionServiceClient = new PredictionServiceClient({
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
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
        endpoint: endpoint,
        instances: [
          {
            prompt: config.prompt,
            aspectRatio: config.aspectRatio,
            numberOfImages: 1,
            safetyFilterLevel: 'block_few',
            personGeneration: 'allow_adult',
          }
        ],
        parameters: {
          sampleCount: 1,
        }
      }

      const [response] = await predictionServiceClient.predict(request)
      
      if (response.predictions && response.predictions.length > 0) {
        for (let i = 0; i < response.predictions.length; i++) {
          const prediction = response.predictions[i]
          const predictionObj = prediction.structValue?.fields
          
          if (predictionObj?.bytesBase64Encoded?.stringValue) {
            const imageData = predictionObj.bytesBase64Encoded.stringValue
            const fileName = `${config.name}.jpg`
            const filePath = join(outputDir, fileName)
            
            // Convert base64 to buffer and save
            const buffer = Buffer.from(imageData, 'base64')
            writeFileSync(filePath, buffer)
            
            console.log(`   ✅ Saved: ${fileName} (${(buffer.length / 1024).toFixed(1)}KB)`)
          } else if (predictionObj?.gcsUri?.stringValue) {
            // If we get a GCS URI instead, we'd need to download it
            console.log('   ℹ️  Got GCS URI, would need to download...')
          }
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
  console.log('1. Review generated images')
  console.log('2. Run optimize script to compress images')
  console.log('3. Update blog post frontmatter with correct image paths')
}

// Run the script
generateBlogImagesWithVertexAI()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })