#!/usr/bin/env npx tsx

import { VertexAI } from '@google-cloud/vertexai'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Google Ads image specifications for Performance Max and Discovery
const campaignImageConfigs = [
  // Square Images (1:1) - 1200x1200, used in Discovery and Performance Max
  {
    name: 'uptune-wedding-square-1-couple-planning',
    prompt: 'Professional wedding photography: Stylish young couple sitting together with laptop and smartphone, planning their wedding playlist, modern bright apartment, natural daylight, authentic happy moment, lifestyle photography style, soft pastel colors, minimalist aesthetic',
    aspectRatio: '1:1',
    campaign: 'discovery'
  },
  {
    name: 'uptune-wedding-square-2-dj-party',
    prompt: 'Professional wedding photography: Packed dance floor at elegant wedding reception, DJ performing with modern equipment, colorful uplighting, happy guests dancing, bokeh lights in background, dynamic party atmosphere, high-energy celebration moment',
    aspectRatio: '1:1',
    campaign: 'performance-max'
  },
  {
    name: 'uptune-wedding-square-3-first-dance',
    prompt: 'Professional wedding photography: Romantic first dance moment, bride and groom in spotlight, guests watching in soft background blur, elegant ballroom setting, warm golden lighting, emotional intimate moment, professional wedding venue',
    aspectRatio: '1:1',
    campaign: 'discovery'
  },
  {
    name: 'uptune-wedding-square-4-music-planning',
    prompt: 'Professional wedding photography: Wedding planner showing tablet with music app to engaged couple, bright modern cafe setting, coffee and planning materials on table, friendly consultation atmosphere, natural lighting, diverse group',
    aspectRatio: '1:1',
    campaign: 'performance-max'
  },

  // Landscape Images (1.91:1) - 1200x628, used in Discovery and Performance Max
  {
    name: 'uptune-wedding-landscape-1-celebration',
    prompt: 'Professional wedding photography: Wide shot of outdoor wedding reception, live band performing on stage, string lights overhead, guests at round tables, golden hour lighting, luxury garden venue, joyful celebration atmosphere',
    aspectRatio: '1.91:1',
    campaign: 'discovery'
  },
  {
    name: 'uptune-wedding-landscape-2-app-demo',
    prompt: 'Professional wedding photography: Close-up of hands holding smartphone showing music playlist app, wedding rings visible, soft blurred wedding decorations in background, modern tech meets romance, bright and clean aesthetic',
    aspectRatio: '1.91:1',
    campaign: 'performance-max'
  },
  {
    name: 'uptune-wedding-landscape-3-uk-venue',
    prompt: 'Professional wedding photography: Elegant British manor house wedding, string quartet performing in grand hall, chandelier lighting, sophisticated UK wedding atmosphere, guests in formal attire, classic luxury setting',
    aspectRatio: '1.91:1',
    campaign: 'discovery'
  },
  {
    name: 'uptune-wedding-landscape-4-beach-wedding',
    prompt: 'Professional wedding photography: Beach wedding ceremony at sunset, acoustic guitarist performing, ocean backdrop, romantic destination wedding, barefoot elegance, golden hour lighting, intimate coastal celebration',
    aspectRatio: '1.91:1',
    campaign: 'performance-max'
  },

  // Portrait Images (4:5) - 1200x1500, great for Discovery campaigns
  {
    name: 'uptune-wedding-portrait-1-bride-prep',
    prompt: 'Professional wedding photography: Bride getting ready with bridesmaids, choosing music on tablet, champagne glasses, bright bridal suite, joyful preparation moments, soft natural lighting, lifestyle wedding photography',
    aspectRatio: '4:5',
    campaign: 'discovery'
  },
  {
    name: 'uptune-wedding-portrait-2-groom-party',
    prompt: 'Professional wedding photography: Groom and groomsmen in modern suits, reviewing wedding playlist on phone, stylish hotel room, masculine elegant setting, candid laughing moment, contemporary wedding style',
    aspectRatio: '4:5',
    campaign: 'discovery'
  },
  {
    name: 'uptune-wedding-portrait-3-dance-floor',
    prompt: 'Professional wedding photography: Vertical shot of crowded dance floor from above, DJ booth at top, colorful lighting effects, guests dancing with hands up, celebration energy, modern wedding reception',
    aspectRatio: '4:5',
    campaign: 'performance-max'
  },

  // Wide Landscape (16:9) - 1920x1080, for YouTube and display ads
  {
    name: 'uptune-wedding-wide-1-venue-overview',
    prompt: 'Professional wedding photography: Panoramic view of luxury wedding reception, multiple entertainment areas visible, live band and DJ setup, elegant decor, hundreds of guests, grand ballroom, sophisticated lighting design',
    aspectRatio: '16:9',
    campaign: 'performance-max'
  },
  {
    name: 'uptune-wedding-wide-2-tech-planning',
    prompt: 'Professional wedding photography: Modern couple at home planning wedding, multiple devices showing music app, cozy living room setting, collaborative planning moment, warm domestic atmosphere, lifestyle photography',
    aspectRatio: '16:9',
    campaign: 'discovery'
  },

  // Logo/Icon variations (1:1) - for smaller placements
  {
    name: 'uptune-icon-music-heart',
    prompt: 'Minimalist design: Elegant music note forming heart shape, gradient from purple to pink, white background, modern logo style, clean vector aesthetic, wedding music app branding, professional and romantic',
    aspectRatio: '1:1',
    campaign: 'brand'
  }
]

