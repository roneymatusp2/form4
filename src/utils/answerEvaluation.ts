/**
 * Local answer evaluation utilities
 * Fallback when Gemini is not available
 */

export interface EvaluationResult {
  isCorrect: boolean;
  confidence: number;
  feedback: string;
  suggestions?: string[];
}

/**
 * Normalise an answer for comparison
 */
function normaliseAnswer(answer: string | number): string {
  const str = String(answer);
  
  return str
    .toLowerCase()
    .trim()
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    // Remove trailing punctuation
    .replace(/[.,;!?]+$/, '')
    // Normalise mathematical symbols
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    // Remove spaces around operators
    .replace(/\s*([+\-*/=:×÷±])\s*/g, '$1');
}

/**
 * Extract numbers from a string
 */
function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+\.?\d*/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Check if two answers are equivalent
 */
function areEquivalent(userAnswer: string | number, correctAnswer: string | number, tolerance: number = 0.05): boolean {
  const normalised1 = normaliseAnswer(userAnswer);
  const normalised2 = normaliseAnswer(correctAnswer);

  // Exact match
  if (normalised1 === normalised2) return true;

  // Number comparison with tolerance
  const userNumbers = extractNumbers(String(userAnswer));
  const correctNumbers = extractNumbers(String(correctAnswer));
  
  if (userNumbers.length > 0 && correctNumbers.length > 0) {
    if (userNumbers.length === correctNumbers.length) {
      const allMatch = userNumbers.every((num, idx) => 
        Math.abs(num - correctNumbers[idx]) <= tolerance
      );
      if (allMatch) return true;
    }
  }

  // Check for mathematical expressions (e.g., "4 ± √21")
  const sqrtPattern = /([+-]?\d+)\s*[±]\s*√(\d+)/;
  const match1 = normalised1.match(sqrtPattern);
  const match2 = normalised2.match(sqrtPattern);
  if (match1 && match2) {
    return match1[1] === match2[1] && match1[2] === match2[2];
  }

  // Check for comma-separated values (e.g., "7, -4")
  const values1 = normalised1.split(/[,\s]+/).filter(v => v && !isNaN(Number(v)));
  const values2 = normalised2.split(/[,\s]+/).filter(v => v && !isNaN(Number(v)));
  if (values1.length > 1 && values2.length > 1) {
    if (values1.length === values2.length) {
      const sorted1 = values1.map(Number).sort((a, b) => a - b);
      const sorted2 = values2.map(Number).sort((a, b) => a - b);
      const allMatch = sorted1.every((num, idx) => 
        Math.abs(num - sorted2[idx]) <= tolerance
      );
      if (allMatch) return true;
    }
  }

  return false;
}

/**
 * Evaluate answer locally (fallback)
 */
export function evaluateAnswerLocally(
  userAnswer: string,
  correctAnswer: string | number,
  answerTolerance: number = 0.05
): EvaluationResult {
  if (!userAnswer.trim()) {
    return {
      isCorrect: false,
      confidence: 1,
      feedback: 'Please provide an answer.',
      suggestions: ['Write your answer in the text box above.']
    };
  }

  const isCorrect = areEquivalent(userAnswer, correctAnswer, answerTolerance);

  if (isCorrect) {
    return {
      isCorrect: true,
      confidence: 1,
      feedback: 'Correct! Well done!',
    };
  }

  // Provide helpful suggestions
  const suggestions: string[] = [];
  const userNumbers = extractNumbers(userAnswer);
  const correctNumbers = extractNumbers(String(correctAnswer));

  if (userNumbers.length > 0 && correctNumbers.length > 0) {
    if (userNumbers.length !== correctNumbers.length) {
      suggestions.push('Check if you have all the required values in your answer.');
    } else {
      suggestions.push('Your calculation might be incorrect. Review your working.');
    }
  }

  if (userNumbers.length === 0 && correctNumbers.length > 0) {
    suggestions.push('Your answer should include numerical values.');
  }

  return {
    isCorrect: false,
    confidence: 0.9,
    feedback: 'Not quite right. Try again or check the hint.',
    suggestions: suggestions.length > 0 ? suggestions : [
      'Review your calculation step by step.',
      'Check the hint if you need help.'
    ]
  };
}
