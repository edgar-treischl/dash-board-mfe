import { memo } from 'react'

export type TrendMetricKey = 
  | 'schools_change' 
  | 'students_change' 
  | 'avgClassSize_change' 
  | 'teachersFTE_change' 
  | 'studentTeacherRatio_change' 
  | 'migrantPercent_change'

interface TrendIndicatorProps {
  label: string
  value: number
  unit?: string
  formatValue?: (val: number) => string
  showArrow?: boolean
}

const TrendIndicatorItem = memo(({
  label,
  value,
  unit = '',
  formatValue = (val) => val.toFixed(2),
  showArrow = true
}: TrendIndicatorProps) => {
  const isPositive = value > 0
  const isNegative = value < 0

  const arrowColor = isPositive ? '#10b981' : isNegative ? '#ef4444' : '#9ca3af'
  const arrowSvg = isPositive 
    ? '↑' 
    : isNegative 
    ? '↓' 
    : '→'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'var(--bydash-bg)',
        border: '1px solid var(--bydash-border)',
        transition: 'all 0.2s ease',
      }}
      className="bydash-mfe__trend-indicator"
    >
      {/* Label */}
      <div style={{ fontSize: '0.875rem', color: 'var(--bydash-text)', fontWeight: '500' }}>
        {label}
      </div>

      {/* Trend Value with Arrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
        }}
      >
        {showArrow && (
          <span
            style={{
              fontSize: '1.5rem',
              color: arrowColor,
              fontWeight: 'bold',
              lineHeight: '1',
            }}
            title={isPositive ? 'Positive trend' : isNegative ? 'Negative trend' : 'No change'}
          >
            {arrowSvg}
          </span>
        )}

        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: arrowColor,
          }}
        >
          {formatValue(Math.abs(value))}
          {unit && <span style={{ fontSize: '0.875rem', marginLeft: '4px' }}>{unit}</span>}
        </span>
      </div>

      {/* Trend description */}
      <div
        style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          fontWeight: '500',
        }}
      >
        {isPositive ? 'Anstieg' : isNegative ? 'Rückgang' : 'Unverändert'}
      </div>

      {/* Progress bar indicator */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e5e7eb',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: Math.abs(value) > 100 ? '100%' : `${Math.abs(value)}%`,
            backgroundColor: arrowColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
})

TrendIndicatorItem.displayName = 'TrendIndicatorItem'

export const TrendIndicator = memo(TrendIndicatorItem)
