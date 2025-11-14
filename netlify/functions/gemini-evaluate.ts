import { Handler } from '@netlify/functions';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

interface EvaluateRequest {
  userAnswer: string;
  correctAnswer: string | number;
  question: string;
  hint?: string;
}

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check if API key is configured
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gemini API key not configured' })
    };
  }

  try {
    const { userAnswer, correctAnswer, question, hint }: EvaluateRequest = JSON.parse(event.body || '{}');

    // Build prompt
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

Respond ONLY with valid JSON:
{
  "isCorrect": true or false,
  "confidence": 0.95,
  "feedback": "Brief, encouraging feedback (1-2 sentences)",
  "suggestions": ["specific suggestion 1", "specific suggestion 2"]
}`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
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
    
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanText);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to evaluate answer',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
