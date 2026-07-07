import './RegionIcon.css'
import oberbayernSvg from '../../assets/regions/oberbayern.svg?raw'
import niederbayernSvg from '../../assets/regions/niederbayern.svg?raw'
import oberpfalzSvg from '../../assets/regions/oberpfalz.svg?raw'
import oberfrankenSvg from '../../assets/regions/oberfranken.svg?raw'
import mittelfrankenSvg from '../../assets/regions/mittelfranken.svg?raw'
import unterfrankenSvg from '../../assets/regions/unterfranken.svg?raw'
import schwabenSvg from '../../assets/regions/schwaben.svg?raw'

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

function prepareSvgForInlining(svgContent: string, width: number, height: number): string {
  // Check if SVG already has viewBox
  if (svgContent.includes('viewBox')) {
    // Remove width and height attributes to let CSS control sizing
    return svgContent
      .replace(/width="[\d.]+"/g, '')
      .replace(/height="[\d.]+"/g, '')
      .replace(/<svg/, `<svg style="width:${width}px;height:${height}px"`)
  }
  
  // Extract width and height to create viewBox
  const widthMatch = svgContent.match(/width="([\d.]+)"/)
  const heightMatch = svgContent.match(/height="([\d.]+)"/)
  
  if (widthMatch && heightMatch) {
    const svgWidth = widthMatch[1]
    const svgHeight = heightMatch[1]
    return svgContent
      .replace(/width="[\d.]+"/g, '')
      .replace(/height="[\d.]+"/g, '')
      .replace(/<svg/, `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width:${width}px;height:${height}px"`)
  }
  
  return svgContent
}

export function RegionIcon({ regionId, width = 24, height = 24 }: RegionIconProps) {
  const svgContent = REGION_SVG_MAP[regionId]
  
  if (!svgContent) {
    return null
  }

  const modifiedSvg = prepareSvgForInlining(svgContent, width, height)

  return (
    <div
      className="region-icon"
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      aria-hidden="true"
    />
  )
}
