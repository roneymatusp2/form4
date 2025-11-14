export interface Exercise {
  id: number;
  question: string;
  type: 'text-input' | 'multiple-choice' | 'multi-part';
  parts?: ExercisePart[];
  answer?: string | number;
  answerTolerance?: number;
  choices?: string[];
  correctChoice?: number;
  topic: string;
  hint?: string;
}

export interface ExercisePart {
  label: string;
  question: string;
  type: 'text-input' | 'multiple-choice';
  answer?: string | number;
  answerTolerance?: number;
  choices?: string[];
  correctChoice?: number;
}
