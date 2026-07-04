import { memo, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { officeCoords } from '../../data/bavaria'

type OfficesLeafletMapProps = {
  selectedRegionId: string
  regions: Array<{
    id: string
    name: string
    shortName: string
    metrics: Record<string, number>
    schoolOffices: Array<{
      name: string
      schools: number
      students: number
      teachersFTE: number
    }>
  }>
}

// Create custom icon for markers
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        font-weight: bold;
        font-size: 16px;
        color: white;
      ">
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

function OfficesLeafletMapComponent({
  selectedRegionId,
  regions,
}: OfficesLeafletMapProps) {
  const selectedRegion = regions.find(r => r.id === selectedRegionId)

  // Define region colors
  const regionColors: Record<string, string> = {
    oberbayern: '#3b82f6',
    niederbayern: '#ef4444',
    oberpfalz: '#10b981',
    oberfranken: '#f59e0b',
    mittelfranken: '#8b5cf6',
    unterfranken: '#ec4899',
    schwaben: '#06b6d4',
  }

  // Memoize map data calculations
  const mapData = useMemo(() => {
    if (!selectedRegion) return { center: [48.5, 11.5] as [number, number], zoom: 8 }

    // Get center of the region based on average office coords
    const regionOfficeCoords = selectedRegion.schoolOffices
      .map(office => {
        const key = `${selectedRegionId}|${office.name}`
        return officeCoords[key as keyof typeof officeCoords]
      })
      .filter((coord) => coord !== undefined)

    const centerLat = regionOfficeCoords.length > 0
      ? regionOfficeCoords.reduce((sum, c) => sum + c.lat, 0) / regionOfficeCoords.length
      : 48.5

    const centerLon = regionOfficeCoords.length > 0
      ? regionOfficeCoords.reduce((sum, c) => sum + c.lon, 0) / regionOfficeCoords.length
      : 11.5

    // Recalculate zoom based on geographic spread
    const calculateZoom = () => {
      if (regionOfficeCoords.length <= 1) return 8
      const lats = regionOfficeCoords.map(c => c.lat)
      const lons = regionOfficeCoords.map(c => c.lon)
      const latRange = Math.max(...lats) - Math.min(...lats)
      const lonRange = Math.max(...lons) - Math.min(...lons)
      const maxRange = Math.max(latRange, lonRange)
      
      if (maxRange < 0.5) return 11
      if (maxRange < 1) return 10
      if (maxRange < 2) return 9
      return 8
    }

    return {
      center: [centerLat, centerLon] as [number, number],
      zoom: calculateZoom(),
    }
  }, [selectedRegionId, selectedRegion])

  if (!selectedRegion) {
    return <div style={{ padding: '1rem', color: '#6b7280' }}>Region nicht gefunden</div>
  }

  const markerColor = regionColors[selectedRegionId] || '#3b82f6'

  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        key={selectedRegionId}
        center={mapData.center}
        zoom={mapData.zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Office markers */}
        {selectedRegion.schoolOffices.map((office, idx) => {
          const key = `${selectedRegionId}|${office.name}`
          const coord = officeCoords[key as keyof typeof officeCoords]

          if (!coord) return null

          return (
            <Marker
              key={idx}
              position={[coord.lat, coord.lon]}
              icon={createMarkerIcon(markerColor)}
            >
              <Popup
                maxWidth={300}
                closeButton={true}
                className="custom-popup"
              >
                <div style={{ fontSize: '13px', fontFamily: 'system-ui, -apple-system' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                    {office.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#374151' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                        Schulen
                      </div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>
                        {office.schools.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                        Schüler/innen
                      </div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>
                        {office.students.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                      Lehrkräfte (VZÄ)
                    </div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>
                      {office.teachersFTE.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-tip {
          background-color: white;
        }
        .custom-marker {
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12));
        }
      `}</style>
    </div>
  )
}

export const OfficesLeafletMap = memo(OfficesLeafletMapComponent)
