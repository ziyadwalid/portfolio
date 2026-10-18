import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  titleA: string
  titleB: string
  intro?: string
  titleId: string
  aside?: ReactNode
  className?: string
}

export function SectionHeading({
  eyebrow,
  titleA,
  titleB,
  intro,
  titleId,
  aside,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('section-heading', className)}>
      <div className="section-heading__main">
        <span className="eyebrow section-heading__eyebrow">
          <span className="section-heading__marker" aria-hidden="true" />
          {eyebrow}
        </span>
        <h2 className="section-heading__title" id={titleId}>
          <span>{titleA}</span>{' '}
          <span className="section-heading__title-accent">{titleB}</span>
        </h2>
      </div>
      <div className="section-heading__aside">
        {intro ? <p className="section-heading__intro">{intro}</p> : null}
        {aside}
      </div>
    </div>
  )
}
