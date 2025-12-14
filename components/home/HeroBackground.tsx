import type { CSSProperties } from "react";

const baseBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(60% 55% at 22% 18%, rgb(var(--accent-green-rgb) / 0.34) 0%, transparent 62%)",
    "radial-gradient(65% 60% at 78% 22%, rgb(var(--primary-blue-rgb) / 0.32) 0%, transparent 60%)",
    "radial-gradient(60% 60% at 55% 70%, rgb(var(--primary-blue-rgb) / 0.22) 0%, transparent 58%)",
    "radial-gradient(55% 55% at 45% 55%, rgb(var(--accent-green-rgb) / 0.26) 0%, transparent 60%)",
    "radial-gradient(85% 65% at 50% 40%, rgb(var(--primary-blue-rgb) / 0.18) 0%, transparent 70%)",
    "linear-gradient(180deg, rgb(var(--background-paper-rgb) / 1) 0%, rgb(var(--background-paper-rgb) / 0.92) 40%, rgb(var(--background-mist-rgb) / 0.75) 100%)",
  ].join(", "),
};

function HeroOrbits() {
  const orbitCount = 14;
  const center = 300;

  const orbits = Array.from({ length: orbitCount }, (_, index) => {
    const rotate = index * (360 / orbitCount);
    const radiusX = 210 - index * 4;
    const radiusY = 120 + index * 3;
    return { rotate, radiusX, radiusY };
  });

  return (
    <svg
      className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-50"
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="orbitSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
      <g filter="url(#orbitSoft)" style={{ mixBlendMode: "overlay" }}>
        {orbits.map((orbit) => (
          <ellipse
            key={orbit.rotate}
            cx={center}
            cy={center}
            rx={orbit.radiusX}
            ry={orbit.radiusY}
            transform={`rotate(${orbit.rotate} ${center} ${center})`}
            stroke="rgb(255 255 255 / 0.55)"
            strokeWidth={1.2}
          />
        ))}
      </g>
    </svg>
  );
}

function HeroGrain() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.18]"
      aria-hidden="true"
      style={{ mixBlendMode: "soft-light" }}
    >
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 [filter:saturate(1.18)_contrast(1.06)]"
        style={baseBackgroundStyle}
      />
      <HeroOrbits />
      <HeroGrain />
      <div className="absolute inset-0 bg-gradient-to-b from-background-paper/30 via-background-paper/15 to-background-mist/25" />
    </div>
  );
}
