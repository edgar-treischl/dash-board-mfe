import { memo } from 'react'
import { regions } from '../../data/bavaria.ts'
import { RegionIcon } from './RegionIcon'
import './RegionSelect.css'

type RegionSelectProps = {
  selectedRegionId: string
  onRegionChange: (regionId: string) => void
  label?: string
  disabled?: boolean
}

/**
 * Region selector dropdown component
 * 
 * Self-contained component for selecting Bavarian regions.
 * Displays region icon alongside the control on a single line.
 * 
 * @param selectedRegionId - Currently selected region ID
 * @param onRegionChange - Callback when region selection changes
 * @param label - Optional custom label for the control (default: "Wählen Sie eine Region:")
 * @param disabled - Optional disabled state for the select element
 */
function RegionSelectComponent({
  selectedRegionId,
  onRegionChange,
  label = 'Wählen Sie eine Region:',
  disabled = false,
}: RegionSelectProps) {
  const currentRegion = regions.find(r => r.id === selectedRegionId) || regions[0]

  return (
    <div className="class-retention-mfe__region-control-wrapper">
      <div className="class-retention-mfe__region-control-group">
        <div className="class-retention-mfe__region-control-label">
          <span>{label}</span>
        </div>
        <div className="class-retention-mfe__region-control-pair">
          <label htmlFor="region-select" className="class-retention-mfe__region-control-short-label">
            Region
          </label>
          <select
            id="region-select"
            className="class-retention-mfe__region-control-select"
            value={selectedRegionId}
            onChange={(e) => onRegionChange(e.target.value)}
            disabled={disabled}
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="class-retention-mfe__region-icon-container">
        <RegionIcon regionId={currentRegion.id} width={96} height={96} />
      </div>
    </div>
  )
}

export const RegionSelect = memo(RegionSelectComponent)

export type { RegionSelectProps }
