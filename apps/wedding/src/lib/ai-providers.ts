/**
 * AI Provider Integration
 * Supports multiple AI providers: Gemini, OpenRouter
 */

interface AIResponse {
  message: string;
  suggestions?: string[];
  songs?: any[];
  context?: any;
}

interface AIProvider {
  name: string;
  generateResponse: (prompt: string, context?: any) => Promise<AIResponse>;
}

/**
 * Gemini AI Provider
 */
class GeminiProvider implements AIProvider {
  name = 'gemini';
  private apiKey: string;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not configured');
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are DJ Harmony, an AI wedding music assistant. You help couples create perfect wedding playlists.
              
Context: ${JSON.stringify(context || {})}

User Query: ${prompt}

Provide a helpful, friendly response. If suggesting songs, include specific recommendations. Format your response as JSON with these fields:
- message: Your main response (string)
- suggestions: Optional array of follow-up suggestions (string[])
- songs: Optional array of song recommendations with title, artist, and why it's perfect for weddings`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Try to parse as JSON, fallback to simple response
      try {
        const parsed = JSON.parse(text);
        return {
          message: parsed.message || text,
          suggestions: parsed.suggestions,
          songs: parsed.songs
        };
      } catch {
        return {
          message: text,
          suggestions: [
            "Tell me about your wedding style",
            "What moments need music?",
            "Show me your favorite artists"
          ]
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

/**
 * OpenRouter Provider (supports multiple models)
 */
class OpenRouterProvider implements AIProvider {
  name = 'openrouter';
  private apiKey: string;
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.OPEN_ROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenRouter API key not configured');
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://weddings.uptune.xyz',
          'X-Title': 'Uptune Wedding App'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free', // Free tier model
          messages: [
            {
              role: 'system',
              content: `You are DJ Harmony, an AI wedding music assistant. You help couples create perfect wedding playlists. Be friendly, helpful, and knowledgeable about wedding music trends.`
            },
            {
              role: 'user',
              content: `Context: ${JSON.stringify(context || {})}
              
User Query: ${prompt}

Provide a helpful response. If suggesting songs, be specific. Format as JSON with:
- message: Your response
- suggestions: Follow-up suggestions (optional)
- songs: Song recommendations (optional)`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      try {
        const parsed = JSON.parse(content);
        return {
          message: parsed.message || content,
          suggestions: parsed.suggestions,
          songs: parsed.songs
        };
      } catch {
        return {
          message: content,
          suggestions: [
            "Browse wedding moments",
            "Search for songs",
            "Get AI recommendations"
          ]
        };
      }
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }
}

/**
 * AI Service Manager
 */
export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private activeProvider: string = 'gemini';

  constructor() {
    // Initialize providers
    if (process.env.GEMINI_API_KEY) {
      this.providers.set('gemini', new GeminiProvider());
    }
    if (process.env.OPEN_ROUTER_API_KEY) {
      this.providers.set('openrouter', new OpenRouterProvider());
    }

    // Fallback to OpenRouter if Gemini not available
    if (!this.providers.has('gemini') && this.providers.has('openrouter')) {
      this.activeProvider = 'openrouter';
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<AIResponse> {
    const provider = this.providers.get(this.activeProvider);
    
    if (!provider) {
      // Fallback to pattern-based responses if no AI provider available
      return this.getFallbackResponse(prompt, context);
    }

    try {
      return await provider.generateResponse(prompt, context);
    } catch (error) {
      console.error(`${this.activeProvider} failed, using fallback:`, error);
      return this.getFallbackResponse(prompt, context);
    }
  }

  private getFallbackResponse(prompt: string, context?: any): AIResponse {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('first dance')) {
      return {
        message: "First dance songs are so special! I recommend romantic classics like 'At Last' by Etta James, modern hits like 'Perfect' by Ed Sheeran, or something unique to your story.",
        suggestions: [
          "Show me classic romantic songs",
          "I want modern love songs",
          "Suggest something unique"
        ]
      };
    }
    
    if (lowerPrompt.includes('party') || lowerPrompt.includes('dance')) {
      return {
        message: "Let's get the party started! For a great dance floor, mix current hits, classic crowd-pleasers, and songs that span generations.",
        suggestions: [
          "Current chart toppers",
          "Wedding party classics",
          "Songs everyone knows"
        ]
      };
    }
    
    return {
      message: "I'm here to help you create the perfect wedding playlist! Tell me about your wedding style, preferred genres, or specific moments you need music for.",
      suggestions: [
        "Help me plan my timeline",
        "Suggest first dance songs",
        "I need party music",
        "Browse by genre"
      ]
    };
  }

  setProvider(providerName: string) {
    if (this.providers.has(providerName)) {
      this.activeProvider = providerName;
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Export singleton instance
export const aiService = new AIService();