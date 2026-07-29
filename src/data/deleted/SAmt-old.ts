/**
 * SAmt.ts - Staatliches Schulamt München-Stadt (Demo Data)
 *
 * This file contains all fictitious data extracted from prototype_samt.html
 * representing schools in the Munich-Stadt school district (Schulamtsbezirk).
 *
 * Data includes:
 * - 26 schools with detailed attributes (performance, staffing, demographics)
 * - 10-year trend data (2015-2024) at district level
 * - Pseudo-random number generation (reproducible with seed 123456)
 */

// =====================
// Random Number Generator (Reproducible)
// =====================

function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296) as number;
  };
}

const rng = mulberry32(123456);

export function rand(): number {
  return rng();
}

export function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function randn(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

// =====================
// Type Definitions
// =====================

export interface School {
  id: number;
  name: string;
  type: "Grundschule" | "Mittelschule";
  lat: number;
  lon: number;
  students: number;
  sozialindex: number; // 1-5
  migShare: number; // 0-1
  dazShare: number; // 0-1
  veraDeu: number; // 20-90
  veraMat: number; // 20-90
  jgstDeu: number; // 20-95
  jgstMat: number; // 20-95
  veraDeuHist: [number, number, number]; // 3-year history
  veraMatHist: [number, number, number]; // 3-year history
  trendDir: "up" | "flat" | "down";
  teachers: number; // Full-time equivalents (VZÄ)
  teacherRatio: number; // Students per teacher
  supplyCategory: "gut" | "angespannt" | "kritisch"; // good, tense, critical
  trainees: number;
  socialFte: number; // Social work FTE
  supportHours: number; // Support hours
  teacherSatisfaction: number; // 20-95
  startchancen: "Startchancen-Schule" | "keine Startchancen-Schule";
}

export interface LongTermData {
  years: number[];
  lernstand: number[]; // Learning level index
  belastung: number[]; // Burden/social index
  ratio: number[]; // Students per teacher
  targets: {
    lernstand: number;
    belastung: number;
    ratio: number;
  };
}

// =====================
// Data Generation
// =====================

function makeHistory(
  current: number,
  dir: "up" | "flat" | "down"
): [number, number, number] {
  const n1 = randn() * 1.2;
  const n2 = randn() * 1.0;
  if (dir === "up") {
    return [
      clamp(current - 4 + n1, 20, 90),
      clamp(current - 2 + n2, 20, 90),
      current,
    ];
  } else if (dir === "down") {
    return [
      clamp(current + 4 + n1, 20, 90),
      clamp(current + 2 + n2, 20, 90),
      current,
    ];
  }
  return [
    clamp(current + n1, 20, 90),
    clamp(current + n2, 20, 90),
    current,
  ];
}

export function generateSchools(): School[] {
  const schools: School[] = [];
  const centerLat = 48.137;
  const centerLon = 11.575;
  let id = 20000;

  for (let i = 0; i < 26; i++) {
    id++;
    const type = i % 2 === 0 ? "Grundschule" : "Mittelschule";
    const students =
      type === "Grundschule" ? randInt(120, 320) : randInt(220, 620);
    const sozialindex = clamp(Math.round(2.6 + randn() * 1.2), 1, 5);
    const migShare = clamp(
      randn() * 0.06 + (0.1 + 0.14 * sozialindex),
      0.03,
      0.95
    );
    const dazShare = clamp(
      randn() * 0.05 + (0.05 + 0.1 * sozialindex),
      0.01,
      0.75
    );
    const baseLevel = 60 - sozialindex * 3.8;
    const veraDeu = clamp(randn() * 6.5 + baseLevel, 20, 90);
    const veraMat = clamp(randn() * 6.5 + baseLevel + 1, 20, 90);
    const jgstDeu = clamp(randn() * 6 + baseLevel + 1.5, 20, 95);
    const jgstMat = clamp(randn() * 6 + baseLevel + 2, 20, 95);

    const teachers = clamp(students / randInt(18, 24), 8, 90);
    const teacherRatio = students / teachers;
    let supplyCategory: "gut" | "angespannt" | "kritisch";
    if (teacherRatio <= 18) supplyCategory = "gut";
    else if (teacherRatio <= 22) supplyCategory = "angespannt";
    else supplyCategory = "kritisch";

    const trainees = clamp(
      Math.round(randn() * 1 + (0.6 + sozialindex * 0.3)),
      0,
      8
    );
    const socialFte = clamp(
      randn() * 0.3 + (0.2 + 0.3 * sozialindex),
      0,
      4.0
    );
    const supportHours = clamp(
      randn() * 5 + (6 + sozialindex * 4.0),
      0,
      55
    );

    const startchancen =
      sozialindex >= 4 && rand() < 0.7
        ? "Startchancen-Schule"
        : "keine Startchancen-Schule";

    const lat = centerLat + randn() * 0.03;
    const lon = centerLon + randn() * 0.05;

    let trendDir: "up" | "flat" | "down";
    const p = rand();
    if (p < 0.33) trendDir = "up";
    else if (p < 0.66) trendDir = "flat";
    else trendDir = "down";

    const veraDeuHist = makeHistory(veraDeu, trendDir);
    const veraMatHist = makeHistory(veraMat, trendDir);

    const perfAvg = (veraDeu + veraMat) / 2;
    let teacherSatisfaction = 70 + randn() * 9;
    if (supplyCategory === "gut") teacherSatisfaction += 6;
    else if (supplyCategory === "angespannt") teacherSatisfaction -= 5;
    else teacherSatisfaction -= 12;
    if (perfAvg < 45) teacherSatisfaction -= 6;
    else if (perfAvg > 62) teacherSatisfaction += 4;
    teacherSatisfaction = clamp(teacherSatisfaction, 20, 95);

    const name = `${type} München-Stadt ${i + 1}`;

    schools.push({
      id,
      name,
      type,
      lat,
      lon,
      students,
      sozialindex,
      migShare,
      dazShare,
      veraDeu,
      veraMat,
      jgstDeu,
      jgstMat,
      veraDeuHist,
      veraMatHist,
      trendDir,
      teachers,
      teacherRatio,
      supplyCategory,
      trainees,
      socialFte,
      supportHours,
      teacherSatisfaction,
      startchancen,
    });
  }

  return schools;
}

// =====================
// Pre-generated School Data
// =====================

export const SCHULEN: School[] = generateSchools();

// =====================
// Long-Term Trends (10 Years: 2015-2024)
// =====================

export const LONG_TERM_DATA: LongTermData = {
  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  lernstand: [56.0, 56.5, 57.2, 57.8, 58.1, 57.5, 58.3, 59.0, 59.4, 60.1],
  belastung: [2.6, 2.65, 2.7, 2.8, 2.9, 3.0, 3.05, 3.08, 3.1, 3.12],
  ratio: [20.8, 20.6, 20.4, 20.2, 20.0, 19.8, 19.6, 19.4, 19.2, 19.0],
  targets: {
    lernstand: 60.0,
    belastung: 3.0,
    ratio: 18.0,
  },
};

// =====================
// District Metadata
// =====================

export const DISTRICT_METADATA = {
  name: "Staatliches Schulamt München-Stadt",
  centerLat: 48.137,
  centerLon: 11.575,
  mapZoom: 11,
  description: "Fiktives Steuerungstool für Grund- und Mittelschulen",
  schoolTypes: ["Grundschule", "Mittelschule"],
  ampelModes: ["vera", "supply", "satisfaction"],
  subjects: ["mat", "deu"],
};

// =====================
// Constants
// =====================

export const SUPPLY_CATEGORIES = {
  gut: { label: "Gut", color: "#16a34a" },
  angespannt: { label: "Angespannt", color: "#eab308" },
  kritisch: { label: "Kritisch", color: "#dc2626" },
};

export const AMPEL_COLORS = {
  green: "#16a34a",
  yellow: "#eab308",
  red: "#dc2626",
};

// =====================
// Legacy Export (for backward compatibility)
// =====================

export const SAmtMetrics = {
  name: "Staatliches Schulamt München-Stadt (Fake)",
  schools: 26,
  students: 8787,
  teachersFTE: 140000,
  avgClassSize: 22.8,
};
