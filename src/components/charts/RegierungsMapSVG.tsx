import { memo, useMemo, useState } from "react";
import { scaleLinear } from "d3-scale";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import bavariaTopoJSONRaw from "../../data/bavaria.topojson?raw";

// Colour ramp mirrors R/mapRegion.R (low_colour, mid_colour, high_colour)
const LOW_COLOUR = "#F1F5F8";
const MID_COLOUR = "#8FB8CE";
const HIGH_COLOUR = "#155A8A";
const NO_DATA_COLOUR = "#D9DDE0";

// Region icon imports
import oberbayernIcon from "../../assets/regions/oberbayern.svg?url";
import niederbayernIcon from "../../assets/regions/niederbayern.svg?url";
import oberpfalzIcon from "../../assets/regions/oberpfalz.svg?url";
import oberfrankeniIcon from "../../assets/regions/oberfranken.svg?url";
import mittelfrankenIcon from "../../assets/regions/mittelfranken.svg?url";
import unterfrankeniIcon from "../../assets/regions/unterfranken.svg?url";
import schwabenIcon from "../../assets/regions/schwaben.svg?url";

const getRegionIconUrl = (iconPath: string): string => {
  // Resolve asset URL relative to the module location for both standalone and federated contexts
  return new URL(iconPath, import.meta.url).href;
};

const regionIconMap: Record<string, string> = {
  "Oberbayern": getRegionIconUrl(oberbayernIcon),
  "Niederbayern": getRegionIconUrl(niederbayernIcon),
  "Oberpfalz": getRegionIconUrl(oberpfalzIcon),
  "Oberfranken": getRegionIconUrl(oberfrankeniIcon),
  "Mittelfranken": getRegionIconUrl(mittelfrankenIcon),
  "Unterfranken": getRegionIconUrl(unterfrankeniIcon),
  "Schwaben": getRegionIconUrl(schwabenIcon),
};


type MetricKey = 'students_percent' | 'avgClassSize' | 'schools' | 'studentTeacherRatio' | 'teachersFTE' | 'migrantPercent'

type RegierungsMapProps = {
  selectedMetric: MetricKey;
  regions: Array<{
    id: string;
    name: string;
    shortName: string;
  } & Record<MetricKey, number>>;
};

const SVG_WIDTH = 700;
const SVG_HEIGHT = 900;
const MARGIN = { top: 20, right: 20, bottom: 120, left: 20 };
const LEGEND_WIDTH = 280;

interface PathRenderData {
  name: string;
  path: string;
  value: number | null;
}

