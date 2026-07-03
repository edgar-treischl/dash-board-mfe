import { memo } from 'react'
import type { ReactNode } from 'react'

type TextBoxVariant = 'intro' | 'conclusion'

type TextBoxProps = {
  variant: TextBoxVariant
  children: ReactNode
  title?: string
}

const getVariantStyles = (variant: TextBoxVariant) => {
  const baseStyles = {
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '2rem',
  }

  switch (variant) {
    case 'intro':
      return {
        ...baseStyles,
        backgroundColor: 'white',
        border: '1px solid var(--class-retention-accent)',
      }
    case 'conclusion':
      return {
        ...baseStyles,
        backgroundColor: 'white',
        borderLeft: '4px solid var(--class-retention-text)',
        fontStyle: 'italic',
        paddingLeft: '1rem',
      }
    default:
      return baseStyles
  }
}

function TextBoxComponent({ variant, children, title }: TextBoxProps) {
  return (
    <div style={getVariantStyles(variant)}>
      {title && (
        <h4
          className="class-retention-mfe__story-text"
          style={{ fontWeight: 600, marginTop: 0, marginBottom: '1rem' }}
        >
          {title}
        </h4>
      )}
      <div className="class-retention-mfe__story-text">{children}</div>
    </div>
  )
}

export const TextBox = memo(TextBoxComponent)
