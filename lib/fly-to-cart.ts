"use client";

/**
 * Flies a golden dot from a clicked element into the header cart button.
 * Pure WAAPI — no React tree involvement.
 */
export function flyToCart(fromEl: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cartEl = document.getElementById("cart-button");
  if (!cartEl) return;

  const from = fromEl.getBoundingClientRect();
  const to = cartEl.getBoundingClientRect();

  const dot = document.createElement("div");
  Object.assign(dot.style, {
    position: "fixed",
    left: `${from.left + from.width / 2 - 10}px`,
    top: `${from.top + from.height / 2 - 10}px`,
    width: "20px",
    height: "20px",
    borderRadius: "9999px",
    background: "radial-gradient(circle at 35% 30%, #e3c377, #c6a15b)",
    boxShadow: "0 0 18px rgb(212 175 55 / 0.6)",
    zIndex: "80",
    pointerEvents: "none",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(dot);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  const flight = dot.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 90}px) scale(0.85)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.6 },
    ],
    { duration: 700, easing: "cubic-bezier(0.5, 0, 0.6, 1)" }
  );

  flight.onfinish = () => {
    dot.remove();
    cartEl.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.28)" },
        { transform: "scale(1)" },
      ],
      { duration: 380, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    );
  };
}
