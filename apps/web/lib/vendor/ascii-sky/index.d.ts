import { type SkyTheme } from "./cells.ts";
import { type Sky, type ThemeChoice } from "./engine.ts";
import { type Stars } from "./shade.ts";
export type { SkyTheme } from "./cells.ts";
export { CONTROLS, type ThemeChoice } from "./engine.ts";
export { NIGHT, type Stars } from "./shade.ts";
export declare const sky: {
    columns: number;
    rows: number;
    cellWidth: number;
    cellHeight: number;
    version: string;
};
export declare const SKY_WIDTH: number;
export declare const SKY_HEIGHT: number;
declare const SKY_FILES: {
    readonly text: "sky.txt";
    readonly light: "sky-light.webp";
    readonly dark: "sky-dark.webp";
    readonly near: "clouds-near.webp";
    readonly far: "clouds-far.webp";
};
export type SkyAssets = string | Readonly<Record<keyof typeof SKY_FILES, string>>;
export type StillSkyStyle = {
    background: string;
    imageRendering: "pixelated";
    opacity: number;
};
export declare const stillSky: (theme: SkyTheme, assets?: SkyAssets) => StillSkyStyle;
export type MountOptions = {
    theme?: ThemeChoice;
    assets?: SkyAssets;
    faintFrom?: number;
    ignore?: string;
    night?: Stars;
};
export type MountedSky = Sky & {
    ready: Promise<void>;
};
export declare const mountSky: (canvas: HTMLCanvasElement, { theme, assets, faintFrom, ignore, night, }?: MountOptions) => MountedSky;
