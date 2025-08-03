#!/usr/bin/env npx tsx

import { VertexAI } from '@google-cloud/vertexai'

async function testImagen() {
  console.log('Testing Imagen 3 connection...\n')

  const projectId = 'weddings-uptune-d12fa'
  console.log('Project ID:', projectId)

  try {
    const vertexAI = new VertexAI({
      project: projectId,
      location: 'us-central1',
    })

    console.log('VertexAI initialized')

    // Try different ways to access the model
    const model1 = vertexAI.preview.getGenerativeModel({
      model: 'imagen-3',
    })
    console.log('Model 1 (preview):', model1)

    // Check if generateImages exists
    console.log('generateImages method exists?', typeof model1.generateImages)

    // Try generating content instead
    if (typeof model1.generateContent === 'function') {
      console.log('generateContent method exists')
      
      const result = await model1.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: 'Generate an image of a wedding couple'
          }]
        }]
      })
      
      console.log('Result:', result)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

testImagen().catch(console.error)