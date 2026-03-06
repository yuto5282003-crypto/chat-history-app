"use client";

import type { AvatarStyle } from "@/lib/demo-data";

/**
 * AvatarFigure — Enhanced SVG avatar for SLOTY plaza.
 *
 * 2–2.5 head-body ratio chibi character.
 * More detailed than before: visible clothing shapes, hair volume,
 * subtle shading, clean lines. Designed to feel "present" on the plaza.
 *
 * Bigger default (64px on plaza, 96-120px in sheets).
 */
export default function AvatarFigure({
  style,
  size = 64,
  className,
  animate,
}: {
  style: AvatarStyle;
  size?: number;
  className?: string;
  animate?: "idle" | "walk";
}) {
  const { hairStyle, hairColor, skinTone, topColor, bottomColor, accessory, expression } = style;

  // Derived colors for shading
  const skinShadow = darken(skinTone, 12);
  const topShadow = darken(topColor, 15);
  const bottomShadow = darken(bottomColor, 10);
  const hairShadow = darken(hairColor, 15);
  const shoeColor = "#4A4A5A";
  const shoeShadow = "#3A3A4A";

  // Expression rendering
  const leftEye = expression === 2
    ? <line x1="36" y1="40" x2="42" y2="40" stroke="#2A2A3A" strokeWidth="2.2" strokeLinecap="round" />
    : <>{/* Eye white */}<ellipse cx="39" cy="39" rx="4" ry={expression === 3 ? 4.5 : 3.8} fill="#fff" /><ellipse cx="39.5" cy="39.5" rx="2.8" ry={expression === 3 ? 3.2 : 2.8} fill="#2A2A3A" /><circle cx="38" cy="38.5" r="1" fill="#fff" opacity="0.8" /></>;

  const rightEye = expression === 2
    ? <path d="M58 37 Q61 42 58 43" stroke="#2A2A3A" strokeWidth="2" fill="none" strokeLinecap="round" />
    : <>{/* Eye white */}<ellipse cx="61" cy="39" rx="4" ry={expression === 3 ? 4.5 : 3.8} fill="#fff" /><ellipse cx="61.5" cy="39.5" rx="2.8" ry={expression === 3 ? 3.2 : 2.8} fill="#2A2A3A" /><circle cx="60" cy="38.5" r="1" fill="#fff" opacity="0.8" /></>;

  const mouth = expression >= 1
    ? <path
        d={expression === 3 ? "M44 50 Q50 57 56 50" : "M45 50 Q50 55 55 50"}
        stroke="#E87777" strokeWidth="2" fill={expression === 3 ? "#F5A0A0" : "none"} strokeLinecap="round"
        fillOpacity={expression === 3 ? 0.3 : 0}
      />
    : <line x1="46" y1="51" x2="54" y2="51" stroke="#C4756C" strokeWidth="1.8" strokeLinecap="round" />;

  // Hair rendering based on style
  const hairPaths: Record<number, React.ReactNode> = {
    // 0: Short — clean masculine cut
    0: <>
      <path d="M28 28 Q50 10 72 28 L72 35 Q50 24 28 35Z" fill={hairColor} />
      <path d="M28 30 Q25 28 27 36" stroke={hairColor} strokeWidth="5" fill="none" />
      <path d="M30 28 Q50 12 70 28" fill={hairShadow} opacity="0.3" />
      {/* Side burns */}
      <path d="M30 34 Q28 38 30 42" stroke={hairColor} strokeWidth="3.5" fill="none" />
      <path d="M70 34 Q72 38 70 42" stroke={hairColor} strokeWidth="3.5" fill="none" />
    </>,
    // 1: Medium — soft layers
    1: <>
      <path d="M24 32 Q50 6 76 32 L76 40 Q50 26 24 40Z" fill={hairColor} />
      <path d="M24 34 Q20 40 22 54" stroke={hairColor} strokeWidth="6" fill="none" />
      <path d="M76 34 Q80 40 78 54" stroke={hairColor} strokeWidth="6" fill="none" />
      <path d="M26 32 Q50 10 74 32" fill={hairShadow} opacity="0.25" />
    </>,
    // 2: Long — flowing, feminine
    2: <>
      <path d="M24 32 Q50 6 76 32 L76 38 Q50 24 24 38Z" fill={hairColor} />
      <path d="M22 34 Q16 46 18 72" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M78 34 Q84 46 82 72" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Volume layers */}
      <path d="M22 40 Q18 52 20 68" stroke={hairShadow} strokeWidth="3" fill="none" opacity="0.2" />
      <path d="M78 40 Q82 52 80 68" stroke={hairShadow} strokeWidth="3" fill="none" opacity="0.2" />
      <path d="M26 32 Q50 10 74 32" fill={hairShadow} opacity="0.25" />
    </>,
    // 3: Bob — rounded, modern
    3: <>
      <path d="M24 28 Q50 6 76 28 L78 52 Q76 58 70 58 L30 58 Q24 58 22 52Z" fill={hairColor} />
      <path d="M24 30 Q50 8 76 30" fill={hairShadow} opacity="0.2" />
      {/* Inner shadow for volume */}
      <path d="M30 54 Q50 48 70 54" fill={hairShadow} opacity="0.15" />
    </>,
    // 4: Ponytail — pulled back with tail
    4: <>
      <path d="M26 30 Q50 10 74 30 L74 36 Q50 24 26 36Z" fill={hairColor} />
      {/* Ponytail */}
      <path d="M72 28 Q82 24 84 36 Q86 52 78 56 Q74 48 74 36" fill={hairColor} />
      <path d="M74 32 Q80 30 82 38" fill={hairShadow} opacity="0.2" />
      {/* Tie */}
      <circle cx="74" cy="30" r="2.5" fill={darken(hairColor, 30)} opacity="0.5" />
    </>,
    // 5: Mash / side-swept — modern, unisex
    5: <>
      <path d="M20 38 Q50 4 80 38 L80 42 Q50 28 20 42Z" fill={hairColor} />
      {/* Fringe sweeping across */}
      <path d="M28 36 L24 44" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
      <path d="M72 36 L74 42" stroke={hairColor} strokeWidth="4" strokeLinecap="round" />
      <path d="M22 38 Q50 8 78 38" fill={hairShadow} opacity="0.2" />
      {/* Texture lines */}
      <path d="M35 28 Q40 22 50 24" stroke={hairShadow} strokeWidth="1.5" fill="none" opacity="0.15" />
    </>,
  };

  const animClass = animate === "walk"
    ? "animate-avatar-walk"
    : animate === "idle"
      ? "animate-avatar-idle"
      : "";

  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      className={`${className || ""} ${animClass}`.trim()}
      style={{ overflow: "visible" }}
    >
      {/* Ground shadow */}
      <ellipse cx="50" cy="112" rx="18" ry="4.5" fill="#000" opacity="0.08" />

      {/* ═══ BODY ═══ */}

      {/* Legs */}
      <rect x="36" y="88" width="10" height="17" rx="4.5" fill={bottomColor} />
      <rect x="54" y="88" width="10" height="17" rx="4.5" fill={bottomColor} />
      {/* Leg shadow */}
      <rect x="36" y="92" width="10" height="6" rx="3" fill={bottomShadow} opacity="0.2" />
      <rect x="54" y="92" width="10" height="6" rx="3" fill={bottomShadow} opacity="0.2" />

      {/* Shoes */}
      <ellipse cx="41" cy="106" rx="7" ry="3.5" fill={shoeColor} />
      <ellipse cx="59" cy="106" rx="7" ry="3.5" fill={shoeColor} />
      <ellipse cx="41" cy="105" rx="6.5" ry="2.5" fill={shoeShadow} opacity="0.3" />
      <ellipse cx="59" cy="105" rx="6.5" ry="2.5" fill={shoeShadow} opacity="0.3" />
      {/* Shoe highlights */}
      <ellipse cx="39" cy="104.5" rx="2.5" ry="1" fill="#fff" opacity="0.12" />
      <ellipse cx="57" cy="104.5" rx="2.5" ry="1" fill="#fff" opacity="0.12" />

      {/* Torso */}
      <rect x="32" y="66" width="36" height="26" rx="10" fill={topColor} />
      {/* Torso shading */}
      <rect x="32" y="78" width="36" height="14" rx="8" fill={topShadow} opacity="0.15" />
      {/* Collar / neckline detail */}
      <path d="M42 66 Q50 72 58 66" fill={darken(topColor, 8)} opacity="0.3" />

      {/* Arms */}
      <ellipse cx="28" cy="76" rx="6" ry="8" fill={topColor} />
      <ellipse cx="72" cy="76" rx="6" ry="8" fill={topColor} />
      {/* Arm shadow */}
      <ellipse cx="28" cy="78" rx="5" ry="5" fill={topShadow} opacity="0.15" />
      <ellipse cx="72" cy="78" rx="5" ry="5" fill={topShadow} opacity="0.15" />
      {/* Hands */}
      <circle cx="28" cy="84" r="4.5" fill={skinTone} />
      <circle cx="72" cy="84" r="4.5" fill={skinTone} />
      <circle cx="28" cy="85" r="3.5" fill={skinShadow} opacity="0.12" />
      <circle cx="72" cy="85" r="3.5" fill={skinShadow} opacity="0.12" />

      {/* Neck */}
      <rect x="44" y="58" width="12" height="12" rx="5" fill={skinTone} />

      {/* ═══ HEAD ═══ */}

      {/* Head shape — slightly wider for chibi proportions */}
      <ellipse cx="50" cy="38" rx="26" ry="25" fill={skinTone} />

      {/* Face shadow (subtle jaw/chin shading) */}
      <ellipse cx="50" cy="48" rx="20" ry="12" fill={skinShadow} opacity="0.08" />

      {/* Ears */}
      <ellipse cx="24" cy="38" rx="4" ry="5" fill={skinTone} />
      <ellipse cx="76" cy="38" rx="4" ry="5" fill={skinTone} />
      <ellipse cx="24" cy="39" rx="2.5" ry="3" fill={skinShadow} opacity="0.15" />
      <ellipse cx="76" cy="39" rx="2.5" ry="3" fill={skinShadow} opacity="0.15" />

      {/* Eyebrows */}
      <line x1="34" y1="32" x2="42" y2="33" stroke={darken(hairColor, 10)} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <line x1="58" y1="33" x2="66" y2="32" stroke={darken(hairColor, 10)} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />

      {/* Eyes */}
      {leftEye}
      {rightEye}

      {/* Nose (very subtle) */}
      <ellipse cx="50" cy="45" rx="1.5" ry="1" fill={skinShadow} opacity="0.2" />

      {/* Cheek blush */}
      <ellipse cx="31" cy="45" rx="5" ry="3.5" fill="#FFB4B4" opacity="0.25" />
      <ellipse cx="69" cy="45" rx="5" ry="3.5" fill="#FFB4B4" opacity="0.25" />

      {/* Mouth */}
      {mouth}

      {/* ═══ HAIR ═══ */}
      {hairPaths[hairStyle] || hairPaths[0]}

      {/* ═══ ACCESSORIES ═══ */}
      {accessory === 1 && (
        <>
          {/* Glasses — round, modern */}
          <circle cx="39" cy="39" r="7" fill="none" stroke="#5A5A6A" strokeWidth="1.6" />
          <circle cx="61" cy="39" r="7" fill="none" stroke="#5A5A6A" strokeWidth="1.6" />
          <line x1="46" y1="39" x2="54" y2="39" stroke="#5A5A6A" strokeWidth="1.2" />
          <line x1="32" y1="38" x2="27" y2="37" stroke="#5A5A6A" strokeWidth="1" />
          <line x1="68" y1="38" x2="73" y2="37" stroke="#5A5A6A" strokeWidth="1" />
          {/* Lens reflection */}
          <circle cx="36" cy="37" r="1.5" fill="#fff" opacity="0.15" />
          <circle cx="58" cy="37" r="1.5" fill="#fff" opacity="0.15" />
        </>
      )}
      {accessory === 2 && (
        <>
          {/* Hat — casual cap */}
          <ellipse cx="50" cy="20" rx="30" ry="7" fill={topColor} />
          <rect x="28" y="10" width="44" height="12" rx="6" fill={topColor} />
          <rect x="28" y="10" width="44" height="4" rx="3" fill={darken(topColor, 10)} opacity="0.3" />
          {/* Brim */}
          <ellipse cx="50" cy="22" rx="32" ry="5" fill={darken(topColor, 8)} opacity="0.5" />
        </>
      )}
      {accessory === 3 && (
        <>
          {/* Headphones — modern, sleek */}
          <path d="M22 34 Q22 12 50 12 Q78 12 78 34" stroke="#555" strokeWidth="4" fill="none" />
          <rect x="16" y="30" width="9" height="14" rx="4" fill="#666" />
          <rect x="75" y="30" width="9" height="14" rx="4" fill="#666" />
          {/* Cushion */}
          <rect x="17" y="32" width="7" height="10" rx="3" fill="#777" />
          <rect x="76" y="32" width="7" height="10" rx="3" fill="#777" />
          {/* Highlight */}
          <rect x="18" y="33" width="2" height="4" rx="1" fill="#999" opacity="0.4" />
          <rect x="77" y="33" width="2" height="4" rx="1" fill="#999" opacity="0.4" />
        </>
      )}
    </svg>
  );
}

/** Darken a hex color by a percentage */
function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
