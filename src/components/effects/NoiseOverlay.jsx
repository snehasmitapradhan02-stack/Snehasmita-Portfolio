/**
 * Film-grain overlay. Purely decorative, sits above the page and below the
 * cursor, and never intercepts pointer events.
 */
export default function NoiseOverlay() {
  return <div aria-hidden="true" className="noise-overlay" />;
}
