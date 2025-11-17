import { useState } from 'react';
import { Header } from './components/Header';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseView } from './components/ExerciseView';
import { exercises } from './data/exercises';

function App() {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  const handleExerciseComplete = (exerciseId: number) => {
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
  };

  const handleBackToList = () => {
    setSelectedExercise(null);
  };

  const handleNavigate = (exerciseId: number) => {
    setSelectedExercise(exerciseId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header
        totalExercises={exercises.length}
        completedCount={completedExercises.size}
        onBackToList={selectedExercise !== null ? handleBackToList : undefined}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {selectedExercise === null ? (
          <ExerciseList
            exercises={exercises}
            completedExercises={completedExercises}
            onSelectExercise={handleNavigate}
          />
        ) : (
          <ExerciseView
            exercise={exercises.find(ex => ex.id === selectedExercise)!}
            allExercises={exercises}
            completedExercises={completedExercises}
            onComplete={handleExerciseComplete}
            onNavigate={handleNavigate}
            onBackToList={handleBackToList}
            isCompleted={completedExercises.has(selectedExercise)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
