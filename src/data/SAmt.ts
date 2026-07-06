/**
 * SAmt.ts - Staatliches Schulamt München-Stadt (Static Demo Data)
 *
 * This file contains all fictitious data representing schools
 * in the Munich-Stadt school district (Schulamtsbezirk).
 *
 * Data includes:
 * - 26 schools with detailed attributes (performance, staffing, demographics)
 * - 10-year trend data (2015-2024) at district level
 * - Pre-generated from reproducible seed (123456)
 */

import generatedData from './SAmt-generated.json'

// =====================
// Type Definitions
// =====================

export interface School {
  id: number
  name: string
  type: 'Grundschule' | 'Mittelschule'
  lat: number
  lon: number
  students: number
  sozialindex: number // 1-5
  migShare: number // 0-1
  dazShare: number // 0-1
  veraDeu: number // 20-90
  veraMat: number // 20-90
  jgstDeu: number // 20-95
  jgstMat: number // 20-95
  veraDeuHist: [number, number, number] // 3-year history
  veraMatHist: [number, number, number] // 3-year history
  trendDir: 'up' | 'flat' | 'down'
  teachers: number // Full-time equivalents (VZÄ)
  teacherRatio: number // Students per teacher
  supplyCategory: 'gut' | 'angespannt' | 'kritisch' // good, tense, critical
  trainees: number
  socialFte: number // Social work FTE
  supportHours: number // Support hours
  teacherSatisfaction: number // 20-95
  startchancen: 'Startchancen-Schule' | 'keine Startchancen-Schule'
}

export interface LongTermData {
  years: number[]
  lernstand: number[] // Learning level index
  belastung: number[] // Burden/social index
  ratio: number[] // Students per teacher
  targets: {
    lernstand: number
    belastung: number
    ratio: number
  }
}

// =====================
// Exported Data
// =====================

export const SCHULEN = generatedData.SCHULEN as School[]

export const LONG_TERM_DATA: LongTermData = generatedData.LONG_TERM_DATA

export const DISTRICT_METADATA = generatedData.DISTRICT_METADATA

export const SUPPLY_CATEGORIES = generatedData.SUPPLY_CATEGORIES

export const AMPEL_COLORS = generatedData.AMPEL_COLORS

export const SAmtMetrics = generatedData.SAmtMetrics
