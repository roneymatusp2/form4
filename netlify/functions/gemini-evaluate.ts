import { Handler } from '@netlify/functions';

const GEMINI_API_KEY = process.env.GEMINI_FORM4;
const GEMINI_MODEL = 'gemini-2.5-pro';

interface EvaluateRequest {
  userAnswer: string;
  correctAnswer: string | number;
  question: string;
  hint?: string;
  imageBase64?: string; // Student's handwritten answer as image
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
    const { userAnswer, correctAnswer, question, hint, imageBase64 }: EvaluateRequest = JSON.parse(event.body || '{}');

    // Build prompt - adjust based on whether image is provided
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
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg', // Support JPEG, PNG will also work
          data: base64Data
        }
      });
    }

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
        error: 'Failed to evaluate answer',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
