import { skyCells, sunsetColours, sunsetGradient, } from "./cells.js";
import { CONTROLS, measureShapes, startSky } from "./engine.js";
import { NIGHT } from "./shade.js";
export { CONTROLS } from "./engine.js";
export { NIGHT } from "./shade.js";
export const sky = {
    columns: 400,
    rows: 71,
    cellWidth: 6,
    cellHeight: 9.75,
    version: "0654411dbe",
};
export const SKY_WIDTH = sky.columns * sky.cellWidth;
export const SKY_HEIGHT = sky.rows * sky.cellHeight;
const SKY_FILES = {
    text: "sky.txt",
    light: "sky-light.webp",
    dark: "sky-dark.webp",
    near: "clouds-near.webp",
    far: "clouds-far.webp",
};
const DEFAULT_ASSETS = "/ascii-sky/";
const CELL = { width: sky.cellWidth, height: sky.cellHeight };
const urlIn = (folder, file) => {
    const base = folder.endsWith("/") ? folder : `${folder}/`;
    return `${base}${SKY_FILES[file]}?v=${sky.version}`;
};
const skyUrl = (assets, file) => typeof assets === "string" ? urlIn(assets, file) : assets[file];
const fetched = async (url, signal) => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`ascii-sky: ${url} answered ${response.status}`);
    }
    return response;
};
const pixelsOf = async (url, signal) => {
    const response = await fetched(url, signal);
    const bitmap = await createImageBitmap(await response.blob(), {
        colorSpaceConversion: "none",
        premultiplyAlpha: "none",
    });
    const { width, height } = bitmap;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
        throw new Error("ascii-sky: no 2d context");
    }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return { pixels: ctx.getImageData(0, 0, width, height).data, width, height };
};
const loadSky = async (assets, signal) => {
    const [text, light, dark, near, far] = await Promise.all([
        fetched(skyUrl(assets, "text"), signal).then((response) => response.text()),
        pixelsOf(skyUrl(assets, "light"), signal),
        pixelsOf(skyUrl(assets, "dark"), signal),
        pixelsOf(skyUrl(assets, "near"), signal),
        pixelsOf(skyUrl(assets, "far"), signal),
    ]);
    return skyCells({
        still: {
            columns: sky.columns,
            rows: sky.rows,
            cellWidth: sky.cellWidth,
            cellHeight: sky.cellHeight,
            text,
            rgb: {
                light: light.pixels,
                dark: dark.pixels,
                sunset: sunsetColours(sky.columns, sky.rows, sky.cellHeight, text),
            },
        },
        near,
        far,
        shapes: measureShapes(sky.cellWidth, sky.cellHeight),
    });
};
const STILL_OPACITY = { light: 0.4, dark: 0.33, sunset: 0.4 };
export const stillSky = (theme, assets = DEFAULT_ASSETS) => ({
    background: theme === "sunset"
        ? sunsetGradient()
        : `url("${skyUrl(assets, theme)}") center top / ${SKY_WIDTH}px ${SKY_HEIGHT}px repeat-x`,
    imageRendering: "pixelated",
    opacity: STILL_OPACITY[theme],
});
export const mountSky = (canvas, { theme = "auto", assets = DEFAULT_ASSETS, faintFrom, ignore = CONTROLS, night = NIGHT, } = {}) => {
    const loading = new AbortController();
    const mounted = { theme, running: undefined };
    const ready = loadSky(assets, loading.signal).then((cells) => {
        if (!loading.signal.aborted) {
            mounted.running = startSky(canvas, cells, SKY_WIDTH, CELL, {
                theme: mounted.theme,
                faintFrom,
                ignore,
                night,
            });
        }
    }, (error) => {
        if (!loading.signal.aborted) {
            throw error;
        }
    });
    return {
        ready,
        setTheme: (next) => {
            mounted.theme = next;
            mounted.running?.setTheme(next);
        },
        stop: () => {
            loading.abort();
            mounted.running?.stop();
        },
    };
};
