declare module 'react-simple-maps' {
  import React from 'react'

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    style?: React.CSSProperties
    children?: React.ReactNode
  }

  interface GeographiesProps {
    geography: string
    children: (props: { geographies: Record<string, unknown>[] }) => React.ReactNode
  }

  interface GeographyProps {
    key: string
    geography: Record<string, unknown>
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: Record<string, Record<string, unknown>>
    onMouseEnter?: (e: React.MouseEvent) => void
    onMouseMove?: (e: React.MouseEvent) => void
    onMouseLeave?: () => void
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const Geographies: React.FC<GeographiesProps>
  export const Geography: React.FC<GeographyProps>
}
