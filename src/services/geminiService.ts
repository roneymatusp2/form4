/**
 * Gemini AI Service for evaluating student answers and providing help
 * Uses Netlify Functions to keep API key secure
 */

export interface EvaluationResult {
  isCorrect: boolean;
  confidence: number; // 0-1
  feedback: string;
  suggestions?: string[];
}

export interface HelpResponse {
  explanation: string;
  steps?: string[];
  example?: string;
}

/**
 * Gemini Provider for answer evaluation and help
 */
export class GeminiService {
  private useNetlifyFunctions: boolean;

  constructor() {
    // Check if we're in production (Netlify) or development
    this.useNetlifyFunctions = import.meta.env.PROD || window.location.hostname !== 'localhost';
  }

  /**
   * Check if Gemini is available
   */
  isAvailable(): boolean {
    // In production, always available (uses Netlify Functions)
    // In development, check for API key
    if (this.useNetlifyFunctions) {
      return true;
    }
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  /**
   * Get help for a specific question
   */
  async getHelp(question: string, topic: string, userQuestion: string): Promise<HelpResponse> {
    if (this.useNetlifyFunctions) {
      // Use Netlify Function
      const response = await fetch('/.netlify/functions/gemini-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          topic,
          userQuestion
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get help');
      }

      return await response.json();
    } else {
      // Development mode - call API directly
      return await this.getHelpDirect(question, topic, userQuestion);
    }
  }

  /**
   * Evaluate a student's answer using Gemini AI
   */
  async evaluateAnswer(
    userAnswer: string,
    correctAnswer: string | number,
    question: string,
    hint?: string
  ): Promise<EvaluationResult> {
    if (this.useNetlifyFunctions) {
      // Use Netlify Function
      const response = await fetch('/.netlify/functions/gemini-evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer,
          correctAnswer,
          question,
          hint
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to evaluate answer');
      }

      return await response.json();
    } else {
      // Development mode - call API directly
      return await this.evaluateAnswerDirect(userAnswer, correctAnswer, question, hint);
    }
  }

  /**
   * Direct API call for development (uses VITE_GEMINI_API_KEY)
   */
  private async getHelpDirect(question: string, topic: string, userQuestion: string): Promise<HelpResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `You are a patient and encouraging GCSE mathematics teacher helping a student understand a concept.

Topic: ${topic}
Question: ${question}

Student asks: "${userQuestion}"

Provide a clear, step-by-step explanation in British English. Be encouraging and break down complex concepts into simple terms.

Respond ONLY with valid JSON in this exact format:
{
  "explanation": "Clear explanation of the concept (2-3 sentences)",
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "example": "A simple example to illustrate the concept (optional)"
}

Keep your language simple, encouraging, and appropriate for GCSE students.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  }

  /**
   * Direct API call for development (uses VITE_GEMINI_API_KEY)
   */
  private async evaluateAnswerDirect(
    userAnswer: string,
    correctAnswer: string | number,
    question: string,
    hint?: string
  ): Promise<EvaluationResult> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `You are a patient and encouraging GCSE mathematics teacher evaluating a student's answer.

Question: ${question}
${hint ? `Hint: ${hint}` : ''}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Evaluate if the student's answer is correct. Be VERY flexible and consider:

1. NUMBERS - Accept both numeric and written forms
2. MATHEMATICAL EXPRESSIONS - Accept equivalent forms
3. FRACTIONS - Accept equivalent forms
4. UNITS - Accept variations
5. ROUNDING - Accept if within tolerance
6. FORMATTING - Accept different presentations

IMPORTANT: Use British English spelling and terminology.

Respond ONLY with valid JSON in this exact format:
{
  "isCorrect": true or false,
  "confidence": 0.95,
  "feedback": "Brief, encouraging feedback in British English (1-2 sentences)",
  "suggestions": ["specific suggestion 1", "specific suggestion 2"]
}

If correct, keep feedback positive and brief. If incorrect, provide helpful, specific suggestions.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 1,
            maxOutputTokens: 512,
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanText);

    return {
      isCorrect: result.isCorrect,
      confidence: result.confidence || 0.9,
      feedback: result.feedback,
      suggestions: result.suggestions || []
    };
  }
}

// Singleton instance
export const geminiService = new GeminiService();
