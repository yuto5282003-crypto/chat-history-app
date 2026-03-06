"use client";

import type { AvatarStyle } from "@/lib/demo-data";

/**
 * AvatarFigure — Pure SVG avatar rendered inline.
 * Chibi-style but clean: round head, simple body, customizable colors.
 * Designed to be small (40-60px) on the plaza map and larger in sheets.
 */
export default function AvatarFigure({
  style,
  size = 48,
  className,
  animate,
}: {
  style: AvatarStyle;
  size?: number;
  className?: string;
  animate?: "idle" | "walk";
}) {
  const { hairStyle, hairColor, skinTone, topColor, bottomColor, accessory, expression } = style;

  // Expression helpers
  const leftEye = expression === 2
    ? <line x1="17" y1="19" x2="21" y2="19" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
    : <ellipse cx="19" cy="19" rx="1.8" ry={expression === 3 ? 2.2 : 1.8} fill="#333" />;
  const rightEye = expression === 2
    ? <path d="M29 17 Q31 21 29 21" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    : <ellipse cx="31" cy="19" rx="1.8" ry={expression === 3 ? 2.2 : 1.8} fill="#333" />;
  const mouth = expression >= 1
    ? <path d={expression === 3 ? "M22 25 Q25 30 28 25" : "M22 25 Q25 28 28 25"} stroke="#E87777" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    : <line x1="23" y1="26" x2="27" y2="26" stroke="#C4756C" strokeWidth="1.3" strokeLinecap="round" />;

  // Hair paths based on style index
  const hairPaths: Record<number, React.ReactNode> = {
    0: <>{/* Short */}<path d="M14 14 Q25 4 36 14 L36 17 Q25 12 14 17Z" fill={hairColor} /><path d="M14 15 Q10 14 12 18" stroke={hairColor} strokeWidth="3" fill="none" /></>,
    1: <>{/* Medium */}<path d="M12 16 Q25 2 38 16 L38 20 Q25 14 12 20Z" fill={hairColor} /><path d="M12 17 Q9 20 10 28" stroke={hairColor} strokeWidth="4" fill="none" /><path d="M38 17 Q41 20 40 28" stroke={hairColor} strokeWidth="4" fill="none" /></>,
    2: <>{/* Long */}<path d="M12 16 Q25 2 38 16 L38 20 Q25 14 12 20Z" fill={hairColor} /><path d="M11 17 Q8 24 9 36" stroke={hairColor} strokeWidth="5" fill="none" /><path d="M39 17 Q42 24 41 36" stroke={hairColor} strokeWidth="5" fill="none" /></>,
    3: <>{/* Bob */}<path d="M12 14 Q25 3 38 14 L39 26 Q38 30 35 30 L15 30 Q12 30 11 26Z" fill={hairColor} /></>,
    4: <>{/* Ponytail */}<path d="M12 16 Q25 4 38 16 L38 19 Q25 13 12 19Z" fill={hairColor} /><path d="M36 14 Q44 12 42 28 Q40 36 38 28" fill={hairColor} /></>,
    5: <>{/* Mash */}<path d="M10 20 Q25 0 40 20 L40 22 Q25 16 10 22Z" fill={hairColor} /><path d="M14 18 L13 22" stroke={hairColor} strokeWidth="3" /><path d="M36 18 L37 22" stroke={hairColor} strokeWidth="3" /></>,
  };

  const animClass = animate === "walk"
    ? "animate-avatar-walk"
    : animate === "idle"
      ? "animate-avatar-idle"
      : "";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 56"
      className={`${className || ""} ${animClass}`.trim()}
      style={{ overflow: "visible" }}
    >
      {/* Shadow */}
      <ellipse cx="25" cy="55" rx="10" ry="3" fill="#000" opacity="0.08" />

      {/* Body / torso */}
      <rect x="18" y="34" width="14" height="14" rx="5" fill={topColor} />

      {/* Legs */}
      <rect x="19" y="46" width="5" height="8" rx="2.5" fill={bottomColor} />
      <rect x="26" y="46" width="5" height="8" rx="2.5" fill={bottomColor} />

      {/* Shoes */}
      <ellipse cx="21.5" cy="54" rx="3.5" ry="2" fill="#555" />
      <ellipse cx="28.5" cy="54" rx="3.5" ry="2" fill="#555" />

      {/* Arms */}
      <rect x="12" y="36" width="6" height="4" rx="2" fill={skinTone} />
      <rect x="32" y="36" width="6" height="4" rx="2" fill={skinTone} />

      {/* Head */}
      <circle cx="25" cy="20" r="14" fill={skinTone} />

      {/* Cheek blush */}
      <circle cx="15" cy="22" r="3" fill="#FFB4B4" opacity="0.3" />
      <circle cx="35" cy="22" r="3" fill="#FFB4B4" opacity="0.3" />

      {/* Eyes */}
      {leftEye}
      {rightEye}

      {/* Mouth */}
      {mouth}

      {/* Hair */}
      {hairPaths[hairStyle] || hairPaths[0]}

      {/* Accessories */}
      {accessory === 1 && (
        <>
          {/* Glasses */}
          <circle cx="19" cy="19" r="4.5" fill="none" stroke="#555" strokeWidth="1.2" />
          <circle cx="31" cy="19" r="4.5" fill="none" stroke="#555" strokeWidth="1.2" />
          <line x1="23.5" y1="19" x2="26.5" y2="19" stroke="#555" strokeWidth="1" />
        </>
      )}
      {accessory === 2 && (
        <>
          {/* Hat */}
          <ellipse cx="25" cy="10" rx="16" ry="4" fill={topColor} />
          <rect x="16" y="4" width="18" height="7" rx="3" fill={topColor} />
        </>
      )}
      {accessory === 3 && (
        <>
          {/* Headphones */}
          <path d="M11 18 Q11 6 25 6 Q39 6 39 18" stroke="#555" strokeWidth="2.5" fill="none" />
          <rect x="8" y="15" width="5" height="8" rx="2.5" fill="#666" />
          <rect x="37" y="15" width="5" height="8" rx="2.5" fill="#666" />
        </>
      )}
    </svg>
  );
}
