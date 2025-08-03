#!/usr/bin/env npx tsx

import { GoogleAuth } from 'google-auth-library'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const PROJECT_ID = 'weddings-uptune-d12fa'
const LOCATION = 'us-central1'
const MODEL = 'imagen-3.0-generate-002'  // Imagen 3 model

interface ImageConfig {
  name: string
  prompt: string
  aspectRatio?: string
  campaign: string
}

const imageConfigs: ImageConfig[] = [
  // Just a few test images
  {
    name: 'wedding-couple-planning',
    prompt: 'Professional wedding photography: Stylish young couple sitting together with laptop planning their wedding, bright modern apartment, natural daylight, authentic happy moment',
    aspectRatio: '1:1',
    campaign: 'test'
  },
  {
    name: 'wedding-first-dance',
    prompt: 'Professional wedding photography: Romantic first dance moment, bride and groom in spotlight, elegant ballroom setting, warm golden lighting',
    aspectRatio: '1:1', 
    campaign: 'test'
  }
]

async function generateImagesSimple() {
  console.log('🎨 Starting image generation...\n')

  // Create output directory
  const outputDir = join(process.cwd(), 'public', 'images', 'google-ads', 'test')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  try {
    // Get authentication
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })
    
    const client = await auth.getClient()
    const accessToken = await client.getAccessToken()
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token')
    }

    console.log('✅ Authenticated successfully\n')

    // Generate each image
    for (const config of imageConfigs) {
      try {
        console.log(`📸 Generating: ${config.name}`)
        
        // Prepare the request
        const apiEndpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`
        
        const requestBody = {
          instances: [{
            prompt: config.prompt
          }],
          parameters: {
            sampleCount: 1,
            aspectRatio: config.aspectRatio || '1:1'
          }
        }

        // Make the API request
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`API Error: ${response.status} - ${error}`)
        }

        const result = await response.json()
        console.log('API Response:', JSON.stringify(result, null, 2))

        // Check if we have predictions with images
        if (result.predictions && result.predictions.length > 0) {
          const prediction = result.predictions[0]
          
          // The response format might vary - check different possible fields
          const imageData = prediction.bytesBase64Encoded || 
                           prediction.image || 
                           prediction.imageBytes ||
                           prediction.images?.[0]

          if (imageData) {
            const fileName = `${config.name}.jpg`
            const filePath = join(outputDir, fileName)
            
            // Convert base64 to buffer and save
            const buffer = Buffer.from(imageData, 'base64')
            writeFileSync(filePath, buffer)
            
            console.log(`   ✅ Saved: ${fileName}`)
            console.log(`   📏 Size: ${(buffer.length / 1024).toFixed(1)}KB`)
          } else {
            console.log('   ⚠️  No image data in response')
            console.log('   Response structure:', Object.keys(prediction))
          }
        } else {
          console.log('   ⚠️  No predictions in response')
        }

      } catch (error) {
        console.error(`   ❌ Error generating ${config.name}:`, error)
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log('\n✨ Generation complete!')
    console.log('📁 Images saved to:', outputDir)

  } catch (error) {
    console.error('Fatal error:', error)
  }
}

// Run the generation
generateImagesSimple().catch(console.error)