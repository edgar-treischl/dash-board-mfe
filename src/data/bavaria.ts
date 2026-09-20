export const bavariaMetrics = {
  schools: 4507,
  students: 1320414,
  avgClassSize: 21.64,
  studentTeacherRatio: 13.16,
  malePercent: 50.91,
  migrantPercent: 15.78
};

interface RegionMetrics {
  id: string;
  shortName: string;
  name: string;
  schools: number;
  students: number;
  avgClassSize: number;
  studentTeacherRatio: number;
}

interface SchoolOffice {
  regionId: string;
  name: string;
  schools: number;
  students: number;
  studentTeacherRatio: number;
}

export const regionMetrics: RegionMetrics[] = [
  {
    id: "oberbayern",
    shortName: "Oberbayern",
    name: "Regierung von Oberbayern",
    schools: 1600,
    students: 520000,
    avgClassSize: 23.4,
    studentTeacherRatio: 13.2
  },
  {
    id: "niederbayern",
    shortName: "Niederbayern",
    name: "Regierung von Niederbayern",
    schools: 650,
    students: 150000,
    avgClassSize: 21.7,
    studentTeacherRatio: 13.1
  },
  {
    id: "oberpfalz",
    shortName: "Oberpfalz",
    name: "Regierung der Oberpfalz",
    schools: 520,
    students: 125000,
    avgClassSize: 21.1,
    studentTeacherRatio: 13.0
  },
  {
    id: "oberfranken",
    shortName: "Oberfranken",
    name: "Regierung von Oberfranken",
    schools: 540,
    students: 118000,
    avgClassSize: 20.9,
    studentTeacherRatio: 12.9
  },
  {
    id: "mittelfranken",
    shortName: "Mittelfranken",
    name: "Regierung von Mittelfranken",
    schools: 780,
    students: 185000,
    avgClassSize: 22.1,
    studentTeacherRatio: 13.2
  },
  {
    id: "unterfranken",
    shortName: "Unterfranken",
    name: "Regierung von Unterfranken",
    schools: 570,
    students: 130000,
    avgClassSize: 21.3,
    studentTeacherRatio: 13.1
  },
  {
    id: "schwaben",
    shortName: "Schwaben",
    name: "Regierung von Schwaben",
    schools: 740,
    students: 185000,
    avgClassSize: 22.0,
    studentTeacherRatio: 13.3
  }
];

export const schoolOffices: SchoolOffice[] = [
  { regionId: "oberbayern", name: "Staatliches Schulamt München-Stadt", schools: 310, students: 115000, studentTeacherRatio: 13.2 },
  { regionId: "oberbayern", name: "Staatliches Schulamt München-Land", schools: 150, students: 54000, studentTeacherRatio: 13.1 },
  { regionId: "oberbayern", name: "Staatliches Schulamt Rosenheim", schools: 110, students: 32000, studentTeacherRatio: 13.3 },
  { regionId: "niederbayern", name: "Staatliches Schulamt Landshut", schools: 120, students: 28000, studentTeacherRatio: 13.0 },
  { regionId: "niederbayern", name: "Staatliches Schulamt Passau", schools: 105, students: 24500, studentTeacherRatio: 13.2 },
  { regionId: "oberpfalz", name: "Staatliches Schulamt Regensburg", schools: 115, students: 27000, studentTeacherRatio: 12.9 },
  { regionId: "oberpfalz", name: "Staatliches Schulamt Amberg-Sulzbach", schools: 70, students: 14500, studentTeacherRatio: 13.0 },
  { regionId: "oberfranken", name: "Staatliches Schulamt Bamberg", schools: 85, students: 21000, studentTeacherRatio: 12.9 },
  { regionId: "oberfranken", name: "Staatliches Schulamt Hof", schools: 60, students: 14500, studentTeacherRatio: 13.1 },
  { regionId: "mittelfranken", name: "Staatliches Schulamt Nürnberg-Stadt", schools: 140, students: 42000, studentTeacherRatio: 13.2 },
  { regionId: "mittelfranken", name: "Staatliches Schulamt Ansbach", schools: 95, students: 21500, studentTeacherRatio: 13.0 },
  { regionId: "unterfranken", name: "Staatliches Schulamt Würzburg", schools: 110, students: 27000, studentTeacherRatio: 13.1 },
  { regionId: "unterfranken", name: "Staatliches Schulamt Aschaffenburg", schools: 90, students: 22500, studentTeacherRatio: 13.0 },
  { regionId: "schwaben", name: "Staatliches Schulamt Augsburg-Stadt", schools: 130, students: 39000, studentTeacherRatio: 13.3 },
  { regionId: "schwaben", name: "Staatliches Schulamt Kempten", schools: 80, students: 18000, studentTeacherRatio: 13.2 }
];


export const officeCoords = {
  "oberbayern|Staatliches Schulamt München-Stadt":   {lat:48.137, lon:11.575},
  "oberbayern|Staatliches Schulamt München-Land":    {lat:48.100, lon:11.780},
  "oberbayern|Staatliches Schulamt Rosenheim":       {lat:47.850, lon:12.130},

  "niederbayern|Staatliches Schulamt Landshut":      {lat:48.540, lon:12.150},
  "niederbayern|Staatliches Schulamt Passau":        {lat:48.570, lon:13.460},

  "oberpfalz|Staatliches Schulamt Regensburg":       {lat:49.020, lon:12.100},
  "oberpfalz|Staatliches Schulamt Amberg-Sulzbach":  {lat:49.440, lon:11.860},

  "oberfranken|Staatliches Schulamt Bamberg":        {lat:49.890, lon:10.890},
  "oberfranken|Staatliches Schulamt Hof":            {lat:50.316, lon:11.912},

  "mittelfranken|Staatliches Schulamt Nürnberg-Stadt": {lat:49.450, lon:11.080},
  "mittelfranken|Staatliches Schulamt Ansbach":        {lat:49.300, lon:10.570},

  "unterfranken|Staatliches Schulamt Würzburg":      {lat:49.800, lon:9.940},
  "unterfranken|Staatliches Schulamt Aschaffenburg": {lat:49.980, lon:9.150},

  "schwaben|Staatliches Schulamt Augsburg-Stadt":    {lat:48.370, lon:10.900},
  "schwaben|Staatliches Schulamt Kempten":           {lat:47.730, lon:10.310}
};
