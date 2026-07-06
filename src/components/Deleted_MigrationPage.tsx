import { memo } from 'react'
import {
  type SchoolYear,
  getMigrationData,
} from '../retention.ts'
import { CITIZENSHIP_LEGEND_ITEMS } from '../config/chartConfig.ts'
import { MIGRATION_INTERPRETATION } from '../config/interpretationContent.tsx'
import { DimensionalDataView } from './DimensionalDataView.tsx'

type MigrationViewProps = {
  selectedYear: SchoolYear
  onYearChange: (year: SchoolYear) => void
}

function MigrationViewComponent({ selectedYear, onYearChange }: MigrationViewProps) {
  const allMigrationData = getMigrationData()

  return (
    <DimensionalDataView
      data={allMigrationData}
      selectedYear={selectedYear}
      onYearChange={onYearChange}
      legendItems={CITIZENSHIP_LEGEND_ITEMS}
      legendLabel="Herkunft"
      interpretationTabs={{
        befund: MIGRATION_INTERPRETATION.befund,
        hinweis: MIGRATION_INTERPRETATION.hinweis,
      }}
      ariaLabel="Gestapeltes Balkendiagramm der Wiederholungen nach Herkunft und Schulart"
      yearSelectLabel="Wählen Sie ein Schuljahr"
    />
  )
}

export const MigrationView = memo(MigrationViewComponent)

