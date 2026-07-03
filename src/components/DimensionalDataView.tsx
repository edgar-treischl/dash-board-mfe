import { memo, type ReactNode } from 'react'
import { type SchoolYear, type DisaggregatedDatum } from '../retention.ts'
import { StackedBarChart, StackedBarChartLegend } from './charts/StackedBarChart.tsx'
import { YearSelect } from './controls'
import { InterpretationBox } from './InterpretationBox.tsx'

export type LegendItem = {
  label: string
  color: string
}

export type InterpretationTab = {
  label: string
  content: ReactNode
}

type DimensionalDataViewProps = {
  /**
   * All data for this dimension (e.g., sex or migration data)
   */
  data: DisaggregatedDatum[]
  
  /**
   * Currently selected school year
   */
  selectedYear: SchoolYear
  
  /**
   * Callback when year is changed
   */
  onYearChange: (year: SchoolYear) => void
  
  /**
   * Legend items with labels and colors
   */
  legendItems: LegendItem[]
  
  /**
   * Legend label (e.g., "Geschlecht", "Herkunft")
   */
  legendLabel: string
  
  /**
   * Interpretation tabs (befund, hinweis, etc.)
   */
  interpretationTabs: Record<string, InterpretationTab>
  
  /**
   * ARIA label for the chart
   */
  ariaLabel: string
  
  /**
   * Optional label for year select control
   */
  yearSelectLabel?: string
}

/**
 * Generic reusable component for displaying disaggregated retention data (sex/gender, migration/citizenship)
 * Reduces code duplication between SexPage and MigrationPage
 */
function DimensionalDataViewComponent({
  data,
  selectedYear,
  onYearChange,
  legendItems,
  legendLabel,
  interpretationTabs,
  ariaLabel,
  yearSelectLabel = 'Wählen Sie ein Schuljahr',
}: DimensionalDataViewProps) {
  // Filter data for selected year
  const yearData = data.filter((d: DisaggregatedDatum) => d.syear === selectedYear)

  return (
    <>
      <section className="class-retention-mfe__dataset-layout">
        <div className="class-retention-mfe__dataset-left">
          <div className="class-retention-mfe__chart-card">
            <div className="class-retention-mfe__card-heading"></div>

            {/* Year selection */}
            <div className="class-retention-mfe__controls-section">
              <YearSelect
                selectedYear={selectedYear}
                onYearChange={onYearChange}
                label={yearSelectLabel}
              />
            </div>

            <div className="class-retention-mfe__chart-frame">
              <StackedBarChart
                data={yearData}
                year={selectedYear}
                ariaLabel={ariaLabel}
                legendItems={legendItems}
              />
              <StackedBarChartLegend legendItems={legendItems} label={legendLabel} />
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

export const DimensionalDataView = memo(DimensionalDataViewComponent)
