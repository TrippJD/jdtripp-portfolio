import { build } from "./build";
import { countdown } from "./countdown";
import { fix } from "./fix";
import { orbit } from "./orbit";
import { review } from "./review";
import { ship } from "./ship";
import { sketch } from "./sketch";
import type { Scene } from "./types";

/** The story in order. Each scene's id matches its copy in `launch.scenes` (site.ts). */
export const scenes: Scene[] = [sketch, build, fix, review, countdown, ship, orbit];
export type { Scene };
