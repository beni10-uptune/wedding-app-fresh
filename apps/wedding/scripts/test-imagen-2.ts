#!/usr/bin/env npx tsx

import { VertexAI } from '@google-cloud/vertexai'

async function testImagen2() {
  console.log('Testing Imagen model...\n')

  const projectId = 'weddings-uptune-d12fa'
  console.log('Project ID:', projectId)

  try {
    const vertexAI = new VertexAI({
      project: projectId,
      location: 'us-central1',
    })

    // Try imagen-2 or imagegeneration model
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',  // Test with a known working model first
    })
    
    console.log('Testing with Gemini model first...')
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: 'Hello, just testing the connection'
        }]
      }]
    })
    
    const response = await result.response
    console.log('Gemini test response:', response.candidates?.[0]?.content?.parts?.[0]?.text)
    
    // Now let's try to find the correct image generation endpoint
    console.log('\nChecking for image generation models...')
    
    // Try the prediction API for Imagen
    const imagenModel = vertexAI.preview.getGenerativeModel({
      model: 'imagegeneration@006',  // Try this model name
    })
    
    console.log('Imagen model:', imagenModel)

  } catch (error) {
    console.error('Error:', error)
  }
}

testImagen2().catch(console.error)