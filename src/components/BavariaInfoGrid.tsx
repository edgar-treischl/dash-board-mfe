import { memo } from 'react'
import { regionMetrics } from '../data/bavaria'
import { BayernIcon } from './controls/BayernIcon'

type RegionalMetricKey = 'students_percent' | 'avgClassSize' | 'schools' | 'studentTeacherRatio' | 'teachersFTE' | 'migrantPercent'

type BavariaInfoGridProps = {
  selectedMetric: RegionalMetricKey
  metricLabels: Record<RegionalMetricKey, string>
  metricDescriptions: Record<RegionalMetricKey, string>
  formatMetricValue: (key: RegionalMetricKey, value: number) => string
  bavariaValue: number
}

function BavariaInfoGridComponent({
  selectedMetric,
  metricLabels,
  metricDescriptions,
  formatMetricValue,
  bavariaValue,
}: BavariaInfoGridProps) {
  // Calculate min, max, average from regionMetrics for the selected metric
  const values = regionMetrics.map(r => r[selectedMetric])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length

  // Find regions with min/max values
  const minRegion = regionMetrics.find(r => r[selectedMetric] === minValue)
  const maxRegion = regionMetrics.find(r => r[selectedMetric] === maxValue)

  const formatValue = (value: number | null): string => {
    if (value === null) return '—'
    return formatMetricValue(selectedMetric, value)
  }

  return (
    <div style={{
      border: '1px solid var(--bydash-border)',
      borderRadius: '12px',
      background: 'var(--bydash-bg)',
      overflow: 'hidden',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: 'fit-content',
    }}>
      {/* Bayern Identification */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '28px', borderBottom: '1px solid var(--bydash-border)' }}>
        <div style={{ width: '45px', height: '45px', flexShrink: 0 }}>
          <BayernIcon width={45} height={45} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Bayern</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0,  marginBottom: '4px' }}>
            In Zahlen
          </div>
        </div>
      </div>

      {/* Metric Definition Header */}
      <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--bydash-border)' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px', marginTop: 0, color: 'var(--bydash-primary)' }}>
          {metricLabels[selectedMetric]}
        </h3>
        <p style={{ fontSize: '0.95rem', opacity: 0.7, marginBottom: 0, marginTop: 0, fontWeight: '500' }}>
          {metricDescriptions[selectedMetric]}
        </p>
      </div>

      {/* Bavaria Total */}
      <div style={{
        padding: '16px',
        border: '1px solid var(--bydash-border)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        textAlign: 'center',
        background: 'rgba(37, 99, 235, 0.04)',
      }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--bydash-text)', fontWeight: '600' }}>
          Bayern (Gesamt)
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--bydash-primary)', marginTop: '4px' }}>
          {formatValue(bavariaValue)}
        </div>
      </div>

      {/* Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {/* Average */}
        <div style={{
          padding: '12px',
          border: '1px solid var(--bydash-border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--bydash-text)', fontWeight: '600' }}>
            Durchschnitt
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--bydash-primary)' }}>
            {formatValue(avgValue)}
          </div>
        </div>

        {/* Minimum */}
        <div style={{
          padding: '12px',
          border: '1px solid var(--bydash-border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--bydash-text)', fontWeight: '600' }}>
            Niedrigster Wert
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--bydash-text)', opacity: 0.65, fontWeight: '600' }}>
            {minRegion ? minRegion.shortName : 'Keine Daten verfügbar'}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--bydash-primary)' }}>
            {formatValue(minValue)}
          </div>
        </div>

        {/* Maximum */}
        <div style={{
          padding: '12px',
          border: '1px solid var(--bydash-border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--bydash-text)', fontWeight: '600' }}>
            Höchster Wert
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--bydash-text)', opacity: 0.65, fontWeight: '600' }}>
            {maxRegion ? maxRegion.shortName : 'Keine Daten verfügbar'}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--bydash-primary)' }}>
            {formatValue(maxValue)}
          </div>
        </div>
      </div>
    </div>
  )
}

export const BavariaInfoGrid = memo(BavariaInfoGridComponent)
