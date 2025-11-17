import { useEffect, useRef } from 'react';
import 'mathlive/static.css';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MathInput({ value, onChange, placeholder, disabled }: MathInputProps) {
  const mathFieldRef = useRef<any>(null);

  useEffect(() => {
    const loadMathLive = async () => {
      const { MathfieldElement } = await import('mathlive');
      
      if (!mathFieldRef.current) return;

      // Create math field if it doesn't exist
      if (!mathFieldRef.current.mathfield) {
        const mf = new MathfieldElement();
        
        // Set initial value
        if (value) {
          mf.value = value;
        }

        // Listen for changes
        mf.addEventListener('input', () => {
          onChange(mf.value);
        });

        // Replace the div with the math field
        mathFieldRef.current.innerHTML = '';
        mathFieldRef.current.appendChild(mf);
        mathFieldRef.current.mathfield = mf;
      } else {
        // Update existing field
        if (mathFieldRef.current.mathfield.value !== value) {
          mathFieldRef.current.mathfield.value = value;
        }
      }
    };

    loadMathLive();
  }, [value, onChange]);

  return (
    <div className="relative">
      <div
        ref={mathFieldRef}
        className={`math-input-container ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        style={{
          minHeight: '60px',
          border: '2px solid #cbd5e1',
          borderRadius: '0.75rem',
          padding: '1rem',
          fontSize: '1.125rem',
          backgroundColor: 'white',
          transition: 'all 0.2s',
        }}
      />
      
      {/* Toolbar with common symbols */}
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (mathFieldRef.current?.mathfield) {
              mathFieldRef.current.mathfield.executeCommand(['insert', '\\frac{#0}{#1}']);
              mathFieldRef.current.mathfield.focus();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-300"
          disabled={disabled}
        >
          Fraction
        </button>
        <button
          type="button"
          onClick={() => {
            if (mathFieldRef.current?.mathfield) {
              mathFieldRef.current.mathfield.executeCommand(['insert', '\\sqrt{#0}']);
              mathFieldRef.current.mathfield.focus();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-300"
          disabled={disabled}
        >
          √ Square Root
        </button>
        <button
          type="button"
          onClick={() => {
            if (mathFieldRef.current?.mathfield) {
              mathFieldRef.current.mathfield.executeCommand(['insert', '\\sqrt[3]{#0}']);
              mathFieldRef.current.mathfield.focus();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-300"
          disabled={disabled}
        >
          ∛ Cube Root
        </button>
        <button
          type="button"
          onClick={() => {
            if (mathFieldRef.current?.mathfield) {
              mathFieldRef.current.mathfield.executeCommand(['insert', '^{#0}']);
              mathFieldRef.current.mathfield.focus();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-300"
          disabled={disabled}
        >
          x² Power
        </button>
        <button
          type="button"
          onClick={() => {
            if (mathFieldRef.current?.mathfield) {
              mathFieldRef.current.mathfield.executeCommand(['insert', '\\pm']);
              mathFieldRef.current.mathfield.focus();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-300"
          disabled={disabled}
        >
          ± Plus/Minus
        </button>
        <button
          type="button"
          onClick={() => {
            if (mathFieldRef.current?.mathfield) {
              mathFieldRef.current.mathfield.executeCommand(['insert', '\\pi']);
              mathFieldRef.current.mathfield.focus();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-300"
          disabled={disabled}
        >
          π Pi
        </button>
      </div>

      {placeholder && !value && (
        <div className="absolute top-4 left-4 text-slate-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}
