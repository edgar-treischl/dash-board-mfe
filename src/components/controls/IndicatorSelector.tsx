import React from 'react'

export interface IndicatorOption<T extends string = string> {
  key: T
  label: string
  icon: React.ReactNode
  value: number | string
  description?: string
  trend?: number
  trendUnit?: '%' | 'count' | 'decimal' // Unit for trend display
}

export interface IndicatorSelectorProps<T extends string = string> {
  options: IndicatorOption<T>[]
  selectedKey: T
  onSelect: (key: T) => void
  formatValue?: (value: number | string, key?: T) => string
  gridColumns?: string
  containerPadding?: string
  containerMarginBottom?: string
  className?: string
  testId?: string
  /** When false, disables the hover styling (e.g. for purely informational/KPI displays). Defaults to true. */
  interactive?: boolean
}

/**
 * IndicatorSelector - A reusable component for selecting metrics with icon, label, and value display
 * 
 * Features:
 * - Clean underline style with smooth transitions
 * - Icon + label + formatted value display
 * - Hover effects for unselected items
 * - Flexible grid layout via gridColumns prop
 * - TypeScript generic support for any string-keyed metric type
 * 
 * Usage:
 * ```tsx
 * <IndicatorSelector
 *   options={[
 *     { key: 'schools', label: 'Schulen', icon: <SchoolsIcon />, value: 42 },
 *     { key: 'students', label: 'Schüler', icon: <PupilsIcon />, value: 1200 },
 *   ]}
 *   selectedKey={selectedMetric}
 *   onSelect={setSelectedMetric}
 *   formatValue={(val) => val.toLocaleString()}
 * />
 * ```
 */
export function IndicatorSelector<T extends string = string>({
  options,
  selectedKey,
  onSelect,
  formatValue = (val) => String(val),
  gridColumns = 'repeat(auto-fit, minmax(120px, 1fr))',
  containerPadding = '0 24px',
  containerMarginBottom = '24px',
  className,
  testId,
  interactive = true,
}: IndicatorSelectorProps<T>) {
  return (
    <div
      data-testid={testId}
      className={className}
      style={{
        padding: containerPadding,
        marginBottom: containerMarginBottom,
      }}
    >
      <div
        style={{
          borderBottom: '1px solid var(--bydash-border)',
          paddingBottom: '12px',
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: '0',
        }}
      >
        {options.map((option) => {
          const isActive = selectedKey === option.key
          return (
            <button
              key={option.key}
              onClick={() => onSelect(option.key)}
              className={`bydash-mfe__indicator-select-btn ${isActive ? 'is-active' : ''}`}
              data-testid={`indicator-${option.key}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'transparent',
                color: isActive ? 'var(--bydash-accent)' : 'var(--bydash-text)',
                border: 'none',
                borderBottom: isActive
                  ? '2px solid var(--bydash-accent)'
                  : '2px solid transparent',
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontSize: '0.85rem',
                fontWeight: isActive ? '600' : '500',
                textAlign: 'center',
                width: '100%',
                minHeight: '80px',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (interactive && !isActive) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.color = 'var(--bydash-heading)'
                  btn.style.borderBottomColor = 'rgba(0, 141, 201, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (interactive && !isActive) {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.color = 'var(--bydash-text)'
                  btn.style.borderBottomColor = 'transparent'
                }
              }}
            >
              {/* Trend Badge - Top Right */}
              {option.trend !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    paddingLeft: '6px',
                    paddingRight: '6px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    backgroundColor: option.trend > 0 ? '#d1fae5' : option.trend < 0 ? '#fee2e2' : '#f3f4f6',
                    color: option.trend > 0 ? '#065f46' : option.trend < 0 ? '#7f1d1d' : '#374151',
                  }}
                  title={option.trend > 0 ? 'Positive trend' : option.trend < 0 ? 'Negative trend' : 'No change'}
                >
                  <span style={{ fontSize: '0.8rem' }}>
                    {option.trend > 0 ? '↑' : option.trend < 0 ? '↓' : '→'}
                  </span>
                  <span>
                    {option.trendUnit === '%'
                      ? Math.abs(option.trend).toFixed(1) + '%'
                      : option.trendUnit === 'count'
                      ? Math.round(Math.abs(option.trend))
                      : Math.abs(option.trend).toFixed(2)}
                  </span>
                </span>
              )}

              {/* Icon */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {option.icon}
              </div>

              {/* Label and Value */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: 0,
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '600' : '500',
                  }}
                >
                  {option.label}
                </strong>
                <div
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    color: isActive ? 'var(--bydash-accent)' : 'var(--bydash-text)',
                    opacity: isActive ? 1 : 0.8,
                    lineHeight: '1.2',
                  }}
                >
                  {formatValue(option.value, option.key)}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
