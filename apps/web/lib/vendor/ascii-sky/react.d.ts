import { type CSSProperties, type ReactElement } from "react";
import { type MountOptions } from "./index.ts";
export type AsciiSkyProps = MountOptions & {
    className?: string;
    style?: CSSProperties;
};
export declare const AsciiSky: ({ theme, assets, faintFrom, ignore, night, className, style, }: AsciiSkyProps) => ReactElement;