async function generateGoogleAdsImages() {
  console.log('🎨 Starting Google Ads image generation with Imagen 3...\n')
  console.log('📊 Generating images for Performance Max and Discovery campaigns\n')

  // Initialize Vertex AI
  // You need to set GOOGLE_CLOUD_PROJECT environment variable or update this
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'weddings-uptune-d12fa'
  
  console.log(`🔧 Using Google Cloud Project: ${projectId}\n`)
  
  const vertexAI = new VertexAI({
    project: projectId,
    location: 'us-central1',
  })

  const generativeModel = vertexAI.preview.getGenerativeModel({
    model: 'imagen-3',
  })

  // Create output directory
  const outputDir = join(process.cwd(), 'public', 'images', 'google-ads')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Create subdirectories for each campaign type
  const campaignDirs = ['discovery', 'performance-max', 'brand']
  campaignDirs.forEach(campaign => {
    const dir = join(outputDir, campaign)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  })

  // Track generated images by type
  const generatedImages = {
    square: [],
    landscape: [],
    portrait: [],
    wide: [],
    brand: []
  }

  // Generate each image
  for (const config of campaignImageConfigs) {
    try {
      console.log(`📸 Generating: ${config.name}`)
      console.log(`   Campaign: ${config.campaign}`)
      console.log(`   Aspect Ratio: ${config.aspectRatio}`)
      console.log(`   Prompt: ${config.prompt.substring(0, 80)}...`)

      const request = {
        prompt: config.prompt,
        number_of_images: 4, // Generate 4 variations for A/B testing
        aspect_ratio: config.aspectRatio,
        safety_filter_level: 'block_few',
        person_generation: 'allow_all',
      }

      const response = await generativeModel.generateImages(request)
      
      if (response.images && response.images.length > 0) {
        // Save all variations
        for (let i = 0; i < response.images.length; i++) {
          const imageData = response.images[i]
          const fileName = i === 0 
            ? `${config.name}.jpg`
            : `${config.name}-v${i + 1}.jpg`
          const filePath = join(outputDir, config.campaign, fileName)
          
          // Convert base64 to buffer and save
          const buffer = Buffer.from(imageData, 'base64')
          writeFileSync(filePath, buffer)
          
          if (i === 0) {
            console.log(`   ✅ Saved: ${fileName}`)
            console.log(`   📏 Size: ${(buffer.length / 1024).toFixed(1)}KB`)
            
            // Track image type
            if (config.aspectRatio === '1:1' && !config.name.includes('icon')) {
              generatedImages.square.push(fileName)
            } else if (config.aspectRatio === '1.91:1') {
              generatedImages.landscape.push(fileName)
            } else if (config.aspectRatio === '4:5') {
              generatedImages.portrait.push(fileName)
            } else if (config.aspectRatio === '16:9') {
              generatedImages.wide.push(fileName)
            } else if (config.name.includes('icon')) {
              generatedImages.brand.push(fileName)
            }
          }
        }
        console.log(`   📦 Generated ${response.images.length} variations`)
      }
    } catch (error) {
      console.error(`   ❌ Error generating ${config.name}:`, error)
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Create a summary file
  const summaryPath = join(outputDir, 'image-summary.json')
  writeFileSync(summaryPath, JSON.stringify({
    generated: new Date().toISOString(),
    images: generatedImages,
    specs: {
      square: '1200x1200 (1:1)',
      landscape: '1200x628 (1.91:1)',
      portrait: '1200x1500 (4:5)',
      wide: '1920x1080 (16:9)',
      icon: '1200x1200 (1:1)'
    },
    usage: {
      'Performance Max': 'Use all sizes for maximum reach',
      'Discovery': 'Square and landscape work best',
      'Display': 'All sizes supported',
      'YouTube': 'Wide (16:9) format recommended'
    }
  }, null, 2))

  console.log('\n✨ Google Ads image generation complete!')
  console.log('📁 Images saved to:', outputDir)
  console.log('\n📊 Generated images by type:')
  console.log(`   Square (1:1): ${generatedImages.square.length} images`)
  console.log(`   Landscape (1.91:1): ${generatedImages.landscape.length} images`)
  console.log(`   Portrait (4:5): ${generatedImages.portrait.length} images`)
  console.log(`   Wide (16:9): ${generatedImages.wide.length} images`)
  console.log(`   Brand/Icon: ${generatedImages.brand.length} images`)
  console.log('\n🎯 Next steps:')
  console.log('1. Review all variations and select the best performing ones')
  console.log('2. Run optimize-google-ads-images.ts to compress for web')
  console.log('3. Upload to Google Ads Asset Library')
  console.log('4. Create responsive display ads with multiple size combinations')
  console.log('5. A/B test different variations in your campaigns')
}

// Run the generation
generateGoogleAdsImages().catch(console.error)