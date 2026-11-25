export declare const range: (n: number) => number[];
export declare const span: (from: number, to: number) => number[];
export declare const once: <T>(make: () => T) => (() => T);
export declare const BYTE_MAX = 255;
export declare const RGB = 3;
export declare const RGBA = 4;
export declare const ALPHA = 3;
export declare const CENTRE = 0.5;
export declare const TAU: number;
export declare const rounded: (x: number) => number;
export declare const hash: (x: number, y: number, seed: number) => number;
export declare const wrap: (x: number, n: number) => number;
export declare const HERMITE: {
    square: number;
    cube: number;
};
export declare const smoothstep: (from: number, to: number, t: number) => number;
type Rgb = readonly [number, number, number];
export declare const hex: (colour: string) => Rgb;
export declare const oklab: (r: number, g: number, b: number) => [number, number, number];
export declare const fromOklab: (lightness: number, a: number, b: number) => [number, number, number];
export declare const SKY_RAMP = ".:+*ox%#@";
export declare const GLYPHS: string[];
export declare const glyphOf: (g: string) => number;
export declare const REGIONS: {
    x: number;
    y: number;
}[];
export declare const REGION_COUNT: number;
export declare const REGION_RADIUS = 0.24;
export declare const measureGlyph: (alpha: ArrayLike<number>, width: number, height: number) => Float32Array;
export declare const normaliseShapes: (measured: readonly Float32Array[]) => Float32Array;
export type CloudLayer = {
    pixels: Uint8ClampedArray;
    width: number;
    height: number;
};
export type SkyTheme = "light" | "dark" | "sunset";
type ThemeStyle = {
    inside: readonly number[];
    tile: readonly Rgb[];
    glyph: readonly Rgb[];
    edge: readonly Rgb[];
    wash: Readonly<{
        thin: number;
        dense: number;
    }>;
    smallestCloud: number;
    clouds: boolean;
    farClouds: boolean;
};
export declare const THEMES: Record<SkyTheme, ThemeStyle>;
export declare const SUNSET_STOPS: readonly Readonly<{
    at: number;
    colour: string;
}>[];
export declare const sunsetColours: (columns: number, rows: number, cellHeight: number, text: string) => Uint8ClampedArray;
export declare const sunsetGradient: () => string;
export declare const bigClouds: (layer: CloudLayer, smallest: number) => CloudLayer;
export declare const WIND: {
    near: number;
    far: number;
};
export declare const drift: (seconds: number, mean: number, lag: number) => number;
type Reach = (x: number, y: number) => number;
export declare const reachOf: (layer: CloudLayer, rx: number, ry: number) => Reach;
export type StillSky = {
    columns: number;
    rows: number;
    cellWidth: number;
    cellHeight: number;
    text: string;
    rgb: Record<SkyTheme, ArrayLike<number>>;
};
export type Look = {
    readonly glyph: Float64Array;
    readonly tile: Float64Array;
    density: number;
    tileAlpha: number;
};
export declare const createLook: () => Look;
export type CellAt = (left: number, top: number, width: number, height: number, look: Look, index: number, shown: number, pushX: number, pushY: number) => number;
export type SkyCells = Readonly<{
    at: (seconds: number, theme: SkyTheme) => CellAt;
    indexAt: (x: number, y: number) => number;
}>;
export declare const OPEN_SKY = -3;
export declare const BLANK = -1;
export declare const skyCells: ({ still, shapes, near, far, }: {
    still: StillSky;
    near: CloudLayer;
    far: CloudLayer;
    shapes: Float32Array;
}) => SkyCells;
export {};
