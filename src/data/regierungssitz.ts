// Regierungssitz (government seat) coordinates and labels
// Extracted from geo_regierungen.md
export type RegierungssitzData = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

export const REGIERUNGSSITZ: Record<string, RegierungssitzData> = {
  unterfranken: {
    id: "unterfranken",
    label: "Würzburg",
    lat: 49.7913,
    lng: 9.9328,
  },
  oberfranken: {
    id: "oberfranken",
    label: "Bayreuth",
    lat: 49.9456,
    lng: 11.5713,
  },
  mittelfranken: {
    id: "mittelfranken",
    label: "Ansbach",
    lat: 49.3008,
    lng: 10.5714,
  },
  oberbayern: {
    id: "oberbayern",
    label: "München",
    lat: 48.1351,
    lng: 11.5820,
  },
  niederbayern: {
    id: "niederbayern",
    label: "Landshut",
    lat: 48.5372,
    lng: 12.1522,
  },
  schwaben: {
    id: "schwaben",
    label: "Augsburg",
    lat: 48.3705,
    lng: 10.8978,
  },
  oberpfalz: {
    id: "oberpfalz",
    label: "Regensburg",
    lat: 49.0134,
    lng: 12.1016,
  },
};

export const getRegierungssitzForRegion = (
  regionId: string
): RegierungssitzData | undefined => REGIERUNGSSITZ[regionId.toLowerCase()];
