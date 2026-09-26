import './RegionIcon.css'
import bayernSvg from '../../assets/regions/bayern.svg?raw'

interface BayernIconProps {
  width?: number
  height?: number
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

export function BayernIcon({ width = 24, height = 24 }: BayernIconProps) {
  const modifiedSvg = prepareSvgForInlining(bayernSvg, width, height)

  return (
    <div
      className="region-icon"
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      aria-hidden="true"
    />
  )
}
