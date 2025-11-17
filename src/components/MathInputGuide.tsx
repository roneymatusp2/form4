import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function MathInputGuide() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
      >
        <HelpCircle size={16} />
        How to enter maths?
      </button>

      {showGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Math Input Guide</h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-3">Using the Toolbar</h4>
                <p className="text-slate-600 mb-4">
                  Click the buttons below the input box to insert mathematical expressions:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium">Fraction Button</div>
                    <div className="text-sm text-slate-600">Creates: 3/4</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium">√ Square Root</div>
                    <div className="text-sm text-slate-600">Creates: √16</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium">∛ Cube Root</div>
                    <div className="text-sm text-slate-600">Creates: ∛27</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium">x² Power</div>
                    <div className="text-sm text-slate-600">Creates: x²</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span>Type: <code className="bg-slate-200 px-2 py-1 rounded">sqrt</code></span>
                    <span>Gets: √</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span>Type: <code className="bg-slate-200 px-2 py-1 rounded">frac</code></span>
                    <span>Gets: fraction template</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span>Type: <code className="bg-slate-200 px-2 py-1 rounded">^</code></span>
                    <span>Gets: superscript</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span>Type: <code className="bg-slate-200 px-2 py-1 rounded">pm</code></span>
                    <span>Gets: ±</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3">Navigation</h4>
                <div className="space-y-2 text-sm">
                  <div>• Use <kbd className="bg-slate-200 px-2 py-1 rounded">Tab</kbd> to move between parts</div>
                  <div>• Use <kbd className="bg-slate-200 px-2 py-1 rounded">Arrow keys</kbd> to navigate</div>
                  <div>• Use <kbd className="bg-slate-200 px-2 py-1 rounded">Backspace</kbd> to delete</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-900 mb-2">💡 Pro Tip</div>
                <div className="text-blue-800 text-sm">
                  You can also upload a photo of your handwritten answer using the camera button!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
