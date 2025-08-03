#!/usr/bin/env npx tsx

import { VertexAI } from '@google-cloud/vertexai'

async function testImagenAPI() {
  console.log('🔍 Testing Imagen API connection...\n')

  try {
    const vertexAI = new VertexAI({
      project: 'weddings-uptune-d12fa',
      location: 'us-central1',
    })

    console.log('✅ VertexAI initialized')
    
    // List available methods on the model
    const model = vertexAI.preview.getGenerativeModel({
      model: 'imagen-3',
    })
    
    console.log('✅ Model created:', model.constructor.name)
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(model)))
    
    // Try different generation approaches
    console.log('\n🎨 Attempting image generation...')
    
    // Approach 1: Try generateContent with image generation prompt
    try {
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: 'Generate an image of a beautiful sunset over the ocean'
          }]
        }]
      })
      
      console.log('generateContent result:', result)
    } catch (e) {
      console.log('❌ generateContent failed:', e.message)
    }
    
    // Check if there's a different method for images
    if ('generateImages' in model) {
      console.log('✅ generateImages method exists!')
    } else {
      console.log('❌ generateImages method not found')
    }
    
    // Try to access the preview API differently
    console.log('\n🔍 Checking preview API...')
    console.log('Preview methods:', Object.keys(vertexAI.preview))
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testImagenAPI()