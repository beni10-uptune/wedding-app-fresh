#!/usr/bin/env npx tsx

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Image generation configurations for genre wedding blog posts
const imageConfigs = [
  {
    name: 'hip-hop-wedding-songs',
    prompt: 'Luxurious modern wedding reception venue with DJ booth and turntables, purple and gold lighting, contemporary ballroom design, urban chic decor, dance floor with dramatic lighting effects, high-end sound system, elegant floral arrangements, sophisticated hip hop inspired wedding atmosphere',
  },
  {
    name: 'country-wedding-songs',
    prompt: 'Rustic barn wedding venue interior, string lights creating warm ambiance, exposed wooden beams, acoustic guitars displayed, cowboy boots as decor, golden hour sunlight streaming through windows, hay bales with floral decorations, vintage country wedding atmosphere, mason jars with wildflowers',
  },
  {
    name: 'rnb-wedding-songs',
    prompt: 'Elegant wedding ballroom with live band stage setup, warm mood lighting, luxury crystal chandeliers, romantic atmosphere with rich purple and gold decor, grand piano on stage, sophisticated soul music venue design, candles and rose petals, intimate reception setting',
  },
  {
    name: 'rock-wedding-songs',
    prompt: 'Dynamic wedding reception venue with rock band stage setup, dramatic stage lighting effects, modern industrial chic interior, electric guitars and drum kit on stage, energetic atmosphere design, mix of edgy and elegant decor elements, concert-style lighting rigs',
  },
  {
    name: 'indie-wedding-songs',
    prompt: 'Bohemian outdoor wedding setup, fairy lights strung between trees, vintage-inspired decor elements, garden party atmosphere with acoustic instruments, mason jar lighting, wildflower arrangements in mismatched vases, whimsical indie wedding aesthetic, natural golden hour lighting',
  }
]

async function generateImagesViaREST() {
  console.log('🎨 Starting genre blog image generation via REST API...\n')

  const project = 'weddings-uptune-d12fa'
  const location = 'us-central1'
  
  // Get access token
  const { stdout: token } = await execAsync('gcloud auth application-default print-access-token')
  const accessToken = token.trim()
  
  // Create output directory
  const outputDir = join(process.cwd(), 'public', 'images', 'blog')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Try Imagen 2 endpoint
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/imagegeneration@002:predict`
  
  for (const config of imageConfigs) {
    try {
      console.log(`📸 Generating: ${config.name}`)
      console.log(`   Prompt: ${config.prompt.substring(0, 80)}...`)

      const requestBody = {
        instances: [
          {
            prompt: config.prompt,
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9",
          safetyFilterLevel: "block_some",
          personGeneration: "dont_allow"
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      
      if (data.predictions && data.predictions.length > 0) {
        for (let i = 0; i < data.predictions.length; i++) {
          const prediction = data.predictions[i]
          
          if (prediction.bytesBase64Encoded) {
            const fileName = `${config.name}.jpg`
            const filePath = join(outputDir, fileName)
            
            // Convert base64 to buffer and save
            const buffer = Buffer.from(prediction.bytesBase64Encoded, 'base64')
            writeFileSync(filePath, buffer)
            
            console.log(`   ✅ Saved: ${fileName} (${(buffer.length / 1024).toFixed(1)}KB)`)
          }
        }
      }
    } catch (error) {
      console.error(`   ❌ Error generating ${config.name}:`, error.message)
    }
    
    // Small delay between requests
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
generateImagesViaREST()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })