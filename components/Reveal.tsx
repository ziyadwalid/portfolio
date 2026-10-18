import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  style?: CSSProperties
  amount?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  style,
  amount = 0.16,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={style}
      // Content stays visible even if a fast jump skips an observer step.
      // The entrance is a restrained upward settle rather than a hidden state.
      initial={reduceMotion ? false : { opacity: 1, y: 22 }}
      whileInView={reduceMotion ? undefined : { y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduceMotion ? 0 : 0.72,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
