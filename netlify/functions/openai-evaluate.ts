import { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.OPENAI_FORM4;
const OPENAI_MODEL = 'o1-preview'; // Latest thinking model

interface EvaluateRequest {
  userAnswer: string;
  correctAnswer: string | number;
  question: string;
  hint?: string;
  imageBase64?: string;
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
    const { userAnswer, correctAnswer, question, hint, imageBase64 }: EvaluateRequest = JSON.parse(event.body || '{}');

    const promptText = `You are a patient and encouraging IGCSE mathematics teacher with exceptional mathematical ability.

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
            content: promptText
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
        error: 'Failed to evaluate answer',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
