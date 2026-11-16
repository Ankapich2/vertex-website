import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function useSmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | undefined;
    const syncLock = () => {
      if (!instance) return;
      if (getComputedStyle(document.body).overflow === "hidden")
        instance.stop();
      else instance.start();
    };
    const configure = () => {
      instance?.destroy();
      instance = undefined;
      if (preference.matches) return;
      instance = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        prevent: (node) => !!node.closest("[data-lenis-prevent]"),
      });
      syncLock();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
    preference.addEventListener("change", configure);
    configure();
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", configure);
      instance?.destroy();
    };
  }, []);
}
