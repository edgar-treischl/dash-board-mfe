import { memo, useMemo } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { scaleSequential } from "d3-scale";
import { interpolateViridis } from "d3-scale-chromatic";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { GeoJsonObject, Feature } from "geojson";
import type { Layer } from "leaflet";
import bavariaTopoJSONRaw from "../../data/bavaria-regierungsbezirke-dissolved.topojson?raw";
import "leaflet/dist/leaflet.css";

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

function formatValue(value: number): string {
  return value.toLocaleString('de-DE', {
    maximumFractionDigits: 0,
  });
}

// Component to fit bounds when data changes
function FitBounds({ geojson }: { geojson: GeoJsonObject | null }) {
  const map = useMap();
  
  useMemo(() => {
    if (geojson) {
      const L = (window as unknown as { L: typeof import('leaflet') }).L;
      const geoJsonLayer = new L.GeoJSON(geojson);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [geojson, map]);
  
  return null;
}

function RegierungsbezirkeMapLeafletComponent({ selectedMetric, regions }: RegierungsMapProps) {
  // Convert TopoJSON to GeoJSON once on mount
  const geojson = useMemo<GeoJsonObject | null>(() => {
    try {
      const topology = JSON.parse(bavariaTopoJSONRaw) as Topology;
      // Get the first object from topology (bavaria-regierungsbezirke)
      const objectName = Object.keys(topology.objects)[0];
      const geometryCollection = topology.objects[objectName] as GeometryCollection;
      
      // Convert to GeoJSON FeatureCollection
      const geoJsonData = feature(topology, geometryCollection);
      return geoJsonData as GeoJsonObject;
    } catch (error) {
      console.error("Error converting map data:", error);
      return null;
    }
  }, []);

  // Build mapping from region shortName to metric value
  const regionDataMap: Record<string, number | null> = {};
  regions.forEach((region) => {
    const value = region.metrics[selectedMetric];
    regionDataMap[region.shortName] = value !== null && value !== undefined ? value : null;
  });

  // Calculate min/max for color scale (excluding missing values)
  const validValues = Object.values(regionDataMap).filter(
    (v): v is number => v !== null
  );

  const minValue = validValues.length > 0 ? Math.min(...validValues) : 0;
  const maxValue = validValues.length > 0 ? Math.max(...validValues) : 0;

  const colorScale = scaleSequential(interpolateViridis)
    .domain([minValue, maxValue]);

  const getFeatureColor = (feature: Feature) => {
    const name = feature.properties?.name;
    const value = regionDataMap[name as keyof typeof regionDataMap];
    return value == null ? "#E5E5E5" : colorScale(value);
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const name = feature.properties?.name;
    const value = regionDataMap[name as keyof typeof regionDataMap];
    
    const tooltipContent = value !== null && value !== undefined
      ? `${name}: ${value.toLocaleString('de-DE')}`
      : `${name}: Keine Daten`;
    
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: 'regierung-tooltip'
    });

    layer.on({
      mouseover: (e) => {
        const targetLayer = e.target;
        targetLayer.setStyle({
          weight: 2,
          color: '#1f2937',
          fillOpacity: 0.7
        });
      },
      mouseout: (e) => {
        const targetLayer = e.target;
        targetLayer.setStyle({
          weight: 1,
          color: '#fff',
          fillOpacity: 0.7
        });
      }
    });
  };

  if (!geojson) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>Fehler beim Laden der Karte</div>;
  }

  return (
    <>
      {/* Map - full width */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <MapContainer
            center={[49.0, 11.5]}
            zoom={7}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={false}
            dragging={true}
            zoomControl={true}
          >
            <FitBounds geojson={geojson} />
            <GeoJSON
              data={geojson}
              style={(feature) => ({
                fillColor: feature ? getFeatureColor(feature) : '#E5E5E5',
                weight: 1,
                opacity: 1,
                color: '#fff',
                fillOpacity: 0.7
              })}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        </div>
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

      <style>{`
        .regierung-tooltip {
          background-color: #111827;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .regierung-tooltip::before {
          display: none;
        }
      `}</style>
    </>
  );
}

export const RegierungsbezirkeMapLeaflet = memo(RegierungsbezirkeMapLeafletComponent);
