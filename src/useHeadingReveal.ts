import { useLayoutEffect } from "react";

// Serega Gentle motion contract:
// https://github.com/mishanaer/deslop/tree/main/serega/serega-gentle
// One reveal per heading; React's original children are restored on teardown.
export function useHeadingReveal(pageKey: boolean) {
  useLayoutEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visual =
      import.meta.env.DEV &&
      new URLSearchParams(location.search).get("visual") === "figma";
    if (visual || preference.matches) return;

    const animations = new Set<Animation>();
    const restore: Array<() => void> = [];
    const segmenter =
      typeof Intl.Segmenter === "function"
        ? new Intl.Segmenter("ru", { granularity: "grapheme" })
        : undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          target
            .querySelectorAll<HTMLElement>(".heading-letter")
            .forEach((letter, index) => {
              const animation = letter.animate(
                [
                  { opacity: 0, transform: "translate3d(0,15px,0)" },
                  { opacity: 1, transform: "translate3d(0,0,0)" },
                ],
                {
                  duration: 500,
                  delay: index * 15,
                  easing: "cubic-bezier(0.2,0.8,0.2,1)",
                  fill: "both",
                },
              );
              animations.add(animation);
              animation.finished
                .then(() => {
                  letter.style.opacity = "1";
                  letter.style.transform = "none";
                  animation.cancel();
                  animations.delete(animation);
                })
                .catch(() => {});
            });
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll<HTMLElement>("main h1,main h2")
      .forEach((heading) => {
        const original = Array.from(heading.childNodes);
        const label = heading.getAttribute("aria-label");
        const copy = heading.innerText.replace(/\s+/g, " ").trim();
        const fragment = document.createDocumentFragment();
        const append = (node: Node, parent: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            // Regular spaces remain break opportunities; NBSP stays in its word.
            (node.textContent ?? "").split(/([ \t\r\n]+)/u).forEach((token) => {
              if (!token) return;
              if (/^[ \t\r\n]+$/u.test(token)) {
                parent.appendChild(document.createTextNode(token));
                return;
              }
              const word = document.createElement("span");
              word.className = "heading-word";
              word.setAttribute("aria-hidden", "true");
              const glyphs = segmenter
                ? Array.from(segmenter.segment(token), ({ segment }) => segment)
                : Array.from(token);
              glyphs.forEach((glyph) => {
                const letter = document.createElement("span");
                letter.className = "heading-letter";
                letter.textContent = glyph;
                word.appendChild(letter);
              });
              parent.appendChild(word);
            });
          } else {
            const clone = node.cloneNode(false);
            node.childNodes.forEach((child) => append(child, clone));
            parent.appendChild(clone);
          }
        };
        original.forEach((node) => append(node, fragment));
        heading.setAttribute("aria-label", copy);
        heading.replaceChildren(fragment);
        observer.observe(heading);
        restore.push(() => {
          heading.replaceChildren(...original);
          if (label === null) heading.removeAttribute("aria-label");
          else heading.setAttribute("aria-label", label);
        });
      });
    const stopMotion = () => {
      if (!preference.matches) return;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      restore.forEach((reset) => reset());
      restore.length = 0;
    };
    preference.addEventListener("change", stopMotion);
    return () => {
      preference.removeEventListener("change", stopMotion);
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      restore.forEach((reset) => reset());
    };
  }, [pageKey]);
}