function RegierungsMapSVGComponent({
  selectedMetric,
  regions,
}: RegierungsMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const renderData = useMemo(() => {
    try {
      // Parse TopoJSON
      const topology = JSON.parse(
        bavariaTopoJSONRaw
      ) as Topology;

      const objectKey = Object.keys(topology.objects)[0];
      if (!objectKey) throw new Error("No objects in TopoJSON");

      const object = topology.objects[objectKey] as GeometryCollection;
      const geojsonData = feature(topology, object) as FeatureCollection;

      // Create region values mapping
      const regionValues: Record<string, number> = Object.fromEntries(
        regions.map((r) => [r.shortName, r[selectedMetric]])
      );

      // Create color scale using the same low/mid/high gradient as ggplot's scale_fill_gradientn
      const metricValues = Object.values(regionValues).filter((v) => v != null);
      const minValue = metricValues.length ? Math.min(...metricValues) : 0;
      const maxValue = metricValues.length ? Math.max(...metricValues) : 1;
      const midValue = (minValue + maxValue) / 2;

      const colorScale = scaleLinear<string>()
        .domain([minValue, midValue, maxValue])
        .range([LOW_COLOUR, MID_COLOUR, HIGH_COLOUR])
        .clamp(true);

      // Create projection with proper sizing
      const mapWidth = SVG_WIDTH - MARGIN.left - MARGIN.right;
      const mapHeight = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

      const proj = geoMercator()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .fitSize([mapWidth, mapHeight], geojsonData as any);

      const pathGen = geoPath().projection(proj);

      // Prepare render data
      const paths: PathRenderData[] = geojsonData.features.map(
        (feat) => {
          const regionName = feat.properties?.name as string;
          const value = regionValues[regionName];
          const pathStr = pathGen(feat) || "";

          return {
            name: regionName,
            path: pathStr,
            value: value ?? null,
          };
        }
      );

      return {
        paths,
        colorScale,
        regionValues,
      };
    } catch (error) {
      console.error("Error rendering map:", error);
      return {
        paths: [],
        colorScale: scaleLinear<string>().domain([0, 1]).range([LOW_COLOUR, HIGH_COLOUR]),
        regionValues: {},
      };
    }
  }, [regions, selectedMetric]);

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    regionName: string
  ) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltipPos({ x, y });
    setHoveredRegion(regionName);
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
    setHoveredRegion(null);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        height: SVG_HEIGHT,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          background: "var(--bydash-bg)",
          display: "block",
        }}
      >
        {/* Define gradient */}
        <defs>
          <linearGradient
            id="regierung-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((t) => ({
              t,
              colour:
                t <= 0.5
                  ? scaleLinear<string>().domain([0, 0.5]).range([LOW_COLOUR, MID_COLOUR])(t)
                  : scaleLinear<string>().domain([0.5, 1]).range([MID_COLOUR, HIGH_COLOUR])(t),
            })).map(({ t, colour }) => (
              <stop key={t} offset={`${t * 100}%`} stopColor={colour} />
            ))}
          </linearGradient>
        </defs>

        {/* Map group with margins */}
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Map paths */}
          {renderData.paths.map((pathData, idx) => {
            const isHovered = hoveredRegion === pathData.name;

            return (
              <path
                key={idx}
                d={pathData.path}
                fill={
                  pathData.value == null
                    ? NO_DATA_COLOUR
                    : renderData.colorScale(pathData.value)
                }
                fillOpacity={isHovered ? 1 : 0.9}
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 1}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseMove={(e) => handleMouseMove(e, pathData.name)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </g>

        {/* Legend */}
        <g transform={`translate(${(SVG_WIDTH - LEGEND_WIDTH) / 2}, ${SVG_HEIGHT - 85})`}>
          {/* Selected metric indicator - centered, bold, black */}
          <text
            x={LEGEND_WIDTH / 2}
            y="0"
            fontSize="16"
            fontWeight="700"
            fill="#1f2937"
            textAnchor="middle"
          >
            {selectedMetric === 'students_percent' ? 'Schüler und Schülerinnen' :
             selectedMetric === 'schools' ? 'Schulen' :
             selectedMetric === 'studentTeacherRatio' ? 'SuS-Lehrer-Relation' :
             selectedMetric === 'teachersFTE' ? 'Lehrkräfte' :
             selectedMetric === 'migrantPercent' ? 'Anteil Migrationshintergrund' :
             'Klassengröße'}
          </text>

          {/* Gradient bar - larger */}
          <rect
            x="0"
            y="22"
            width={LEGEND_WIDTH}
            height="35"
            fill="url(#regierung-gradient)"
            stroke="#d1d5db"
            strokeWidth="1.5"
          />

          {/* Min/Max labels - larger */}
          <text x="0" y="68" fontSize="14" fontWeight="600" fill="#4b5563">
            Niedrig
          </text>
          <text x={LEGEND_WIDTH} y="68" fontSize="14" fontWeight="600" fill="#4b5563" textAnchor="end">
            Hoch
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltipPos && hoveredRegion && (
        <div
          style={{
            position: "absolute",
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
            background: "rgba(0, 0, 0, 0.9)",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            pointerEvents: "none",
            zIndex: 10,
            marginTop: "-8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            minWidth: "140px",
          }}
        >
          {regionIconMap[hoveredRegion] && (
            <img
              src={regionIconMap[hoveredRegion]}
              alt={hoveredRegion}
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
            />
          )}
          <div style={{ textAlign: "center", fontWeight: "600" }}>
            {hoveredRegion}
          </div>
          <div style={{ textAlign: "center", fontSize: "12px", opacity: 0.9 }}>
            {selectedMetric === "students_percent"
              ? "Schüler und Schülerinnen"
              : selectedMetric === "schools"
                ? "Schulen"
                : selectedMetric === "studentTeacherRatio"
                  ? "SuS-Lehrer-Relation"
                  : selectedMetric === "teachersFTE"
                    ? "Lehrkräfte"
                    : selectedMetric === "migrantPercent"
                      ? "Anteil Migrationshintergrund"
                      : "Klassengröße"}
          </div>
          <div style={{ textAlign: "center", fontWeight: "700" }}>
            {renderData.regionValues[hoveredRegion] == null
              ? "Keine Daten"
              : selectedMetric === "studentTeacherRatio"
                ? renderData.regionValues[hoveredRegion].toFixed(2)
                : renderData.regionValues[hoveredRegion].toLocaleString("de-DE")}
          </div>
        </div>
      )}
    </div>
  );
}

export const RegierungsbezirkeMapSVG = memo(RegierungsMapSVGComponent);
