import { memo } from 'react'
import {
  type SchoolYear,
  getSexData,
} from '../retention.ts'
import { GENDER_LEGEND_ITEMS } from '../config/chartConfig.ts'
import { SEX_INTERPRETATION } from '../config/interpretationContent.tsx'
import { DimensionalDataView } from './DimensionalDataView.tsx'

type SexViewProps = {
  selectedYear: SchoolYear
  onYearChange: (year: SchoolYear) => void
}

function SexViewComponent({ selectedYear, onYearChange }: SexViewProps) {
  const allSexData = getSexData()

  return (
    <DimensionalDataView
      data={allSexData}
      selectedYear={selectedYear}
      onYearChange={onYearChange}
      legendItems={GENDER_LEGEND_ITEMS}
      legendLabel="Geschlecht"
      interpretationTabs={{
        befund: SEX_INTERPRETATION.befund,
        hinweis: SEX_INTERPRETATION.hinweis,
      }}
      ariaLabel="Gestapeltes Balkendiagramm der Wiederholungen nach Geschlecht und Schulart"
      yearSelectLabel="Wählen Sie ein Schuljahr"
    />
  )
}

export const SexView = memo(SexViewComponent)


