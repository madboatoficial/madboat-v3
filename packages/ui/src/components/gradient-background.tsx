'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';

type GradientTheme = 'vortex' | 'odisseia' | 'persona' | 'alma';

interface GradientBackgroundProps {
  theme?: GradientTheme;
  className?: string;
  transition?: Transition;
}

const getGradientClasses = (theme: GradientTheme = 'vortex') => {
  const gradients = {
    vortex: 'from-purple-900 via-purple-700 to-purple-800', // Roxo escuro
    odisseia: 'from-red-900 via-red-700 to-red-800', // Vermelho
    persona: 'from-purple-400 via-purple-500 to-purple-600', // Lilás
    alma: 'from-teal-600 via-teal-500 to-teal-700', // Turquesa
  };
  
  return `absolute inset-0 bg-gradient-to-br ${gradients[theme]} opacity-20 bg-[length:300%_300%]`;
};

function GradientBackground({
  theme = 'vortex',
  className = '',
  transition = { duration: 10, ease: 'easeInOut', repeat: Infinity }
}: GradientBackgroundProps) {
  return (
    <motion.div 
      className={`${getGradientClasses(theme)} ${className}`}
      animate={{
        backgroundPosition: ['0% 0%', '50% 50%', '100% 0%', '50% 100%', '0% 50%', '100% 100%', '0% 0%'],
      }}
      transition={transition}
      key={theme} // Force re-render when theme changes for smooth transition
    />
  );
}

export { GradientBackground, type GradientBackgroundProps, type GradientTheme };