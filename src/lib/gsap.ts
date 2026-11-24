"use client";

// Register GSAP plugins once and import GSAP from here everywhere else,
// so every component gets the same registered instance.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Toggle actions for "animate the first time it scrolls into view".
 * Use this instead of `once: true`: a `once` trigger deletes itself when it
 * fires, and if that happens while GSAP is still setting up later triggers
 * (e.g. the page loads already scrolled down via a #link), GSAP crashes.
 */
export const PLAY_ONCE = "play none none none";

export { gsap, ScrollTrigger, SplitText, useGSAP };
