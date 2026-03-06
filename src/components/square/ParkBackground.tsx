"use client";

/**
 * ParkBackground — Inline SVG park/garden background for the square.
 * Soft pastel palette, minimal detail. Designed to be visually pleasant
 * without overwhelming the avatars placed on top.
 *
 * The SVG is 800x600 viewBox, rendered at full container width.
 * Key landmarks: central fountain, trees, benches, paths, hedges.
 */
export default function ParkBackground() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8F4FD" />
          <stop offset="100%" stopColor="#D5EDFB" />
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8E6A1" />
          <stop offset="100%" stopColor="#9BD88A" />
        </linearGradient>
        <radialGradient id="water" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B8DDF2" />
          <stop offset="100%" stopColor="#8EC8E8" />
        </radialGradient>
        <linearGradient id="path-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F0E6D3" />
          <stop offset="100%" stopColor="#E8DCCA" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="600" fill="url(#sky)" />

      {/* Ground / grass */}
      <rect y="120" width="800" height="480" fill="url(#grass)" rx="0" />

      {/* Paths — soft sand-colored curved walkways */}
      <path d="M0 350 Q200 320 400 350 Q600 380 800 350 L800 370 Q600 400 400 370 Q200 340 0 370Z" fill="url(#path-g)" opacity="0.7" />
      <path d="M400 180 L400 500" stroke="#E8DCCA" strokeWidth="28" strokeLinecap="round" opacity="0.5" />
      <path d="M200 140 Q300 250 400 280" stroke="#E8DCCA" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M600 140 Q500 250 400 280" stroke="#E8DCCA" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* Central fountain — oval pool + simple spray */}
      <ellipse cx="400" cy="280" rx="65" ry="35" fill="url(#water)" />
      <ellipse cx="400" cy="280" rx="55" ry="28" fill="#A0D4EE" opacity="0.4" />
      {/* Fountain base */}
      <rect x="393" y="252" width="14" height="28" rx="7" fill="#D0D0D0" />
      {/* Water spray — 3 small arcs */}
      <path d="M400 252 Q396 238 392 245" stroke="#B8DDF2" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M400 252 Q400 235 400 245" stroke="#B8DDF2" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M400 252 Q404 238 408 245" stroke="#B8DDF2" strokeWidth="2" fill="none" opacity="0.7" />
      {/* Sparkle dots */}
      <circle cx="395" cy="243" r="1.5" fill="#D5EDFB" opacity="0.8" />
      <circle cx="405" cy="240" r="1.5" fill="#D5EDFB" opacity="0.8" />
      <circle cx="400" cy="237" r="1.5" fill="#D5EDFB" opacity="0.8" />

      {/* Trees — simple lollipop shapes with shadow */}
      {/* Tree 1 - left */}
      <ellipse cx="85" cy="195" rx="8" ry="15" fill="#7FB069" opacity="0.15" />
      <rect x="82" y="210" width="6" height="22" rx="3" fill="#9E7A5A" />
      <circle cx="85" cy="195" r="25" fill="#7FB069" />
      <circle cx="78" cy="188" r="8" fill="#8DC478" opacity="0.6" />

      {/* Tree 2 - left-center */}
      <ellipse cx="210" cy="165" rx="8" ry="15" fill="#7FB069" opacity="0.15" />
      <rect x="207" y="182" width="6" height="18" rx="3" fill="#9E7A5A" />
      <circle cx="210" cy="168" r="22" fill="#6BA55A" />
      <circle cx="204" cy="162" r="7" fill="#7FB069" opacity="0.6" />

      {/* Tree 3 - right-center */}
      <ellipse cx="590" cy="170" rx="8" ry="15" fill="#7FB069" opacity="0.15" />
      <rect x="587" y="185" width="6" height="20" rx="3" fill="#9E7A5A" />
      <circle cx="590" cy="172" r="24" fill="#7FB069" />
      <circle cx="596" cy="166" r="7" fill="#8DC478" opacity="0.6" />

      {/* Tree 4 - far right */}
      <ellipse cx="720" cy="200" rx="8" ry="15" fill="#7FB069" opacity="0.15" />
      <rect x="717" y="215" width="6" height="20" rx="3" fill="#9E7A5A" />
      <circle cx="720" cy="200" r="22" fill="#6BA55A" />

      {/* Tree 5 - bottom left */}
      <rect x="122" y="430" width="6" height="22" rx="3" fill="#9E7A5A" />
      <circle cx="125" cy="418" r="26" fill="#7FB069" />
      <circle cx="118" cy="412" r="8" fill="#8DC478" opacity="0.5" />

      {/* Tree 6 - bottom right */}
      <rect x="677" y="420" width="6" height="22" rx="3" fill="#9E7A5A" />
      <circle cx="680" cy="408" r="24" fill="#6BA55A" />

      {/* Hedges — rounded rectangles */}
      <rect x="280" y="190" width="50" height="16" rx="8" fill="#6B9E5A" opacity="0.7" />
      <rect x="470" y="190" width="50" height="16" rx="8" fill="#6B9E5A" opacity="0.7" />

      {/* Benches — simple rectangles with legs */}
      {/* Bench 1 - left side */}
      <rect x="148" y="322" width="36" height="6" rx="2" fill="#C19A6B" />
      <rect x="151" y="328" width="3" height="8" fill="#A17B52" />
      <rect x="178" y="328" width="3" height="8" fill="#A17B52" />
      <rect x="148" y="316" width="36" height="3" rx="1" fill="#D4A574" />

      {/* Bench 2 - right side */}
      <rect x="616" y="340" width="36" height="6" rx="2" fill="#C19A6B" />
      <rect x="619" y="346" width="3" height="8" fill="#A17B52" />
      <rect x="646" y="346" width="3" height="8" fill="#A17B52" />
      <rect x="616" y="334" width="36" height="3" rx="1" fill="#D4A574" />

      {/* Flowers — tiny colored circles near paths */}
      <circle cx="320" cy="370" r="3" fill="#F3A7C6" opacity="0.8" />
      <circle cx="330" cy="375" r="2.5" fill="#F3A7C6" opacity="0.6" />
      <circle cx="315" cy="378" r="2" fill="#B79DFF" opacity="0.7" />
      <circle cx="480" cy="365" r="3" fill="#F3A7C6" opacity="0.8" />
      <circle cx="490" cy="372" r="2.5" fill="#7B8CFF" opacity="0.6" />
      <circle cx="475" cy="375" r="2" fill="#F3A7C6" opacity="0.6" />

      {/* Light lamp posts */}
      <rect x="298" y="295" width="3" height="30" fill="#888" opacity="0.4" />
      <circle cx="300" cy="292" r="5" fill="#FFF3E0" opacity="0.5" />
      <rect x="498" y="295" width="3" height="30" fill="#888" opacity="0.4" />
      <circle cx="500" cy="292" r="5" fill="#FFF3E0" opacity="0.5" />

      {/* Subtle cloud shadows on grass */}
      <ellipse cx="200" cy="450" rx="60" ry="15" fill="#000" opacity="0.03" />
      <ellipse cx="600" cy="480" rx="50" ry="12" fill="#000" opacity="0.03" />
    </svg>
  );
}
