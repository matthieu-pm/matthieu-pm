import { type SkyCells, type SkyTheme } from "./cells.ts";
import { type CellSize, type Stars } from "./shade.ts";
export declare const FULL_RATE = 60;
export declare const HALF_RATE = 30;
export declare const STEP: number;
export declare const CONTROLS = "a, button, input, textarea, select, label, [role]";
export declare const beat: (drawnAt: number, rate: number, now: number) => number;
type Ink = Readonly<{
    up: number;
    down: number;
    left: number;
    right: number;
}>;
export declare const fitGlyphs: (ink: Ink, cellWidth: number, cellHeight: number) => {
    size: number;
    x: number;
    y: number;
};
export declare const measureShapes: (cellWidth: number, cellHeight: number) => Float32Array;
export type ThemeChoice = SkyTheme | "auto";
export type SkyConfig = Readonly<{
    theme: ThemeChoice;
    faintFrom: number | undefined;
    ignore: string;
    night: Stars;
}>;
export type Sky = {
    setTheme: (theme: ThemeChoice) => void;
    stop: () => void;
};
export declare const startSky: (canvas: HTMLCanvasElement, cells: SkyCells, skyWidth: number, cell: CellSize, { theme: chosen, faintFrom, ignore, night }: SkyConfig) => Sky;
export {};
