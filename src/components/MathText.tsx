import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface MathTextProps {
  text: string;
}

export function MathText({ text }: MathTextProps) {
  // Parse text and identify math vs regular text segments
  const parseText = (input: string) => {
    const segments: Array<{ type: 'text' | 'math'; content: string }> = [];
    let currentText = '';
    let i = 0;

    while (i < input.length) {
      // Check for common math patterns
      if (input[i] === '(' && input.indexOf(')', i) > i) {
        // Check if this looks like a fraction or math expression
        const closeIdx = input.indexOf(')', i);
        
        // Look ahead for division or other math operators
        if (closeIdx + 1 < input.length && input[closeIdx + 1] === '/') {
          // This is likely a fraction
          if (currentText) {
            segments.push({ type: 'text', content: currentText });
            currentText = '';
          }
          
          // Find the end of the fraction
          let fractionEnd = closeIdx + 2;
          if (input[fractionEnd] === '(') {
            fractionEnd = input.indexOf(')', fractionEnd) + 1;
          } else {
            // Find next space or end
            while (fractionEnd < input.length && !/[\s,.]/.test(input[fractionEnd])) {
              fractionEnd++;
            }
          }
          
          segments.push({ type: 'math', content: input.substring(i, fractionEnd) });
          i = fractionEnd;
          continue;
        }
      }
      
      // Check for math symbols
      if (/[²³⁴⁵⁶⁷⁸⁹⁰√±×÷∛∜]/.test(input[i])) {
        if (currentText) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        // Collect the math expression
        let mathExpr = '';
        while (i < input.length && (/[²³⁴⁵⁶⁷⁸⁹⁰√±×÷∛∜\d\s\+\-\(\)xy]/.test(input[i]) || input[i] === '^')) {
          mathExpr += input[i];
          i++;
          // Stop at punctuation or end of math-like characters
          if (i < input.length && /[.,;!?]/.test(input[i])) break;
        }
        
        segments.push({ type: 'math', content: mathExpr.trim() });
        continue;
      }
      
      // Check for f⁻¹ or g⁻¹ patterns
      if ((input[i] === 'f' || input[i] === 'g') && i + 2 < input.length && input.substring(i + 1, i + 3) === '⁻¹') {
        if (currentText) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        segments.push({ type: 'math', content: input.substring(i, i + 3) });
        i += 3;
        continue;
      }
      
      currentText += input[i];
      i++;
    }
    
    if (currentText) {
      segments.push({ type: 'text', content: currentText });
    }
    
    return segments;
  };

  // Convert text to LaTeX
  const convertToLatex = (input: string): string => {
    let result = input;
    
    // Fractions: (a)/(b) -> \frac{a}{b}
    result = result.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');
    result = result.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
    
    // Square root: √x -> \sqrt{x}
    result = result.replace(/√\{([^}]+)\}/g, '\\sqrt{$1}');
    result = result.replace(/√\(([^)]+)\)/g, '\\sqrt{$1}');
    result = result.replace(/√(\d+)/g, '\\sqrt{$1}');
    result = result.replace(/√([a-z])/g, '\\sqrt{$1}');
    
    // Cube root: ∛
    result = result.replace(/∛\{([^}]+)\}/g, '\\sqrt[3]{$1}');
    result = result.replace(/∛\(([^)]+)\)/g, '\\sqrt[3]{$1}');
    result = result.replace(/∛(\d+)/g, '\\sqrt[3]{$1}');
    
    // Fourth root: ∜
    result = result.replace(/∜\{([^}]+)\}/g, '\\sqrt[4]{$1}');
    result = result.replace(/∜\(([^)]+)\)/g, '\\sqrt[4]{$1}');
    result = result.replace(/∜(\d+)/g, '\\sqrt[4]{$1}');
    
    // Superscripts
    result = result.replace(/⁰/g, '^{0}');
    result = result.replace(/¹/g, '^{1}');
    result = result.replace(/²/g, '^{2}');
    result = result.replace(/³/g, '^{3}');
    result = result.replace(/⁴/g, '^{4}');
    result = result.replace(/⁵/g, '^{5}');
    result = result.replace(/⁶/g, '^{6}');
    result = result.replace(/⁷/g, '^{7}');
    result = result.replace(/⁸/g, '^{8}');
    result = result.replace(/⁹/g, '^{9}');
    result = result.replace(/⁻¹/g, '^{-1}');
    
    // Handle x^2 style already in text
    result = result.replace(/\^(\d)/g, '^{$1}');
    
    // Plus/minus: ± -> \pm
    result = result.replace(/±/g, '\\pm');
    
    // Multiplication: × -> \times
    result = result.replace(/×/g, '\\times');
    
    // Division: ÷ -> \div
    result = result.replace(/÷/g, '\\div');
    
    return result;
  };

  const segments = parseText(text);
  
  return (
    <>
      {segments.map((segment, idx) => {
        if (segment.type === 'text') {
          return <span key={idx}>{segment.content}</span>;
        } else {
          const latex = convertToLatex(segment.content);
          try {
            return <InlineMath key={idx} math={latex} />;
          } catch (e) {
            // Fallback if LaTeX parsing fails
            return <span key={idx}>{segment.content}</span>;
          }
        }
      })}
    </>
  );
}
