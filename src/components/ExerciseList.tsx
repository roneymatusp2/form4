import { CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { Exercise } from '../types/exercise';

interface ExerciseListProps {
  exercises: Exercise[];
  completedExercises: Set<number>;
  onSelectExercise: (id: number) => void;
}

// Topic icons and colors
const topicStyles: Record<string, { gradient: string; icon: string }> = {
  'Use of Calculator': { 
    gradient: 'from-blue-500 to-cyan-500', 
    icon: '🧮'
  },
  'Direct and Inverse Proportions': { 
    gradient: 'from-purple-500 to-pink-500', 
    icon: '⚖️'
  },
  'Quadratics Expansion and Factorisation': { 
    gradient: 'from-orange-500 to-red-500', 
    icon: '📐'
  },
  'Quadratics Involving Area and Perimeter': { 
    gradient: 'from-green-500 to-emerald-500', 
    icon: '📏'
  },
  "Pythagoras' Theorem": { 
    gradient: 'from-indigo-500 to-purple-500', 
    icon: '📐'
  },
  'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula': { 
    gradient: 'from-rose-500 to-pink-500', 
    icon: '🔢'
  },
  'Simplify Algebraic Fractions': { 
    gradient: 'from-teal-500 to-cyan-500', 
    icon: '➗'
  },
  'Adding, Subtracting, Multiplying and Dividing Algebraic Fractions': { 
    gradient: 'from-amber-500 to-orange-500', 
    icon: '➕'
  },
  'Volume and Surface Area of 3D Shapes': { 
    gradient: 'from-sky-500 to-blue-500', 
    icon: '🧊'
  },
  'Inverse Functions': { 
    gradient: 'from-violet-500 to-purple-500', 
    icon: '🔄'
  }
};

export function ExerciseList({ exercises, completedExercises, onSelectExercise }: ExerciseListProps) {
  // Group exercises by topic
  const groupedExercises = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.topic]) {
      acc[exercise.topic] = [];
    }
    acc[exercise.topic].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const handleTopicClick = (topic: string) => {
    const topicExercises = groupedExercises[topic];
    if (topicExercises && topicExercises.length > 0) {
      // Go to first exercise of this topic
      onSelectExercise(topicExercises[0].id);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Card */}
      <div className="glass-card rounded-3xl p-8 shadow-2xl">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl">
            <BookOpen size={40} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              IGCSE Mathematics Practice
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Master key mathematical concepts with comprehensive exercises organised by topic.
              Click on any topic card to start practising.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="badge bg-purple-100 text-purple-700">
                <span className="font-bold">{Object.keys(groupedExercises).length}</span> Topics
              </div>
              <div className="badge bg-indigo-100 text-indigo-700">
                <span className="font-bold">{exercises.length}</span> Exercises
              </div>
              <div className="badge bg-green-100 text-green-700">
                <CheckCircle2 size={16} />
                <span className="font-bold">{completedExercises.size}</span> Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedExercises).map(([topic, topicExercises]) => {
          const style = topicStyles[topic] || { gradient: 'from-slate-500 to-slate-600', icon: '📚' };
          const completedCount = topicExercises.filter(ex => completedExercises.has(ex.id)).length;
          const totalCount = topicExercises.length;
          const progress = Math.round((completedCount / totalCount) * 100);
          const allCompleted = completedCount === totalCount;

          return (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              className="glass-card rounded-2xl overflow-hidden shadow-xl card-hover transition-all text-left group animate-scale-in"
            >
              <div className={`bg-gradient-to-br ${style.gradient} p-8 text-white relative`}>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={28} className="text-white transform group-hover:translate-x-1 transition-transform" />
                </div>
                
                {allCompleted && (
                  <div className="absolute top-4 left-4">
                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <CheckCircle2 size={24} className="text-white" />
                    </div>
                  </div>
                )}
                
                <div className="text-6xl mb-4 mt-8">{style.icon}</div>
                
                <h3 className="text-xl font-bold mb-3 pr-8 leading-tight min-h-[3.5rem]">
                  {topic}
                </h3>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="font-medium text-white/90">
                    {totalCount} {totalCount === 1 ? 'Exercise' : 'Exercises'}
                  </span>
                  <span className="font-bold text-lg">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Hover Effect Footer */}
              <div className="p-4 bg-white group-hover:bg-gradient-to-r group-hover:from-slate-50 group-hover:to-slate-100 transition-all">
                <div className="flex items-center justify-between text-slate-600 group-hover:text-slate-800">
                  <span className="text-sm font-medium">Click to start</span>
                  <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
