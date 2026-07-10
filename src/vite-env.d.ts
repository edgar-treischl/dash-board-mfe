/// <reference types="vite/client" />

declare module '*.topojson' {
  const content: string;
  export default content;
}

declare module '*.topojson?raw' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: Record<string, unknown>;
  export default content;
}

