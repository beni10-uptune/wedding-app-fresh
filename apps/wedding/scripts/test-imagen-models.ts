#!/usr/bin/env npx tsx

import { VertexAI } from '@google-cloud/vertexai'

async function testImagenModels() {
  console.log('🔍 Testing available Imagen models...\n')

  const modelNames = [
    'imagen-3',
    'imagegeneration',
    'imagegeneration@002',
    'imagegeneration@003',
    'imagegeneration@005',
    'imagegeneration@006',
    'imagen-2',
    'imagen',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ]

  try {
    const vertexAI = new VertexAI({
      project: 'weddings-uptune-d12fa',
      location: 'us-central1',
    })

    for (const modelName of modelNames) {
      try {
        console.log(`\n📌 Testing model: ${modelName}`)
        
        const model = vertexAI.preview.getGenerativeModel({
          model: modelName,
        })
        
        // Try a simple text generation to see if model exists
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{
              text: 'Hello, just testing the connection'
            }]
          }]
        })
        
        const response = await result.response
        console.log(`✅ ${modelName} - Connected successfully`)
        
        // Check if it's an image model
        if (modelName.includes('image') || modelName.includes('imagen')) {
          console.log(`   ℹ️  This appears to be an image model`)
        }
        
      } catch (e) {
        console.log(`❌ ${modelName} - ${e.message.split('.')[0]}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
  }
}

testImagenModels()