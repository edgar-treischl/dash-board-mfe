
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { memo, useState } from "react";
import { scaleSequential } from "d3-scale";
import { interpolateViridis } from "d3-scale-chromatic";

type MetricKey = 'schools' | 'students' | 'teachersFTE' | 'avgClassSize'

type RegierungsMapProps = {
  selectedMetric: MetricKey
  regions: Array<{
    id: string
    name: string
    shortName: string
    metrics: Record<MetricKey, number>
  }>
}

// Use the dissolved Regierungsbezirke TopoJSON file (internal boundaries removed, single shape per region)
// Shapefile is saved in public/ folder and served at BASE_URL + filename
// Based on NUTS2 data for Bavaria (DE2*): GISCO 2021, resolution 20m
const REGIERUNGSBEZIRKE_TOPOJSON = `${import.meta.env.BASE_URL}bavaria-regierungsbezirke-dissolved.topojson`;

const metricLabels: Record<MetricKey, string> = {
  schools: 'Schulen',
  students: 'Schüler',
  teachersFTE: 'Lehrkräfte (VZÄ)',
  avgClassSize: 'Ø Klassengröße',
}

function formatValue(value: number): string {
  return value.toLocaleString('de-DE', {
    maximumFractionDigits: 0,
  });
}

// Calculate nice round breaks for legend
// function calculateLegendBreaks(min: number, max: number, count: number = 5): number[] {
//   const range = max - min;
//   if (range === 0) return [min];
//   
//   // Calculate nice step size
//   const roughStep = range / (count - 1);
//   const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
//   const normalizedStep = roughStep / magnitude;
//   
//   // Round to nice numbers: 1, 2, 5, 10
//   let niceStep: number;
//   if (normalizedStep <= 1) niceStep = 1;
//   else if (normalizedStep <= 2) niceStep = 2;
//   else if (normalizedStep <= 5) niceStep = 5;
//   else niceStep = 10;
//   
//   niceStep *= magnitude;
//   
//   // Generate breaks
//   const niceMin = Math.floor(min / niceStep) * niceStep;
//   const niceMax = Math.ceil(max / niceStep) * niceStep;
//   
//   const breaks: number[] = [];
//   for (let i = niceMax; i >= niceMin; i -= niceStep) {
//     if (i >= min && i <= max) {
//       breaks.push(i);
//     }
//   }
//   
//   // Ensure we have min and max
//   if (breaks[breaks.length - 1] > min) breaks.push(min);
//   if (breaks[0] < max) breaks.unshift(max);
//   
//   return breaks.sort((a, b) => b - a); // descending order
// }





function RegierungsbezirkeMapComponent({ selectedMetric, regions }: RegierungsMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Build mapping from region shortName to metric value
  // TopoJSON uses simple names like "Oberbayern", our data has shortName that matches
  const regionDataMap: Record<string, number | null> = {};
  regions.forEach((region) => {
    const value = region.metrics[selectedMetric];
    // Handle missing data explicitly
    regionDataMap[region.shortName] = value !== null && value !== undefined ? value : null;
  });

  // Calculate min/max for color scale (excluding missing values)
const validValues = Object.values(regionDataMap).filter(
  (v): v is number => v !== null
);

const minValue =
  validValues.length > 0 ? Math.min(...validValues) : 0;

const maxValue =
  validValues.length > 0 ? Math.max(...validValues) : 0;

const colorScale = scaleSequential(interpolateViridis)
  .domain([minValue, maxValue]);

    return (
      <>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>
          {metricLabels[selectedMetric]} nach Regierungsbezirk
        </h2>
      
        {/* Map - full width */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 6500,
                center: [11.5, 49.0],
              }}
              width={800}
              height={600}
              style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
            >
              <Geographies geography={REGIERUNGSBEZIRKE_TOPOJSON}>
                {({ geographies }: { geographies: Record<string, unknown>[] }) => {
                  return (
                    <>
                      {geographies.map((geo: Record<string, unknown>) => {
                        const properties = geo.properties as Record<string, string> | undefined;
                        const name = properties?.name;
                        const value = regionDataMap[name as keyof typeof regionDataMap];
                        const fillColor =
    value == null
      ? "#E5E5E5"
      : colorScale(value);
                      
                        return (
                          <Geography
                            key={geo.rsmKey as string}
                            geography={geo}
                            fill={fillColor}
                            stroke="#fff"
                            strokeWidth={0.5}
                            style={{
                              default: { 
                                fill: fillColor,
                                stroke: "#fff",
                                strokeWidth: 0.5,
                                outline: "none"
                              },
                              hover: {
                                fill: fillColor,
                                stroke: "#1f2937",
                                strokeWidth: 0.5,
                                outline: "none",
                                cursor: "pointer",
                              },
                              pressed: { 
                                fill: fillColor,
                                stroke: "#1f2937",
                                strokeWidth: 0.5,
                                outline: "none"
                              },
                            }}
                            onMouseEnter={(e: React.MouseEvent) => {
                              const { clientX, clientY } = e;
                              setTooltipContent(
                                value !== null && value !== undefined
                                  ? `${name}: ${value.toLocaleString('de-DE')}`
                                  : `${name}: Keine Daten`
                              );
                              setTooltipPosition({ x: clientX, y: clientY });
                              setShowTooltip(true);
                            }}
                            onMouseMove={(e: React.MouseEvent) => {
                              const { clientX, clientY } = e;
                              setTooltipPosition({ x: clientX, y: clientY });
                            }}
                            onMouseLeave={() => {
                              setShowTooltip(false);
                            }}
                          />
                        );
                      })}
                    
                      {/* TODO: Region labels - react-simple-maps v3.0 doesn't export Marker/Annotation
                          Consider adding labels via custom SVG overlay or upgrading library version */}
                    </>
                  );
                }}
              </Geographies>
            </ComposableMap>
          </div>
          {showTooltip && (
            <div
              style={{
                position: 'fixed',
                backgroundColor: '#111827',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                pointerEvents: 'none',
                zIndex: 50,
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y + 10,
              }}
            >
              {tooltipContent}
            </div>
          )}
        </div>

        {/* Horizontal legend at bottom (ggplot2 style) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Horizontal gradient bar */}
            <div
              style={{
                width: '300px',
                height: '20px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                background: `linear-gradient(
    to right,
    ${interpolateViridis(0)},
    ${interpolateViridis(0.125)},
    ${interpolateViridis(0.25)},
    ${interpolateViridis(0.375)},
    ${interpolateViridis(0.5)},
    ${interpolateViridis(0.625)},
    ${interpolateViridis(0.75)},
    ${interpolateViridis(0.875)},
    ${interpolateViridis(1)}
)`
              }}
            />
            {/* Labels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
              <span>{formatValue(minValue)}</span>
              <span>–</span>
              <span>{formatValue(maxValue)}</span>
            </div>
          </div>
          {/* No data indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280', marginLeft: '16px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '2px', backgroundColor: "#E5E5E5", border: '1px solid #d1d5db' }} />
            <span>Keine Daten</span>
          </div>
        </div>
      </>
    );
}

export const RegierungsbezirkeMap = memo(RegierungsbezirkeMapComponent);
