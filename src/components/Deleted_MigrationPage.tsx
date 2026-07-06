import { memo } from 'react'
import {
  type SchoolYear,
  getMigrationData,
} from '../retention'
import { CITIZENSHIP_LEGEND_ITEMS } from '../config/chartConfig'
import { MIGRATION_INTERPRETATION } from '../config/interpretationContent'
import { DimensionalDataView } from './DimensionalDataView'

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

