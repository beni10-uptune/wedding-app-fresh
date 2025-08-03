#!/usr/bin/env npx tsx

async function testVertexAI() {
  console.log('Testing Vertex AI connection...')
  
  try {
    // Use dynamic import for ES modules
    const { VertexAI } = await import('@google-cloud/vertexai')
    
    const vertex_ai = new VertexAI({
      project: 'weddings-uptune-d12fa',
      location: 'us-central1',
    })

    // Get the generative model
    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: 'imagen-3',
    })

    console.log('Model initialized:', generativeModel)
    
    // Try the predict method instead
    const prompt = 'Professional wedding photography: Happy couple planning their wedding with a tablet'
    
    const request = {
      instances: [{
        prompt: prompt,
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1',
        safetyFilterLevel: 'block_few',
        personGeneration: 'allow_all',
      }
    }
    
    console.log('Making prediction request...')
    
    // The generateImages might be a custom method - let's check the model methods
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(generativeModel)))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testVertexAI()