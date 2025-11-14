import { Handler } from '@netlify/functions';

const GEMINI_API_KEY = process.env.GEMINI_FORM4;
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

interface HelpRequest {
  question: string;
  topic: string;
  userQuestion: string;
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
    const { question, topic, userQuestion }: HelpRequest = JSON.parse(event.body || '{}');

    // Build prompt
    const prompt = `You are a patient and encouraging IGCSE mathematics teacher helping a student understand a concept.

Topic: ${topic}
Question: ${question}

Student asks: "${userQuestion}"

Provide a clear, step-by-step explanation in British English. Be encouraging and break down complex concepts into simple terms.

Respond ONLY with valid JSON:
{
  "explanation": "Clear explanation of the concept (2-3 sentences)",
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "example": "A simple example to illustrate the concept (optional)"
}

Keep your language simple, encouraging, and appropriate for IGCSE students.`;

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
        error: 'Failed to get help',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
