import { memo, useState } from 'react'
import { SCHOOL_YEARS, getTimeSeriesData, type SchoolType, type RetentionDatum } from '../retention.ts'
import { LineChart, LineChartLegend } from './charts/LineChart.tsx'
import { SelectIcon } from './icons/SelectIcon.tsx'
import { InterpretationBox } from './InterpretationBox.tsx'

function TrendViewComponent() {
  const allYearsAvailable = SCHOOL_YEARS.map(sy => parseInt(sy.split('/')[0])).sort((a, b) => a - b)
  const [minYear, setMinYear] = useState(allYearsAvailable[0])
  const [maxYear, setMaxYear] = useState(allYearsAvailable[allYearsAvailable.length - 1])
  const [highlightedSelect, setHighlightedSelect] = useState<'min' | 'max' | null>(null)

  const handleSelectChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setMinYear(value)
    } else {
      setMaxYear(value)
    }
    setHighlightedSelect(type)
    setTimeout(() => setHighlightedSelect(null), 1000)
  }
  
  const timeSeriesData = getTimeSeriesData()
  
  // Filter data by year range
  const filteredTimeSeriesData = new Map<SchoolType, RetentionDatum[]>()
  timeSeriesData.forEach((data, schoolType) => {
    const filtered = data.filter(d => {
      const year = parseInt(d.year)
      return year >= minYear && year <= maxYear
    })
    if (filtered.length > 0) {
      filteredTimeSeriesData.set(schoolType, filtered)
    }
  })

  // Build interpretation tabs
  const interpretationTabs = {
    befund: {
      label: 'Befund',
      content: (
        <div>
          <p className="class-retention-mfe__story-text">
            Das Liniendiagramm zeigt die jährlichen Wiederholungsquoten für verschiedene Schultypen im Zeitverlauf. Die Pandemie hat dabei zu signifikanten Verschiebungen geführt.
          </p>
          <ul className="class-retention-mfe__story-text" style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: 0, marginTop: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Relativ stabiler Trend:</strong> Die Wiederholungsquoten waren bis zur Pandemie nach Schularten relativ konsistent.
            </li>

            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Starker Rückgang in 2020/21:</strong> Schulen führten während der Pandemie Sonderregelungen ein, die großzügigere Versetzungsentscheidungen ermöglichten.
            </li>

            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Wiederanstieg ab 2021/22:</strong> Die Wiederholungsquoten kehren auf das Vor-Pandemie-Niveau zurück und stabilisieren sich wieder.
            </li>
          </ul>
        </div>
      ),
    },
    hinweis: {
      label: 'Hinweis',
      content: (
        <p className="class-retention-mfe__story-text class-retention-mfe__story-text--italic">
          Die deutlichen Schwankungen im Zeitverlauf spiegeln die Auswirkungen von Schulpolitik und Kriseneingriffen wider. Der Zeitverlauf zeigt, dass die Wiederholungsquote auch von institutionellen Faktoren der Bildungspolitik abhängen, nicht nur von Leistungsunterschieden.
        </p>
      ),
    },
  }

  return (
    <>
      <section className="class-retention-mfe__dataset-layout">
        <div className="class-retention-mfe__dataset-left">
          <div className="class-retention-mfe__chart-card">
            <div className="class-retention-mfe__card-heading"></div>

            {/* Year range controls */}
            <div className="class-retention-mfe__controls-section">
              <div className="class-retention-mfe__control-group">
                <div className="class-retention-mfe__control-label">
                  <SelectIcon />
                  <span>Wählen Sie einen Zeitraum:</span>
                </div>
                <div className="class-retention-mfe__control-pairs">
                  <div className="class-retention-mfe__control-pair">
                    <label htmlFor="min-year-select" className="class-retention-mfe__control-short-label">
                      Startjahr
                    </label>
                    <select
                      id="min-year-select"
                      className={`class-retention-mfe__control-select ${highlightedSelect === 'min' ? 'class-retention-mfe__control-select--active' : ''}`}
                      value={minYear}
                      onChange={(e) => handleSelectChange('min', parseInt(e.target.value))}
                    >
                      {allYearsAvailable.map((year) => (
                        <option key={year} value={year} disabled={year > maxYear}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="class-retention-mfe__control-pair">
                    <label htmlFor="max-year-select" className="class-retention-mfe__control-short-label">
                      Endjahr
                    </label>
                    <select
                      id="max-year-select"
                      className={`class-retention-mfe__control-select ${highlightedSelect === 'max' ? 'class-retention-mfe__control-select--active' : ''}`}
                      value={maxYear}
                      onChange={(e) => handleSelectChange('max', parseInt(e.target.value))}
                    >
                      {allYearsAvailable.map((year) => (
                        <option key={year} value={year} disabled={year < minYear}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="class-retention-mfe__chart-frame">
              <LineChart data={filteredTimeSeriesData} minYear={minYear} maxYear={maxYear} />
              <LineChartLegend />
            </div>
          </div>
        </div>

        <div className="class-retention-mfe__dataset-right">
          <InterpretationBox tabs={interpretationTabs} defaultTab="befund" title="Interpretation" />
        </div>
      </section>
    </>
  )
}

export const TrendView = memo(TrendViewComponent)
