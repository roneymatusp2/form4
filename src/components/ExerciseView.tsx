import { useState, useRef } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw, Loader2, Sparkles, HelpCircle, Send, X, AlertCircle, Camera, Image as ImageIcon } from 'lucide-react';
import { Exercise } from '../types/exercise';
import { geminiService } from '../services/geminiService';
import { evaluateAnswerLocally } from '../utils/answerEvaluation';
import { ExerciseNavigation } from './ExerciseNavigation';
import { MathText } from './MathText';
import { MathInput } from './MathInput';
import { MathInputGuide } from './MathInputGuide';

interface ExerciseViewProps {
  exercise: Exercise;
  allExercises: Exercise[];
  completedExercises: Set<number>;
  onComplete: (id: number) => void;
  onNavigate: (id: number) => void;
  onBackToList: () => void;
  isCompleted: boolean;
}

export function ExerciseView({ exercise, allExercises, completedExercises, onComplete, onNavigate, onBackToList, isCompleted }: ExerciseViewProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [partAnswers, setPartAnswers] = useState<Record<number, string>>({});
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
    suggestions?: string[];
    usedAI?: boolean;
  } | null>(null);
  const [partFeedbacks, setPartFeedbacks] = useState<Record<number, {
    correct: boolean;
    message: string;
    suggestions?: string[];
  }>>({});
  const [showHint, setShowHint] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Image upload state
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [partImages, setPartImages] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingForPart, setUploadingForPart] = useState<number | null>(null);

  // Help panel state
  const [helpQuestion, setHelpQuestion] = useState('');
  const [helpResponse, setHelpResponse] = useState<{
    explanation: string;
    steps?: string[];
    example?: string;
  } | null>(null);
  const [isLoadingHelp, setIsLoadingHelp] = useState(false);

  const handleReset = () => {
    setUserAnswer('');
    setPartAnswers({});
    setSelectedChoice(null);
    setFeedback(null);
    setPartFeedbacks({});
    setShowHint(false);
    setAnswerImage(null);
    setPartImages({});
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, partIndex?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (partIndex !== undefined) {
        setPartImages(prev => ({ ...prev, [partIndex]: base64String }));
      } else {
        setAnswerImage(base64String);
      }
      setUploadingForPart(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = (partIndex?: number) => {
    setUploadingForPart(partIndex ?? -1);
    fileInputRef.current?.click();
  };

  const removeImage = (partIndex?: number) => {
    if (partIndex !== undefined) {
      setPartImages(prev => {
        const newImages = { ...prev };
        delete newImages[partIndex];
        return newImages;
      });
    } else {
      setAnswerImage(null);
    }
  };

  const handleAskHelp = async () => {
    if (!helpQuestion.trim()) return;
    
    if (!geminiService.isAvailable()) {
      setHelpResponse({
        explanation: "AI Tutor is not configured. Please add your Gemini API key to enable intelligent help.",
        steps: []
      });
      return;
    }

    setIsLoadingHelp(true);
    setHelpResponse(null);

    try {
      const response = await geminiService.getHelp(
        exercise.question,
        exercise.topic,
        helpQuestion
      );
      setHelpResponse(response);
    } catch (error) {
      console.error('Failed to get help:', error);
      setHelpResponse({
        explanation: "Sorry, I couldn't get help at the moment. Please try again or check the hint below.",
        steps: []
      });
    } finally {
      setIsLoadingHelp(false);
    }
  };

  const checkAnswerWithAI = async (answer: string, correctAnswer: string | number, imageData?: string) => {
    setIsEvaluating(true);

    try {
      if (geminiService.isAvailable()) {
        try {
          const result = await geminiService.evaluateAnswer(
            answer,
            correctAnswer,
            exercise.question,
            exercise.hint,
            imageData
          );

          setFeedback({
            correct: result.isCorrect,
            message: result.feedback,
            suggestions: result.suggestions,
            usedAI: true
          });

          if (result.isCorrect && !isCompleted) {
            setTimeout(() => onComplete(exercise.id), 1500);
          }
          return;
        } catch (error) {
          console.warn('Gemini evaluation failed, falling back to local:', error);
        }
      }

      const tolerance = typeof correctAnswer === 'number' && exercise.answerTolerance 
        ? exercise.answerTolerance 
        : 0.05;
      
      const result = evaluateAnswerLocally(answer, correctAnswer, tolerance);
      
      setFeedback({
        correct: result.isCorrect,
        message: result.feedback,
        suggestions: result.suggestions,
        usedAI: false
      });

      if (result.isCorrect && !isCompleted) {
        setTimeout(() => onComplete(exercise.id), 1500);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const checkAnswer = async () => {
    if (exercise.type === 'multiple-choice') {
      const correct = selectedChoice === exercise.correctChoice;
      setFeedback({
        correct,
        message: correct
          ? 'Correct! Well done!'
          : 'Not quite right. Try again or check the hint.',
        usedAI: false
      });
      if (correct && !isCompleted) {
        setTimeout(() => onComplete(exercise.id), 1000);
      }
    } else if (exercise.type === 'multi-part') {
      setIsEvaluating(true);

      try {
        const detailedResults = await Promise.all(
          (exercise.parts || []).map(async (part, idx) => {
            const userAns = partAnswers[idx] || '';
            if (!userAns.trim()) {
              return {
                isCorrect: false,
                feedback: 'Please provide an answer.',
                suggestions: [],
                index: idx
              };
            }

            if (geminiService.isAvailable()) {
              try {
                const partImage = partImages[idx];
                const result = await geminiService.evaluateAnswer(
                  userAns,
                  part.answer || '',
                  `${part.label} ${part.question}`,
                  exercise.hint,
                  partImage
                );
                return {
                  isCorrect: result.isCorrect,
                  feedback: result.feedback,
                  suggestions: result.suggestions || [],
                  index: idx
                };
              } catch {
                const tolerance = typeof part.answer === 'number' && part.answerTolerance
                  ? part.answerTolerance
                  : 0.05;
                const result = evaluateAnswerLocally(userAns, part.answer || '', tolerance);
                return {
                  isCorrect: result.isCorrect,
                  feedback: result.feedback,
                  suggestions: result.suggestions || [],
                  index: idx
                };
              }
            } else {
              const tolerance = typeof part.answer === 'number' && part.answerTolerance
                ? part.answerTolerance
                : 0.05;
              const result = evaluateAnswerLocally(userAns, part.answer || '', tolerance);
              return {
                isCorrect: result.isCorrect,
                feedback: result.feedback,
                suggestions: result.suggestions || [],
                index: idx
              };
            }
          })
        );

        // Save individual part feedbacks
        const newPartFeedbacks: Record<number, {
          correct: boolean;
          message: string;
          suggestions?: string[];
        }> = {};
        detailedResults.forEach(result => {
          newPartFeedbacks[result.index] = {
            correct: result.isCorrect,
            message: result.feedback,
            suggestions: result.suggestions
          };
        });
        setPartFeedbacks(newPartFeedbacks);

        const allCorrect = detailedResults.every(r => r.isCorrect);
        const incorrectParts = detailedResults.filter(r => !r.isCorrect);

        setFeedback({
          correct: allCorrect,
          message: allCorrect
            ? 'All parts correct! Excellent work!'
            : `Part${incorrectParts.length > 1 ? 's' : ''} ${incorrectParts.map(r => exercise.parts?.[r.index]?.label).join(', ')} need${incorrectParts.length === 1 ? 's' : ''} correction.`,
          usedAI: geminiService.isAvailable()
        });

        if (allCorrect && !isCompleted) {
          setTimeout(() => onComplete(exercise.id), 1500);
        }
      } finally {
        setIsEvaluating(false);
      }
    } else {
      await checkAnswerWithAI(userAnswer, exercise.answer || '', answerImage || undefined);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleImageUpload(e, uploadingForPart === -1 ? undefined : uploadingForPart ?? undefined)}
        className="hidden"
      />

      <ExerciseNavigation
        currentExercise={exercise}
        allExercises={allExercises}
        completedExercises={completedExercises}
        onNavigate={onNavigate}
        onBackToList={onBackToList}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Exercise Card */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold">{exercise.topic}</h2>
                    {geminiService.isAvailable() && (
                      <div className="badge bg-white/20 text-white border border-white/30">
                        <Sparkles size={16} />
                        AI Tutor Active
                      </div>
                    )}
                  </div>
                  <p className="text-purple-100 font-medium">
                    {exercise.type === 'multi-part' ? `${exercise.parts?.length} parts` : 'Single question'}
                  </p>
                </div>
                {isCompleted && (
                  <div className="badge bg-green-500 text-white">
                    <CheckCircle2 size={20} />
                    Completed
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Question */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-l-4 border-purple-600">
                <div className="math-display text-lg text-slate-800 leading-relaxed whitespace-pre-line">
                  <MathText text={exercise.question} />
                </div>
              </div>

              {/* Multi-part questions */}
              {exercise.type === 'multi-part' && exercise.parts && (
                <div className="space-y-4">
                  {exercise.parts.map((part, idx) => {
                    const partFeedback = partFeedbacks[idx];
                    const hasFeedback = !!partFeedback;
                    const borderColor = hasFeedback
                      ? partFeedback.correct
                        ? 'border-green-400'
                        : 'border-amber-400'
                      : 'border-slate-200 hover:border-purple-300';

                    return (
                      <div key={idx} className={`bg-white rounded-xl p-6 border-2 ${borderColor} transition-colors`}>
                        <label className="block">
                          <div className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                            {part.label} <MathText text={part.question} />
                            {hasFeedback && (
                              partFeedback.correct ? (
                                <CheckCircle2 size={20} className="text-green-600" />
                              ) : (
                                <AlertCircle size={20} className="text-amber-600" />
                              )
                            )}
                          </div>
                          <div className="space-y-3">
                            <MathInput
                              value={partAnswers[idx] || ''}
                              onChange={(val) => setPartAnswers({ ...partAnswers, [idx]: val })}
                              placeholder="Type your answer (use toolbar for fractions, roots, etc.)"
                              disabled={isEvaluating}
                            />
                            <button
                              type="button"
                              onClick={() => triggerImageUpload(idx)}
                              disabled={isEvaluating}
                              className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-300"
                              title="Upload handwritten answer"
                            >
                              <Camera size={18} />
                              Or Upload Handwritten Answer
                            </button>
                          </div>
                        </label>

                        {/* Image preview for this part */}
                        {partImages[idx] && (
                          <div className="mt-3 relative bg-slate-50 rounded-lg p-3 border-2 border-indigo-300">
                            <div className="flex items-start gap-2">
                              <ImageIcon size={16} className="text-indigo-600 mt-1" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-slate-700 mb-2">Uploaded Answer</p>
                                <img
                                  src={partImages[idx]}
                                  alt={`Answer for ${part.label}`}
                                  className="max-h-32 rounded border border-slate-300"
                                />
                              </div>
                              <button
                                onClick={() => removeImage(idx)}
                                className="text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Individual part feedback */}
                        {hasFeedback && (
                          <div className={`mt-4 p-4 rounded-lg ${
                            partFeedback.correct
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-amber-50 border border-amber-200'
                          }`}>
                            <p className={`text-sm font-medium ${
                              partFeedback.correct ? 'text-green-900' : 'text-amber-900'
                            }`}>
                              {partFeedback.message}
                            </p>
                            {partFeedback.suggestions && partFeedback.suggestions.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {partFeedback.suggestions.map((suggestion, sIdx) => (
                                  <li key={sIdx} className="text-sm text-amber-800 flex items-start gap-2">
                                    <span className="text-amber-600">•</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Text input */}
              {exercise.type === 'text-input' && (
                <div className="space-y-4">
                  <label className="block">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-800 text-lg">Your Answer:</span>
                      <MathInputGuide />
                    </div>
                    <div className="space-y-3">
                      <MathInput
                        value={userAnswer}
                        onChange={setUserAnswer}
                        placeholder="Type your answer (use toolbar for fractions, roots, etc.)"
                        disabled={isEvaluating}
                      />
                      <button
                        type="button"
                        onClick={() => triggerImageUpload()}
                        disabled={isEvaluating}
                        className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-300"
                        title="Upload handwritten answer"
                      >
                        <Camera size={20} />
                        Or Upload Handwritten Answer
                      </button>
                    </div>
                  </label>

                  {/* Image preview */}
                  {answerImage && (
                    <div className="relative bg-slate-50 rounded-xl p-4 border-2 border-indigo-300">
                      <div className="flex items-start gap-3">
                        <ImageIcon size={20} className="text-indigo-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700 mb-2">Uploaded Answer</p>
                          <img
                            src={answerImage}
                            alt="Your handwritten answer"
                            className="max-h-48 rounded-lg border border-slate-300"
                          />
                        </div>
                        <button
                          onClick={() => removeImage()}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Multiple choice */}
              {exercise.type === 'multiple-choice' && exercise.choices && (
                <div className="space-y-3">
                  <p className="font-bold text-slate-800 text-lg mb-4">Select your answer:</p>
                  {exercise.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedChoice(idx)}
                      disabled={isEvaluating}
                      className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                        selectedChoice === idx
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-slate-200 hover:border-purple-300 bg-white'
                      } disabled:opacity-50`}
                    >
                      <span className={`font-bold mr-3 text-lg ${selectedChoice === idx ? 'text-purple-600' : 'text-slate-500'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="text-slate-800 text-lg"><MathText text={choice} /></span>
                    </button>
                  ))}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div
                  className={`rounded-xl p-6 shadow-lg animate-scale-in ${
                    feedback.correct
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
                      : 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {feedback.correct ? (
                      <CheckCircle2 size={32} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={32} className="text-amber-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`font-bold text-xl mb-2 ${feedback.correct ? 'text-green-900' : 'text-amber-900'}`}>
                        {feedback.message}
                      </p>
                      {feedback.suggestions && feedback.suggestions.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {feedback.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-amber-800 flex items-start gap-2">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {feedback.usedAI && (
                        <div className="mt-3 flex items-center gap-2 text-purple-600 text-sm font-medium">
                          <Sparkles size={16} />
                          Evaluated with AI
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Hint */}
              {exercise.hint && (
                <div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-lg transition-all"
                  >
                    <Lightbulb size={24} />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  {showHint && (
                    <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl animate-slide-in">
                      <p className="text-blue-900 text-lg leading-relaxed">{exercise.hint}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={checkAnswer}
                  disabled={
                    isEvaluating ||
                    (exercise.type === 'text-input' && !userAnswer) ||
                    (exercise.type === 'multiple-choice' && selectedChoice === null) ||
                    (exercise.type === 'multi-part' && Object.keys(partAnswers).length < (exercise.parts?.length || 0))
                  }
                  className="flex-1 btn-primary text-white px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>Check Answer</>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isEvaluating}
                  className="px-8 py-4 border-2 border-purple-300 rounded-xl font-bold text-lg text-purple-700 hover:bg-purple-50 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <RotateCcw size={22} />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Panel */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl shadow-2xl overflow-hidden sticky top-24">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <HelpCircle size={28} />
                <h3 className="text-xl font-bold">Need Help?</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {!geminiService.isAvailable() ? (
                <div className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 text-sm leading-relaxed">
                    AI Tutor is not configured. Add your Gemini API key to enable intelligent help.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-slate-700 leading-relaxed">
                    Ask me anything about this question! I can explain concepts, break down steps, or clarify terminology.
                  </p>

                  <div className="space-y-3">
                    <textarea
                      value={helpQuestion}
                      onChange={(e) => setHelpQuestion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && helpQuestion.trim() && !isLoadingHelp) {
                          e.preventDefault();
                          handleAskHelp();
                        }
                      }}
                      placeholder="e.g., What are significant figures?"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                      rows={3}
                      disabled={isLoadingHelp}
                    />

                    <button
                      onClick={handleAskHelp}
                      disabled={!helpQuestion.trim() || isLoadingHelp}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {isLoadingHelp ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Ask AI Tutor
                        </>
                      )}
                    </button>
                  </div>

                  {helpResponse && (
                    <div className="mt-6 space-y-4 animate-scale-in">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-300 shadow-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <Sparkles size={22} className="text-blue-600 flex-shrink-0 mt-1" />
                          <p className="text-blue-900 leading-relaxed font-medium">
                            {helpResponse.explanation}
                          </p>
                        </div>

                        {helpResponse.steps && helpResponse.steps.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="font-bold text-blue-900">Steps:</p>
                            <ol className="space-y-2">
                              {helpResponse.steps.map((step, idx) => (
                                <li key={idx} className="text-blue-800 flex gap-2">
                                  <span className="font-bold text-blue-600">{idx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {helpResponse.example && (
                          <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                            <p className="font-bold text-blue-900 mb-1">Example:</p>
                            <p className="text-blue-800">{helpResponse.example}</p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setHelpResponse(null);
                          setHelpQuestion('');
                        }}
                        className="text-slate-600 hover:text-slate-800 font-medium flex items-center gap-2 mx-auto transition-colors"
                      >
                        <X size={18} />
                        Clear
                      </button>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center mb-3">
                      Quick questions:
                    </p>
                    <div className="space-y-2">
                      {[
                        "What are significant figures?",
                        "How do I factorise this?",
                        "Explain Pythagoras' theorem"
                      ].map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => setHelpQuestion(q)}
                          className="w-full text-left px-3 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
