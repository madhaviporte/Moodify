import { useRef, useEffect } from "react";

/**
 * useParallax — lightweight mouse-parallax for auth pages.
 *
 * Sets CSS custom properties on the page element:
 *   --mx  (-1 to 1)  horizontal normalized cursor
 *   --my  (-1 to 1)  vertical normalized cursor
 *   --mxp (-1 to 1)  for card 3D tilt (smaller range)
 *   --cx, --cy        cursor position for glow element
 *
 * Uses direct DOM style writes — zero React re-renders.
 * Disabled on touch devices.
 */
export default function useParallax() {
  const pageRef = useRef(null);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) return;

    // All mutable state lives inside the effect closure — no refs needed for animation
    let rafId = null;
    let tx = 0, ty = 0; // target
    let cx = 0, cy = 0; // current (smoothed)

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function tick() {
      cx = lerp(cx, tx, 0.08);
      cy = lerp(cy, ty, 0.08);

      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      el.style.setProperty("--mxp", (cx * 0.6).toFixed(3));

      if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    function startAnimation() {
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function handleMouseMove(e) {
      const rect = el.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      el.style.setProperty("--cx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--cy", `${e.clientY - rect.top}px`);

      startAnimation();
    }

    function handleMouseLeave() {
      tx = 0;
      ty = 0;
      startAnimation();
    }

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return pageRef;
}
