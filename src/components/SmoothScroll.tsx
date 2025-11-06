"use client";

import { PropsWithChildren, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: PropsWithChildren) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Use GSAP's ticker for a rock-solid RAF clock
    const ticker = (time: number) => {
      // gsap.ticker time is in seconds; Lenis expects ms
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);

    gsap.ticker.lagSmoothing(0);

    // Optional: scrollerProxy to ensure perfect pinning with Lenis
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // Force transform-based pinning for Lenis to avoid reverse jump glitches
      pinType: "transform",
    });

    // Keep integration local per-trigger to avoid global defaults that affect the whole site
    ScrollTrigger.addEventListener("refresh", () => {
      requestAnimationFrame(() => lenis.raf(performance.now()));
    });
    // Ensure correct measurements once images/fonts are fully loaded
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
