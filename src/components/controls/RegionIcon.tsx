import './RegionIcon.css'

interface RegionIconProps {
  regionId: string
  width?: number
  height?: number
}

const REGION_SVG_NAMES: Record<string, string> = {
  oberbayern: 'oberbayern.svg',
  niederbayern: 'niederbayern.svg',
  oberpfalz: 'oberpfalz.svg',
  oberfranken: 'oberfranken.svg',
  mittelfranken: 'mittelfranken.svg',
  unterfranken: 'unterfranken.svg',
  schwaben: 'schwaben.svg',
}

export function RegionIcon({ regionId, width = 24, height = 24 }: RegionIconProps) {
  const svgName = REGION_SVG_NAMES[regionId]
  
  if (!svgName) {
    return null
  }

  // Construct path with BASE_URL to work with base: '/dash-board-mfe/'
  const svgPath = `${import.meta.env.BASE_URL}${svgName}`

  return (
    <img
      src={svgPath}
      alt=""
      width={width}
      height={height}
      className="region-icon"
      aria-hidden="true"
    />
  )
}
