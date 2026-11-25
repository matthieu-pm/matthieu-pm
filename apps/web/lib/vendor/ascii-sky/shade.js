import { isSeenAt } from "./air.js";
import { ALPHA, BLANK, BYTE_MAX, CENTRE, createLook, glyphOf, hash, hex, OPEN_SKY, RGBA, range, rounded, SKY_RAMP, span, TAU, } from "./cells.js";
const SINE_SIZE = 4096;
const SINE = Float64Array.from({ length: SINE_SIZE + 1 }, (_, i) => Math.sin((i / SINE_SIZE) * Math.PI * 2));
const PER_RADIAN = SINE_SIZE / TAU;
export const sine = (a) => {
    const turns = a * PER_RADIAN;
    const at = turns - Math.floor(turns / SINE_SIZE) * SINE_SIZE;
    const i = at | 0;
    const v = SINE[i];
    return v + (SINE[i + 1] - v) * (at - i);
};
const unit = (wave) => CENTRE + CENTRE * wave;
export const layoutGrid = (width, height, dpr, skyWidth, cell, faintFrom) => {
    const half = Math.floor(width / 2 / cell.width);
    const originX = width / 2 - half * cell.width;
    const columns = half * 2;
    const rows = Math.ceil(height / cell.height);
    const xAt = (c) => originX + c * cell.width;
    const columnLeft = Int32Array.from({ length: columns }, (_, c) => Math.round(xAt(c) * dpr));
    const rowTop = Int32Array.from({ length: rows }, (_, r) => Math.round(r * cell.height * dpr));
    return {
        width,
        height,
        dpr,
        pixelWidth: Math.round(width * dpr),
        pixelHeight: Math.round(height * dpr),
        cellWidth: cell.width,
        cellHeight: cell.height,
        columns,
        rows,
        originX,
        skyOffset: skyWidth / 2 - width / 2,
        columnLeft,
        columnWidth: columnLeft.map((left, c) => Math.round((xAt(c) + cell.width) * dpr) - left),
        rowTop,
        rowHeight: rowTop.map((top, r) => Math.round((r * cell.height + cell.height) * dpr) - top),
        faintFrom,
        faintRow: faintFrom > 0 ? Math.min(rows, Math.ceil(faintFrom / cell.height)) : rows,
    };
};
const GLOW = { light: hex("#1052d6"), dark: hex("#d6f0ff"), sunset: hex("#00bee6") };
const WIND_TINT = {
    light: { glyph: 1, tile: 0 },
    dark: { glyph: 1, tile: 0 },
    sunset: { glyph: 2.2, tile: 0.4 },
};
const STREAK = { glow: 0.28, speed: 50 };
const GUSTY = 0.7;
const LEVEL = 2.4;
const UNLIT = 0.02;
const ALONG = glyphOf("-");
const GUST = glyphOf("~");
const UP = glyphOf("|");
const RISING = glyphOf("/");
const FALLING = glyphOf("\\");
const RAMP = SKY_RAMP.split("").map(glyphOf);
const STAR = ".......++*".split("").map(glyphOf);
const BAND = {
    across: 0.09,
    acrossSpeed: 0.3,
    down: 0.15,
    downSpeed: 0.23,
    light: 0.93,
    depth: 0.07,
};
const BREATH = { floor: 0.9, depth: 0.1 };
const BREATH_SEED = { phase: 23, pace: 37 };
const BREATH_PACE = { slowest: 0.25, spread: 0.9 };
const TWINKLE = { floor: 0.35, depth: 0.65, speed: 2.2 };
const STAR_SEED = { place: 101, glyph: 103 };
export const TURNS = 3;
export const EVERY_ROW = -1;
export const UNDRAWN = -2;
export const NIGHT = {
    stars: 0.03,
    star: hex("#fff6d8"),
    glow: hex("#b0c8ff"),
    sparkle: true,
};
export const NO_STARS = {
    stars: 0,
    star: hex("#ffffff"),
    glow: GLOW.dark,
    sparkle: false,
};
export const isStarAt = (column, row, share) => hash(column, row, STAR_SEED.place) < share;
export const TICK = 0.09;
export const MOST = { big: 4, small: 12 };
export const TINTS = [hex("#ffffff"), hex("#fde68a"), hex("#e0f7ff")];
const SPAWN_TRIES = 24;
const SPAWN_MARGIN = { columns: 2, rows: 1 };
const BIG_CHANCE = 0.35;
const SMALL_CHANCE = 0.6;
const SMALL_TRIES = 2;
const BIG_REACH = 2;
const picture = (...lines) => {
    const middleRow = (lines.length - 1) / 2;
    const middleColumn = (lines[0].length - 1) / 2;
    return lines.flatMap((line, y) => [...line].flatMap((glyph, x) => glyph === " " ? [] : [[x - middleColumn, y - middleRow, glyphOf(glyph)]]));
};
const SMALL = ".+*+.".split("").map((glyph) => picture(glyph));
const BIG = [
    picture("."),
    picture("+"),
    picture(" | ", "-*-", " | "),
    picture("  |  ", ".-*-.", "  |  "),
    picture(" ' ", "-+-", " . "),
    picture("+"),
    picture("."),
];
const GONE = { steps: [], age: 0, column: 0, row: 0, tint: 0 };
export const createSparkles = (columns, rows) => ({
    columns,
    rows,
    code: new Int16Array(columns * rows).fill(BLANK),
    tint: new Uint8Array(columns * rows),
    touched: new Uint8Array(columns * rows),
    touchedRows: new Uint8Array(rows),
    pool: range(MOST.big + MOST.small).map(() => GONE),
    owed: 0,
});
const lay = (sp, s, isOn) => {
    if (s.age >= s.steps.length) {
        return;
    }
    s.steps[s.age].forEach(([dc, dr, glyph]) => {
        const c = s.column + dc;
        const r = s.row + dr;
        if (c < 0 || r < 0 || c >= sp.columns || r >= sp.rows) {
            return;
        }
        const k = r * sp.columns + c;
        sp.code[k] = isOn ? glyph : BLANK;
        sp.tint[k] = s.tint;
        sp.touched[k] = 1;
        sp.touchedRows[r] = 1;
    });
};
const isCrowded = (sp, steps, column, row) => {
    const reach = steps === BIG ? BIG_REACH : 0;
    return span(row - 1, row + 1).some((r) => span(column - reach, column + reach).some((c) => c < 0 || r < 0 || c >= sp.columns || r >= sp.rows || sp.code[r * sp.columns + c] >= 0));
};
const findSpot = (sp, steps, rows, isStar, random, tries) => {
    if (tries === 0) {
        return undefined;
    }
    const column = SPAWN_MARGIN.columns + Math.floor(random() * (sp.columns - 2 * SPAWN_MARGIN.columns));
    const row = SPAWN_MARGIN.rows +
        Math.floor(random() * Math.max(1, Math.min(rows, sp.rows) - 2 * SPAWN_MARGIN.rows));
    return isStar(column, row) && !isCrowded(sp, steps, column, row)
        ? { column, row }
        : findSpot(sp, steps, rows, isStar, random, tries - 1);
};
const spawn = (sp, pool, steps, rows, isStar, random) => {
    const slot = pool.findIndex((s) => s.steps.length === 0);
    const spot = slot < 0 ? undefined : findSpot(sp, steps, rows, isStar, random, SPAWN_TRIES);
    if (!spot) {
        return pool;
    }
    const born = { steps, age: 0, ...spot, tint: Math.floor(random() * TINTS.length) };
    lay(sp, born, true);
    return pool.map((s, i) => (i === slot ? born : s));
};
const older = (sp, s) => {
    if (s.steps.length === 0) {
        return s;
    }
    lay(sp, s, false);
    const next = s.age + 1 < s.steps.length ? { ...s, age: s.age + 1 } : GONE;
    lay(sp, next, true);
    return next;
};
const tickSparkles = (sp, pool, rows, isStar, random) => {
    const now = pool.map((s) => older(sp, s));
    const big = now.filter((s) => s.steps === BIG).length;
    const small = now.filter((s) => s.steps === SMALL).length;
    const withBig = big < MOST.big && random() < BIG_CHANCE ? spawn(sp, now, BIG, rows, isStar, random) : now;
    return range(SMALL_TRIES).reduce((p) => small < MOST.small && random() < SMALL_CHANCE ? spawn(sp, p, SMALL, rows, isStar, random) : p, withBig);
};
export const stepSparkles = (sp, dt, rows, isStar, random) => {
    const settle = (debt, live) => debt >= TICK ? settle(debt - TICK, tickSparkles(sp, live, rows, isStar, random)) : [debt, live];
    const [owed, pool] = settle(sp.owed + dt, sp.pool);
    sp.owed = owed;
    sp.pool = pool;
};
export const breathing = (columns, rows) => Float32Array.from({ length: columns * rows * 2 }, (_, i) => {
    const k = Math.floor(i / 2);
    const c = k % columns;
    const r = (k - c) / columns;
    return i % 2 === 0
        ? hash(c, r, BREATH_SEED.phase) * Math.PI * 2
        : BREATH_PACE.slowest + hash(c, r, BREATH_SEED.pace) * BREATH_PACE.spread;
});
export const createFrame = (grid, colours, tiles, night) => {
    const { columns, rows } = grid;
    return {
        colours,
        tiles,
        shown: new Int16Array(columns * rows).fill(UNDRAWN),
        changed: new Int32Array(columns * rows),
        breath: breathing(columns, rows),
        look: createLook(),
        night,
        sparkles: night.sparkle ? createSparkles(columns, rows) : undefined,
    };
};
export const streak = (vx, vy, glow) => {
    const ax = Math.abs(vx);
    const ay = Math.abs(vy);
    if (ax > ay * LEVEL) {
        return glow > GUSTY ? GUST : ALONG;
    }
    if (ay > ax * LEVEL) {
        return UP;
    }
    return vx * vy < 0 ? RISING : FALLING;
};
const paint = (glyph, rgb) => {
    glyph[0] = rgb[0];
    glyph[1] = rgb[1];
    glyph[2] = rgb[2];
};
const indexTables = new WeakMap();
const stillIndexes = (cells, grid) => {
    const forSky = indexTables.get(cells) ?? new WeakMap();
    indexTables.set(cells, forSky);
    const known = forSky.get(grid);
    if (known) {
        return known;
    }
    const { columns, rows, originX, cellWidth, cellHeight, skyOffset } = grid;
    const made = Int32Array.from({ length: columns * rows }, (_, k) => {
        const c = k % columns;
        const r = (k - c) / columns;
        const left = originX + c * cellWidth + skyOffset;
        return cells.indexAt(left + cellWidth / 2, r * cellHeight + cellHeight / 2);
    });
    forSky.set(grid, made);
    return made;
};
const shadeRow = (pass, r, isOffTurn, changesSoFar) => {
    const { grid, frame, air, cellAt, indexes, t, glow, windTint, stars, sparks, across, down } = pass;
    const { columns, cellWidth, cellHeight, originX, skyOffset } = grid;
    const { colours, tiles, shown, changed, breath, look, night } = frame;
    const { stirred, vx, vy, dx, dy } = air;
    const { glyph, tile } = look;
    const densest = RAMP.length - 1;
    const y = r * cellHeight;
    let changes = changesSoFar;
    for (let c = 0; c < columns; c += 1) {
        const k = r * columns + c;
        if (isOffTurn && !isSeenAt(air, k) && !sparks?.touched[k]) {
            continue;
        }
        const o = k * RGBA;
        const was = shown[k];
        const drawn = cellAt(originX + c * cellWidth + skyOffset, y, cellWidth, cellHeight, look, indexes[k], was >= 0 ? was : BLANK, stirred ? dx[k] : 0, stirred ? dy[k] : 0);
        let code = drawn;
        let alpha = 1;
        if (drawn === OPEN_SKY) {
            const phase = breath[k * 2];
            const pace = breath[k * 2 + 1];
            const breathe = unit(sine(t * pace + phase));
            const band = BAND.light + BAND.depth * across[c] * down;
            alpha = (BREATH.floor + BREATH.depth * breathe) * band;
            look.tileAlpha *= band;
            code = RAMP[rounded(look.density * densest)];
            if (stars > 0) {
                const skyColumn = Math.floor((originX + c * cellWidth + skyOffset) / cellWidth);
                if (isStarAt(skyColumn, r, stars)) {
                    code = STAR[(hash(skyColumn, r, STAR_SEED.glyph) * STAR.length) | 0];
                    const twinkle = unit(sine(t * TWINKLE.speed * pace + phase));
                    alpha = TWINKLE.floor + TWINKLE.depth * twinkle;
                    paint(glyph, night.star);
                }
            }
            if (sparks) {
                const spark = sparks.code[k];
                sparks.touched[k] = 0;
                if (spark >= 0) {
                    code = spark;
                    paint(glyph, TINTS[sparks.tint[k]]);
                    alpha = 1;
                }
            }
            const g = stirred ? Math.min(1, air.glow[k]) : 0;
            if (g > UNLIT) {
                alpha += (1 - alpha) * g;
                const m = Math.min(1, g * windTint.glyph);
                for (let j = 0; j < glyph.length; j += 1) {
                    glyph[j] += (glow[j] - glyph[j]) * m;
                    tile[j] += (glow[j] - tile[j]) * g * windTint.tile;
                }
                const wx = vx[k];
                const wy = vy[k];
                if (g > STREAK.glow && Math.abs(wx) + Math.abs(wy) > STREAK.speed) {
                    code = streak(wx, wy, g);
                }
            }
        }
        colours[o] = glyph[0];
        colours[o + 1] = glyph[1];
        colours[o + 2] = glyph[2];
        colours[o + ALPHA] = code < 0 ? 0 : rounded(alpha * BYTE_MAX);
        tiles[o] = tile[0];
        tiles[o + 1] = tile[1];
        tiles[o + 2] = tile[2];
        tiles[o + ALPHA] = rounded(look.tileAlpha * BYTE_MAX);
        if (code === shown[k]) {
            continue;
        }
        shown[k] = code;
        changed[changes] = k;
        changes += 1;
    }
    return changes;
};
export const shadeFrame = (grid, cells, air, frame, t, theme, half, every, turn) => {
    const { columns, rows, faintRow } = grid;
    const isDark = theme === "dark";
    const sparks = isDark ? frame.sparkles : undefined;
    const across = Float64Array.from({ length: columns }, (_, c) => Math.sin(c * BAND.across + t * BAND.acrossSpeed));
    const shared = {
        grid,
        frame,
        air,
        cellAt: cells.at(t, theme),
        indexes: stillIndexes(cells, grid),
        t,
        glow: isDark ? frame.night.glow : GLOW[theme],
        windTint: WIND_TINT[theme],
        stars: isDark ? frame.night.stars : 0,
        sparks,
        across,
    };
    const isSkipped = (r) => r >= faintRow && half !== EVERY_ROW && (r & 1) !== half;
    return range(rows).reduce((changes, r) => {
        const isOffTurn = every > 1 && half !== EVERY_ROW && r % every !== turn;
        if (isSkipped(r) || (isOffTurn && !air.stirred && !sparks?.touchedRows[r])) {
            return changes;
        }
        const down = Math.sin(r * BAND.down - t * BAND.downSpeed);
        const next = shadeRow({ ...shared, down }, r, isOffTurn, changes);
        if (sparks) {
            sparks.touchedRows[r] = 0;
        }
        return next;
    }, 0);
};
