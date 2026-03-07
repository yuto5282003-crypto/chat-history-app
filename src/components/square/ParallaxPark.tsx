"use client";

/**
 * ParallaxPark — 2.8D parallax background for the SLOTY plaza.
 *
 * Three layers at different scroll speeds:
 *   FarLayer  (0.3×) — sky, clouds, distant city silhouettes
 *   MidLayer  (0.6×) — hills, mid-distance buildings
 *   NearLayer (1.0×) — ground, paths, structures, all walkable details
 *
 * World is 4× viewport wide with four areas:
 *   Left       (0-1000)  — Stylish Café (Starbucks-style)
 *   Center-L   (1000-2000) — Park / Fountain plaza
 *   Center-R   (2000-3000) — Dense City / Office district
 *   Right      (3000-4000) — Station front (Shinjuku/Shibuya)
 */

/* ═══════════════════════════════════════════
   FAR LAYER — sky, clouds, distant buildings
   ═══════════════════════════════════════════ */
export function FarLayer() {
  return (
    <svg viewBox="0 0 4000 900" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="f-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8E0F8" />
          <stop offset="40%" stopColor="#DDE9F6" />
          <stop offset="70%" stopColor="#E8F0E8" />
          <stop offset="100%" stopColor="#EEF4E0" />
        </linearGradient>
      </defs>

      <rect width="4000" height="900" fill="url(#f-sky)" />

      {/* Clouds */}
      {[
        [200,50,90,25,.4],[160,45,55,20,.45],[600,35,100,28,.35],
        [1000,55,80,22,.3],[1400,40,100,26,.35],[1800,60,70,20,.3],
        [2200,45,95,24,.32],[2600,55,75,22,.28],[900,70,50,16,.22],
        [1700,75,60,18,.2],[2400,70,55,17,.22],
        [3100,50,85,24,.3],[3500,40,70,20,.28],[3800,60,60,18,.25],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="white" opacity={o} />
      ))}

      {/* ── Café area — low-rise European-style buildings ── */}
      {[
        [60,110,18,45,.14],[90,100,22,55,.16],[130,108,16,47,.13],
        [700,105,20,50,.15],[740,112,16,43,.12],[780,98,24,57,.16],
        [830,108,18,47,.14],
      ].map(([x,y,w,h,o],i) => (
        <rect key={`cf-${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#C8C0B8" opacity={o} />
      ))}

      {/* ── Park area — scattered buildings ── */}
      <rect x="1200" y="100" width="18" height="45" rx="2" fill="#C0C8D4" opacity=".12" />
      <rect x="1700" y="105" width="14" height="40" rx="1" fill="#CCD4DC" opacity=".10" />

      {/* ── City district — DENSE Tokyo skyline ── */}
      {[
        [2020,30,28,130,.24],[2055,50,22,110,.22],[2085,35,18,125,.25],
        [2110,55,30,105,.22],[2150,25,24,135,.26],[2185,60,20,100,.21],
        [2210,40,26,120,.24],[2245,70,22,90,.20],[2275,30,20,130,.25],
        [2300,50,32,110,.23],[2340,20,22,140,.27],[2370,55,28,105,.22],
        [2405,35,18,125,.24],[2430,65,24,95,.20],[2465,25,20,135,.25],
        [2490,45,30,115,.23],[2530,60,22,100,.21],[2560,30,26,130,.25],
        [2595,50,18,110,.22],[2620,70,24,90,.19],[2655,40,28,120,.23],
        [2690,55,20,105,.21],[2720,35,22,125,.24],[2760,65,26,95,.20],
        [2800,45,18,115,.22],[2840,60,24,100,.20],[2880,50,20,110,.21],
        [2920,75,22,85,.18],[2960,55,26,105,.21],
      ].map(([x,y,w,h,o],i) => (
        <rect key={`sk-${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#B0B8C8" opacity={o} />
      ))}
      {/* Tokyo Tower hint */}
      <rect x="2450" y="10" width="10" height="150" rx="1" fill="#C0A0A0" opacity=".20" />
      <polygon points="2445,10 2465,10 2455,-5" fill="#C0A0A0" opacity=".17" />

      {/* ── Station area — dense mid-rise + high-rise (Shinjuku feel) ── */}
      {[
        [3050,50,26,110,.20],[3085,35,22,125,.22],[3115,60,30,100,.19],
        [3150,40,24,120,.21],[3185,55,20,105,.20],[3220,30,28,130,.23],
        [3260,65,22,95,.18],[3295,45,26,115,.21],[3330,55,18,105,.19],
        [3365,35,24,125,.22],[3400,60,20,100,.18],[3440,50,28,110,.20],
        [3480,40,22,120,.21],[3520,65,20,95,.17],[3560,55,26,105,.19],
        [3600,45,18,115,.18],[3640,60,24,100,.17],[3680,50,20,110,.18],
        [3720,70,22,90,.16],[3760,55,18,105,.17],
      ].map(([x,y,w,h,o],i) => (
        <rect key={`sks-${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#B8C0CC" opacity={o} />
      ))}

      {/* Birds */}
      {[[420,100],[1500,85],[2300,75],[2500,90],[3300,80],[3600,95]].map(([x,y],i) => (
        <path key={`b-${i}`} d={`M${x} ${y} Q${x+4} ${y-6} ${x+8} ${y}`} stroke="#888" strokeWidth="1" fill="none" opacity={.25-.02*i} />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   MID LAYER — hills, distant tree lines, mid-distance buildings
   ═══════════════════════════════════════════ */
export function MidLayer() {
  return (
    <svg viewBox="0 0 4000 900" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Rolling hills (café + park areas) */}
      {[
        [300,170,200,40,.30],[700,165,180,38,.25],[1100,170,200,42,.28],
        [1500,165,220,40,.25],[1900,172,190,38,.27],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`h-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#A8D090" opacity={o} />
      ))}
      {/* Distant tree line (café + park only) */}
      {[
        [200,168,50,22,.35],[400,165,40,18,.30],[700,168,45,20,.32],
        [1000,166,42,19,.28],[1300,168,48,21,.33],[1600,165,38,17,.28],
        [1900,170,44,19,.30],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`t-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#88B870" opacity={o} />
      ))}

      {/* ── City district mid-distance buildings ── */}
      {[
        [2100,120,35,55,.20],[2160,130,28,45,.18],[2220,115,32,60,.21],
        [2300,125,26,50,.18],[2370,118,30,57,.20],[2440,128,24,47,.17],
        [2510,112,28,63,.21],[2580,132,32,43,.18],[2650,120,26,55,.19],
        [2730,125,30,50,.18],[2800,118,24,57,.19],[2870,130,28,45,.17],
      ].map(([x,y,w,h,o],i) => (
        <rect key={`cm-${i}`} x={x} y={y} width={w} height={h} rx="3" fill="#B0B8C4" opacity={o} />
      ))}

      {/* ── Station area mid-distance ── */}
      {[
        [3100,125,30,50,.19],[3170,118,26,57,.20],[3240,130,32,45,.18],
        [3320,122,28,53,.19],[3400,128,24,47,.17],[3480,120,30,55,.19],
        [3560,130,26,45,.17],[3640,125,28,50,.18],[3720,132,24,43,.16],
      ].map(([x,y,w,h,o],i) => (
        <rect key={`sm-${i}`} x={x} y={y} width={w} height={h} rx="3" fill="#BAC0CC" opacity={o} />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   NEAR LAYER — ground, paths, structures
   ═══════════════════════════════════════════ */
export function NearLayer() {
  return (
    <svg viewBox="0 0 4000 900" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="n-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ECF60" /><stop offset="100%" stopColor="#6BBF50" />
        </linearGradient>
        <linearGradient id="n-gl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#90D878" /><stop offset="100%" stopColor="#7ECF60" />
        </linearGradient>
        <linearGradient id="n-gd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BBF50" /><stop offset="100%" stopColor="#5AAE42" />
        </linearGradient>
        <linearGradient id="n-path" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2E6D2" /><stop offset="50%" stopColor="#E8D8C0" /><stop offset="100%" stopColor="#F0E2CE" />
        </linearGradient>
        <linearGradient id="n-pe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4C4AA" /><stop offset="100%" stopColor="#C8B898" />
        </linearGradient>
        <linearGradient id="n-pave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDD8D0" /><stop offset="100%" stopColor="#CCC6BC" />
        </linearGradient>
        <linearGradient id="n-asphalt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A0A0A0" /><stop offset="100%" stopColor="#909090" />
        </linearGradient>
        <linearGradient id="n-sidewalk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D8D4CC" /><stop offset="100%" stopColor="#C8C4BC" />
        </linearGradient>
        <radialGradient id="n-water" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#B8E4F8" /><stop offset="60%" stopColor="#90CCE8" /><stop offset="100%" stopColor="#78BCD8" />
        </radialGradient>
        <radialGradient id="n-ws" cx="30%" cy="30%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="n-ta" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#7CC064" /><stop offset="100%" stopColor="#55A040" />
        </radialGradient>
        <radialGradient id="n-tb" cx="35%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#88CC72" /><stop offset="100%" stopColor="#60AA48" />
        </radialGradient>
        <linearGradient id="n-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF4EC" /><stop offset="100%" stopColor="#EDE4D8" />
        </linearGradient>
        <linearGradient id="n-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D88888" /><stop offset="100%" stopColor="#C87878" />
        </linearGradient>
        <linearGradient id="n-groof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A0C0" /><stop offset="100%" stopColor="#C088A8" />
        </linearGradient>
        <linearGradient id="n-cafe-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D4739" /><stop offset="100%" stopColor="#1E3328" />
        </linearGradient>
        <linearGradient id="n-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8E8F0" /><stop offset="100%" stopColor="#A0D0E0" />
        </linearGradient>
        <linearGradient id="n-bldg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E4E0" /><stop offset="100%" stopColor="#D0CCC4" />
        </linearGradient>
        <linearGradient id="n-bldg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4D8DC" /><stop offset="100%" stopColor="#B8BCC4" />
        </linearGradient>
        <linearGradient id="n-bldg3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0C4CC" /><stop offset="100%" stopColor="#A8ACB8" />
        </linearGradient>
        <linearGradient id="n-station" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0DCD4" /><stop offset="100%" stopColor="#C8C4B8" />
        </linearGradient>
        <radialGradient id="n-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,240,200,0.6)" /><stop offset="100%" stopColor="rgba(255,240,200,0)" />
        </radialGradient>
        <filter id="n-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity=".08" />
        </filter>
        <filter id="n-sh2">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000" floodOpacity=".12" />
        </filter>
        <linearGradient id="n-atmo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(200,220,240,0.10)" />
          <stop offset="40%" stopColor="rgba(200,220,240,0)" />
          <stop offset="100%" stopColor="rgba(80,100,60,0.06)" />
        </linearGradient>
      </defs>

      {/* ═══ GROUND ═══ */}
      {/* Grass for café and park areas (0-2000) */}
      <rect y="175" width="2000" height="725" fill="url(#n-grass)" />
      {/* Paved ground for city + station areas (2000-4000) */}
      <rect x="2000" y="175" width="2000" height="725" fill="#C4C0B8" />
      {/* Transition from grass to pavement */}
      <rect x="1950" y="175" width="100" height="725" fill="url(#n-grass)" opacity=".5" />

      {/* Grass texture patches (café+park only) */}
      {[
        [300,500,120,30,.2],[800,600,100,25,.18],[1500,420,140,35,.2],
        [500,350,80,22,.12],[1800,300,90,24,.12],[1200,700,130,32,.15],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`gt-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#n-gl)" opacity={o} />
      ))}

      {/* ═══ MAIN CONNECTING PATH — full width ═══ */}
      <path
        d="M0 500 Q250 488 500 494 Q750 500 1000 498 Q1250 502 1500 498 Q1750 494 2000 498 L2000 528 Q1750 524 1500 528 Q1250 532 1000 528 Q750 530 500 524 Q250 518 0 530Z"
        fill="url(#n-path)" opacity=".85"
      />
      <path
        d="M0 530 Q250 518 500 524 Q750 530 1000 528 Q1250 532 1500 528 Q1750 524 2000 528 L2000 535 Q1750 531 1500 535 Q1250 539 1000 535 Q750 537 500 531 Q250 525 0 537Z"
        fill="url(#n-pe)" opacity=".5"
      />
      {/* City + station: wide sidewalk */}
      <rect x="2000" y="488" width="2000" height="50" fill="url(#n-sidewalk)" opacity=".6" />

      {/* ══════════════════════════════════════════════════════
           AREA 1 — Stylish Café / Starbucks-style (0-1000)
         ══════════════════════════════════════════════════════ */}

      {/* ── Main café building (Starbucks-style dark green) ── */}
      <g filter="url(#n-sh2)">
        {/* Building body */}
        <rect x="180" y="210" width="320" height="160" rx="4" fill="url(#n-cafe-wall)" />
        {/* Large glass windows */}
        <rect x="195" y="230" width="90" height="80" rx="4" fill="url(#n-glass)" opacity=".85" />
        <rect x="295" y="230" width="90" height="80" rx="4" fill="url(#n-glass)" opacity=".85" />
        <rect x="395" y="230" width="90" height="80" rx="4" fill="url(#n-glass)" opacity=".85" />
        {/* Window dividers */}
        <line x1="240" y1="230" x2="240" y2="310" stroke="#2D4739" strokeWidth="2" />
        <line x1="340" y1="230" x2="340" y2="310" stroke="#2D4739" strokeWidth="2" />
        <line x1="440" y1="230" x2="440" y2="310" stroke="#2D4739" strokeWidth="2" />
        {/* Door */}
        <rect x="310" y="320" width="60" height="50" rx="3" fill="#1A2E22" />
        <rect x="314" y="323" width="24" height="44" rx="2" fill="url(#n-glass)" opacity=".6" />
        <rect x="342" y="323" width="24" height="44" rx="2" fill="url(#n-glass)" opacity=".6" />
        <circle cx="336" cy="348" r="2.5" fill="#D4A57A" />
        {/* Sign board */}
        <rect x="250" y="195" width="180" height="22" rx="6" fill="#1A2E22" />
        <circle cx="275" cy="206" r="8" fill="#2D4739" stroke="#4A7A5A" strokeWidth="1" />
        <text x="340" y="210" textAnchor="middle" fontSize="11" fill="#FFFFFF" fontWeight="bold" letterSpacing="2">SLOTY CAFÉ</text>
        {/* Logo circle detail */}
        <circle cx="275" cy="206" r="5" fill="none" stroke="#7AAA8A" strokeWidth="1" />
        <text x="275" y="209" textAnchor="middle" fontSize="5" fill="#7AAA8A" fontWeight="bold">S</text>
      </g>

      {/* ── Awning ── */}
      <path d="M178 368 L502 368 L496 385 L184 385Z" fill="#2D4739" opacity=".75" />
      <path d="M184 385 L496 385 L492 390 L188 390Z" fill="#1A2E22" opacity=".5" />

      {/* ── Outdoor terrace area ── */}
      {/* Wooden deck floor */}
      <rect x="180" y="390" width="340" height="100" rx="4" fill="#D4B896" opacity=".35" />
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <line key={`dk-${i}`} x1={180+i*34} y1="390" x2={180+i*34} y2="490" stroke="#C4A886" strokeWidth="1" opacity=".2" />
      ))}

      {/* ── Outdoor tables with umbrellas (Starbucks patio) ── */}
      {[[240,425],[350,415],[460,430],[280,460],[410,455]].map(([tx,ty],i) => (
        <g key={`ct-${i}`}>
          {/* Table */}
          <ellipse cx={tx} cy={ty} rx="16" ry="8" fill="#F0E8DC" />
          <rect x={tx-2} y={ty} width="4" height="12" rx="1" fill="#C8B898" />
          {/* Chairs */}
          <rect x={tx-18} y={ty-3} width="8" height="8" rx="2" fill="#8B7355" />
          <rect x={tx+10} y={ty-3} width="8" height="8" rx="2" fill="#8B7355" />
          {/* Cup on table */}
          <rect x={tx-3} y={ty-4} width="6" height="5" rx="1" fill="white" opacity=".7" />
          <rect x={tx-3} y={ty-5} width="6" height="2" rx="1" fill="#2D4739" opacity=".4" />
          {/* Umbrella */}
          <rect x={tx-1} y={ty-40} width="2" height="38" fill="#8B7355" />
          <ellipse cx={tx} cy={ty-40} rx="22" ry="8" fill={i%2===0 ? "#2D4739" : "#D88888"} opacity=".65" />
        </g>
      ))}

      {/* ── Menu board ── */}
      <g transform="translate(540,340)">
        <rect x="0" y="0" width="36" height="50" rx="3" fill="#2A2018" />
        <rect x="3" y="3" width="30" height="44" rx="2" fill="#1A1410" />
        <text x="18" y="16" textAnchor="middle" fontSize="5" fill="#E8D8C0" fontWeight="bold">MENU</text>
        <line x1="6" y1="20" x2="30" y2="20" stroke="#8B7355" strokeWidth=".5" />
        <text x="18" y="28" textAnchor="middle" fontSize="4" fill="#C8B898">Latte ¥480</text>
        <text x="18" y="34" textAnchor="middle" fontSize="4" fill="#C8B898">Mocha ¥520</text>
        <text x="18" y="40" textAnchor="middle" fontSize="4" fill="#C8B898">Tea ¥380</text>
        {/* A-frame legs */}
        <line x1="4" y1="50" x2="-2" y2="65" stroke="#2A2018" strokeWidth="2" />
        <line x1="32" y1="50" x2="38" y2="65" stroke="#2A2018" strokeWidth="2" />
      </g>

      {/* ── Flower planters along café front ── */}
      {[195,260,325,390,455].map((fx,i) => (
        <g key={`fp-${i}`}>
          <rect x={fx} y="365" width="28" height="10" rx="3" fill="#5A4A38" />
          {[0,7,14,21].map((d,j) => (
            <circle key={j} cx={fx+3+d} cy={363-j%2*2} r="3.5" fill={["#F3A7C6","#B79DFF","#FFB7D5","#9B8AFB"][j%4]} opacity=".75" />
          ))}
          {[3,10,18,25].map((d,j) => (
            <ellipse key={`lf-${j}`} cx={fx+d} cy={360} rx="3" ry="2" fill="#5DA34A" opacity=".4" />
          ))}
        </g>
      ))}

      {/* ── String lights ── */}
      <path d="M190 368 Q280 378 370 368 Q460 378 550 368" stroke="#D4A57A" strokeWidth="1" fill="none" opacity=".5" />
      {[200,222,244,266,288,310,332,354,376,398,420,442,464,486,508,530].map((lx,i) => (
        <circle key={`sl-${i}`} cx={lx} cy={371+Math.sin(i*.8)*3} r="2" fill="#FFF0C8" opacity=".7" />
      ))}

      {/* ── Side building (bakery/sweets shop) ── */}
      <g filter="url(#n-sh)">
        <rect x="600" y="260" width="140" height="110" rx="4" fill="url(#n-wall)" />
        <path d="M595 262 L670 235 L745 262Z" fill="url(#n-roof)" />
        <rect x="615" y="280" width="30" height="25" rx="2" fill="url(#n-glass)" opacity=".7" />
        <rect x="655" y="280" width="30" height="25" rx="2" fill="url(#n-glass)" opacity=".7" />
        <rect x="695" y="280" width="30" height="25" rx="2" fill="url(#n-glass)" opacity=".7" />
        <rect x="645" y="325" width="40" height="45" rx="3" fill="#A07050" />
        <rect x="620" y="248" width="90" height="16" rx="3" fill="#F8E8D8" />
        <text x="665" y="260" textAnchor="middle" fontSize="8" fill="#C07070" fontWeight="bold">BAKERY</text>
      </g>

      {/* ── Takeout counter ── */}
      <g transform="translate(120,350)">
        <rect x="0" y="0" width="45" height="30" rx="3" fill="#2D4739" />
        <rect x="3" y="3" width="39" height="10" rx="2" fill="url(#n-glass)" opacity=".6" />
        <text x="22" y="24" textAnchor="middle" fontSize="5" fill="#C8B898">TO GO</text>
      </g>

      {/* ── Trees — café ── */}
      {[[60,360,35,30,"n-ta"],[820,370,32,28,"n-tb"],[770,320,28,24,"n-ta"]].map(([x,y,rx,ry,g],i) => (
        <g key={`ctr-${i}`}>
          <rect x={(x as number)-4} y={y as number} width="8" height="36" rx="3" fill="#8B7355" />
          <ellipse cx={x as number} cy={(y as number)-15} rx={rx as number} ry={ry as number} fill={`url(#${g})`} />
        </g>
      ))}

      {/* ── Benches — café ── */}
      {[[80,460],[900,450]].map(([bx,by],i) => (
        <g key={`cb-${i}`} transform={`translate(${bx},${by})`}>
          <rect x="0" y="5" width="40" height="3" rx="1" fill="#D4A57A" />
          <rect x="2" y="-2" width="36" height="3" rx="1" fill="#D4A57A" />
          <rect x="4" y="8" width="3" height="11" rx="1" fill="#A67B52" />
          <rect x="33" y="8" width="3" height="11" rx="1" fill="#A67B52" />
        </g>
      ))}

      {/* ── Lamp posts — café ── */}
      {[[100,380],[560,370],[850,375]].map(([lx,ly],i) => (
        <g key={`cl-${i}`} transform={`translate(${lx},${ly})`}>
          <rect x="3" y="10" width="3" height="40" rx="1" fill="#5A4A38" />
          <rect x="1" y="46" width="7" height="4" rx="1.5" fill="#4A3A28" />
          <path d="M-2 10 Q4.5 2 11 10" fill="#F0E8D8" />
          <circle cx="4.5" cy="7" r="6" fill="url(#n-glow)" />
          <circle cx="4.5" cy="7" r="3" fill="#FFF8E8" opacity=".7" />
        </g>
      ))}

      {/* Terrace path */}
      <path d="M340 370 Q345 420 350 470 Q355 498 370 510 L386 505 Q371 493 366 465 Q361 415 356 368Z" fill="url(#n-path)" opacity=".6" />

      {/* ══════════════════════════════════════════════════════
           AREA 2 — Fountain park (1000-2000)
         ══════════════════════════════════════════════════════ */}
      <g transform="translate(1000,0)">
        <path d="M475 230 Q480 350 485 440 Q490 496 500 510 Q510 496 515 440 Q520 350 525 230Z" fill="url(#n-path)" opacity=".8" />
        <path d="M120 230 Q280 350 430 470 L448 462 Q290 342 140 222Z" fill="url(#n-path)" opacity=".6" />
        <path d="M880 230 Q720 350 570 470 L552 462 Q710 342 860 222Z" fill="url(#n-path)" opacity=".6" />
        <path d="M250 510 Q290 580 250 690 L268 695 Q308 585 268 515Z" fill="url(#n-path)" opacity=".5" />
        <path d="M750 510 Q710 580 750 690 L732 695 Q692 585 732 515Z" fill="url(#n-path)" opacity=".5" />
        <ellipse cx="500" cy="435" rx="110" ry="50" fill="none" stroke="url(#n-path)" strokeWidth="28" opacity=".6" />

        {/* Fountain */}
        <ellipse cx="502" cy="464" rx="100" ry="36" fill="#000" opacity=".06" />
        <ellipse cx="500" cy="440" rx="92" ry="39" fill="#C4C0B8" />
        <ellipse cx="500" cy="435" rx="90" ry="38" fill="#D4D0C8" />
        <ellipse cx="500" cy="430" rx="90" ry="38" fill="#E4E0D8" />
        <ellipse cx="500" cy="429" rx="79" ry="33" fill="#CCC8C0" />
        <ellipse cx="500" cy="426" rx="74" ry="30" fill="url(#n-water)" />
        <ellipse cx="500" cy="426" rx="74" ry="30" fill="url(#n-ws)" />
        <ellipse cx="500" cy="430" rx="55" ry="22" fill="none" stroke="#fff" strokeWidth=".8" opacity=".35" />
        <ellipse cx="500" cy="432" rx="38" ry="15" fill="none" stroke="#fff" strokeWidth=".6" opacity=".25" />
        <rect x="492" y="385" width="16" height="48" rx="8" fill="#D8D4CC" />
        <ellipse cx="500" cy="385" rx="12" ry="5" fill="#E0DCD4" />
        <ellipse cx="500" cy="378" rx="22" ry="8" fill="#DCD8D0" />
        <ellipse cx="500" cy="376" rx="18" ry="6" fill="#88C4DE" opacity=".6" />
        <ellipse cx="500" cy="368" rx="6" ry="6" fill="#E8E4DC" />
        <circle cx="500" cy="362" r="4" fill="#D4D0C8" />
        <path d="M500 366 Q492 342 482 356" stroke="#A8D8EE" strokeWidth="2" fill="none" opacity=".6" />
        <path d="M500 366 Q500 338 500 352" stroke="#A8D8EE" strokeWidth="2" fill="none" opacity=".7" />
        <path d="M500 366 Q508 342 518 356" stroke="#A8D8EE" strokeWidth="2" fill="none" opacity=".6" />
        <circle cx="500" cy="442" r="10" fill="#E8E4DC" opacity=".5" />
        <circle cx="500" cy="442" r="6" fill="none" stroke="#B79DFF" strokeWidth="1.2" opacity=".4" />
        <text x="500" y="445" textAnchor="middle" fontSize="6" fill="#B79DFF" opacity=".3" fontWeight="bold">S</text>

        {/* Gazebo */}
        <g transform="translate(750, 260)">
          <ellipse cx="2" cy="70" rx="58" ry="22" fill="#000" opacity=".06" />
          <ellipse cx="0" cy="62" rx="52" ry="18" fill="#EDE6DC" />
          <rect x="-40" y="10" width="5" height="55" rx="2" fill="#E8E4DC" />
          <rect x="35" y="10" width="5" height="55" rx="2" fill="#E8E4DC" />
          <rect x="-3" y="8" width="5" height="57" rx="2" fill="#F0ECE4" />
          <path d="M-55 12 L0 -18 L55 12Z" fill="url(#n-groof)" />
          <path d="M-55 12 L55 12 L50 18 L-50 18Z" fill="#B080A0" opacity=".5" />
          <circle cx="0" cy="-20" r="4" fill="#D4A0C0" />
          <line x1="-38" y1="50" x2="38" y2="50" stroke="#D8D4CC" strokeWidth="2" />
          <rect x="-25" y="45" width="50" height="6" rx="2" fill="#D4A57A" />
        </g>

        {/* Flower beds */}
        <ellipse cx="360" cy="440" rx="40" ry="14" fill="#5DA34A" opacity=".2" />
        {[[340,435,"#B79DFF"],[350,432,"#F3A7C6"],[360,434,"#B79DFF"],[370,436,"#F3A7C6"],[380,433,"#9B8AFB"]].map(([cx,cy,c],i) => (
          <circle key={`fl-${i}`} cx={cx as number} cy={cy as number} r={3.5} fill={c as string} opacity=".7" />
        ))}
        <ellipse cx="640" cy="440" rx="40" ry="14" fill="#5DA34A" opacity=".2" />
        {[[620,435,"#F3A7C6"],[630,432,"#B79DFF"],[640,434,"#F3A7C6"],[650,436,"#9B8AFB"],[660,433,"#F3A7C6"]].map(([cx,cy,c],i) => (
          <circle key={`fr-${i}`} cx={cx as number} cy={cy as number} r={3.5} fill={c as string} opacity=".7" />
        ))}

        {/* Trees */}
        {[[80,335,48,40,"n-ta"],[920,330,42,36,"n-tb"],[280,215,35,30,"n-ta"],[720,212,36,30,"n-tb"]].map(([x,y,rx,ry,g],i) => (
          <g key={`pt-${i}`}>
            <rect x={(x as number)-5} y={y as number} width="10" height="42" rx="4" fill="#8B7355" />
            <ellipse cx={x as number} cy={(y as number)-18} rx={rx as number} ry={ry as number} fill={`url(#${g})`} />
            <ellipse cx={(x as number)-6} cy={(y as number)-25} rx="14" ry="11" fill="#88CC72" opacity=".4" />
          </g>
        ))}

        {/* Benches */}
        {[[200,480],[800,485],[440,340],[560,340]].map(([bx,by],i) => (
          <g key={`pb-${i}`} transform={`translate(${bx},${by})`}>
            <rect x="0" y="5" width="40" height="3" rx="1" fill="#D4A57A" />
            <rect x="2" y="-2" width="36" height="3" rx="1" fill="#D4A57A" />
            <rect x="4" y="8" width="3" height="10" rx="1" fill="#A67B52" />
            <rect x="33" y="8" width="3" height="10" rx="1" fill="#A67B52" />
          </g>
        ))}

        {/* Lamp posts */}
        {[[370,365],[630,365],[270,520],[730,520],[500,580]].map(([lx,ly],i) => (
          <g key={`pl-${i}`} transform={`translate(${lx},${ly})`}>
            <rect x="3" y="10" width="3" height="40" rx="1" fill="#8A8A8A" />
            <rect x="1" y="46" width="7" height="4" rx="1.5" fill="#7A7A7A" />
            <path d="M0 10 Q4.5 4 9 10" fill="#E8E0D0" />
            <circle cx="4.5" cy="8" r="5" fill="url(#n-glow)" />
            <circle cx="4.5" cy="8" r="2.5" fill="#FFF8E8" opacity=".7" />
          </g>
        ))}

        {/* Flower arches */}
        {[320,650].map((ax,i) => (
          <g key={`fa-${i}`} transform={`translate(${ax},470)`}>
            <path d="M0 0 Q15 -25 30 0" stroke="#8B7355" strokeWidth="3" fill="none" />
            <circle cx="5" cy="-10" r="4" fill="#F3A7C6" opacity=".7" />
            <circle cx="15" cy="-20" r="4.5" fill="#B79DFF" opacity=".7" />
            <circle cx="25" cy="-10" r="4" fill="#F3A7C6" opacity=".7" />
          </g>
        ))}

        {/* Bridge */}
        <g transform="translate(470, 640)">
          <ellipse cx="30" cy="25" rx="40" ry="12" fill="#90CCE8" opacity=".4" />
          <path d="M0 15 Q30 -5 60 15" stroke="#D4A57A" strokeWidth="6" fill="none" />
          <path d="M0 15 Q30 -5 60 15" stroke="#E4B88A" strokeWidth="3" fill="none" />
          <rect x="4" y="2" width="3" height="14" rx="1" fill="#C4956A" />
          <rect x="53" y="2" width="3" height="14" rx="1" fill="#C4956A" />
          <line x1="4" y1="4" x2="55" y2="4" stroke="#D4A57A" strokeWidth="2" />
        </g>

        {/* Statue */}
        <g transform="translate(500, 330)">
          <rect x="-12" y="0" width="24" height="8" rx="2" fill="#D8D4CC" />
          <rect x="-10" y="-15" width="20" height="16" rx="1" fill="#E0DCD4" />
          <ellipse cx="0" cy="-22" rx="6" ry="6" fill="#CCC8C0" />
          <rect x="-4" y="-38" width="8" height="16" rx="3" fill="#D4D0C8" />
        </g>
      </g>

      {/* ══════════════════════════════════════════════════════
           AREA 3 — Dense City / Office District (2000-3000)
           Concrete jungle: no green, lots of buildings & shops
         ══════════════════════════════════════════════════════ */}
      <g transform="translate(2000,0)">
        {/* ── Road ── */}
        <rect x="0" y="480" width="1000" height="60" rx="2" fill="url(#n-asphalt)" opacity=".5" />
        {/* Center line */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={`cl-${i}`} x={50+i*75} y="508" width="40" height="3" rx="1" fill="#E8E0D0" opacity=".35" />
        ))}

        {/* ── LEFT SIDE BUILDINGS ── */}

        {/* Building A — tall glass office */}
        <g filter="url(#n-sh2)">
          <rect x="40" y="180" width="100" height="210" rx="3" fill="url(#n-bldg2)" />
          <rect x="46" y="186" width="88" height="200" rx="2" fill="#B8D0E0" opacity=".3" />
          {/* Window grid */}
          {[0,1,2,3,4,5,6,7].map(row => [0,1,2].map(col => (
            <rect key={`wa-${row}-${col}`} x={52+col*28} y={192+row*24} width="22" height="18" rx="1" fill="#A0C8E0" opacity=".55" />
          )))}
          <rect x="65" y="355" width="50" height="35" rx="2" fill="#8098A8" />
          <rect x="68" y="358" width="20" height="29" rx="1" fill="#A0C8E0" opacity=".4" />
          <rect x="92" y="358" width="20" height="29" rx="1" fill="#A0C8E0" opacity=".4" />
        </g>

        {/* Building B — shorter retail */}
        <g filter="url(#n-sh)">
          <rect x="155" y="270" width="80" height="120" rx="3" fill="url(#n-bldg1)" />
          <rect x="160" y="280" width="30" height="40" rx="2" fill="url(#n-glass)" opacity=".6" />
          <rect x="198" y="280" width="30" height="40" rx="2" fill="url(#n-glass)" opacity=".6" />
          <rect x="165" y="350" width="60" height="40" rx="2" fill="#D07060" opacity=".7" />
          <text x="195" y="375" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">SHOP</text>
          <rect x="155" y="264" width="80" height="10" rx="2" fill="#E07060" />
        </g>

        {/* Building C — tall office tower */}
        <g filter="url(#n-sh2)">
          <rect x="250" y="160" width="110" height="230" rx="3" fill="url(#n-bldg3)" />
          {[0,1,2,3,4,5,6,7,8,9].map(row => [0,1,2,3].map(col => (
            <rect key={`wc-${row}-${col}`} x={258+col*25} y={168+row*22} width="19" height="16" rx="1" fill="#90B0C8" opacity=".5" />
          )))}
          <rect x="280" y="355" width="50" height="35" rx="2" fill="#7888A0" />
          <rect x="283" y="358" width="44" height="29" rx="1" fill="#A0C8E0" opacity=".35" />
        </g>

        {/* ── LARGE CENTER BILLBOARD ── */}
        <g transform="translate(370,190)">
          <rect x="0" y="0" width="160" height="80" rx="5" fill="#1A1A2E" />
          <rect x="4" y="4" width="152" height="72" rx="3" fill="#2A2A4E" />
          <rect x="8" y="8" width="70" height="64" rx="2" fill="#6644AA" opacity=".45" />
          <rect x="82" y="8" width="70" height="30" rx="2" fill="#AA4466" opacity=".45" />
          <rect x="82" y="42" width="70" height="30" rx="2" fill="#44AA66" opacity=".45" />
          <text x="43" y="46" textAnchor="middle" fontSize="14" fill="#E0D0FF" opacity=".8" fontWeight="bold">SLOTY</text>
          <text x="117" y="28" textAnchor="middle" fontSize="6" fill="#FFD0D0" opacity=".6">LIVE NOW</text>
          {/* Glow */}
          <rect x="-6" y="-6" width="172" height="92" rx="8" fill="none" stroke="#6644AA" strokeWidth="1.5" opacity=".2" />
        </g>

        {/* Building D — behind billboard */}
        <g filter="url(#n-sh)">
          <rect x="380" y="275" width="140" height="115" rx="3" fill="url(#n-bldg1)" />
          {[0,1,2].map(row => [0,1,2,3,4].map(col => (
            <rect key={`wd-${row}-${col}`} x={388+col*26} y={283+row*28} width="20" height="22" rx="1" fill="url(#n-glass)" opacity=".5" />
          )))}
        </g>

        {/* ── RIGHT SIDE BUILDINGS ── */}

        {/* Building E — fashion boutique */}
        <g filter="url(#n-sh)">
          <rect x="550" y="250" width="90" height="140" rx="3" fill="#E8DCD0" />
          <rect x="556" y="260" width="78" height="60" rx="2" fill="url(#n-glass)" opacity=".7" />
          <rect x="565" y="340" width="28" height="50" rx="2" fill="#806050" />
          <rect x="601" y="340" width="28" height="50" rx="2" fill="#806050" />
          <rect x="555" y="238" width="80" height="16" rx="3" fill="#2A2A2A" />
          <text x="595" y="250" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">FASHION</text>
        </g>

        {/* Building F — tall office */}
        <g filter="url(#n-sh2)">
          <rect x="660" y="190" width="95" height="200" rx="3" fill="url(#n-bldg2)" />
          {[0,1,2,3,4,5,6,7].map(row => [0,1,2].map(col => (
            <rect key={`wf-${row}-${col}`} x={668+col*28} y={198+row*24} width="22" height="18" rx="1" fill="#A0C8E0" opacity=".5" />
          )))}
          <rect x="685" y="355" width="45" height="35" rx="2" fill="#708090" />
        </g>

        {/* Building G — convenience store */}
        <g filter="url(#n-sh)">
          <rect x="775" y="300" width="85" height="90" rx="3" fill="url(#n-bldg1)" />
          <rect x="780" y="310" width="75" height="35" rx="2" fill="url(#n-glass)" opacity=".65" />
          <rect x="800" y="360" width="40" height="30" rx="2" fill="#5090C0" />
          <rect x="775" y="292" width="85" height="12" rx="2" fill="#0068B7" />
          <text x="817" y="302" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">LAWSON</text>
        </g>

        {/* Building H — small restaurant */}
        <g filter="url(#n-sh)">
          <rect x="875" y="310" width="70" height="80" rx="3" fill="#F0E8DC" />
          <rect x="880" y="320" width="25" height="25" rx="2" fill="url(#n-glass)" opacity=".6" />
          <rect x="912" y="320" width="25" height="25" rx="2" fill="url(#n-glass)" opacity=".6" />
          <rect x="895" y="355" width="30" height="35" rx="2" fill="#8B6040" />
          <rect x="875" y="304" width="70" height="10" rx="2" fill="#C06050" />
          <text x="910" y="312" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">ラーメン</text>
        </g>

        {/* ── Neon signs scattered ── */}
        <rect x="170" y="344" width="50" height="14" rx="4" fill="#FF6090" opacity=".4" />
        <text x="195" y="355" textAnchor="middle" fontSize="8" fill="#FF6090" opacity=".65" fontWeight="bold">OPEN</text>
        <rect x="690" y="185" width="55" height="12" rx="3" fill="#60AAFF" opacity=".35" />
        <text x="717" y="194" textAnchor="middle" fontSize="7" fill="#60AAFF" opacity=".55" fontWeight="bold">OFFICE</text>
        <rect x="562" y="234" width="68" height="10" rx="3" fill="#FFAA40" opacity=".35" />
        <text x="596" y="243" textAnchor="middle" fontSize="6" fill="#FFAA40" opacity=".55" fontWeight="bold">SALE 50%</text>
        <rect x="810" y="289" width="40" height="8" rx="2" fill="#40E0D0" opacity=".3" />
        <text x="830" y="296" textAnchor="middle" fontSize="5" fill="#40E0D0" opacity=".5" fontWeight="bold">24H</text>

        {/* ── Crosswalk ── */}
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <rect key={`cw-${i}`} x={420+i*16} y="480" width="10" height="60" rx="1" fill="white" opacity=".25" />
        ))}

        {/* ── Sidewalk details ── */}
        {/* Vending machines */}
        <rect x="145" y="400" width="18" height="32" rx="2" fill="#D04040" />
        <rect x="148" y="404" width="12" height="12" rx="1" fill="#E8E0D8" opacity=".6" />
        <rect x="148" y="420" width="5" height="4" rx="1" fill="#FFE0A0" opacity=".5" />
        <rect x="170" y="400" width="18" height="32" rx="2" fill="#4070D0" />
        <rect x="173" y="404" width="12" height="12" rx="1" fill="#E8E0D8" opacity=".6" />
        <rect x="173" y="420" width="5" height="4" rx="1" fill="#FFE0A0" opacity=".5" />

        {/* Traffic lights */}
        {[400,600].map((tx,i) => (
          <g key={`tl-${i}`} transform={`translate(${tx},430)`}>
            <rect x="0" y="0" width="5" height="40" rx="1" fill="#606060" />
            <rect x="-5" y="-20" width="15" height="22" rx="3" fill="#303030" />
            <circle cx="2.5" cy="-13" r="3" fill="#FF4040" opacity=".6" />
            <circle cx="2.5" cy="-5" r="3" fill="#FFCC00" opacity=".3" />
            <circle cx="2.5" cy="3" r="0" fill="#40CC40" opacity=".3" />
          </g>
        ))}

        {/* Modern street lamps */}
        {[[80,400],[320,410],[530,400],[720,410],[930,400]].map(([lx,ly],i) => (
          <g key={`ml-${i}`} transform={`translate(${lx},${ly})`}>
            <rect x="2" y="5" width="4" height="50" rx="2" fill="#707070" />
            <rect x="0" y="52" width="8" height="4" rx="2" fill="#606060" />
            <rect x="-6" y="0" width="20" height="6" rx="3" fill="#909090" />
            <rect x="-4" y="4" width="16" height="2" rx="1" fill="#FFF8E0" opacity=".5" />
            <circle cx="4" cy="3" r="7" fill="url(#n-glow)" />
          </g>
        ))}

        {/* Bicycle */}
        <g transform="translate(510,450)">
          <circle cx="0" cy="0" r="6" fill="none" stroke="#666" strokeWidth="1.5" />
          <circle cx="18" cy="0" r="6" fill="none" stroke="#666" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="9" y2="-8" stroke="#666" strokeWidth="1.5" />
          <line x1="9" y1="-8" x2="18" y2="0" stroke="#666" strokeWidth="1.5" />
          <line x1="9" y1="-8" x2="7" y2="-14" stroke="#666" strokeWidth="1" />
        </g>

        {/* Post box */}
        <g transform="translate(860,430)">
          <rect x="0" y="0" width="16" height="22" rx="3" fill="#CC3333" />
          <rect x="2" y="8" width="12" height="3" rx="1" fill="#AA2222" />
          <rect x="4" y="22" width="8" height="6" rx="1" fill="#AA2222" />
        </g>
      </g>

      {/* ══════════════════════════════════════════════════════
           AREA 4 — Station front / Shinjuku-Shibuya (3000-4000)
         ══════════════════════════════════════════════════════ */}
      <g transform="translate(3000,0)">
        {/* ── Road ── */}
        <rect x="0" y="480" width="1000" height="60" rx="2" fill="url(#n-asphalt)" opacity=".5" />
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={`scl-${i}`} x={50+i*75} y="508" width="40" height="3" rx="1" fill="#E8E0D0" opacity=".35" />
        ))}

        {/* ── MAIN STATION BUILDING (Shinjuku-style) ── */}
        <g filter="url(#n-sh2)">
          {/* Main building */}
          <rect x="180" y="180" width="400" height="210" rx="4" fill="url(#n-station)" />
          {/* Upper facade */}
          <rect x="180" y="170" width="400" height="18" rx="3" fill="#808890" />
          <rect x="175" y="164" width="410" height="10" rx="2" fill="#909AA0" />
          {/* Large windows — row 1 */}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={`sw1-${i}`} x={195+i*54} y="200" width="42" height="50" rx="3" fill="#A0C8E0" opacity=".65" />
          ))}
          {/* Cross mullions */}
          {[0,1,2,3,4,5,6].map(i => (
            <g key={`swm-${i}`}>
              <line x1={216+i*54} y1="200" x2={216+i*54} y2="250" stroke="#C8D4DC" strokeWidth="1" />
              <line x1={195+i*54} y1="225" x2={237+i*54} y2="225" stroke="#C8D4DC" strokeWidth="1" />
            </g>
          ))}
          {/* Row 2 windows */}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={`sw2-${i}`} x={195+i*54} y="260" width="42" height="35" rx="3" fill="#A0C8E0" opacity=".55" />
          ))}
          {/* Main entrance — large glass */}
          <rect x="290" y="320" width="180" height="70" rx="4" fill="#5A7888" />
          <rect x="296" y="324" width="52" height="62" rx="2" fill="#88B8D0" opacity=".5" />
          <rect x="354" y="324" width="52" height="62" rx="2" fill="#88B8D0" opacity=".5" />
          <rect x="412" y="324" width="52" height="62" rx="2" fill="#88B8D0" opacity=".5" />
          <line x1="348" y1="324" x2="348" y2="386" stroke="#4A6878" strokeWidth="3" />
          <line x1="406" y1="324" x2="406" y2="386" stroke="#4A6878" strokeWidth="3" />
          {/* Side entrances */}
          <rect x="195" y="345" width="60" height="45" rx="2" fill="#6A8898" opacity=".7" />
          <rect x="198" y="348" width="54" height="38" rx="1" fill="#88B0C8" opacity=".35" />
          <rect x="505" y="345" width="60" height="45" rx="2" fill="#6A8898" opacity=".7" />
          <rect x="508" y="348" width="54" height="38" rx="1" fill="#88B0C8" opacity=".35" />
          {/* Station sign */}
          <rect x="260" y="148" width="240" height="28" rx="5" fill="#2A5A80" />
          <text x="380" y="168" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold" letterSpacing="3">SLOTY駅</text>
          {/* Sub sign */}
          <rect x="310" y="300" width="140" height="18" rx="3" fill="rgba(0,0,0,0.5)" />
          <text x="380" y="313" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">中央改札 Central Gate</text>
        </g>

        {/* ── Clock ── */}
        <circle cx="380" cy="195" r="16" fill="white" stroke="#506070" strokeWidth="2.5" />
        <circle cx="380" cy="195" r="1.5" fill="#333" />
        <line x1="380" y1="183" x2="380" y2="195" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="380" y1="195" x2="389" y2="201" stroke="#333" strokeWidth="2" strokeLinecap="round" />

        {/* ── Platform canopy ── */}
        <rect x="170" y="390" width="420" height="6" rx="2" fill="#B0B8C0" opacity=".8" />
        {[190,270,350,430,510,570].map((px,i) => (
          <rect key={`cp-${i}`} x={px} y="396" width="5" height="32" rx="1" fill="#909AA0" />
        ))}

        {/* ── Ticket gates (more of them) ── */}
        {[240,275,310,345,380,415,450,485].map((gx,i) => (
          <g key={`tg-${i}`}>
            <rect x={gx} y="430" width="28" height="6" rx="1" fill="#D0D4D8" />
            <rect x={gx+2} y="436" width="4" height="16" rx="1" fill="#B0B4B8" />
            <rect x={gx+22} y="436" width="4" height="16" rx="1" fill="#B0B4B8" />
            {/* IC card reader */}
            <rect x={gx+9} y="432" width="10" height="4" rx="1" fill="#40A0E0" opacity=".5" />
          </g>
        ))}

        {/* ── Left buildings (department store) ── */}
        <g filter="url(#n-sh2)">
          <rect x="20" y="210" width="120" height="180" rx="3" fill="url(#n-bldg1)" />
          {[0,1,2,3,4,5].map(row => [0,1,2,3].map(col => (
            <rect key={`wl-${row}-${col}`} x={28+col*28} y={220+row*28} width="22" height="22" rx="1" fill="url(#n-glass)" opacity=".5" />
          )))}
          <rect x="20" y="200" width="120" height="14" rx="2" fill="#C07060" />
          <text x="80" y="210" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">LUMINE</text>
        </g>

        {/* ── Right buildings (electronics store) ── */}
        <g filter="url(#n-sh2)">
          <rect x="640" y="220" width="110" height="170" rx="3" fill="url(#n-bldg2)" />
          {[0,1,2,3,4,5].map(row => [0,1,2].map(col => (
            <rect key={`wr-${row}-${col}`} x={650+col*32} y={230+row*26} width="26" height="20" rx="1" fill="#A0C8E0" opacity=".5" />
          )))}
          <rect x="640" y="210" width="110" height="14" rx="2" fill="#E8C020" />
          <text x="695" y="221" textAnchor="middle" fontSize="7" fill="#2A2A2A" fontWeight="bold">ELECTRONICS</text>
        </g>

        {/* ── Far right building ── */}
        <g filter="url(#n-sh)">
          <rect x="770" y="260" width="90" height="130" rx="3" fill="#E0D8D0" />
          {[0,1,2,3].map(row => [0,1,2].map(col => (
            <rect key={`wfr-${row}-${col}`} x={778+col*28} y={270+row*30} width="22" height="24" rx="1" fill="url(#n-glass)" opacity=".5" />
          )))}
          <rect x="800" y="355" width="36" height="35" rx="2" fill="#806050" />
        </g>

        {/* ── Vending machines (cluster) ── */}
        {[[630,400,"#D04040"],[650,400,"#4070D0"],[670,400,"#40A060"],[690,400,"#D0A040"]].map(([x,y,c],i) => (
          <g key={`vm-${i}`}>
            <rect x={x as number} y={y as number} width="16" height="30" rx="2" fill={c as string} />
            <rect x={(x as number)+2} y={(y as number)+3} width="12" height="10" rx="1" fill="#E8E0D8" opacity=".5" />
            <rect x={(x as number)+2} y={(y as number)+18} width="5" height="3" rx="1" fill="#FFE0A0" opacity=".4" />
          </g>
        ))}

        {/* ── Bus stop ── */}
        <g transform="translate(600,430)">
          <rect x="0" y="0" width="4" height="35" rx="1" fill="#707070" />
          <rect x="-8" y="-2" width="20" height="14" rx="2" fill="#3A6080" />
          <text x="2" y="9" textAnchor="middle" fontSize="4" fill="white" fontWeight="bold">BUS</text>
          <rect x="-10" y="12" width="24" height="4" rx="1" fill="#909090" />
        </g>

        {/* ── Taxi stand sign ── */}
        <g transform="translate(160,440)">
          <rect x="0" y="0" width="4" height="28" rx="1" fill="#707070" />
          <rect x="-12" y="-3" width="28" height="14" rx="2" fill="#E8C020" />
          <text x="2" y="8" textAnchor="middle" fontSize="5" fill="#2A2A2A" fontWeight="bold">TAXI</text>
        </g>

        {/* ── Crosswalk (Shibuya-style wide) ── */}
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
          <rect key={`scw-${i}`} x={300+i*14} y="480" width="9" height="60" rx="1" fill="white" opacity=".25" />
        ))}
        {/* Diagonal crosswalk */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={`dcw-${i}`} x={320+i*18} y={482+i*5} width="9" height="45" rx="1" fill="white" opacity=".12" transform={`rotate(-25 ${324+i*18} ${504+i*5})`} />
        ))}

        {/* ── Traffic lights ── */}
        {[280,520].map((tx,i) => (
          <g key={`stl-${i}`} transform={`translate(${tx},430)`}>
            <rect x="0" y="0" width="5" height="40" rx="1" fill="#505050" />
            <rect x="-5" y="-20" width="15" height="22" rx="3" fill="#282828" />
            <circle cx="2.5" cy="-13" r="3" fill="#FF4040" opacity=".6" />
            <circle cx="2.5" cy="-5" r="3" fill="#FFCC00" opacity=".3" />
          </g>
        ))}

        {/* ── Street lamps ── */}
        {[[60,380],[250,390],[500,380],[750,390],[920,380]].map(([lx,ly],i) => (
          <g key={`slamp-${i}`} transform={`translate(${lx},${ly})`}>
            <rect x="2" y="5" width="4" height="50" rx="2" fill="#707070" />
            <rect x="0" y="52" width="8" height="4" rx="2" fill="#606060" />
            <rect x="-6" y="0" width="20" height="6" rx="3" fill="#909090" />
            <rect x="-4" y="4" width="16" height="2" rx="1" fill="#FFF8E0" opacity=".5" />
            <circle cx="4" cy="3" r="7" fill="url(#n-glow)" />
          </g>
        ))}

        {/* ── Bike parking ── */}
        <g transform="translate(850,430)">
          <rect x="0" y="8" width="60" height="2" rx="1" fill="#808080" />
          {[0,1,2,3,4].map(i => (
            <rect key={`bp-${i}`} x={3+i*12} y="0" width="2" height="10" rx="1" fill="#909090" />
          ))}
        </g>

        {/* ── Benches ── */}
        {[[100,460],[550,455],[830,460]].map(([bx,by],i) => (
          <g key={`sb-${i}`} transform={`translate(${bx},${by})`}>
            <rect x="0" y="5" width="45" height="3" rx="1" fill="#A0A0A0" />
            <rect x="2" y="-2" width="41" height="3" rx="1" fill="#B0B0B0" />
            <rect x="5" y="8" width="4" height="10" rx="1" fill="#808080" />
            <rect x="36" y="8" width="4" height="10" rx="1" fill="#808080" />
          </g>
        ))}

        {/* ── Info board ── */}
        <g transform="translate(550,400)">
          <rect x="0" y="0" width="30" height="40" rx="2" fill="#2A2A2A" />
          <rect x="2" y="2" width="26" height="26" rx="1" fill="#4488AA" opacity=".4" />
          <text x="15" y="14" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">MAP</text>
          <rect x="6" y="30" width="18" height="3" rx="1" fill="#E8E0D8" opacity=".4" />
          <rect x="6" y="35" width="14" height="2" rx="1" fill="#E8E0D8" opacity=".3" />
        </g>
      </g>

      {/* ═══ ATMOSPHERE ═══ */}
      <rect y="175" width="4000" height="725" fill="url(#n-atmo)" />
    </svg>
  );
}
