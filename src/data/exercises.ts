import { Exercise } from '../types/exercise';

export const exercises: Exercise[] = [
  // Use of Calculator
  {
    id: 1,
    topic: 'Use of Calculator',
    type: 'multi-part',
    question: 'Calculator computation',
    parts: [
      {
        label: '(a)',
        question: 'Use your calculator to work out (47.8 × 9.62)/(32.5 - 7.4). Write down all the figures on your calculator display.',
        type: 'text-input',
        answer: 18.32015936,
        answerTolerance: 0.00000001
      },
      {
        label: '(b)',
        question: 'Write your answer to part (a) correct to 1 significant figure.',
        type: 'text-input',
        answer: 20,
        answerTolerance: 0.1
      }
    ]
  },
  {
    id: 2,
    topic: 'Use of Calculator',
    type: 'multi-part',
    question: 'Calculator computation',
    parts: [
      {
        label: '(a)',
        question: 'Use your calculator to work out: (125.4 × 0.86)/(9.7 + 3.18). Write down all the figures on your calculator display.',
        type: 'text-input',
        answer: 8.364118,
        answerTolerance: 0.000001
      },
      {
        label: '(b)',
        question: 'Write your answer to part (a) correct to 1 significant figure.',
        type: 'text-input',
        answer: 8,
        answerTolerance: 0.1
      }
    ]
  },
  {
    id: 3,
    topic: 'Use of Calculator',
    type: 'multi-part',
    question: 'Calculator computation',
    parts: [
      {
        label: '(a)',
        question: 'Use your calculator to work out (52.3 × 8.9)/(21.5 - 7.6). Write down all the figures on your calculator display. You must give your answer as a decimal.',
        type: 'text-input',
        answer: 33.48705036,
        answerTolerance: 0.000001
      },
      {
        label: '(b)',
        question: 'Write your answer to part (a) correct to 1 significant figure.',
        type: 'text-input',
        answer: 30,
        answerTolerance: 0.1
      }
    ]
  },

  // Rounding (included in calculator exercises above)

  // Direct and Inverse Proportions
  {
    id: 4,
    topic: 'Direct and Inverse Proportions',
    question: 'p is inversely proportional to t. When t = 4, p = 12. Find the value of p when t = 6.',
    type: 'text-input',
    answer: 8,
    answerTolerance: 0.05,
    hint: 'If p ∝ 1/t, then p = k/t. Find k first.'
  },
  {
    id: 5,
    topic: 'Direct and Inverse Proportions',
    question: 'p is inversely proportional to t. If p = 8 when t = 15, find the value of p when t = 10.',
    type: 'text-input',
    answer: 12,
    answerTolerance: 0.05,
    hint: 'p = k/t, find k first'
  },
  {
    id: 6,
    topic: 'Direct and Inverse Proportions',
    question: 'M is inversely proportional to d. When d = 2, M = 15. Find the value of M when d = 10.',
    type: 'text-input',
    answer: 3,
    answerTolerance: 0.05,
    hint: 'If M ∝ 1/d, then M = k/d. Find k first using the given values.'
  },
  {
    id: 7,
    topic: 'Direct and Inverse Proportions',
    type: 'multi-part',
    question: 'y is directly proportional to the square of x. y = 48.6 when x = 3.',
    parts: [
      {
        label: '(a)',
        question: 'Find a formula for y in terms of x.',
        type: 'text-input',
        answer: 'y = 5.4x²'
      },
      {
        label: '(b)',
        question: 'Work out the value of y when x = 5.',
        type: 'text-input',
        answer: 135,
        answerTolerance: 0.5
      }
    ],
    hint: 'If y ∝ x², then y = kx². Use the given values to find k.'
  },

  // Quadratics Expansion and Factorisation
  {
    id: 8,
    topic: 'Quadratics Expansion and Factorisation',
    type: 'multi-part',
    question: 'Factorisation problems',
    parts: [
      {
        label: '(i)',
        question: 'Factorise x² - 13x + 36',
        type: 'text-input',
        answer: '(x-9)(x-4)'
      },
      {
        label: '(ii)',
        question: 'Solve the equation x² - 13x + 36 = 0',
        type: 'text-input',
        answer: '9, 4'
      },
      {
        label: '(a)',
        question: 'Factorise z² - 121',
        type: 'text-input',
        answer: '(z-11)(z+11)'
      }
    ],
    hint: 'Look for two numbers that multiply to give the constant and add to give the coefficient of x.'
  },
  {
    id: 9,
    topic: 'Quadratics Expansion and Factorisation',
    type: 'multi-part',
    question: 'Factorisation problems',
    parts: [
      {
        label: '(i)',
        question: 'Factorise x² - 7x - 18',
        type: 'text-input',
        answer: '(x-9)(x+2)'
      },
      {
        label: '(ii)',
        question: 'Solve the equation x² - 7x - 18 = 0',
        type: 'text-input',
        answer: '9, -2'
      },
      {
        label: '(a)',
        question: 'Factorise w² - 64',
        type: 'text-input',
        answer: '(w-8)(w+8)'
      }
    ],
    hint: 'For difference of squares: a² - b² = (a-b)(a+b)'
  },
  {
    id: 10,
    topic: 'Quadratics Expansion and Factorisation',
    question: 'Solve the equation by factorisation: x² - 3x - 28 = 0',
    type: 'text-input',
    answer: '7, -4',
    hint: 'Find two numbers that multiply to -28 and add to -3'
  },

  // Quadratics Involving Area and Perimeter
  {
    id: 11,
    topic: 'Quadratics Involving Area and Perimeter',
    question: 'A rectangle has width x cm and length (x + 4) cm. The perimeter of the rectangle is 45 cm. Work out the value of x.',
    type: 'text-input',
    answer: 9.25,
    answerTolerance: 0.05,
    hint: 'Perimeter = 2(width + length) = 45'
  },
  {
    id: 12,
    topic: 'Quadratics Involving Area and Perimeter',
    question: 'A rectangle has width (x-2) cm and length (2x+1) cm. The perimeter is 60 cm. Find the value of x.',
    type: 'text-input',
    answer: 10.5,
    answerTolerance: 0.05,
    hint: 'Perimeter = 2(width + length) = 60'
  },
  {
    id: 13,
    topic: 'Quadratics Involving Area and Perimeter',
    question: 'A rectangle has width (y + 3) cm and length (2y - 1) cm. The perimeter of the rectangle is 64 cm. Work out the value of y.',
    type: 'text-input',
    answer: 10,
    answerTolerance: 0.05,
    hint: 'Perimeter = 2(width + length) = 64'
  },

  // Pythagoras' Theorem
  {
    id: 14,
    topic: "Pythagoras' Theorem",
    question: 'PQR is a right-angled triangle with PQ = 2.10 m and QR = 4.40 m. The right angle is at Q. Calculate the length of PR. Give your answer correct to 3 significant figures.',
    type: 'text-input',
    answer: 4.87,
    answerTolerance: 0.01,
    hint: 'Use Pythagoras: PR² = PQ² + QR²'
  },
  {
    id: 15,
    topic: "Pythagoras' Theorem",
    question: 'UVW is a right-angled triangle with UV = 1.80 m and VW = 2.90 m. The right angle is at V. Calculate the length of UW. Give your answer correct to 3 significant figures.',
    type: 'text-input',
    answer: 3.42,
    answerTolerance: 0.01,
    hint: 'Use Pythagoras: UW² = UV² + VW²'
  },
  {
    id: 16,
    topic: "Pythagoras' Theorem",
    question: 'ABC is a right-angled triangle with AC = 14.2 cm and BC = 8.5 cm. The right angle is at B. Calculate the length of AB. Give your answer correct to 3 significant figures.',
    type: 'text-input',
    answer: 11.4,
    answerTolerance: 0.05,
    hint: 'Use Pythagoras: AC² = AB² + BC², so AB² = AC² - BC²'
  },

  // Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula
  {
    id: 17,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve the equation 2x² - 5x - 7 = 0. Give your solutions correct to 2 decimal places.',
    type: 'text-input',
    answer: '3.50, -1.00',
    hint: 'Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a'
  },
  {
    id: 18,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve x² - 8x - 5 = 0. Write your answer in the form a ± √b, where a and b are integers.',
    type: 'text-input',
    answer: '4 ± √21',
    hint: 'Complete the square: (x - 4)² = 21'
  },
  {
    id: 19,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve this equation algebraically. Give your solutions correct to 2 decimal places: 2x² - x - 10 = 0',
    type: 'text-input',
    answer: '2.50, -2.00',
    hint: 'Use the quadratic formula'
  },
  {
    id: 20,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve the equation 4x² + 3x - 1 = 0. Give your solutions correct to 2 decimal places.',
    type: 'text-input',
    answer: '0.25, -1.00',
    hint: 'Use the quadratic formula'
  },
  {
    id: 21,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve x² - 12x + 2 = 0. Write your answer in the form a ± √b, where a,b ∈ ℤ.',
    type: 'text-input',
    answer: '6 ± √34',
    hint: 'Complete the square: (x - 6)² = 34'
  },
  {
    id: 22,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve the equation algebraically. Give your solutions correct to 2 decimal places: 5x² - 14x - 3 = 0',
    type: 'text-input',
    answer: '2.99, -0.20',
    hint: 'Use the quadratic formula'
  },
  {
    id: 23,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve x² + 10x - 3 = 0. Write your answer in the form a ± √b where a and b are integers.',
    type: 'text-input',
    answer: '-5 ± √28',
    hint: 'Complete the square: (x + 5)² = 28'
  },
  {
    id: 24,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve this equation algebraically. Give your solutions correct to 2 decimal places: 5x² - 6x - 2 = 0',
    type: 'text-input',
    answer: '1.47, -0.27',
    hint: 'Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a'
  },

  // Simplify Algebraic Fractions
  {
    id: 25,
    topic: 'Simplify Algebraic Fractions',
    question: 'Choose the expression that is equivalent to 4x/(8x + 12)',
    type: 'multiple-choice',
    choices: ['x/(2x + 3)', '4/(8 + 12x)', 'x/(2x + 6)', '1/2 + x/3'],
    correctChoice: 0,
    hint: 'Factor out the common factor from the denominator first.'
  },
  {
    id: 26,
    topic: 'Simplify Algebraic Fractions',
    question: 'Choose the expression that is equivalent to 9x²/(12x² - 3)',
    type: 'multiple-choice',
    choices: ['3x²/(4x² - 1)', '3x/(4x - 3)', 'x²/(4x² - 3)', '9/(12 - 3x²)'],
    correctChoice: 0,
    hint: 'Factor out 3 from both numerator and denominator.'
  },

  // Adding, Subtracting, Multiplying and Dividing Algebraic Fractions
  {
    id: 27,
    topic: 'Adding, Subtracting, Multiplying and Dividing Algebraic Fractions',
    question: 'Write as a single fraction in its simplest form: 3/(x-2) - 2/(x+3)',
    type: 'text-input',
    answer: '(x+13)/((x-2)(x+3))',
    hint: 'Find a common denominator: (x-2)(x+3)'
  },
  {
    id: 28,
    topic: 'Adding, Subtracting, Multiplying and Dividing Algebraic Fractions',
    question: 'Write as a single fraction in its simplest form: 5/(y-4) - 3/(y+2)',
    type: 'text-input',
    answer: '(2y+22)/((y-4)(y+2))',
    hint: 'Common denominator: (y-4)(y+2)'
  },
  {
    id: 29,
    topic: 'Adding, Subtracting, Multiplying and Dividing Algebraic Fractions',
    question: 'Write as a single fraction in its simplest form: 3/(x-2) + 4/(x+5)',
    type: 'text-input',
    answer: '(7x+7)/((x-2)(x+5))',
    hint: 'Find a common denominator: (x-2)(x+5). Then combine the numerators.'
  },

  // Volume and Surface Area of 3D Shapes
  {
    id: 30,
    topic: 'Volume and Surface Area of 3D Shapes',
    question: 'A cylindrical tin has a radius of 7.2 cm and a height of 10.8 cm. A new tin will have a radius of 6.0 cm and the same volume as the large tin. Calculate the height of the new tin. Give your answer correct to 1 decimal place.',
    type: 'text-input',
    answer: 15.6,
    answerTolerance: 0.1,
    hint: 'Volume = πr²h. Set the volumes equal and solve for the new height.'
  },
  {
    id: 31,
    topic: 'Volume and Surface Area of 3D Shapes',
    question: 'A cylindrical tin has a radius of 6.8 cm and a height of 12.0 cm. A new tin is to be made with the same volume and a radius of 5.5 cm. Calculate the height of the new tin. Give your answer correct to 1 decimal place.',
    type: 'text-input',
    answer: 18.3,
    answerTolerance: 0.1,
    hint: 'Volume = πr²h. Set the volumes equal.'
  },
  {
    id: 32,
    topic: 'Volume and Surface Area of 3D Shapes',
    question: 'A large cylindrical tin has a radius of 8 cm and a height of 15 cm. A new tin will have a height of 10 cm and the same volume as the large tin. Calculate the radius of the new tin. Give your answer correct to one decimal place.',
    type: 'text-input',
    answer: 9.8,
    answerTolerance: 0.1,
    hint: 'Volume = πr²h. Set the volumes equal: π(8²)(15) = π(r²)(10)'
  },

  // Inverse Functions
  {
    id: 33,
    topic: 'Inverse Functions',
    question: 'Let f(x) = 5x - 9. Solve the equation f⁻¹(x) = x/3.',
    type: 'text-input',
    answer: 4.5,
    answerTolerance: 0.05,
    hint: 'First find f⁻¹(x), then solve f⁻¹(x) = x/3.'
  },
  {
    id: 34,
    topic: 'Inverse Functions',
    question: 'Let g(x) = -2x + 11. Solve the equation g⁻¹(x) = 4 - x.',
    type: 'text-input',
    answer: 1,
    answerTolerance: 0.05,
    hint: 'Find g⁻¹(x) first, then solve the equation.'
  },
  {
    id: 35,
    topic: 'Inverse Functions',
    question: 'The function f is defined as f(x) = 4x + 9. Solve f⁻¹(x) = x - 3.',
    type: 'text-input',
    answer: 1,
    answerTolerance: 0.05,
    hint: 'First find f⁻¹(x) by solving y = 4x + 9 for x. Then solve f⁻¹(x) = x - 3.'
  },

  // New exercises from Set B
  {
    id: 36,
    topic: 'Use of Calculator',
    type: 'multi-part',
    question: 'Calculator computation',
    parts: [
      {
        label: '(a)',
        question: 'Use your calculator to work out (√95.2 + 21.7)/(6.5² - 30.2). Write down all the figures on your calculator display.',
        type: 'text-input',
        answer: 2.6105434,
        answerTolerance: 0.000001
      },
      {
        label: '(b)',
        question: 'Write your answer to part (a) correct to 2 significant figures.',
        type: 'text-input',
        answer: 2.6,
        answerTolerance: 0.01
      }
    ]
  },
  {
    id: 37,
    topic: "Pythagoras' Theorem",
    question: 'ABC is a right-angled triangle with AC = 15.2 m and BC = 7.1 m. The right angle is at B. Calculate the length of AB. Give your answer correct to 3 significant figures.',
    type: 'text-input',
    answer: 13.4,
    answerTolerance: 0.05,
    hint: 'Use Pythagoras: AC² = AB² + BC², so AB² = AC² - BC²'
  },
  {
    id: 38,
    topic: 'Direct and Inverse Proportions',
    question: 'M is inversely proportional to d. When d = 8, M = 15. Find the value of M when d = 10.',
    type: 'text-input',
    answer: 12,
    answerTolerance: 0.05,
    hint: 'If M ∝ 1/d, then M = k/d. Find k first using the given values.'
  },
  {
    id: 39,
    topic: 'Volume and Surface Area of 3D Shapes',
    question: 'A large cylindrical tin has a radius of 8.2 cm and a height of 10.5 cm. A new tin will have a radius of 6.9 cm and the same volume as the large tin. Calculate the height of the new tin. Give your answer correct to one decimal place.',
    type: 'text-input',
    answer: 14.8,
    answerTolerance: 0.1,
    hint: 'Volume = πr²h. Set the volumes equal: π(8.2²)(10.5) = π(6.9²)(h)'
  },
  {
    id: 40,
    topic: 'Quadratics Expansion and Factorisation',
    question: 'Solve the equation by factorisation: x² + 4x - 21 = 0',
    type: 'text-input',
    answer: '3, -7',
    hint: 'Find two numbers that multiply to -21 and add to 4'
  },
  {
    id: 41,
    topic: 'Direct and Inverse Proportions',
    type: 'multi-part',
    question: 'y is directly proportional to the square of x. y = 75 when x = 5.',
    parts: [
      {
        label: '(a)',
        question: 'Find a formula for y in terms of x.',
        type: 'text-input',
        answer: 'y = 3x²'
      },
      {
        label: '(b)',
        question: 'Work out the value of y when x = 8.',
        type: 'text-input',
        answer: 192,
        answerTolerance: 0.5
      }
    ],
    hint: 'If y ∝ x², then y = kx². Use the given values to find k.'
  },
  {
    id: 42,
    topic: 'Adding, Subtracting, Multiplying and Dividing Algebraic Fractions',
    question: 'Write as a single fraction in its simplest form: 4/(x-2) + 3/(x+5)',
    type: 'text-input',
    answer: '(7x+14)/((x-2)(x+5))',
    hint: 'Find a common denominator: (x-2)(x+5). Then combine the numerators.'
  },
  {
    id: 43,
    topic: 'Quadratics Involving Area and Perimeter',
    question: 'An isosceles triangle has two equal sides of length (2y + 3) cm and a base of length y cm. The perimeter of the triangle is 36 cm. Work out the value of y.',
    type: 'text-input',
    answer: 6,
    answerTolerance: 0.05,
    hint: 'Perimeter = 2(2y + 3) + y = 36'
  },
  {
    id: 44,
    topic: 'Inverse Functions',
    question: 'The function f is defined as f(x) = 5x - 8. Solve f⁻¹(x) = x.',
    type: 'text-input',
    answer: 2,
    answerTolerance: 0.05,
    hint: 'First find f⁻¹(x) by solving y = 5x - 8 for x. Then solve f⁻¹(x) = x.'
  },
  
  // Additional unique exercises from LaTeX
  {
    id: 45,
    topic: 'Use of Calculator',
    type: 'multi-part',
    question: 'Calculator computation',
    parts: [
      {
        label: '(a)',
        question: 'Use your calculator to work out (38.5 × 14.2)/(18.4 - 5.9). Write down all the figures on your calculator display. You must give your answer as a decimal.',
        type: 'text-input',
        answer: 43.704,
        answerTolerance: 0.001
      },
      {
        label: '(b)',
        question: 'Write your answer to part (a) correct to 1 significant figure.',
        type: 'text-input',
        answer: 40,
        answerTolerance: 0.1
      }
    ]
  },
  {
    id: 46,
    topic: 'Direct and Inverse Proportions',
    type: 'multi-part',
    question: 'T is directly proportional to the cube of r. T = 21.76 when r = 4.',
    parts: [
      {
        label: '(a)',
        question: 'Find a formula for T in terms of r.',
        type: 'text-input',
        answer: 'T = 0.34r³'
      },
      {
        label: '(b)',
        question: 'Work out the value of T when r = 6.',
        type: 'text-input',
        answer: 73.44,
        answerTolerance: 0.1
      }
    ],
    hint: 'If T ∝ r³, then T = kr³. Use the given values to find k.'
  },
  {
    id: 47,
    topic: "Pythagoras' Theorem",
    question: 'XYZ is a right-angled triangle with XY = 1.35 m and YZ = 3.25 m. The right angle is at Y. Calculate the length of XZ. Give your answer correct to 3 significant figures.',
    type: 'text-input',
    answer: 3.52,
    answerTolerance: 0.01,
    hint: 'Use Pythagoras: XZ² = XY² + YZ²'
  },
  {
    id: 48,
    topic: 'Inverse Functions',
    question: 'g(x) = 3x + 7. Solve g⁻¹(x) = 2x.',
    type: 'text-input',
    answer: -7,
    answerTolerance: 0.05,
    hint: 'First find g⁻¹(x), then solve g⁻¹(x) = 2x.'
  },
  {
    id: 49,
    topic: 'Adding, Subtracting, Multiplying and Dividing Algebraic Fractions',
    question: 'Write as a single fraction in its simplest form: 2/(y+3) - 1/(y-6)',
    type: 'text-input',
    answer: '(y-15)/((y+3)(y-6))',
    hint: 'Find a common denominator: (y+3)(y-6). Then combine the numerators.'
  },
  {
    id: 50,
    topic: 'Quadratics Expansion and Factorisation',
    question: 'Solve the equation by factorisation: x² - 12x + 27 = 0',
    type: 'text-input',
    answer: '9, 3',
    hint: 'Find two numbers that multiply to 27 and add to -12'
  },
  {
    id: 51,
    topic: 'Volume and Surface Area of 3D Shapes',
    question: 'A large tin of pet food has the shape of a cylinder with radius 6.5 cm and height 11.5 cm. A new tin will have a radius of 5.8 cm and the same volume. Calculate the height of the new tin. Give your answer correct to one decimal place.',
    type: 'text-input',
    answer: 14.4,
    answerTolerance: 0.1,
    hint: 'Volume = πr²h. Set the volumes equal: π(6.5²)(11.5) = π(5.8²)(h)'
  },
  {
    id: 52,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve this equation algebraically. Give your solutions correct to 2 decimal places: 3x² + 8x - 5 = 0',
    type: 'text-input',
    answer: '0.52, -3.19',
    hint: 'Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a'
  },
  {
    id: 53,
    topic: 'Solving Quadratics by Factorisation, Completing the Square and Using the Quadratic Formula',
    question: 'Solve x² - 6x - 8 = 0. Write your answer in the form a ± √b where a and b are integers.',
    type: 'text-input',
    answer: '3 ± √17',
    hint: 'Complete the square: (x - 3)² = 17'
  }
];
