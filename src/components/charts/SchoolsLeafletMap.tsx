import { memo, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { School } from '../../data/SAmt'
import { AMPEL_COLORS } from '../../data/SAmt'

type SchoolsLeafletMapProps = {
  schools: School[]
  selectedSchoolId: number | null
  ampelMode: 'vera' | 'supply' | 'satisfaction'
  onSchoolSelect: (schoolId: number) => void
}

// Create custom icon for markers
const createMarkerIcon = (color: string, isSelected: boolean = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${isSelected ? 40 : 32}px;
        height: ${isSelected ? 40 : 32}px;
        background-color: ${color};
        border: ${isSelected ? '3px' : '2px'} solid ${isSelected ? '#1f2937' : 'white'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${isSelected ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
        font-weight: bold;
        font-size: 16px;
        color: white;
        transition: all 0.2s ease;
      ">
      </div>
    `,
    iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
    iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
    popupAnchor: [0, isSelected ? -20 : -16],
  })
}

function getAmpelColor(school: School, mode: 'vera' | 'supply' | 'satisfaction'): string {
  if (mode === 'vera') {
    const avgVera = (school.veraMat + school.veraDeu) / 2
    if (avgVera >= 70) return AMPEL_COLORS.green
    if (avgVera >= 55) return AMPEL_COLORS.yellow
    return AMPEL_COLORS.red
  }

  if (mode === 'supply') {
    if (school.supplyCategory === 'gut') return AMPEL_COLORS.green
    if (school.supplyCategory === 'angespannt') return AMPEL_COLORS.yellow
    return AMPEL_COLORS.red
  }

  // satisfaction
  if (school.teacherSatisfaction >= 70) return AMPEL_COLORS.green
  if (school.teacherSatisfaction >= 55) return AMPEL_COLORS.yellow
  return AMPEL_COLORS.red
}

function SchoolsLeafletMapComponent({
  schools,
  selectedSchoolId,
  ampelMode,
  onSchoolSelect,
}: SchoolsLeafletMapProps) {
  // Memoize map data calculations
  const mapData = useMemo(() => {
    if (schools.length === 0) return { center: [48.1351, 11.5820] as [number, number], zoom: 11 }

    // Get center of all schools (Munich-Stadt)
    const centerLat = schools.reduce((sum, s) => sum + s.lat, 0) / schools.length
    const centerLon = schools.reduce((sum, s) => sum + s.lon, 0) / schools.length

    // Recalculate zoom based on geographic spread
    const calculateZoom = () => {
      if (schools.length <= 1) return 11
      const lats = schools.map(s => s.lat)
      const lons = schools.map(s => s.lon)
      const latRange = Math.max(...lats) - Math.min(...lats)
      const lonRange = Math.max(...lons) - Math.min(...lons)
      const maxRange = Math.max(latRange, lonRange)

      if (maxRange < 0.05) return 13
      if (maxRange < 0.1) return 12
      if (maxRange < 0.2) return 11
      return 10
    }

    return {
      center: [centerLat, centerLon] as [number, number],
      zoom: calculateZoom(),
    }
  }, [schools])

  if (schools.length === 0) {
    return <div style={{ padding: '1rem', color: '#6b7280' }}>Keine Schulen gefunden</div>
  }

  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={mapData.center}
        zoom={mapData.zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* School markers */}
        {schools.map((school) => {
          const color = getAmpelColor(school, ampelMode)
          const isSelected = school.id === selectedSchoolId

          return (
            <Marker
              key={school.id}
              position={[school.lat, school.lon]}
              icon={createMarkerIcon(color, isSelected)}
              eventHandlers={{
                click: () => onSchoolSelect(school.id),
              }}
            >
              <Popup
                maxWidth={300}
                closeButton={true}
                className="custom-popup"
              >
                <div
                  style={{ fontSize: '13px', fontFamily: 'system-ui, -apple-system' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSchoolSelect(school.id)
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                    {school.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#374151', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                        Schulart
                      </div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>
                        {school.type}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                        Schüler:innen
                      </div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>
                        {school.students.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {ampelMode === 'vera' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#374151' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                            VERA Mathe
                          </div>
                          <div style={{ fontWeight: '500', fontSize: '14px' }}>
                            {school.veraMat.toFixed(1)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                            VERA Deutsch
                          </div>
                          <div style={{ fontWeight: '500', fontSize: '14px' }}>
                            {school.veraDeu.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {ampelMode === 'supply' && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                        Versorgung
                      </div>
                      <div style={{ fontWeight: '500', fontSize: '14px', color }}>
                        {school.supplyCategory === 'gut'
                          ? 'Gut'
                          : school.supplyCategory === 'angespannt'
                            ? 'Angespannt'
                            : 'Kritisch'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginTop: '4px' }}>
                        Schüler/Lehrer
                      </div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>
                        {school.teacherRatio.toFixed(1)}
                      </div>
                    </div>
                  )}

                  {ampelMode === 'satisfaction' && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>
                        Lehrerzufriedenheit
                      </div>
                      <div style={{ fontWeight: '500', fontSize: '14px', color }}>
                        {school.teacherSatisfaction.toFixed(1)}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>
                    Klick zum Auswählen
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

export const SchoolsLeafletMap = memo(SchoolsLeafletMapComponent)
