"use client";

/**
 * ParkBackground — Rich isometric 3D-style miniature garden for SLOTY plaza.
 *
 * Design goals:
 * - Strong isometric 3D feel with shadows and depth layers
 * - Rich details: gazebo, café tables, flower arches, statues, bridges
 * - Warm, inviting atmosphere — a place people want to be
 * - SLOTY lavender/pink accents woven throughout
 * - Multiple depth layers for parallax-like effect
 */
export default function ParkBackground() {
  return (
    <svg
      viewBox="0 0 1000 900"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {/* Sky gradient — warm golden hour */}
        <linearGradient id="pk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8E0F8" />
          <stop offset="40%" stopColor="#DDE9F6" />
          <stop offset="70%" stopColor="#E8F0E8" />
          <stop offset="100%" stopColor="#EEF4E0" />
        </linearGradient>

        {/* Grass gradients */}
        <linearGradient id="pk-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ECF60" />
          <stop offset="100%" stopColor="#6BBF50" />
        </linearGradient>
        <linearGradient id="pk-grass-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#90D878" />
          <stop offset="100%" stopColor="#7ECF60" />
        </linearGradient>
        <linearGradient id="pk-grass-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BBF50" />
          <stop offset="100%" stopColor="#5AAE42" />
        </linearGradient>

        {/* Path */}
        <linearGradient id="pk-path" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2E6D2" />
          <stop offset="50%" stopColor="#E8D8C0" />
          <stop offset="100%" stopColor="#F0E2CE" />
        </linearGradient>
        <linearGradient id="pk-path-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4C4AA" />
          <stop offset="100%" stopColor="#C8B898" />
        </linearGradient>

        {/* Water */}
        <radialGradient id="pk-water" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#B8E4F8" />
          <stop offset="60%" stopColor="#90CCE8" />
          <stop offset="100%" stopColor="#78BCD8" />
        </radialGradient>
        <radialGradient id="pk-water-shine" cx="30%" cy="30%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Tree foliage */}
        <radialGradient id="pk-tree-a" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#7CC064" />
          <stop offset="100%" stopColor="#55A040" />
        </radialGradient>
        <radialGradient id="pk-tree-b" cx="35%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#88CC72" />
          <stop offset="100%" stopColor="#60AA48" />
        </radialGradient>
        <radialGradient id="pk-tree-c" cx="45%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#6DB85C" />
          <stop offset="100%" stopColor="#4A9838" />
        </radialGradient>

        {/* Building/structure gradients */}
        <linearGradient id="pk-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A080" />
          <stop offset="100%" stopColor="#B08868" />
        </linearGradient>
        <linearGradient id="pk-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF4EC" />
          <stop offset="100%" stopColor="#EDE4D8" />
        </linearGradient>
        <linearGradient id="pk-gazebo-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A0C0" />
          <stop offset="100%" stopColor="#C088A8" />
        </linearGradient>

        {/* Lamp glow */}
        <radialGradient id="pk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,240,200,0.6)" />
          <stop offset="100%" stopColor="rgba(255,240,200,0)" />
        </radialGradient>

        {/* Shadow filter */}
        <filter id="pk-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.1" />
        </filter>
        <filter id="pk-shadow-sm">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* ═══════ SKY ═══════ */}
      <rect width="1000" height="900" fill="url(#pk-sky)" />

      {/* Clouds — layered for depth */}
      <ellipse cx="120" cy="50" rx="90" ry="25" fill="white" opacity="0.4" />
      <ellipse cx="80" cy="45" rx="55" ry="20" fill="white" opacity="0.45" />
      <ellipse cx="500" cy="35" rx="100" ry="28" fill="white" opacity="0.35" />
      <ellipse cx="460" cy="30" rx="60" ry="20" fill="white" opacity="0.4" />
      <ellipse cx="780" cy="55" rx="80" ry="22" fill="white" opacity="0.3" />
      <ellipse cx="820" cy="50" rx="50" ry="18" fill="white" opacity="0.35" />
      <ellipse cx="300" cy="70" rx="45" ry="14" fill="white" opacity="0.25" />
      <ellipse cx="650" cy="75" rx="55" ry="16" fill="white" opacity="0.2" />

      {/* Distant city silhouette */}
      <rect x="40" y="100" width="25" height="60" rx="2" fill="#C0C8D4" opacity="0.2" />
      <rect x="70" y="80" width="20" height="80" rx="2" fill="#B8C0CC" opacity="0.18" />
      <rect x="95" y="105" width="18" height="55" rx="2" fill="#C4CCD8" opacity="0.15" />
      <rect x="860" y="90" width="22" height="70" rx="2" fill="#C0C8D4" opacity="0.18" />
      <rect x="888" y="100" width="18" height="60" rx="2" fill="#B8C0CC" opacity="0.15" />
      <rect x="912" y="110" width="25" height="50" rx="2" fill="#C4CCD8" opacity="0.17" />
      <rect x="430" y="95" width="14" height="40" rx="1" fill="#CCD4DC" opacity="0.1" />
      <rect x="550" y="100" width="16" height="38" rx="1" fill="#C8D0D8" opacity="0.1" />

      {/* Distant hills */}
      <ellipse cx="200" cy="170" rx="120" ry="35" fill="#A8D090" opacity="0.3" />
      <ellipse cx="500" cy="165" rx="150" ry="40" fill="#9CC880" opacity="0.25" />
      <ellipse cx="800" cy="172" rx="130" ry="38" fill="#A0CC88" opacity="0.28" />

      {/* Distant tree line */}
      <ellipse cx="150" cy="168" rx="45" ry="20" fill="#88B870" opacity="0.35" />
      <ellipse cx="250" cy="165" rx="38" ry="18" fill="#80B068" opacity="0.3" />
      <ellipse cx="650" cy="168" rx="42" ry="19" fill="#88B870" opacity="0.32" />
      <ellipse cx="850" cy="170" rx="35" ry="16" fill="#80B068" opacity="0.28" />

      {/* ═══════ GROUND ═══════ */}
      <rect y="175" width="1000" height="725" fill="url(#pk-grass)" />

      {/* Ground depth layers — isometric feel */}
      <ellipse cx="500" cy="350" rx="450" ry="140" fill="url(#pk-grass-light)" opacity="0.4" />
      <ellipse cx="500" cy="500" rx="480" ry="120" fill="url(#pk-grass-dark)" opacity="0.3" />

      {/* Grass texture patches */}
      <ellipse cx="150" cy="600" rx="70" ry="18" fill="#6BBF50" opacity="0.25" />
      <ellipse cx="800" cy="650" rx="65" ry="15" fill="#6BBF50" opacity="0.2" />
      <ellipse cx="400" cy="720" rx="80" ry="20" fill="#78C858" opacity="0.18" />
      <ellipse cx="600" cy="300" rx="50" ry="14" fill="#90D878" opacity="0.15" />

      {/* ═══════ PATHS — wider, more defined ═══════ */}
      {/* Main horizontal path */}
      <path
        d="M0 500 Q150 475 350 488 Q500 496 650 488 Q850 475 1000 500
           L1000 530 Q850 505 650 518 Q500 526 350 518 Q150 505 0 530Z"
        fill="url(#pk-path)" opacity="0.9"
      />
      <path
        d="M0 530 Q150 505 350 518 Q500 526 650 518 Q850 505 1000 530
           L1000 535 Q850 510 650 523 Q500 531 350 523 Q150 510 0 535Z"
        fill="url(#pk-path-edge)" opacity="0.5"
      />

      {/* Vertical center path */}
      <path
        d="M475 230 Q480 350 485 440 Q490 496 500 510 Q510 496 515 440 Q520 350 525 230Z"
        fill="url(#pk-path)" opacity="0.8"
      />

      {/* Diagonal paths */}
      <path d="M120 230 Q280 350 430 470 L448 462 Q290 342 140 222Z" fill="url(#pk-path)" opacity="0.65" />
      <path d="M880 230 Q720 350 570 470 L552 462 Q710 342 860 222Z" fill="url(#pk-path)" opacity="0.65" />

      {/* Lower branching paths */}
      <path d="M250 510 Q290 580 250 690 L268 695 Q308 585 268 515Z" fill="url(#pk-path)" opacity="0.55" />
      <path d="M750 510 Q710 580 750 690 L732 695 Q692 585 732 515Z" fill="url(#pk-path)" opacity="0.55" />

      {/* Small circular path around fountain */}
      <ellipse cx="500" cy="435" rx="110" ry="50" fill="none" stroke="url(#pk-path)" strokeWidth="28" opacity="0.6" />

      {/* Path stones */}
      {[
        [250,495],[350,498],[450,508],[550,498],[650,495],[150,492],[750,492],[800,498],
        [500,380],[495,420],[505,340],[490,280],
      ].map(([cx,cy],i) => (
        <circle key={`s-${i}`} cx={cx} cy={cy} r="2.5" fill="#D4C8B4" opacity="0.35" />
      ))}

      {/* ═══════ CENTRAL FOUNTAIN — larger, more detailed ═══════ */}
      <ellipse cx="500" cy="460" rx="95" ry="32" fill="#000" opacity="0.06" />

      {/* Outer rim — stone */}
      <ellipse cx="500" cy="435" rx="90" ry="38" fill="#D4D0C8" />
      <ellipse cx="500" cy="430" rx="90" ry="38" fill="#E4E0D8" />

      {/* Inner rim */}
      <ellipse cx="500" cy="428" rx="78" ry="32" fill="#D8D4CC" />

      {/* Water surface */}
      <ellipse cx="500" cy="426" rx="74" ry="30" fill="url(#pk-water)" />
      <ellipse cx="500" cy="426" rx="74" ry="30" fill="url(#pk-water-shine)" />

      {/* Water ripples */}
      <ellipse cx="500" cy="430" rx="55" ry="22" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.35" />
      <ellipse cx="500" cy="432" rx="38" ry="15" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.25" />
      <ellipse cx="500" cy="434" rx="20" ry="8" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.2" />

      {/* Fountain pedestal */}
      <rect x="492" y="385" width="16" height="48" rx="8" fill="#D8D4CC" />
      <ellipse cx="500" cy="385" rx="12" ry="5" fill="#E0DCD4" />

      {/* Fountain top bowl */}
      <ellipse cx="500" cy="378" rx="22" ry="8" fill="#DCD8D0" />
      <ellipse cx="500" cy="376" rx="18" ry="6" fill="#88C4DE" opacity="0.6" />

      {/* Fountain top ornament */}
      <ellipse cx="500" cy="368" rx="6" ry="6" fill="#E8E4DC" />
      <circle cx="500" cy="362" r="4" fill="#D4D0C8" />

      {/* Water spray arcs — elegant */}
      <path d="M500 366 Q492 342 482 356" stroke="#A8D8EE" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M500 366 Q500 338 500 352" stroke="#A8D8EE" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M500 366 Q508 342 518 356" stroke="#A8D8EE" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M500 366 Q488 346 476 360" stroke="#B0DCEE" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M500 366 Q512 346 524 360" stroke="#B0DCEE" strokeWidth="1.2" fill="none" opacity="0.4" />

      {/* Water droplets */}
      <circle cx="486" cy="348" r="2" fill="#C5E8F5" opacity="0.6" />
      <circle cx="514" cy="346" r="2" fill="#C5E8F5" opacity="0.5" />
      <circle cx="500" cy="340" r="2.5" fill="#D0EEFA" opacity="0.7" />

      {/* ═══════ GAZEBO — upper right ═══════ */}
      <g transform="translate(750, 260)" filter="url(#pk-shadow)">
        {/* Floor/base */}
        <ellipse cx="0" cy="65" rx="55" ry="20" fill="#E0D8CC" />
        <ellipse cx="0" cy="62" rx="52" ry="18" fill="#EDE6DC" />
        {/* Pillars */}
        <rect x="-40" y="10" width="5" height="55" rx="2" fill="#E8E4DC" />
        <rect x="35" y="10" width="5" height="55" rx="2" fill="#E8E4DC" />
        <rect x="-3" y="8" width="5" height="57" rx="2" fill="#F0ECE4" />
        {/* Roof — SLOTY lavender */}
        <path d="M-55 12 L0 -18 L55 12Z" fill="url(#pk-gazebo-roof)" />
        <path d="M-55 12 L55 12 L50 18 L-50 18Z" fill="#B080A0" opacity="0.5" />
        {/* Roof ornament */}
        <circle cx="0" cy="-20" r="4" fill="#D4A0C0" />
        {/* Railing */}
        <line x1="-38" y1="50" x2="38" y2="50" stroke="#D8D4CC" strokeWidth="2" />
        <line x1="-38" y1="55" x2="38" y2="55" stroke="#D8D4CC" strokeWidth="1.5" />
        {/* Bench inside */}
        <rect x="-25" y="45" width="50" height="6" rx="2" fill="#D4A57A" />
      </g>

      {/* ═══════ CAFÉ AREA — upper left ═══════ */}
      <g transform="translate(180, 280)" filter="url(#pk-shadow-sm)">
        {/* Café awning */}
        <path d="M-50 -5 L50 -5 L45 5 L-45 5Z" fill="#E8A0A0" opacity="0.7" />
        <path d="M-50 -5 L50 -5 L55 -8 L-55 -8Z" fill="#D88888" opacity="0.6" />
        {/* Table 1 */}
        <ellipse cx="-18" cy="25" rx="14" ry="7" fill="#F0E8DC" />
        <rect x="-20" y="24" width="4" height="12" rx="1" fill="#C8B898" />
        {/* Chair */}
        <rect x="-32" y="22" width="8" height="8" rx="2" fill="#D4A57A" />
        <rect x="-8" y="22" width="8" height="8" rx="2" fill="#D4A57A" />
        {/* Table 2 */}
        <ellipse cx="22" cy="25" rx="14" ry="7" fill="#F0E8DC" />
        <rect x="20" y="24" width="4" height="12" rx="1" fill="#C8B898" />
        {/* Chairs */}
        <rect x="8" y="22" width="8" height="8" rx="2" fill="#D4A57A" />
        <rect x="32" y="22" width="8" height="8" rx="2" fill="#D4A57A" />
        {/* Umbrella */}
        <rect x="-19" y="0" width="2" height="25" fill="#AAA" />
        <ellipse cx="-18" cy="0" rx="16" ry="5" fill="#E88888" opacity="0.6" />
        <rect x="21" y="0" width="2" height="25" fill="#AAA" />
        <ellipse cx="22" cy="0" rx="16" ry="5" fill="#B8A0D8" opacity="0.6" />
      </g>

      {/* ═══════ FLOWER ARCHES ═══════ */}
      {/* Arch 1 — near main path left */}
      <g transform="translate(320, 470)">
        <path d="M0 0 Q15 -25 30 0" stroke="#8B7355" strokeWidth="3" fill="none" />
        <circle cx="5" cy="-10" r="4" fill="#F3A7C6" opacity="0.7" />
        <circle cx="15" cy="-20" r="4.5" fill="#B79DFF" opacity="0.7" />
        <circle cx="25" cy="-10" r="4" fill="#F3A7C6" opacity="0.7" />
        <circle cx="10" cy="-16" r="3" fill="#9B8AFB" opacity="0.5" />
        <circle cx="20" cy="-16" r="3" fill="#F3A7C6" opacity="0.5" />
        <ellipse cx="8" cy="-8" rx="4" ry="2" fill="#6BA55A" opacity="0.4" />
        <ellipse cx="22" cy="-8" rx="4" ry="2" fill="#6BA55A" opacity="0.4" />
      </g>
      {/* Arch 2 — near main path right */}
      <g transform="translate(650, 470)">
        <path d="M0 0 Q15 -25 30 0" stroke="#8B7355" strokeWidth="3" fill="none" />
        <circle cx="5" cy="-10" r="4" fill="#B79DFF" opacity="0.7" />
        <circle cx="15" cy="-20" r="4.5" fill="#F3A7C6" opacity="0.7" />
        <circle cx="25" cy="-10" r="4" fill="#B79DFF" opacity="0.7" />
        <circle cx="10" cy="-16" r="3" fill="#F3A7C6" opacity="0.5" />
        <circle cx="20" cy="-16" r="3" fill="#9B8AFB" opacity="0.5" />
        <ellipse cx="8" cy="-8" rx="4" ry="2" fill="#6BA55A" opacity="0.4" />
        <ellipse cx="22" cy="-8" rx="4" ry="2" fill="#6BA55A" opacity="0.4" />
      </g>

      {/* ═══════ FLOWER BEDS — multiple, rich ═══════ */}
      {/* Left bed near fountain */}
      <ellipse cx="360" cy="440" rx="40" ry="14" fill="#5DA34A" opacity="0.2" />
      {[[340,435,"#B79DFF"],[348,432,"#F3A7C6"],[356,434,"#B79DFF"],[364,436,"#F3A7C6"],[372,433,"#9B8AFB"],[380,437,"#F3A7C6"],[345,439,"#9B8AFB"],[365,441,"#B79DFF"]].map(([cx,cy,c],i) => (
        <circle key={`fl-${i}`} cx={cx as number} cy={cy as number} r={3.5} fill={c as string} opacity="0.7" />
      ))}

      {/* Right bed near fountain */}
      <ellipse cx="640" cy="440" rx="40" ry="14" fill="#5DA34A" opacity="0.2" />
      {[[620,435,"#F3A7C6"],[628,432,"#B79DFF"],[636,434,"#F3A7C6"],[644,436,"#9B8AFB"],[652,433,"#F3A7C6"],[660,437,"#B79DFF"],[632,439,"#F3A7C6"],[648,441,"#B79DFF"]].map(([cx,cy,c],i) => (
        <circle key={`fr-${i}`} cx={cx as number} cy={cy as number} r={3.5} fill={c as string} opacity="0.7" />
      ))}

      {/* Long flower bed along lower path */}
      <ellipse cx="500" cy="560" rx="80" ry="12" fill="#5DA34A" opacity="0.15" />
      {[[435,558],[455,555],[475,557],[495,554],[515,557],[535,555],[555,558],[565,556]].map(([cx,cy],i) => (
        <circle key={`fb-${i}`} cx={cx} cy={cy} r={3} fill={i%2===0 ? "#F3A7C6" : "#B79DFF"} opacity="0.6" />
      ))}

      {/* ═══════ TREES — varied sizes and positions ═══════ */}

      {/* Tree 1 — Large left */}
      <g filter="url(#pk-shadow-sm)">
        <ellipse cx="80" cy="390" rx="16" ry="5" fill="#000" opacity="0.06" />
        <rect x="73" y="335" width="14" height="58" rx="6" fill="#8B7355" />
        <ellipse cx="80" cy="308" rx="48" ry="40" fill="url(#pk-tree-a)" />
        <ellipse cx="68" cy="295" rx="22" ry="18" fill="#88CC72" opacity="0.5" />
        <ellipse cx="96" cy="300" rx="18" ry="15" fill="#7CC064" opacity="0.4" />
        <ellipse cx="72" cy="288" rx="12" ry="9" fill="#9FD88A" opacity="0.3" />
      </g>

      {/* Tree 2 — Right side */}
      <g filter="url(#pk-shadow-sm)">
        <ellipse cx="920" cy="380" rx="14" ry="4.5" fill="#000" opacity="0.06" />
        <rect x="914" y="330" width="12" height="52" rx="5" fill="#8B7355" />
        <ellipse cx="920" cy="305" rx="42" ry="36" fill="url(#pk-tree-b)" />
        <ellipse cx="908" cy="294" rx="18" ry="14" fill="#7CC064" opacity="0.45" />
        <ellipse cx="935" cy="298" rx="16" ry="13" fill="#6DB85C" opacity="0.4" />
      </g>

      {/* Tree 3 — Upper center-left */}
      <g filter="url(#pk-shadow-sm)">
        <ellipse cx="280" cy="270" rx="12" ry="4" fill="#000" opacity="0.05" />
        <rect x="275" y="235" width="10" height="38" rx="4" fill="#8B7355" />
        <ellipse cx="280" cy="215" rx="35" ry="30" fill="url(#pk-tree-c)" />
        <ellipse cx="270" cy="206" rx="14" ry="12" fill="#9FD88A" opacity="0.4" />
      </g>

      {/* Tree 4 — Upper center-right */}
      <g filter="url(#pk-shadow-sm)">
        <ellipse cx="720" cy="268" rx="12" ry="4" fill="#000" opacity="0.05" />
        <rect x="715" y="232" width="10" height="38" rx="4" fill="#8B7355" />
        <ellipse cx="720" cy="212" rx="36" ry="30" fill="url(#pk-tree-a)" />
        <ellipse cx="730" cy="204" rx="14" ry="11" fill="#88CC72" opacity="0.4" />
      </g>

      {/* Tree 5 — Lower left (big) */}
      <g filter="url(#pk-shadow-sm)">
        <ellipse cx="130" cy="680" rx="15" ry="5" fill="#000" opacity="0.06" />
        <rect x="123" y="625" width="14" height="58" rx="6" fill="#8B7355" />
        <ellipse cx="130" cy="600" rx="44" ry="38" fill="url(#pk-tree-b)" />
        <ellipse cx="118" cy="590" rx="18" ry="14" fill="#7CC064" opacity="0.45" />
      </g>

      {/* Tree 6 — Lower right */}
      <g filter="url(#pk-shadow-sm)">
        <ellipse cx="870" cy="680" rx="13" ry="4.5" fill="#000" opacity="0.05" />
        <rect x="864" y="635" width="12" height="48" rx="5" fill="#8B7355" />
        <ellipse cx="870" cy="612" rx="38" ry="32" fill="url(#pk-tree-c)" />
        <ellipse cx="880" cy="604" rx="14" ry="11" fill="#9FD88A" opacity="0.35" />
      </g>

      {/* Small decorative trees */}
      {[[420,240,20],[580,245,22],[350,600,18],[650,610,20]].map(([x,y,r],i) => (
        <g key={`st-${i}`}>
          <rect x={(x as number)-3} y={(y as number)+2} width="6" height={(r as number)*1.2} rx="2" fill="#8B7355" />
          <ellipse cx={x} cy={y} rx={r} ry={(r as number)*0.85} fill={i%2===0 ? "url(#pk-tree-a)" : "url(#pk-tree-b)"} />
        </g>
      ))}

      {/* Bushes and hedges */}
      <ellipse cx="400" cy="300" rx="22" ry="12" fill="#5E9E4A" opacity="0.55" />
      <ellipse cx="395" cy="297" rx="10" ry="7" fill="#7CC064" opacity="0.35" />
      <ellipse cx="600" cy="305" rx="20" ry="11" fill="#5E9E4A" opacity="0.55" />
      <ellipse cx="605" cy="302" rx="9" ry="6" fill="#7CC064" opacity="0.35" />

      {/* Hedge row along paths */}
      <ellipse cx="310" cy="478" rx="30" ry="8" fill="#4E9240" opacity="0.45" />
      <ellipse cx="690" cy="478" rx="30" ry="8" fill="#4E9240" opacity="0.45" />

      {/* ═══════ BENCHES — isometric style ═══════ */}
      {[[200,480],[800,485],[440,340],[560,340],[380,615],[620,620]].map(([x,y],i) => (
        <g key={`bench-${i}`} transform={`translate(${x},${y})`}>
          <ellipse cx="20" cy="24" rx="22" ry="5" fill="#000" opacity="0.06" />
          <rect x="0" y="8" width="40" height="5" rx="1.5" fill="#C4956A" />
          <rect x="0" y="6" width="40" height="3" rx="1" fill="#D4A57A" />
          <rect x="2" y="0" width="36" height="4" rx="1.5" fill="#C4956A" />
          <rect x="2" y="-1" width="36" height="3" rx="1" fill="#D4A57A" />
          <rect x="4" y="13" width="3" height="10" rx="1" fill="#A67B52" />
          <rect x="33" y="13" width="3" height="10" rx="1" fill="#A67B52" />
          <rect x="0" y="2" width="3" height="12" rx="1" fill="#B88B60" />
          <rect x="37" y="2" width="3" height="12" rx="1" fill="#B88B60" />
        </g>
      ))}

      {/* ═══════ LAMP POSTS ═══════ */}
      {[[370,365],[630,365],[270,560],[730,560],[500,600],[160,450],[840,455]].map(([x,y],i) => (
        <g key={`lamp-${i}`} transform={`translate(${x},${y})`}>
          <rect x="3" y="10" width="3" height="40" rx="1" fill="#8A8A8A" />
          <rect x="1" y="46" width="7" height="4" rx="1.5" fill="#7A7A7A" />
          <path d="M0 10 Q4.5 4 9 10" fill="#E8E0D0" />
          <circle cx="4.5" cy="8" r="5" fill="url(#pk-glow)" />
          <circle cx="4.5" cy="8" r="2.5" fill="#FFF8E8" opacity="0.7" />
        </g>
      ))}

      {/* ═══════ SMALL BRIDGE — lower center ═══════ */}
      <g transform="translate(470, 640)">
        <ellipse cx="30" cy="25" rx="40" ry="12" fill="#90CCE8" opacity="0.4" />
        <path d="M0 15 Q30 -5 60 15" stroke="#D4A57A" strokeWidth="6" fill="none" />
        <path d="M0 15 Q30 -5 60 15" stroke="#E4B88A" strokeWidth="3" fill="none" />
        {/* Railings */}
        <rect x="4" y="2" width="3" height="14" rx="1" fill="#C4956A" />
        <rect x="53" y="2" width="3" height="14" rx="1" fill="#C4956A" />
        <rect x="18" y="-2" width="3" height="14" rx="1" fill="#C4956A" />
        <rect x="39" y="-2" width="3" height="14" rx="1" fill="#C4956A" />
        <line x1="4" y1="4" x2="55" y2="4" stroke="#D4A57A" strokeWidth="2" />
      </g>

      {/* ═══════ STATUE — center of plaza ═══════ */}
      <g transform="translate(500, 330)">
        {/* Pedestal */}
        <rect x="-12" y="0" width="24" height="8" rx="2" fill="#D8D4CC" />
        <rect x="-10" y="-15" width="20" height="16" rx="1" fill="#E0DCD4" />
        {/* Simple figure silhouette */}
        <ellipse cx="0" cy="-22" rx="6" ry="6" fill="#CCC8C0" />
        <rect x="-4" y="-38" width="8" height="16" rx="3" fill="#D4D0C8" />
      </g>

      {/* ═══════ DECORATIVE ELEMENTS ═══════ */}

      {/* Small pond — lower left */}
      <ellipse cx="300" cy="660" rx="28" ry="14" fill="#A0D4EA" opacity="0.5" />
      <ellipse cx="300" cy="658" rx="22" ry="10" fill="#B8E4F8" opacity="0.3" />
      {/* Lily pads */}
      <ellipse cx="292" cy="656" rx="5" ry="3" fill="#6BA55A" opacity="0.5" />
      <ellipse cx="308" cy="660" rx="4" ry="2.5" fill="#6BA55A" opacity="0.45" />
      <circle cx="293" cy="655" r="2" fill="#F3A7C6" opacity="0.5" />

      {/* Fountain stone border decoration */}
      <ellipse cx="500" cy="440" rx="100" ry="42" fill="none" stroke="#D0C8BC" strokeWidth="3.5" opacity="0.4" />
      <ellipse cx="500" cy="438" rx="104" ry="44" fill="none" stroke="#E0D8CC" strokeWidth="1.5" opacity="0.3" />

      {/* Birds */}
      <path d="M420 100 Q424 94 428 100" stroke="#888" strokeWidth="1.2" fill="none" opacity="0.3" />
      <path d="M438 105 Q441 100 444 105" stroke="#888" strokeWidth="1" fill="none" opacity="0.25" />
      <path d="M700 85 Q704 79 708 85" stroke="#888" strokeWidth="1" fill="none" opacity="0.2" />

      {/* Ground shadows from trees */}
      <ellipse cx="80" cy="370" rx="40" ry="14" fill="#000" opacity="0.04" />
      <ellipse cx="920" cy="360" rx="36" ry="12" fill="#000" opacity="0.04" />
      <ellipse cx="280" cy="255" rx="30" ry="10" fill="#000" opacity="0.03" />
      <ellipse cx="720" cy="252" rx="32" ry="10" fill="#000" opacity="0.03" />
      <ellipse cx="130" cy="660" rx="38" ry="13" fill="#000" opacity="0.04" />
      <ellipse cx="870" cy="660" rx="32" ry="10" fill="#000" opacity="0.03" />

      {/* Fallen leaves */}
      <ellipse cx="160" cy="380" rx="3" ry="1.5" fill="#D4A574" opacity="0.25" transform="rotate(30 160 380)" />
      <ellipse cx="880" cy="370" rx="2.5" ry="1.2" fill="#C49564" opacity="0.2" transform="rotate(-20 880 370)" />
      <ellipse cx="450" cy="520" rx="2" ry="1" fill="#D4A574" opacity="0.15" transform="rotate(45 450 520)" />

      {/* SLOTY emblem on fountain */}
      <circle cx="500" cy="442" r="10" fill="#E8E4DC" opacity="0.5" />
      <circle cx="500" cy="442" r="6" fill="none" stroke="#B79DFF" strokeWidth="1.2" opacity="0.4" />
      <text x="500" y="445" textAnchor="middle" fontSize="6" fill="#B79DFF" opacity="0.3" fontWeight="bold">S</text>
    </svg>
  );
}
