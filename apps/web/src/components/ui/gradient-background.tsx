'use client';

import * as React from 'react';
import { HTMLMotionProps, motion, type Transition } from 'motion/react';
import { cn } from 'src/lib/utils';

type GradientTheme = 'vortex' | 'odisseia' | 'persona' | 'alma';

type GradientBackgroundProps = HTMLMotionProps<'div'> & {
  transition?: Transition;
  theme?: GradientTheme;
};

const getGradientClasses = (theme: GradientTheme = 'vortex') => {
  const gradients = {
    vortex: 'from-purple-900 via-purple-700 to-purple-800', // Roxo escuro
    odisseia: 'from-red-900 via-red-700 to-red-800', // Vermelho
    persona: 'from-purple-400 via-purple-500 to-purple-600', // Lilás
    alma: 'from-teal-600 via-teal-500 to-teal-700', // Turquesa
  };
  
  return `size-full bg-gradient-to-br ${gradients[theme]} from-0% via-50% to-100% bg-[length:300%_300%]`;
};

function GradientBackground({
  className,
  transition = { duration: 10, ease: 'easeInOut', repeat: Infinity },
  theme = 'vortex',
  ...props
}: GradientBackgroundProps) {
  return (
    <motion.div
      data-slot="gradient-background"
      className={cn(
        getGradientClasses(theme),
        className,
      )}
      animate={{
        backgroundPosition: ['0% 0%', '50% 50%', '100% 0%', '50% 100%', '0% 50%', '100% 100%', '0% 0%'],
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={transition}
      {...props}
    />
  );
}

export { GradientBackground, type GradientBackgroundProps };
