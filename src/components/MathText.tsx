import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathTextProps {
  text: string;
  block?: boolean;
}

export function MathText({ text, block = false }: MathTextProps) {
  // Convert common text patterns to LaTeX
  const convertToLatex = (input: string): string => {
    let result = input;
    
    // Fractions: (a)/(b) -> \frac{a}{b}
    result = result.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');
    
    // Square root: √x -> \sqrt{x}
    result = result.replace(/√(\d+)/g, '\\sqrt{$1}');
    result = result.replace(/√\(([^)]+)\)/g, '\\sqrt{$1}');
    
    // Superscripts: x² -> x^2, x³ -> x^3
    result = result.replace(/²/g, '^2');
    result = result.replace(/³/g, '^3');
    result = result.replace(/⁻¹/g, '^{-1}');
    
    // Plus/minus: ± -> \pm
    result = result.replace(/±/g, '\\pm');
    
    // Multiplication: × -> \times
    result = result.replace(/×/g, '\\times');
    
    // Division: ÷ -> \div
    result = result.replace(/÷/g, '\\div');
    
    return result;
  };

  // Split text into math and non-math parts
  const renderText = (input: string) => {
    // Check if text contains LaTeX delimiters or math symbols
    const hasMath = /[²³√±×÷]|\^|\(.*\)\/\(.*\)|f⁻¹|g⁻¹/.test(input);
    
    if (!hasMath) {
      return <span>{input}</span>;
    }

    const latex = convertToLatex(input);
    
    if (block) {
      return <BlockMath math={latex} />;
    }
    
    return <InlineMath math={latex} />;
  };

  return <>{renderText(text)}</>;
}
