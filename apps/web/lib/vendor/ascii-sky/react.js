"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { mountSky, SKY_HEIGHT, stillSky } from "./index.js";
const FADE = "opacity 700ms";
const fill = { position: "absolute", inset: 0, width: "100%", height: "100%" };
export const AsciiSky = ({ theme = "auto", assets, faintFrom, ignore, night, className, style, }) => {
    const canvasRef = useRef(null);
    const skyRef = useRef(undefined);
    const [isDrawn, setIsDrawn] = useState(false);
    const themeRef = useRef(theme);
    useEffect(() => {
        const element = canvasRef.current;
        if (!element) {
            return;
        }
        const mounted = mountSky(element, {
            theme: themeRef.current,
            assets,
            faintFrom,
            ignore,
            night,
        });
        skyRef.current = mounted;
        mounted.ready
            .then(() => {
            if (skyRef.current === mounted) {
                setIsDrawn(true);
            }
        })
            .catch(() => undefined);
        return () => {
            mounted.stop();
            skyRef.current = undefined;
            setIsDrawn(false);
        };
    }, [assets, faintFrom, ignore, night]);
    useEffect(() => {
        themeRef.current = theme;
        skyRef.current?.setTheme(theme);
    }, [theme]);
    const still = theme === "auto" ? undefined : stillSky(theme, assets);
    return (_jsxs("div", { "aria-hidden": "true", className: className, style: {
            position: "relative",
            width: "100%",
            height: SKY_HEIGHT,
            overflow: "hidden",
            pointerEvents: "none",
            userSelect: "none",
            ...style,
        }, children: [still !== undefined && (_jsx("div", { style: { ...fill, ...still, opacity: isDrawn ? 0 : still.opacity, transition: FADE } })), _jsx("canvas", { ref: canvasRef, style: { ...fill, display: "block", opacity: isDrawn ? 1 : 0, transition: FADE } })] }));
};
