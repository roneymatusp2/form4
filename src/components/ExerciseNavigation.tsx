import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Exercise } from '../types/exercise';

interface ExerciseNavigationProps {
  currentExercise: Exercise;
  allExercises: Exercise[];
  completedExercises: Set<number>;
  onNavigate: (id: number) => void;
  onBackToList: () => void;
}

export function ExerciseNavigation({ 
  currentExercise, 
  allExercises, 
  completedExercises,
  onNavigate,
  onBackToList 
}: ExerciseNavigationProps) {
  // Get exercises from the same topic
  const topicExercises = allExercises.filter(ex => ex.topic === currentExercise.topic);
  const currentIndex = topicExercises.findIndex(ex => ex.id === currentExercise.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < topicExercises.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(topicExercises[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(topicExercises[currentIndex + 1].id);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToList}
          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors rounded-lg hover:bg-slate-100"
        >
          <List size={20} />
          All Topics
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-medium mr-2">
            {currentIndex + 1} of {topicExercises.length}
          </span>
          
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="p-2 rounded-lg border-2 border-slate-300 text-slate-700 hover:border-purple-400 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="p-2 rounded-lg border-2 border-slate-300 text-slate-700 hover:border-purple-400 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {topicExercises.map((exercise, idx) => (
          <button
            key={exercise.id}
            onClick={() => onNavigate(exercise.id)}
            className={`h-2 rounded-full transition-all ${
              exercise.id === currentExercise.id
                ? 'w-8 bg-purple-600'
                : completedExercises.has(exercise.id)
                ? 'w-2 bg-green-500'
                : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            title={`Exercise ${idx + 1}${completedExercises.has(exercise.id) ? ' (Completed)' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
