import { memo, useState } from 'react'
import { bavariaMetrics, regionMetrics } from '../data/bavaria'
import { BavariaInfoGrid } from './BavariaInfoGrid'
import { RegierungsbezirkeMapSVG as RegierungsbezirkeMap } from './charts/RegierungsMapSVG'
import { ViewSwitcher } from './controls/ViewSwitcher'
import { IndicatorSelector } from './controls/IndicatorSelector'
import { SchoolsIcon, PupilsIcon, ClassSizeIcon, StudentTeacherRelationIcon, GlobeIcon } from '../utils/icons'


type RegionalMetricKey = 'students_percent' | 'avgClassSize' | 'schools' | 'studentTeacherRatio' | 'teachersFTE' | 'migrantPercent'

type BavariaViewProps = {
  selectedMetric?: RegionalMetricKey
  onMetricChange?: (metric: RegionalMetricKey) => void
}

type ViewType = 'map' | 'chart' | 'table'

function BavariaViewComponent({
  selectedMetric: propSelectedMetric,
  onMetricChange: propOnMetricChange,
}: BavariaViewProps) {
  const [internalMetric, setInternalMetric] = useState<RegionalMetricKey>('students_percent')
  const [view, setView] = useState<ViewType>('map')

  // Helper function to safely get metric from bavariaMetrics
  const getMetricValue = (key: RegionalMetricKey): number => {
    if (key === 'students_percent') return bavariaMetrics.students
    return (bavariaMetrics as Record<string, number>)[key] || 0
  }

  // Helper to format metric value for feature grid display
  const formatMetricValue = (key: RegionalMetricKey, value: number): string => {
    if (key === 'studentTeacherRatio') return value.toFixed(2)
    if (key === 'avgClassSize') return value.toFixed(2)
    if (key === 'migrantPercent') return value.toFixed(2) + '%'
    return value.toLocaleString()
  }

  // Helper to get table header label with proper unit indication
  const getTableHeaderLabel = (key: RegionalMetricKey): string => {
    const baseLabel = metricLabels[key]
    if (key === 'students_percent' || key === 'migrantPercent') {
      return baseLabel + ' in %'
    }
    return baseLabel
  }

  // Helper to format table cell value
  const formatTableValue = (key: RegionalMetricKey, value: number): string => {
    if (key === 'students_percent' || key === 'migrantPercent') {
      return value.toFixed(2)
    }
    if (key === 'avgClassSize' || key === 'studentTeacherRatio') {
      return value.toFixed(2)
    }
    return value.toLocaleString()
  }
  
  const selectedMetric = propSelectedMetric || internalMetric
  const onMetricChange = propOnMetricChange || setInternalMetric

  const metricLabels: Record<RegionalMetricKey, string> = {
    students_percent: 'Schülerschaft',
    migrantPercent: 'Migrationshintergrund',
    teachersFTE: 'Lehrkräfte',
    studentTeacherRatio: 'Relation',
    avgClassSize: 'Klassengrößen',
    schools: 'Schulen',
   
  }

  const metricDescriptions: Record<RegionalMetricKey, string> = {
    students_percent: 'Anteil der Schüler und Schülerinnen (SuS) in Bayern:',
    migrantPercent: 'Anteil der SuS mit Migrationshintergrund in Bayern:',
    teachersFTE: 'Lehrkräfte (Vollzeitäquivalente) in Bayern:',
    studentTeacherRatio: 'Schüler-Lehrer-Relation in Bayern:',
    avgClassSize: 'Durchschnittliche Klassengröße in Bayern:',
    schools: 'Anzahl der Schulen in Bayern:',

    
  }

  const metricColors: Record<RegionalMetricKey, string> = {
    schools: '#3b82f6',
    students_percent: '#ef4444',
    avgClassSize: '#f59e0b',
    studentTeacherRatio: '#10b981',
    teachersFTE: '#8b5cf6',
    migrantPercent: '#06b6d4',
  }

  const metricIcons: Record<RegionalMetricKey, React.ReactNode> = {
    schools: <SchoolsIcon className="bydash-mfe__grid-icon" />,
    students_percent: <PupilsIcon className="bydash-mfe__grid-icon" />,
    avgClassSize: <ClassSizeIcon className="bydash-mfe__grid-icon" />,
    studentTeacherRatio: <StudentTeacherRelationIcon className="bydash-mfe__grid-icon" />,
    teachersFTE: <GlobeIcon className="bydash-mfe__grid-icon" />,
    migrantPercent: <GlobeIcon className="bydash-mfe__grid-icon" />,
  }

  // Sort regions by selected metric value
  const sortedRegions = [...regionMetrics].sort((a, b) => {
    return b[selectedMetric] - a[selectedMetric]
  })

  return (
    <div className="bydash-mfe__bavaria-container" style={{ width: '100%', margin: '0', padding: '24px', boxSizing: 'border-box' }}>
      
      {/* Main Card Container */}
      <div style={{
        background: 'var(--bydash-surface)',
        border: '1px solid var(--bydash-border)',
        borderRadius: '18px',
        boxShadow: 'var(--bydash-shadow)',
        overflow: 'hidden'
      }}>
        
        {/* Selection Grid Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid var(--bydash-border)',
          background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.02), transparent)'
        }}>
          <h1 className="bydash-mfe__selection-title" style={{ marginBottom: '6px' }}>Bayern im Überblick</h1>
          <small style={{ color: 'var(--bydash-text)', fontSize: '0.875rem' }}>Wählen Sie einen Indikator zur Analyse der bayerischen Regierungsbezirke.</small>
        </div>

        {/* Selection Grid */}
        <div style={{ padding: '24px' }}>
          <IndicatorSelector<RegionalMetricKey>
            options={(Object.keys(metricLabels) as RegionalMetricKey[]).map((key) => ({
              key,
              label: metricLabels[key],
              icon: metricIcons[key],
              value: getMetricValue(key),
            }))}
            selectedKey={selectedMetric}
            onSelect={onMetricChange}
            formatValue={(val) => formatMetricValue(selectedMetric, val as number)}
            gridColumns="repeat(6, 1fr)"
            containerPadding="0"
            containerMarginBottom="0"
          />
        </div>   

        {/* Graph/Map Section */}
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--bydash-border)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              {/* Chart Card */}
              <div style={{
                border: '1px solid var(--bydash-border)',
                borderRadius: '12px',
                background: 'var(--bydash-bg)',
                overflow: 'hidden'
              }}>
            {/* Card Header */}
            <div className="bydash-mfe__story-header">
              <h3 className="bydash-mfe__story-heading">{metricLabels[selectedMetric]} nach Regierungsbezirk</h3>
            </div>

            {/* View selector using semantic nav element */}
            <ViewSwitcher
              options={[
                { key: 'map', label: 'Karte' },
                { key: 'chart', label: 'Diagramm' },
                { key: 'table', label: 'Daten' },
              ]}
              activeKey={view}
              onSelect={(selectedView) => setView(selectedView as ViewType)}
              ariaLabel="Ansichtsauswahl für Regierungsbezirke"
              variant="underline"
            />
            <div className="bydash-mfe__card-heading"></div>

            <div className="bydash-mfe__chart-frame">

              {view === 'map' && (
                <RegierungsbezirkeMap selectedMetric={selectedMetric} regions={regionMetrics} />
              )}
              
              {view === 'chart' && (
                <svg width="100%" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                  
                  {/* Grid lines and scale labels */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const maxValue = Math.max(...regionMetrics.map(r => r[selectedMetric]))
                    const xPos = 200 + ratio * 600
                    const value = Math.round(maxValue * ratio)
                     
                    return (
                      <g key={`scale-${ratio}`}>
                        <line
                          x1={xPos}
                          y1="50"
                          x2={xPos}
                          y2={50 + sortedRegions.length * 50}
                          stroke="#e5e7eb"
                          strokeDasharray="2,2"
                          opacity="0.5"
                        />
                        <text
                          x={xPos}
                          y={50 + sortedRegions.length * 50 + 20}
                          fontSize="14"
                          fill="#6b7280"
                          textAnchor="middle"
                          fontWeight="500"
                        >
                          {value.toLocaleString()}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Bars and labels */}
                  {sortedRegions.map((region, idx) => {
                    const maxValue = Math.max(...regionMetrics.map(r => r[selectedMetric]))
                    const barWidth = (region[selectedMetric] / maxValue) * 600
                    const yPos = idx * 50 + 50
                     
                    return (
                      <g key={region.id}>
                        {/* Region label */}
                        <text
                          x="10"
                          y={yPos + 20}
                          fontSize="18"
                          fill="#374151"
                          fontWeight="500"
                        >
                          {region.shortName}
                        </text>
                         
                        {/* Bar */}
                        <rect
                          x="200"
                          y={yPos + 3}
                          width={barWidth}
                          height="30"
                          fill={metricColors[selectedMetric]}
                          opacity="0.85"
                          rx="4"
                        />
                         
                        {/* Value label on top of bar (end of bar) */}
                        <text
                          x={200 + barWidth + 8}
                          y={yPos + 20}
                          fontSize="16"
                          fill="#374151"
                          fontWeight="600"
                          dominantBaseline="middle"
                        >
                          {region[selectedMetric].toLocaleString()}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* X-axis label */}
                  <text
                    x="500"
                    y={50 + sortedRegions.length * 50 + 50}
                    fontSize="16"
                    fill="#6b7280"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Wert
                  </text>
                </svg>
              )}

              {view === 'table' && (
                <div style={{ padding: '0.25rem', overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                        <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap' }}>Regierungsbezirk</th>
                        {(Object.keys(metricLabels) as RegionalMetricKey[]).map((key) => (
                          <th key={key} style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap' }}>
                            {getTableHeaderLabel(key)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {regionMetrics.map((region, idx) => (
                        <tr 
                          key={region.id} 
                          style={{ 
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                            borderBottom: '1px solid #e5e7eb',
                          }}
                        >
                          <td style={{ padding: '6px 8px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>
                            {region.shortName}
                          </td>
                          {(Object.keys(metricLabels) as RegionalMetricKey[]).map((key) => (
                            <td 
                              key={key} 
                              style={{ 
                                padding: '6px 8px', 
                                textAlign: 'right', 
                                color: '#4b5563',
                                fontVariantNumeric: 'tabular-nums',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {formatTableValue(key, region[key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Info Grid Container - Right column of grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <BavariaInfoGrid
              selectedMetric={selectedMetric}
              metricLabels={metricLabels}
              metricDescriptions={metricDescriptions}
              formatMetricValue={formatMetricValue}
              bavariaValue={getMetricValue(selectedMetric)}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export const BavariaView = memo(BavariaViewComponent)
