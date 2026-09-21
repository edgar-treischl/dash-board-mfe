import { memo, useMemo, useState } from "react";
import { scaleLinear } from "d3-scale";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import bavariaDistrictsTopoJSONRaw from "../../data/bavaria-districts.json?raw";
import { districtData } from "../../data/districtData";

// Colour ramp mirrors R/mapRegion.R (low_colour, mid_colour, high_colour)
const LOW_COLOUR = "#F1F5F8";
const MID_COLOUR = "#8FB8CE";
const HIGH_COLOUR = "#155A8A";
const NO_DATA_COLOUR = "#D9DDE0";

type MetricKey = 'students_percent' | 'avgClassSize' | 'schools' | 'studentTeacherRatio' | 'teachersFTE' | 'migrantPercent'

type RegionMapProps = {
  selectedMetric: MetricKey;
  selectedRegion: string;
  regions: Array<{
    id: string;
    name: string;
    shortName: string;
  } & Record<MetricKey, number>>;
};

const SVG_WIDTH = 800;
const SVG_HEIGHT = 700;
const MARGIN = { top: 20, right: 20, bottom: 160, left: 20 };
const LEGEND_WIDTH = 200;

interface PathRenderData {
  key: string;
  path: string;
  value: number | null;
}

// Derive the district key (RS) from a topojson feature id like "DE.BY.09774000"
const rsFromFeatureId = (id: string | number | undefined): string =>
  String(id ?? "")
    .replace(/^.*\./, "")
    .slice(0, 5);

// Map a selected UI metric to the matching field on district-level data
const districtValueForMetric = (
  district: (typeof districtData)[number] | undefined,
  metric: MetricKey
): number | null => {
  if (!district) return null;
  switch (metric) {
    case "students_percent":
      return district.studentsPercent;
    case "avgClassSize":
      return district.avgClassSize;
    case "schools":
      return district.schools;
    case "studentTeacherRatio":
      return district.studentTeacherRatio;
    case "migrantPercent":
      return district.migrantPercent;
    case "teachersFTE":
      return district.teachersFTE;
    default:
      return null;
  }
};

