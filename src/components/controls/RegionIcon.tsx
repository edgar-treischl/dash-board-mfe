import './RegionIcon.css'
import oberbayernSvg from '../../assets/regions/oberbayern.svg?url'
import niederbayernSvg from '../../assets/regions/niederbayern.svg?url'
import oberpfalzSvg from '../../assets/regions/oberpfalz.svg?url'
import oberfrankenSvg from '../../assets/regions/oberfranken.svg?url'
import mittelfrankenSvg from '../../assets/regions/mittelfranken.svg?url'
import unterfrankenSvg from '../../assets/regions/unterfranken.svg?url'
import schwabenSvg from '../../assets/regions/schwaben.svg?url'

interface RegionIconProps {
  regionId: string
  width?: number
  height?: number
}

const REGION_SVG_MAP: Record<string, string> = {
  oberbayern: oberbayernSvg,
  niederbayern: niederbayernSvg,
  oberpfalz: oberpfalzSvg,
  oberfranken: oberfrankenSvg,
  mittelfranken: mittelfrankenSvg,
  unterfranken: unterfrankenSvg,
  schwaben: schwabenSvg,
}

export function RegionIcon({ regionId, width = 24, height = 24 }: RegionIconProps) {
  const svgPath = REGION_SVG_MAP[regionId]
  
  if (!svgPath) {
    return null
  }

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
