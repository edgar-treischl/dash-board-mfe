export const bavariaMetrics = {
  schools: 6300,
  students: 1600000,
  teachersFTE: 140000,
  avgClassSize: 22.8
};

export const regions = [
  {
    id: "oberbayern",
    shortName: "Oberbayern",
    name: "Regierung von Oberbayern",
    metrics: { schools: 1600, students: 520000, teachersFTE: 46000, avgClassSize: 23.4 },
    schoolOffices: [
      { name: "Staatliches Schulamt München-Stadt", schools: 310, students: 115000, teachersFTE: 8400 },
      { name: "Staatliches Schulamt München-Land", schools: 150, students: 54000, teachersFTE: 3800 },
      { name: "Staatliches Schulamt Rosenheim", schools: 110, students: 32000, teachersFTE: 2400 }
    ]
  },
  {
    id: "niederbayern",
    shortName: "Niederbayern",
    name: "Regierung von Niederbayern",
    metrics: { schools: 650, students: 150000, teachersFTE: 12500, avgClassSize: 21.7 },
    schoolOffices: [
      { name: "Staatliches Schulamt Landshut", schools: 120, students: 28000, teachersFTE: 2300 },
      { name: "Staatliches Schulamt Passau", schools: 105, students: 24500, teachersFTE: 2050 }
    ]
  },
  {
    id: "oberpfalz",
    shortName: "Oberpfalz",
    name: "Regierung der Oberpfalz",
    metrics: { schools: 520, students: 125000, teachersFTE: 10500, avgClassSize: 21.1 },
    schoolOffices: [
      { name: "Staatliches Schulamt Regensburg", schools: 115, students: 27000, teachersFTE: 2300 },
      { name: "Staatliches Schulamt Amberg-Sulzbach", schools: 70, students: 14500, teachersFTE: 1200 }
    ]
  },
  {
    id: "oberfranken",
    shortName: "Oberfranken",
    name: "Regierung von Oberfranken",
    metrics: { schools: 540, students: 118000, teachersFTE: 10200, avgClassSize: 20.9 },
    schoolOffices: [
      { name: "Staatliches Schulamt Bamberg", schools: 85, students: 21000, teachersFTE: 1850 },
      { name: "Staatliches Schulamt Hof", schools: 60, students: 14500, teachersFTE: 1250 }
    ]
  },
  {
    id: "mittelfranken",
    shortName: "Mittelfranken",
    name: "Regierung von Mittelfranken",
    metrics: { schools: 780, students: 185000, teachersFTE: 16000, avgClassSize: 22.1 },
    schoolOffices: [
      { name: "Staatliches Schulamt Nürnberg-Stadt", schools: 140, students: 42000, teachersFTE: 3400 },
      { name: "Staatliches Schulamt Ansbach", schools: 95, students: 21500, teachersFTE: 1900 }
    ]
  },
  {
    id: "unterfranken",
    shortName: "Unterfranken",
    name: "Regierung von Unterfranken",
    metrics: { schools: 570, students: 130000, teachersFTE: 11100, avgClassSize: 21.3 },
    schoolOffices: [
      { name: "Staatliches Schulamt Würzburg", schools: 110, students: 27000, teachersFTE: 2300 },
      { name: "Staatliches Schulamt Aschaffenburg", schools: 90, students: 22500, teachersFTE: 1950 }
    ]
  },
  {
    id: "schwaben",
    shortName: "Schwaben",
    name: "Regierung von Schwaben",
    metrics: { schools: 740, students: 185000, teachersFTE: 15800, avgClassSize: 22.0 },
    schoolOffices: [
      { name: "Staatliches Schulamt Augsburg-Stadt", schools: 130, students: 39000, teachersFTE: 3250 },
      { name: "Staatliches Schulamt Kempten", schools: 80, students: 18000, teachersFTE: 1450 }
    ]
  }
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
