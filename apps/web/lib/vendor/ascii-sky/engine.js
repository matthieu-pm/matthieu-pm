import { blow, calm, createAir, fitAir, puff, stepAir } from "./air.js";
import { ALPHA, GLYPHS, measureGlyph, normaliseShapes, RGBA, range, } from "./cells.js";
import { createFrame, EVERY_ROW, isStarAt, layoutGrid, shadeFrame, stepSparkles, TURNS, } from "./shade.js";
export const FULL_RATE = 60;
export const HALF_RATE = 30;
export const STEP = 1 / FULL_RATE;
const MAX_STEPS = 4;
const MAX_DT = 0.1;
const MS_PER_SECOND = 1000;
const CALM_RATE = FULL_RATE / TURNS;
const PACE_FRAMES = 30;
const SLOW_MS = 8;
const QUICK_MS = 5;
const EARLY_MS = 1.5;
const RETRY_MS = 5000;
const MOST_DPR = 3;
export const CONTROLS = "a, button, input, textarea, select, label, [role]";
export const beat = (drawnAt, rate, now) => {
    const gap = MS_PER_SECOND / rate;
    const due = drawnAt + gap;
    if (now < due - EARLY_MS) {
        return Number.NaN;
    }
    return now - due < gap ? due : now;
};
const owing = (owed, steps = 0) => {
    if (steps === MAX_STEPS) {
        return { owed: 0, steps };
    }
    return owed >= STEP ? owing(owed - STEP, steps + 1) : { owed, steps };
};
const advance = (clock, now, due) => {
    const dt = Math.min(MAX_DT, (now - clock.last) / MS_PER_SECOND);
    const { owed, steps } = owing(clock.owed + dt);
    return { clock: { time: clock.time + dt, last: now, owed, drawnAt: due }, dt, steps };
};
const paced = (pace, rate, now) => rate === pace.rate ? pace : { rate, since: now, costs: [] };
const retried = (pace, now) => pace.rate === HALF_RATE && now - pace.since >= RETRY_MS ? paced(pace, FULL_RATE, now) : pace;
const median = (values) => [...values].sort((a, b) => a - b)[values.length >> 1];
const timed = (pace, cost, now) => {
    const costs = [...pace.costs, cost];
    if (costs.length < PACE_FRAMES) {
        return { ...pace, costs };
    }
    const ms = median(costs);
    const counted = { ...pace, costs: [] };
    if (ms > SLOW_MS) {
        return paced(counted, HALF_RATE, now);
    }
    return ms < QUICK_MS ? paced(counted, FULL_RATE, now) : counted;
};
const FONT = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
const MEASURE = 8;
const GAP = 1;
const PAD = 0.25;
const PROBE = 100;
export const fitGlyphs = (ink, cellWidth, cellHeight) => {
    const roomWidth = cellWidth - GAP - 2 * PAD;
    const roomHeight = cellHeight - GAP - 2 * PAD;
    const wide = ink.left + ink.right;
    const tall = ink.up + ink.down;
    const scale = Math.min(roomWidth / wide, roomHeight / tall);
    return {
        size: PROBE * scale,
        x: GAP + PAD + (roomWidth - wide * scale) / 2 + ink.left * scale,
        y: GAP + PAD + (roomHeight - tall * scale) / 2 + ink.up * scale,
    };
};
const measureInk = (ctx) => {
    ctx.font = `bold ${PROBE}px ${FONT}`;
    return GLYPHS.map((g) => ctx.measureText(g)).reduce((ink, m) => ({
        up: Math.max(ink.up, m.actualBoundingBoxAscent),
        down: Math.max(ink.down, m.actualBoundingBoxDescent),
        left: Math.max(ink.left, m.actualBoundingBoxLeft),
        right: Math.max(ink.right, m.actualBoundingBoxRight),
    }), { up: 0, down: 0, left: 0, right: 0 });
};
const context2d = (canvas, settings) => {
    const ctx = canvas.getContext("2d", settings);
    if (!ctx) {
        throw new Error("ascii-sky: no 2d context");
    }
    return ctx;
};
const drawAtlas = (cellWidth, cellHeight, scale) => {
    const glyphWidth = Math.ceil(cellWidth * scale);
    const glyphHeight = Math.ceil(cellHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = glyphWidth * GLYPHS.length;
    canvas.height = glyphHeight;
    const ctx = context2d(canvas, { willReadFrequently: true });
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";
    const fit = fitGlyphs(measureInk(ctx), cellWidth, cellHeight);
    ctx.font = `bold ${fit.size * scale}px ${FONT}`;
    const inside = Math.round(GAP * scale);
    const x = Math.round(fit.x * scale);
    const y = Math.round(fit.y * scale);
    GLYPHS.forEach((g, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(i * glyphWidth + inside, inside, glyphWidth - inside, glyphHeight - inside);
        ctx.clip();
        ctx.fillText(g, i * glyphWidth + x, y);
        ctx.restore();
    });
    return { canvas, ctx, glyphWidth };
};
export const measureShapes = (cellWidth, cellHeight) => {
    const { canvas, ctx, glyphWidth } = drawAtlas(cellWidth, cellHeight, MEASURE);
    const glyphHeight = canvas.height;
    const ink = ctx.getImageData(0, 0, canvas.width, glyphHeight).data;
    return normaliseShapes(range(GLYPHS.length).map((g) => measureGlyph(Uint8ClampedArray.from({ length: glyphWidth * glyphHeight }, (_, i) => {
        const x = i % glyphWidth;
        const y = (i - x) / glyphWidth;
        return ink[(y * canvas.width + g * glyphWidth + x) * RGBA + ALPHA];
    }), glyphWidth, glyphHeight)));
};
const layer = (canvas) => ({
    canvas,
    ctx: context2d(canvas, {}),
});
const offscreen = () => layer(document.createElement("canvas"));
const createLayers = (canvas) => ({
    main: layer(canvas),
    mask: offscreen(),
    ink: offscreen(),
    gaps: offscreen(),
    tint: offscreen(),
    tiles: offscreen(),
});
const sizeLayers = (layers, grid) => {
    const { main, mask, ink, gaps, tint, tiles } = layers;
    const { pixelWidth, pixelHeight, columns, rows, dpr, originX, cellWidth, cellHeight } = grid;
    [main, mask, ink, gaps].forEach(({ canvas }) => {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
    });
    [tint, tiles].forEach(({ canvas }) => {
        canvas.width = columns;
        canvas.height = rows;
    });
    main.ctx.imageSmoothingEnabled = false;
    ink.ctx.imageSmoothingEnabled = false;
    const line = Math.max(1, Math.round(dpr));
    gaps.ctx.fillStyle = "#000";
    range(columns + 1).forEach((c) => {
        gaps.ctx.fillRect(Math.round((originX + c * cellWidth) * dpr), 0, line, pixelHeight);
    });
    range(rows + 1).forEach((r) => {
        gaps.ctx.fillRect(0, Math.round(r * cellHeight * dpr), pixelWidth, line);
    });
    return {
        colours: tint.ctx.createImageData(columns, rows),
        tiles: tiles.ctx.createImageData(columns, rows),
    };
};
const stamp = (layers, atlas, grid, frame, count) => {
    const mask = layers.mask.ctx;
    const { columns, columnLeft, columnWidth, rowTop, rowHeight } = grid;
    for (let i = 0; i < count; i += 1) {
        const k = frame.changed[i];
        const r = (k / columns) | 0;
        const c = k - r * columns;
        const x = columnLeft[c];
        const y = rowTop[r];
        const w = columnWidth[c];
        const h = rowHeight[r];
        mask.clearRect(x, y, w, h);
        const code = frame.shown[k];
        if (code >= 0) {
            mask.drawImage(atlas.canvas, code * atlas.glyphWidth, 0, w, h, x, y, w, h);
        }
    }
};
const composite = (layers, grid, images) => {
    const { main, mask, ink, gaps, tint, tiles } = layers;
    const { columns, rows, cellWidth, cellHeight, dpr, originX } = grid;
    const left = originX * dpr;
    const width = columns * cellWidth * dpr;
    const height = rows * cellHeight * dpr;
    tiles.ctx.putImageData(images.tiles, 0, 0);
    main.ctx.globalCompositeOperation = "copy";
    main.ctx.drawImage(tiles.canvas, 0, 0, columns, rows, left, 0, width, height);
    main.ctx.globalCompositeOperation = "destination-out";
    main.ctx.drawImage(gaps.canvas, 0, 0);
    tint.ctx.putImageData(images.colours, 0, 0);
    ink.ctx.globalCompositeOperation = "copy";
    ink.ctx.drawImage(mask.canvas, 0, 0);
    ink.ctx.globalCompositeOperation = "source-in";
    ink.ctx.drawImage(tint.canvas, 0, 0, columns, rows, left, 0, width, height);
    main.ctx.globalCompositeOperation = "source-over";
    main.ctx.drawImage(ink.canvas, 0, 0);
};
export const startSky = (canvas, cells, skyWidth, cell, { theme: chosen, faintFrom, ignore, night }) => {
    const layers = createLayers(canvas);
    const reduced = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const listening = new AbortController();
    const { signal } = listening;
    const themeOf = (choice) => {
        if (choice !== "auto") {
            return choice;
        }
        return darkScheme.matches ? "dark" : "light";
    };
    const sky = {
        choice: chosen,
        theme: themeOf(chosen),
        view: undefined,
        air: createAir(0, 0, 1, 1),
        clock: { time: 0, last: 0, owed: 0, drawnAt: Number.NEGATIVE_INFINITY },
        pace: { rate: FULL_RATE, since: 0, costs: [] },
        drawn: 0,
        raf: 0,
        visible: true,
    };
    const isStar = (c, r) => {
        if (!sky.view) {
            return false;
        }
        const { originX, cellWidth, skyOffset } = sky.view.grid;
        const skyColumn = Math.floor((originX + c * cellWidth + skyOffset) / cellWidth);
        return isStarAt(skyColumn, r, sky.view.frame.night.stars);
    };
    const draw = (half, every) => {
        const { view } = sky;
        if (!view) {
            return;
        }
        const { grid, atlas, frame, images } = view;
        const turn = half === EVERY_ROW ? 0 : sky.drawn % every;
        const changed = shadeFrame(grid, cells, sky.air, frame, sky.clock.time, sky.theme, half, every, turn);
        stamp(layers, atlas, grid, frame, changed);
        composite(layers, grid, images);
        if (canvas.dataset.ready === undefined) {
            canvas.dataset.ready = "";
        }
    };
    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) {
            return;
        }
        const dpr = Math.min(globalThis.devicePixelRatio || 1, MOST_DPR);
        const faint = faintFrom ??
            (Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--sky-faint")) || 0);
        const was = sky.view?.grid;
        if (was &&
            was.width === rect.width &&
            was.height === rect.height &&
            was.dpr === dpr &&
            was.faintFrom === faint) {
            return;
        }
        const grid = layoutGrid(rect.width, rect.height, dpr, skyWidth, cell, faint);
        const atlas = sky.view && was?.dpr === dpr ? sky.view.atlas : drawAtlas(cell.width, cell.height, dpr);
        const images = sizeLayers(layers, grid);
        sky.view = {
            grid,
            atlas,
            images,
            frame: createFrame(grid, images.colours.data, images.tiles.data, night),
        };
        sky.air = fitAir(sky.air, grid.columns, grid.rows, grid.cellWidth, grid.cellHeight);
        sky.drawn = 0;
        draw(EVERY_ROW, TURNS);
    };
    const tick = (now) => {
        sky.raf = requestAnimationFrame(tick);
        sky.pace = retried(sky.pace, now);
        const isCalm = !sky.air.lively;
        const rate = isCalm ? Math.min(sky.pace.rate, CALM_RATE) : sky.pace.rate;
        const due = beat(sky.clock.drawnAt, rate, now);
        if (Number.isNaN(due)) {
            return;
        }
        const begin = performance.now();
        const { clock, dt, steps } = advance(sky.clock, now, due);
        sky.clock = clock;
        range(steps).forEach(() => {
            stepAir(sky.air, STEP);
        });
        const sparkles = sky.theme === "dark" ? sky.view?.frame.sparkles : undefined;
        if (sky.view && sparkles) {
            stepSparkles(sparkles, dt, sky.view.grid.faintRow, isStar, Math.random);
        }
        const half = sky.drawn & 1;
        sky.drawn += 1;
        draw(half, isCalm ? 1 : TURNS);
        if (!isCalm) {
            sky.pace = timed(sky.pace, performance.now() - begin, now);
        }
    };
    const schedule = () => {
        cancelAnimationFrame(sky.raf);
        if (signal.aborted) {
            return;
        }
        if (reduced.matches) {
            sky.clock = { ...sky.clock, time: 0 };
            draw(EVERY_ROW, TURNS);
            return;
        }
        if (!sky.visible || document.hidden) {
            return;
        }
        sky.clock = { ...sky.clock, last: performance.now(), drawnAt: Number.NEGATIVE_INFINITY };
        sky.raf = requestAnimationFrame(tick);
    };
    const pointerAt = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x, y } : undefined;
    };
    const onPointerMove = (e) => {
        if (reduced.matches || e.pointerType === "touch") {
            return;
        }
        const at = sky.visible ? pointerAt(e) : undefined;
        if (at) {
            blow(sky.air, at.x, at.y, e.timeStamp);
        }
        else {
            calm(sky.air);
        }
    };
    const onPointerDown = (e) => {
        const isOnControl = ignore !== "" && e.target instanceof Element && e.target.closest(ignore) !== null;
        if (reduced.matches || isOnControl) {
            return;
        }
        const at = pointerAt(e);
        if (at) {
            puff(sky.air, at.x, at.y);
        }
    };
    const onLeave = () => calm(sky.air);
    const onTheme = () => {
        const next = themeOf(sky.choice);
        if (signal.aborted || next === sky.theme) {
            return;
        }
        sky.theme = next;
        draw(EVERY_ROW, TURNS);
    };
    const sized = new ResizeObserver(resize);
    const seen = new IntersectionObserver(([entry]) => {
        sky.visible = entry.isIntersecting;
        schedule();
    });
    sized.observe(canvas);
    seen.observe(canvas);
    darkScheme.addEventListener("change", onTheme, { signal });
    reduced.addEventListener("change", schedule, { signal });
    document.addEventListener("visibilitychange", schedule, { signal });
    globalThis.addEventListener("pointermove", onPointerMove, { passive: true, signal });
    globalThis.addEventListener("pointerdown", onPointerDown, { passive: true, signal });
    document.documentElement.addEventListener("pointerleave", onLeave, { signal });
    globalThis.addEventListener("blur", onLeave, { signal });
    resize();
    schedule();
    return {
        setTheme: (next) => {
            sky.choice = next;
            onTheme();
        },
        stop: () => {
            listening.abort();
            cancelAnimationFrame(sky.raf);
            sized.disconnect();
            seen.disconnect();
        },
    };
};
