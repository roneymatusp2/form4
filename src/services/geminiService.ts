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
    hint?: string,
    imageBase64?: string
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
          hint,
          imageBase64
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to evaluate answer');
      }

      return await response.json();
    } else {
      // Development mode - call API directly
      return await this.evaluateAnswerDirect(userAnswer, correctAnswer, question, hint, imageBase64);
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

    const prompt = `You are a patient and encouraging IGCSE mathematics teacher helping a student understand a concept.

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

Keep your language simple, encouraging, and appropriate for IGCSE students.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
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
    
    // Remove markdown code blocks more aggressively
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```json\s*/i, '');
    cleanText = cleanText.replace(/^```\s*/i, '');
    cleanText = cleanText.replace(/\s*```$/i, '');
    cleanText = cleanText.trim();
    
    return JSON.parse(cleanText);
  }

  /**
   * Direct API call for development (uses VITE_GEMINI_API_KEY)
   */
  private async evaluateAnswerDirect(
    userAnswer: string,
    correctAnswer: string | number,
    question: string,
    hint?: string,
    imageBase64?: string
  ): Promise<EvaluationResult> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const promptText = imageBase64
      ? `You are a patient and encouraging IGCSE mathematics teacher with exceptional mathematical ability.

Question: ${question}
${hint ? `Hint: ${hint}` : ''}
Reference Answer (may be incorrect): ${correctAnswer}

The student has submitted a PHOTO/IMAGE of their handwritten answer (see image).
${userAnswer ? `They also typed: "${userAnswer}"` : ''}

IMPORTANT INSTRUCTIONS:
1. FIRST: Carefully read and interpret the handwritten answer in the image
2. Accept handwriting, sketches, diagrams, workings, rabiscos (scribbles)
3. Calculate the correct answer yourself using your mathematical knowledge
4. IGNORE the reference answer if it's wrong - trust YOUR calculation
5. Compare the student's answer (from image and/or text) with YOUR calculated answer
6. Be EXTREMELY flexible:
   - Accept messy handwriting, crossed-out work, arrows, annotations
   - Accept partial work that shows correct understanding
   - Accept diagrams, sketches, visual representations
   - Accept work in progress if final answer is correct
   - Natural language, symbols, abbreviations - all acceptable

CRITICAL: Respond with ONLY valid JSON. No markdown, no code blocks.

{
  "isCorrect": boolean,
  "confidence": number,
  "feedback": "Encouraging feedback in British English",
  "suggestions": []
}`
      : `You are a patient and encouraging IGCSE mathematics teacher with exceptional mathematical ability.

Question: ${question}
${hint ? `Hint: ${hint}` : ''}
Reference Answer (may be incorrect): ${correctAnswer}
Student's Answer: ${userAnswer}

IMPORTANT INSTRUCTIONS:
1. FIRST: Calculate the correct answer yourself using your mathematical knowledge
2. IGNORE the reference answer if it's wrong - trust YOUR calculation
3. Compare the student's answer with YOUR calculated answer
4. Be EXTREMELY flexible accepting answers:
   - Natural language: "eighteen point three two", "about 18", "roughly 18.3"
   - Written formats: "8.37", "8.372981", "8.4" (all correct if close)
   - Expressions: "4 ± √21", "4 + sqrt(21)", "4 plus or minus square root of 21"
   - Fractions: "3/4", "0.75", "three quarters", "75%"
   - Multiple values: "7, -4" = "7 and -4" = "x=7 or x=-4"
   - Approximations: Accept if mathematically reasonable

5. For calculator questions: Accept answers with ANY number of decimal places if mathematically correct
6. For rounding: Be flexible with ±1 in the last significant figure

CRITICAL: Respond with ONLY valid JSON. No markdown, no code blocks.

{
  "isCorrect": boolean,
  "confidence": number,
  "feedback": "Encouraging feedback in British English",
  "suggestions": []
}`;

    // Build content parts (text + optional image)
    const parts: any[] = [{
      text: promptText
    }];

    // Add image if provided
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: base64Data
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: parts
          }],
          generationConfig: {
            temperature: 0,
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
    
    console.log('Gemini raw response:', text);
    
    // Remove markdown code blocks more aggressively
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```json\s*/i, '');
    cleanText = cleanText.replace(/^```\s*/i, '');
    cleanText = cleanText.replace(/\s*```$/i, '');
    cleanText = cleanText.trim();
    
    console.log('Cleaned text:', cleanText);
    
    try {
      const result = JSON.parse(cleanText);
      
      console.log('Parsed result:', result);
      
      return {
        isCorrect: result.isCorrect,
        confidence: result.confidence || 0.9,
        feedback: result.feedback,
        suggestions: result.suggestions || []
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanText, parseError);
      throw new Error('Failed to parse AI response');
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService();