function RegionMapSVGComponent({
  selectedMetric,
  selectedRegion,
  regions,
}: RegionMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const currentRegionInfo = regions.find((r) => r.id === selectedRegion);

  const renderData = useMemo(() => {
    try {
      // Parse district-level TopoJSON (same source as R/mapRegion.R's bavaria-districts.json)
      const topology = JSON.parse(
        bavariaDistrictsTopoJSONRaw
      ) as Topology;

      const objectKey = Object.keys(topology.objects)[0];
      if (!objectKey) throw new Error("No objects in TopoJSON");

      const object = topology.objects[objectKey] as GeometryCollection;
      const geojsonData = feature(topology, object) as FeatureCollection;

      // Join geometries with district data via RS, then filter to the selected region
      // (mirrors: map_data <- geo |> left_join(data, by = "RS"); filter(regierungen == feature_grid_selected))
      const districtByRS = new Map(districtData.map((d) => [d.RS, d]));

      const filteredFeatures = geojsonData.features.filter((feat) => {
        const rs = rsFromFeatureId(feat.id);
        const district = districtByRS.get(rs);
        return district?.regionId === selectedRegion;
      });

      const filteredGeojson: FeatureCollection = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };

      // Create colour scale using the same low/mid/high gradient as ggplot's scale_fill_gradientn
      const districtValues = filteredFeatures
        .map((feat) => districtValueForMetric(districtByRS.get(rsFromFeatureId(feat.id)), selectedMetric))
        .filter((v): v is number => v != null);

      const minValue = districtValues.length ? Math.min(...districtValues) : 0;
      const maxValue = districtValues.length ? Math.max(...districtValues) : 1;
      const midValue = (minValue + maxValue) / 2;

      const colorScale = scaleLinear<string>()
        .domain([minValue, midValue, maxValue])
        .range([LOW_COLOUR, MID_COLOUR, HIGH_COLOUR])
        .clamp(true);

      // Project only the filtered (selected region) districts, so the map zooms in like coord_sf() does
      const mapWidth = SVG_WIDTH - MARGIN.left - MARGIN.right;
      const mapHeight = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

      const proj = geoMercator()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .fitSize([mapWidth, mapHeight], filteredGeojson as any);

      const pathGen = geoPath().projection(proj);

      const paths: PathRenderData[] = filteredFeatures.map((feat) => {
        const rs = rsFromFeatureId(feat.id);
        const district = districtByRS.get(rs);
        const value = districtValueForMetric(district, selectedMetric);
        const pathStr = pathGen(feat) || "";

        return {
          key: district?.key ?? rs,
          path: pathStr,
          value,
        };
      });

      const districtValuesByKey: Record<string, number | null> = Object.fromEntries(
        paths.map((p) => [p.key, p.value])
      );

      return {
        paths,
        colorScale,
        districtValuesByKey,
        minValue,
        maxValue,
      };
    } catch (error) {
      console.error("Error rendering region map:", error);
      return {
        paths: [],
        colorScale: scaleLinear<string>().domain([0, 1]).range([LOW_COLOUR, HIGH_COLOUR]),
        districtValuesByKey: {},
        minValue: 0,
        maxValue: 1,
      };
    }
  }, [selectedMetric, selectedRegion]);

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    districtKey: string
  ) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltipPos({ x, y });
    setHoveredDistrict(districtKey);
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
    setHoveredDistrict(null);
  };

  const getMetricLabel = (metric: MetricKey): string => {
    const labels: Record<MetricKey, string> = {
      students_percent: "Schüler und Schülerinnen",
      schools: "Schulen",
      studentTeacherRatio: "SuS-Lehrer-Relation",
      avgClassSize: "Klassengröße",
      teachersFTE: "Lehrkräfte",
      migrantPercent: "Anteil Migrationshintergrund",
    };
    return labels[metric];
  };

  const gradientStops = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    t,
    colour:
      t <= 0.5
        ? scaleLinear<string>().domain([0, 0.5]).range([LOW_COLOUR, MID_COLOUR])(t)
        : scaleLinear<string>().domain([0.5, 1]).range([MID_COLOUR, HIGH_COLOUR])(t),
  }));

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
            id="region-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            {gradientStops.map(({ t, colour }) => (
              <stop key={t} offset={`${t * 100}%`} stopColor={colour} />
            ))}
          </linearGradient>
        </defs>

        {/* Map group with margins */}
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Map paths */}
          {renderData.paths.map((pathData, idx) => {
            const isHovered = hoveredDistrict === pathData.key;

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
                onMouseMove={(e) => handleMouseMove(e, pathData.key)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </g>

        {/* Legend */}
        <g transform={`translate(${(SVG_WIDTH - LEGEND_WIDTH) / 2}, ${SVG_HEIGHT - 140})`}>
          {/* Selected metric indicator - centered, bold, black */}
          <text
            x={LEGEND_WIDTH / 2}
            y="0"
            fontSize="13"
            fontWeight="700"
            fill="#1f2937"
            textAnchor="middle"
          >
            {getMetricLabel(selectedMetric)}
            {currentRegionInfo ? ` – ${currentRegionInfo.shortName}` : ""}
          </text>

          {/* Gradient bar - larger */}
          <rect
            x="0"
            y="18"
            width={LEGEND_WIDTH}
            height="25"
            fill="url(#region-gradient)"
            stroke="#d1d5db"
            strokeWidth="1.5"
          />

          {/* Min/Max labels - larger */}
          <text x="0" y="53" fontSize="12" fontWeight="500" fill="#4b5563">
            Niedrig
          </text>
          <text x={LEGEND_WIDTH} y="53" fontSize="12" fontWeight="500" fill="#4b5563" textAnchor="end">
            Hoch
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltipPos && hoveredDistrict && (
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
          <div style={{ textAlign: "center", fontWeight: "600" }}>
            {hoveredDistrict}
          </div>
          <div style={{ textAlign: "center", fontSize: "12px", opacity: 0.9 }}>
            {getMetricLabel(selectedMetric)}
          </div>
          <div style={{ textAlign: "center", fontWeight: "700" }}>
            {renderData.districtValuesByKey[hoveredDistrict] == null
              ? "Keine Daten"
              : selectedMetric === "studentTeacherRatio"
                ? renderData.districtValuesByKey[hoveredDistrict]!.toFixed(2)
                : renderData.districtValuesByKey[hoveredDistrict]!.toLocaleString("de-DE")}
          </div>
        </div>
      )}
    </div>
  );
}

export const RegionMapSVG = memo(RegionMapSVGComponent);
