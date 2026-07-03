/**
 * Centralized chart styling configuration
 * Contains all color schemes, legends, and styling constants
 */

// Gender/Sex data colors
export const GENDER_COLORS = {
  Männlich: '#f4a261',
  Weiblich: '#e76f51',
} as const

export const GENDER_LEGEND_ITEMS = [
  { label: 'Männlich', color: GENDER_COLORS.Männlich },
  { label: 'Weiblich', color: GENDER_COLORS.Weiblich },
]

// Migration/Citizenship data colors
export const CITIZENSHIP_COLORS = {
  Deutsche: '#2a9d8f',
  Ausländer: '#264653',
} as const

export const CITIZENSHIP_LEGEND_ITEMS = [
  { label: 'Deutsche', color: CITIZENSHIP_COLORS.Deutsche },
  { label: 'Ausländer', color: CITIZENSHIP_COLORS.Ausländer },
]

// Common styling patterns used across components
export const COMMON_STYLES = {
  // List styling for interpretation content
  bulletList: {
    listStyle: 'disc',
    paddingLeft: '1.5rem',
    margin: 0,
    marginTop: '1.5rem',
  } as const,
  
  // List item styling
  listItem: {
    marginBottom: '0.5rem',
  } as const,
  
  // Italic text styling for hints
  italicText: {
    fontStyle: 'italic',
  } as const,
} as const
