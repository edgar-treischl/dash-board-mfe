import { memo } from 'react'
import { SCHOOL_YEARS, type SchoolYear } from '../../retention'
import { SelectIcon } from './SelectIcon'
import './YearSelect.css'

type YearSelectProps = {
  selectedYear: SchoolYear
  onYearChange: (year: SchoolYear) => void
  label?: string
  disabled?: boolean
}

/**
 * Year selector dropdown component
 * 
 * Self-contained component designed for use in component libraries.
 * Includes all necessary styles in YearSelect.css.
 * 
 * @param selectedYear - Currently selected school year (e.g., "2020/21", "2021/22")
 * @param onYearChange - Callback when year selection changes
 * @param label - Optional custom label for the control (default: "Wählen Sie ein Schuljahr:")
 * @param disabled - Optional disabled state for the select element
 * 
 * @example
 * ```tsx
 * import { YearSelect } from '@controls/YearSelect'
 * 
 * function MyComponent() {
 *   const [year, setYear] = useState('2023/24')
 *   return (
 *     <YearSelect 
 *       selectedYear={year} 
 *       onYearChange={setYear}
 *       label="Choose year:"
 *     />
 *   )
 * }
 * ```
 * 
 * @remarks
 * CSS Variables used (with fallback defaults):
 * - --class-retention-heading: Text color for labels (default: #333)
 * - --class-retention-accent: Accent color for focus states (default: #008dc9)
 * - --class-retention-border: Border color (default: #e5e7eb)
 * - --class-retention-bg: Background color (default: #f9fafb)
 * - --class-retention-text: Secondary text color (default: #666)
 */
function YearSelectComponent({
  selectedYear,
  onYearChange,
  label = 'Wählen Sie ein Schuljahr:',
  disabled = false,
}: YearSelectProps) {
  return (
    <div className="class-retention-mfe__control-group">
      <div className="class-retention-mfe__control-label">
        <SelectIcon />
        <span>{label}</span>
      </div>
      <div className="class-retention-mfe__control-pair">
        <label htmlFor="year-select" className="class-retention-mfe__control-short-label">
          Schuljahr
        </label>
        <select
          id="year-select"
          className="class-retention-mfe__control-select"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value as SchoolYear)}
          disabled={disabled}
        >
          {SCHOOL_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export const YearSelect = memo(YearSelectComponent)

export type { YearSelectProps }
