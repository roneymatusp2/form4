import { BookOpen, ArrowLeft, Trophy } from 'lucide-react';

interface HeaderProps {
  totalExercises: number;
  completedCount: number;
  onBackToList?: () => void;
}

export function Header({ totalExercises, completedCount, onBackToList }: HeaderProps) {
  const percentage = Math.round((completedCount / totalExercises) * 100);

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBackToList && (
              <button
                onClick={onBackToList}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-white" />
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  IGCSE Mathematics
                </h1>
                <p className="text-white/80 text-sm">
                  Practice Exercises
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-card px-6 py-3 rounded-xl">
              <div className="flex items-center gap-3">
                <Trophy size={24} className="text-yellow-500" />
                <div>
                  <div className="text-sm text-slate-600 font-medium">Progress</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {completedCount}/{totalExercises}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card px-4 py-3 rounded-xl min-w-[120px]">
              <div className="text-sm text-slate-600 font-medium mb-1">Completion</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-slate-800">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
