declare module 'd3-scale' {
  export interface ScaleSequential<Domain = number, Range = string> {
    (x: Domain): Range;
    domain(): Domain[];
    domain(domain: Domain[]): this;
    range(): Range[];
    range(range: Range[]): this;
  }

  export function scaleSequential<Range = string>(
    interpolator?: (t: number) => Range
  ): ScaleSequential<number, Range>;
}

declare module 'd3-scale-chromatic' {
  export function interpolateViridis(t: number): string;
  export function interpolatePlasma(t: number): string;
  export function interpolateInferno(t: number): string;
  export function interpolateMagma(t: number): string;
  export function interpolateCividis(t: number): string;
}
