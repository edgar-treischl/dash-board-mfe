import { memo, useMemo, useEffect, useRef } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import type { GeoJSON as LeafletGeoJSON } from "leaflet";
import { scaleSequential } from "d3-scale";
import { interpolateViridis } from "d3-scale-chromatic";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import bavariaTopoJSONRaw from "../../data/bavaria-regierungsbezirke-dissolved.topojson?raw";
import "leaflet/dist/leaflet.css";

type MetricKey =
  | "schools"
  | "students"
  | "teachersFTE"
  | "avgClassSize";

type RegierungsMapProps = {
  selectedMetric: MetricKey;
  regions: Array<{
    id: string;
    name: string;
    shortName: string;
    metrics: Record<MetricKey, number>;
  }>;
};

function RegierungsbezirkeMapLeafletComponent({
  selectedMetric,
  regions,
}: RegierungsMapProps) {
  const layerRef = useRef<LeafletGeoJSON>(null);

  const geojson = useMemo(() => {
    const topology = JSON.parse(
      bavariaTopoJSONRaw
    ) as Topology;

    const object = topology.objects[
      Object.keys(topology.objects)[0]
    ] as GeometryCollection;

    return feature(topology, object) as FeatureCollection;
  }, []);

  useEffect(() => {
    if (!layerRef.current) return;

    const bounds = layerRef.current.getBounds();
    const map = (layerRef.current as unknown as { _map: unknown })._map;

    if (bounds.isValid()) {
      (map as { fitBounds: (b: unknown, o: unknown) => void }).fitBounds(bounds, {
        padding: [20, 20],
      });
    }
  }, [geojson]);

  const regionValues = useMemo(() => {
    return Object.fromEntries(
      regions.map((r) => [
        r.shortName,
        r.metrics[selectedMetric],
      ])
    );
  }, [regions, selectedMetric]);

  const values = Object.values(regionValues);

  const color = scaleSequential(interpolateViridis).domain([
    Math.min(...values),
    Math.max(...values),
  ]);

  return (
    <MapContainer
      style={{ height: 600 }}
      zoom={7}
      center={[49, 11.5]}
      scrollWheelZoom={false}
    >
      <GeoJSON
        ref={layerRef}
        data={geojson}
        style={(feature) => {
          const value =
            regionValues[
              feature?.properties?.name as string
            ];

          return {
            fillColor:
              value == null ? "#ddd" : color(value),
            fillOpacity: 0.8,
            color: "#fff",
            weight: 1,
          };
        }}
        onEachFeature={(feature, layer) => {
          const value =
            regionValues[
              feature.properties?.name as string
            ];

          layer.bindTooltip(
            value == null
              ? `${feature.properties?.name}: Keine Daten`
              : `${feature.properties?.name}: ${value.toLocaleString("de-DE")}`
          );
        }}
      />
    </MapContainer>
  );
}

export default memo(RegierungsbezirkeMapLeafletComponent);