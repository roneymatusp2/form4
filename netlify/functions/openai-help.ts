import { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.OPENAI_FORM4;
const OPENAI_MODEL = 'o1-preview'; // Latest thinking model

interface HelpRequest {
  question: string;
  topic: string;
  userQuestion: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured' })
    };
  }

  try {
    const { question, topic, userQuestion }: HelpRequest = JSON.parse(event.body || '{}');

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

    // Call OpenAI API
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_completion_tokens: 1024
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    // Remove markdown code blocks
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
