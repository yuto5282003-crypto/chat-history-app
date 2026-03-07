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
          <stop offset="0%" stopColor="#8BB8E0" />
          <stop offset="15%" stopColor="#A8CEE8" />
          <stop offset="35%" stopColor="#C4DDF0" />
          <stop offset="55%" stopColor="#D8E6F0" />
          <stop offset="75%" stopColor="#E4ECE8" />
          <stop offset="100%" stopColor="#E8EEE0" />
        </linearGradient>
        <linearGradient id="f-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(200,216,230,0)" />
          <stop offset="60%" stopColor="rgba(200,216,230,0.05)" />
          <stop offset="100%" stopColor="rgba(200,216,230,0.25)" />
        </linearGradient>
        <radialGradient id="f-sun" cx="22%" cy="8%" r="18%" fx="22%" fy="8%">
          <stop offset="0%" stopColor="rgba(255,248,220,0.55)" />
          <stop offset="40%" stopColor="rgba(255,240,200,0.2)" />
          <stop offset="100%" stopColor="rgba(255,240,200,0)" />
        </radialGradient>
        <filter id="f-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="f-blur2">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <linearGradient id="f-bldg-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B4BCC8" /><stop offset="100%" stopColor="#C0C8D4" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="4000" height="900" fill="url(#f-sky)" />
      {/* Sun glow */}
      <rect width="4000" height="900" fill="url(#f-sun)" />
      {/* Atmospheric haze overlay */}
      <rect width="4000" height="900" fill="url(#f-haze)" />

      {/* ── Realistic layered clouds ── */}
      {/* Large soft background clouds */}
      {[
        [300,40,140,35,.18],[800,55,120,30,.15],[1400,35,160,38,.2],
        [2100,50,130,32,.16],[2800,40,150,36,.18],[3500,55,120,30,.15],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`cb-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="white" opacity={o} filter="url(#f-blur)" />
      ))}
      {/* Main cloud formations — multi-blob clusters */}
      {[
        {x:180,y:48,blobs:[[0,0,70,22],[55,-8,50,18],[-40,5,45,16],[30,10,55,15]]},
        {x:650,y:32,blobs:[[0,0,80,24],[60,-6,55,20],[-50,4,48,17],[40,8,60,16],[-20,-10,40,14]]},
        {x:1100,y:55,blobs:[[0,0,65,20],[50,-5,48,16],[-35,6,40,14]]},
        {x:1550,y:38,blobs:[[0,0,75,22],[55,-8,52,18],[-45,3,42,15],[30,10,50,14]]},
        {x:2000,y:48,blobs:[[0,0,68,21],[48,-6,50,17],[-38,5,44,15]]},
        {x:2500,y:35,blobs:[[0,0,82,25],[65,-7,55,19],[-48,4,50,17],[35,10,58,15]]},
        {x:3000,y:50,blobs:[[0,0,60,18],[42,-5,45,15],[-30,6,38,13]]},
        {x:3450,y:40,blobs:[[0,0,72,22],[52,-6,48,16],[-40,3,42,14],[28,9,52,14]]},
        {x:3850,y:55,blobs:[[0,0,55,17],[38,-4,40,14],[-28,5,35,12]]},
      ].map((cloud,ci) => (
        <g key={`cloud-${ci}`} opacity=".38">
          {cloud.blobs.map(([dx,dy,rx,ry],bi) => (
            <ellipse key={`cl-${ci}-${bi}`} cx={cloud.x+dx} cy={cloud.y+dy} rx={rx} ry={ry} fill="white" />
          ))}
        </g>
      ))}
      {/* Small wispy clouds */}
      {[
        [450,80,30,8],[950,72,25,7],[1350,85,28,8],[1800,78,22,6],
        [2250,82,26,7],[2700,76,24,7],[3200,85,28,8],[3700,78,22,6],
      ].map(([cx,cy,rx,ry],i) => (
        <ellipse key={`cw-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="white" opacity=".2" />
      ))}

      {/* ── Café area — distant European low-rise with depth ── */}
      <g opacity=".18" filter="url(#f-blur2)">
        {[
          [40,108,22,50,3],[70,96,26,62,3],[105,104,20,54,2],[140,100,24,58,3],
          [670,102,22,56,2],[705,108,18,50,2],[735,96,26,62,3],[770,104,20,54,2],
          [810,100,24,58,3],[848,106,18,52,2],
        ].map(([x,y,w,h,r],i) => (
          <rect key={`cf-${i}`} x={x} y={y} width={w} height={h} rx={r} fill="#B8B0A8" />
        ))}
      </g>

      {/* ── Park area — very sparse distant ── */}
      <g opacity=".12" filter="url(#f-blur2)">
        <rect x="1180" y="100" width="20" height="48" rx="2" fill="#B8C0C8" />
        <rect x="1700" y="105" width="16" height="42" rx="2" fill="#C0C8D0" />
      </g>

      {/* ── City district — detailed Tokyo skyline silhouette ── */}
      <g opacity=".22">
        {/* Farthest row (blurred, lighter) */}
        <g filter="url(#f-blur2)" opacity=".6">
          {[
            [2010,25,22,140],[2040,40,18,125],[2065,15,26,150],[2100,50,20,115],
            [2130,30,24,135],[2162,55,18,110],[2190,20,22,145],[2220,45,20,120],
            [2248,35,24,130],[2280,50,18,115],[2305,25,22,140],[2335,55,20,110],
            [2365,30,26,135],[2400,45,18,120],[2425,20,24,145],[2460,40,22,125],
            [2490,55,20,110],[2518,25,24,140],[2550,35,22,130],[2580,50,20,115],
            [2610,20,26,145],[2644,40,22,125],[2674,55,18,110],[2700,30,24,135],
            [2732,45,22,120],[2762,25,20,140],[2790,50,24,115],[2822,35,22,130],
            [2855,45,18,120],[2880,55,22,110],[2910,30,20,135],[2940,40,24,125],
            [2972,20,22,145],
          ].map(([x,y,w,h],i) => (
            <rect key={`skf-${i}`} x={x} y={y} width={w} height={h} rx="1" fill="url(#f-bldg-far)" />
          ))}
        </g>
        {/* Main skyline row */}
        {[
          [2020,30,28,130],[2055,50,22,110],[2085,35,18,125],[2110,55,30,105],
          [2150,25,24,135],[2185,60,20,100],[2210,40,26,120],[2245,70,22,90],
          [2275,30,20,130],[2300,50,32,110],[2340,20,22,140],[2370,55,28,105],
          [2405,35,18,125],[2430,65,24,95],[2465,25,20,135],[2490,45,30,115],
          [2530,60,22,100],[2560,30,26,130],[2595,50,18,110],[2620,70,24,90],
          [2655,40,28,120],[2690,55,20,105],[2720,35,22,125],[2760,65,26,95],
          [2800,45,18,115],[2840,60,24,100],[2880,50,20,110],[2920,75,22,85],
          [2960,55,26,105],
        ].map(([x,y,w,h],i) => (
          <g key={`sk-${i}`}>
            <rect x={x} y={y} width={w} height={h} rx="1" fill="#A8B0C0" />
            {/* Window dots for realism */}
            {Array.from({length:Math.floor(h/12)}).map((_,r) =>
              Array.from({length:Math.floor(w/8)}).map((_,c) => (
                <rect key={`skw-${i}-${r}-${c}`} x={x+3+c*8} y={y+4+r*12} width="4" height="6" fill="#95A0B0" opacity=".6" />
              ))
            )}
          </g>
        ))}
      </g>
      {/* Tokyo Tower */}
      <g opacity=".22">
        <rect x="2448" y="8" width="12" height="152" rx="1" fill="#C0908A" />
        <polygon points="2442,20 2466,20 2454,-8" fill="#C09090" />
        <rect x="2451" y="60" width="6" height="6" rx="3" fill="#D0A0A0" />
        {[30,50,70,90,110,130].map((dy,i) => (
          <line key={`tt-${i}`} x1="2448" y1={8+dy} x2="2460" y2={8+dy} stroke="#B88080" strokeWidth=".7" opacity=".4" />
        ))}
      </g>

      {/* ── Station area skyline ── */}
      <g opacity=".18" filter="url(#f-blur2)">
        {[
          [3050,50,26,110],[3085,35,22,125],[3115,60,30,100],[3150,40,24,120],
          [3185,55,20,105],[3220,30,28,130],[3260,65,22,95],[3295,45,26,115],
          [3330,55,18,105],[3365,35,24,125],[3400,60,20,100],[3440,50,28,110],
          [3480,40,22,120],[3520,65,20,95],[3560,55,26,105],[3600,45,18,115],
          [3640,60,24,100],[3680,50,20,110],[3720,70,22,90],[3760,55,18,105],
        ].map(([x,y,w,h],i) => (
          <rect key={`sks-${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#B0B8C4" />
        ))}
      </g>

      {/* ── Birds (more natural V-shape pairs) ── */}
      {[[320,95],[540,105],[1450,82],[1650,108],[2280,72],[2520,88],[3280,78],[3580,98]].map(([x,y],i) => (
        <g key={`b-${i}`} opacity={.22-.01*i}>
          <path d={`M${x} ${y} Q${x+5} ${y-5} ${x+10} ${y+1}`} stroke="#666" strokeWidth="1.2" fill="none" />
          <path d={`M${x+10} ${y+1} Q${x+15} ${y-4} ${x+20} ${y+2}`} stroke="#666" strokeWidth="1.2" fill="none" />
        </g>
      ))}

      {/* ── Distant mountain range (very faint) ── */}
      <path d="M0 165 Q200 130 400 148 Q600 125 800 142 Q1000 120 1200 140 Q1400 128 1600 145 Q1800 118 2000 138 L2000 170 L0 170Z"
        fill="#C0D0C0" opacity=".12" />
      <path d="M2000 165 Q2200 135 2400 150 Q2600 128 2800 145 Q3000 120 3200 140 Q3400 130 3600 148 Q3800 122 4000 140 L4000 170 L2000 170Z"
        fill="#B8C8C8" opacity=".1" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   MID LAYER — hills, distant tree lines, mid-distance buildings
   ═══════════════════════════════════════════ */
export function MidLayer() {
  return (
    <svg viewBox="0 0 4000 900" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="m-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8EC070" /><stop offset="100%" stopColor="#6AA850" />
        </linearGradient>
        <linearGradient id="m-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ACA7A" /><stop offset="100%" stopColor="#78B060" />
        </linearGradient>
        <linearGradient id="m-hill3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8D488" /><stop offset="100%" stopColor="#88BC68" />
        </linearGradient>
        <linearGradient id="m-tree1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A9848" /><stop offset="100%" stopColor="#488838" />
        </linearGradient>
        <linearGradient id="m-tree2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#68A855" /><stop offset="100%" stopColor="#559842" />
        </linearGradient>
        <filter id="m-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* ── Rolling hills — organic shapes using paths ── */}
      {/* Far hill layer (lightest) */}
      <path d="M-50 175 Q150 140 350 155 Q550 130 750 152 Q950 138 1150 150 Q1350 128 1550 148 Q1750 135 1950 155 L2000 175 L-50 175Z"
        fill="url(#m-hill3)" opacity=".35" />
      <path d="M2000 172 Q2200 145 2400 158 Q2600 135 2800 150 Q3000 130 3200 148 Q3400 138 3600 155 Q3800 128 4050 145 L4050 175 L2000 175Z"
        fill="#A0C888" opacity=".2" />

      {/* Mid hill layer */}
      <path d="M-50 178 Q200 155 450 165 Q650 148 850 162 Q1050 152 1250 168 Q1500 145 1700 158 Q1900 150 2050 170 L2050 195 L-50 195Z"
        fill="url(#m-hill2)" opacity=".3" />

      {/* Near hill layer (darkest, most visible) */}
      <path d="M-50 185 Q100 170 300 175 Q500 162 700 172 Q900 165 1100 178 Q1350 160 1550 170 Q1800 162 2050 180 L2050 210 L-50 210Z"
        fill="url(#m-hill1)" opacity=".32" />

      {/* ── Distant tree line — layered canopy clusters ── */}
      {/* Back tree row (lighter, blurred) */}
      <g filter="url(#m-blur)" opacity=".2">
        {[80,180,280,380,500,620,740,860,980,1100,1220,1380,1520,1660,1800,1940].map((x,i) => (
          <ellipse key={`tbk-${i}`} cx={x} cy={168} rx={35+i%3*8} ry={16+i%2*4} fill="#78B860" />
        ))}
      </g>
      {/* Front tree row (darker, sharper) */}
      {[
        [120,172,32,14],[250,169,28,12],[370,172,35,15],[480,170,25,11],
        [600,172,30,13],[730,169,34,15],[850,172,28,12],[960,170,32,14],
        [1080,172,26,11],[1200,169,34,15],[1340,172,30,13],[1480,170,28,12],
        [1620,172,32,14],[1760,169,26,11],[1880,172,30,13],
      ].map(([cx,cy,rx,ry],i) => (
        <ellipse key={`tfr-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#m-tree1)" opacity=".35" />
      ))}
      {/* Individual tree tops poking above canopy */}
      {[
        [160,162,12,10],[340,160,10,9],[550,163,11,9],[720,160,13,11],
        [900,162,10,8],[1060,160,12,10],[1260,162,11,9],[1430,161,10,8],
        [1580,163,12,10],[1730,160,10,9],[1850,162,11,9],
      ].map(([cx,cy,rx,ry],i) => (
        <ellipse key={`tp-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#m-tree2)" opacity=".4" />
      ))}

      {/* ── City district mid-distance buildings (with windows) ── */}
      <g opacity=".22">
        {[
          [2080,115,38,60],[2128,125,30,50],[2168,110,34,65],[2212,128,26,47],
          [2250,118,32,57],[2295,130,28,45],[2335,108,36,67],[2382,122,30,53],
          [2425,132,24,43],[2460,112,34,63],[2506,126,28,49],[2545,118,32,57],
          [2590,130,26,45],[2628,108,30,67],[2670,122,34,53],[2718,115,28,60],
          [2758,128,24,47],[2795,110,32,65],[2840,125,26,50],[2878,118,30,57],
        ].map(([x,y,w,h],i) => (
          <g key={`cm-${i}`}>
            <rect x={x} y={y} width={w} height={h} rx="2" fill="#A8B0BC" />
            {/* Window rows */}
            {Array.from({length:Math.floor(h/14)}).map((_,r) =>
              Array.from({length:Math.floor(w/10)}).map((_,c) => (
                <rect key={`mw-${i}-${r}-${c}`} x={x+3+c*10} y={y+4+r*14} width="5" height="8" fill="#96A0B0" opacity=".5" />
              ))
            )}
          </g>
        ))}
      </g>

      {/* ── Station area mid-distance ── */}
      <g opacity=".19">
        {[
          [3080,120,32,55],[3125,112,28,63],[3168,128,34,47],[3218,118,30,57],
          [3262,125,26,50],[3302,110,32,65],[3348,130,28,45],[3390,115,34,60],
          [3438,122,26,53],[3478,108,30,67],[3522,128,28,47],[3565,118,32,57],
          [3610,125,24,50],[3648,112,30,63],[3692,130,26,45],[3730,118,28,57],
        ].map(([x,y,w,h],i) => (
          <g key={`sm-${i}`}>
            <rect x={x} y={y} width={w} height={h} rx="2" fill="#ACB4C0" />
            {Array.from({length:Math.floor(h/14)}).map((_,r) =>
              Array.from({length:Math.floor(w/10)}).map((_,c) => (
                <rect key={`sw-${i}-${r}-${c}`} x={x+3+c*10} y={y+4+r*14} width="5" height="8" fill="#9CA4B4" opacity=".45" />
              ))
            )}
          </g>
        ))}
      </g>

      {/* ── Atmospheric depth — gradient fade at bottom ── */}
      <rect y="160" width="4000" height="40" fill="url(#m-hill3)" opacity=".08" />
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
          <stop offset="0%" stopColor="#6EBE52" /><stop offset="40%" stopColor="#5DAD44" /><stop offset="100%" stopColor="#4E9E38" />
        </linearGradient>
        <linearGradient id="n-gl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7EC862" /><stop offset="100%" stopColor="#6AB850" />
        </linearGradient>
        <linearGradient id="n-gd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#58AE42" /><stop offset="100%" stopColor="#489838" />
        </linearGradient>
        <linearGradient id="n-grass-shadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,40,0,0.08)" /><stop offset="100%" stopColor="rgba(0,40,0,0)" />
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
      {/* Paved ground for café area (0-1000) — urban sidewalk/tiles */}
      <rect y="175" width="1000" height="725" fill="#CBC7BF" />
      {/* Subtle warm tone variation */}
      <rect y="175" width="500" height="725" fill="#D0CBC2" opacity=".3" />
      <rect x="500" y="175" width="500" height="725" fill="#C8C4BA" opacity=".2" />

      {/* Grass for park area (1000-2000) */}
      <rect x="1000" y="175" width="1000" height="725" fill="url(#n-grass)" />
      {/* Grass color variation patches for realism */}
      <ellipse cx="1300" cy="400" rx="200" ry="120" fill="url(#n-gl)" opacity=".15" />
      <ellipse cx="1700" cy="550" rx="180" ry="100" fill="url(#n-gd)" opacity=".12" />
      <ellipse cx="1150" cy="650" rx="150" ry="90" fill="url(#n-gl)" opacity=".1" />
      <ellipse cx="1500" cy="300" rx="160" ry="80" fill="#5DAD44" opacity=".08" />
      {/* Grass shadows under trees/structures */}
      <rect x="1000" y="175" width="80" height="725" fill="url(#n-grass-shadow)" />

      {/* Paved ground for city + station areas (2000-4000) */}
      <rect x="2000" y="175" width="2000" height="725" fill="#C0BCB4" />
      {/* Subtle variation for city ground */}
      <rect x="2000" y="175" width="1000" height="725" fill="#C4C0B8" opacity=".3" />
      <rect x="3000" y="175" width="1000" height="725" fill="#C8C4BC" opacity=".2" />

      {/* Smooth transitions between areas */}
      <rect x="930" y="175" width="140" height="725" fill="url(#n-grass)" opacity=".4" />
      <rect x="960" y="175" width="80" height="725" fill="url(#n-grass)" opacity=".6" />
      <rect x="1920" y="175" width="160" height="725" fill="url(#n-grass)" opacity=".35" />
      <rect x="1950" y="175" width="100" height="725" fill="url(#n-grass)" opacity=".5" />

      {/* Café area sidewalk tile pattern — more detailed */}
      {Array.from({length: 20}).map((_,row) =>
        Array.from({length: 25}).map((_,col) => {
          const shade = ((row+col)%4===0) ? "#D5D1C9" : ((row+col)%4===1) ? "#C9C5BD" : ((row+col)%4===2) ? "#D0CCc4" : "#C6C2BA";
          return (
            <rect key={`ct-${row}-${col}`} x={col*40} y={180+row*36} width="38" height="34" rx="1" fill={shade} opacity=".35" />
          );
        })
      )}
      {/* Tile joint lines (subtle) */}
      {Array.from({length: 21}).map((_,row) => (
        <line key={`tj-h-${row}`} x1="0" y1={180+row*36} x2="1000" y2={180+row*36} stroke="#B8B4AC" strokeWidth=".5" opacity=".15" />
      ))}
      {Array.from({length: 26}).map((_,col) => (
        <line key={`tj-v-${col}`} x1={col*40} y1="180" x2={col*40} y2="900" stroke="#B8B4AC" strokeWidth=".5" opacity=".12" />
      ))}
      {/* Café area decorative brick border along buildings */}
      <rect x="0" y="490" width="1000" height="48" fill="url(#n-sidewalk)" opacity=".5" />

      {/* Grass texture patches (park area) — more varied and natural */}
      {[
        [1500,420,140,35,.15],[1800,300,90,24,.1],[1200,700,130,32,.12],
        [1100,500,100,25,.14],[1300,350,80,22,.1],[1600,600,120,30,.12],
        [1400,250,95,28,.08],[1850,450,110,30,.1],[1150,400,80,25,.09],
        [1700,700,100,28,.11],[1300,600,110,30,.13],[1500,550,80,22,.08],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`gt-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={i%2===0?"url(#n-gl)":"url(#n-gd)"} opacity={o} />
      ))}
      {/* Individual grass blade clusters (very subtle) */}
      {Array.from({length:40}).map((_,i) => {
        const gx = 1020 + (i*24 + (i*17)%950);
        const gy = 200 + (i*31)%680;
        return (
          <g key={`gb-${i}`} opacity=".08">
            <line x1={gx} y1={gy} x2={gx-1} y2={gy-6} stroke="#4A9838" strokeWidth="1" />
            <line x1={gx+2} y1={gy} x2={gx+3} y2={gy-7} stroke="#58A842" strokeWidth="1" />
            <line x1={gx+4} y1={gy} x2={gx+3} y2={gy-5} stroke="#4A9838" strokeWidth="1" />
          </g>
        );
      })}

      {/* ═══ MAIN CONNECTING PATH — full width ═══ */}
      {/* Path shadow (subtle depth) */}
      <path
        d="M0 502 Q250 490 500 496 Q750 502 1000 500 Q1250 504 1500 500 Q1750 496 2000 500 L2000 534 Q1750 530 1500 534 Q1250 538 1000 534 Q750 536 500 530 Q250 524 0 536Z"
        fill="#000" opacity=".04"
      />
      {/* Main path surface */}
      <path
        d="M0 500 Q250 488 500 494 Q750 500 1000 498 Q1250 502 1500 498 Q1750 494 2000 498 L2000 528 Q1750 524 1500 528 Q1250 532 1000 528 Q750 530 500 524 Q250 518 0 530Z"
        fill="url(#n-path)" opacity=".85"
      />
      {/* Path edge highlight (top) */}
      <path
        d="M0 500 Q250 488 500 494 Q750 500 1000 498 Q1250 502 1500 498 Q1750 494 2000 498 L2000 500 Q1750 496 1500 500 Q1250 504 1000 500 Q750 502 500 496 Q250 490 0 502Z"
        fill="white" opacity=".08"
      />
      {/* Path edge shadow (bottom) */}
      <path
        d="M0 530 Q250 518 500 524 Q750 530 1000 528 Q1250 532 1500 528 Q1750 524 2000 528 L2000 535 Q1750 531 1500 535 Q1250 539 1000 535 Q750 537 500 531 Q250 525 0 537Z"
        fill="url(#n-pe)" opacity=".5"
      />
      {/* City + station: wide sidewalk with texture */}
      <rect x="2000" y="488" width="2000" height="50" fill="url(#n-sidewalk)" opacity=".6" />
      {/* Subtle tile lines on city sidewalk */}
      {Array.from({length:50}).map((_,i) => (
        <line key={`csw-${i}`} x1={2000+i*40} y1="488" x2={2000+i*40} y2="538" stroke="#B8B4AC" strokeWidth=".5" opacity=".1" />
      ))}

      {/* ══════════════════════════════════════════════════════
           AREA 1 — Starbucks Café (0-1000)
           Based on reference: dark brick + vertical cedar slats + black frames + large glass
         ══════════════════════════════════════════════════════ */}

      {/* ── Sidewalk / road ── */}
      <rect x="0" y="540" width="1000" height="50" rx="2" fill="url(#n-asphalt)" opacity=".4" />
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
        <rect key={`ccl-${i}`} x={20+i*75} y="563" width="40" height="3" rx="1" fill="#E8E0D0" opacity=".3" />
      ))}

      {/* ══════════════════════════════════════════════════════════
           STARBUCKS BUILDING + LANDSCAPING — shifted left so building is never cut off
           Wrapping group shifts all café content 200px left (building effective x=100-700)
         ══════════════════════════════════════════════════════════ */}
      <g transform="translate(-200,0)">
      <g filter="url(#n-sh2)">

        {/* ── FLAT ROOF (black trim) ── */}
        <rect x="300" y="248" width="600" height="7" fill="#1A1A1A" />
        <rect x="300" y="253" width="600" height="3" fill="#2A2A2A" />

        {/* ═══ LEFT SECTION (x=300-560): Dark brick upper + vertical wood lower ═══ */}

        {/* Dark reddish-brown BRICK wall (upper) */}
        <rect x="300" y="256" width="260" height="110" fill="#4A2E20" />
        {Array.from({length: 11}).map((_,row) =>
          Array.from({length: 13}).map((_,col) => (
            <rect key={`brk-${row}-${col}`}
              x={302 + col*20 + (row%2===0 ? 0 : 10)}
              y={258 + row*10}
              width="18" height="8" rx="0.5"
              fill={((row+col)%3===0) ? "#5A3828" : ((row+col)%3===1) ? "#4E3222" : "#3E2818"}
              opacity=".8"
            />
          ))
        )}

        {/* "STARBUCKS COFFEE" text on brick */}
        <text x="430" y="325" textAnchor="middle" fontSize="18" fill="#D4C8B0" fontWeight="bold" letterSpacing="3" opacity=".9">STARBUCKS COFFEE</text>

        {/* Vertical CEDAR WOOD slats (lower left, x=300-460) */}
        <rect x="300" y="366" width="160" height="122" fill="#B8885A" />
        {Array.from({length: 20}).map((_,i) => (
          <rect key={`vslat-l-${i}`} x={302+i*8} y="366" width="4" height="122"
            fill={i%2===0 ? "#C8986A" : "#A07848"} />
        ))}

        {/* Large glass windows on wood section */}
        <rect x="312" y="370" width="136" height="110" rx="2" fill="#1A1A1A" />
        {[0,1,2].map(i => (
          <rect key={`gw-l-${i}`} x={316+i*44} y="374" width="40" height="102" rx="1"
            fill="#B8D4CC" opacity=".7" />
        ))}
        {[1,2].map(i => (
          <line key={`wf-l-${i}`} x1={316+i*44} y1="370" x2={316+i*44} y2="480" stroke="#1A1A1A" strokeWidth="3" />
        ))}
        {[0,1,2].map(i => (
          <line key={`wr-l-${i}`} x1={324+i*44} y1="378" x2={321+i*44} y2="472" stroke="white" strokeWidth="1.5" opacity=".15" />
        ))}

        {/* Small high window on brick */}
        <rect x="470" y="270" width="75" height="35" rx="1" fill="#1A1A1A" />
        <rect x="473" y="273" width="69" height="29" rx="1" fill="#B8D4CC" opacity=".5" />
        <line x1="507" y1="270" x2="507" y2="305" stroke="#1A1A1A" strokeWidth="2" />

        {/* Black column */}
        <rect x="460" y="366" width="8" height="122" fill="#1A1A1A" />

        {/* Brick section to center */}
        <rect x="468" y="366" width="92" height="122" fill="#4A2E20" />
        {Array.from({length: 12}).map((_,row) =>
          Array.from({length: 4}).map((_,col) => (
            <rect key={`brk2-${row}-${col}`}
              x={470 + col*20 + (row%2===0 ? 0 : 10)}
              y={368 + row*10}
              width="18" height="8" rx="0.5"
              fill={((row+col)%3===0) ? "#5A3828" : "#3E2818"}
              opacity=".7"
            />
          ))
        )}

        {/* Cedar accent column */}
        <rect x="560" y="256" width="12" height="232" fill="#C8986A" />
        <rect x="562" y="256" width="3" height="232" fill="#D4A878" opacity=".5" />

        {/* ═══ CENTER GLASS ENTRANCE (x=572-700) ═══ */}
        <rect x="572" y="350" width="128" height="138" fill="#1A1A1A" />
        <rect x="576" y="354" width="58" height="130" rx="1" fill="#A8C8BC" opacity=".65" />
        <rect x="640" y="354" width="56" height="130" rx="1" fill="#A8C8BC" opacity=".65" />
        <line x1="634" y1="354" x2="634" y2="484" stroke="#1A1A1A" strokeWidth="4" />
        <line x1="640" y1="354" x2="640" y2="484" stroke="#1A1A1A" strokeWidth="3" />
        <rect x="629" y="410" width="4" height="16" rx="2" fill="#808080" />
        <rect x="641" y="410" width="4" height="16" rx="2" fill="#808080" />
        <line x1="592" y1="358" x2="589" y2="478" stroke="white" strokeWidth="1.5" opacity=".12" />
        <line x1="660" y1="358" x2="657" y2="478" stroke="white" strokeWidth="1.5" opacity=".12" />
        <rect x="572" y="344" width="128" height="6" fill="#1A1A1A" />

        {/* Transom window above entrance */}
        <rect x="572" y="300" width="128" height="44" fill="#1A1A1A" />
        <rect x="576" y="304" width="120" height="36" rx="1" fill="#B8D4CC" opacity=".5" />
        <line x1="636" y1="300" x2="636" y2="344" stroke="#1A1A1A" strokeWidth="3" />

        {/* ═══ RIGHT SECTION (x=700-900): Brick + white panel ═══ */}

        {/* Dark brick (upper right) */}
        <rect x="700" y="256" width="200" height="112" fill="#4A2E20" />
        {Array.from({length: 11}).map((_,row) =>
          Array.from({length: 10}).map((_,col) => (
            <rect key={`brk3-${row}-${col}`}
              x={702 + col*20 + (row%2===0 ? 0 : 10)}
              y={258 + row*10}
              width="18" height="8" rx="0.5"
              fill={((row+col)%3===0) ? "#5A3828" : ((row+col)%3===1) ? "#4E3222" : "#3E2818"}
              opacity=".8"
            />
          ))
        )}

        {/* Starbucks GREEN CIRCLE LOGO */}
        <circle cx="790" cy="300" r="30" fill="#00704A" />
        <circle cx="790" cy="300" r="26" fill="#1E3932" />
        <circle cx="790" cy="300" r="23" fill="#00704A" />
        <circle cx="790" cy="300" r="21" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="790" cy="300" r="15" fill="none" stroke="white" strokeWidth="1" />
        <circle cx="790" cy="290" r="3.5" fill="white" />
        <path d="M787 287 L788 284 L790 285.5 L792 284 L793 287" fill="white" />
        <path d="M785 294 Q790 306 795 294" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M783 296 Q780 303 777 305" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M797 296 Q800 303 803 305" stroke="white" strokeWidth="1.5" fill="none" />

        {/* White/cream panel (lower right) */}
        <rect x="700" y="368" width="200" height="120" fill="#F0EDE8" />
        <rect x="700" y="368" width="200" height="4" fill="#E0DCD4" />

        {/* Glass windows on white panel */}
        <rect x="712" y="380" width="85" height="96" rx="1" fill="#1A1A1A" />
        <rect x="716" y="384" width="36" height="88" rx="1" fill="#B8D4CC" opacity=".65" />
        <rect x="757" y="384" width="36" height="88" rx="1" fill="#B8D4CC" opacity=".65" />
        <line x1="752" y1="380" x2="752" y2="476" stroke="#1A1A1A" strokeWidth="3" />

        <rect x="810" y="380" width="75" height="96" rx="1" fill="#1A1A1A" />
        <rect x="814" y="384" width="67" height="88" rx="1" fill="#B8D4CC" opacity=".6" />
        <line x1="847" y1="380" x2="847" y2="476" stroke="#1A1A1A" strokeWidth="2" />

        {/* Black accent bands */}
        <rect x="300" y="362" width="260" height="5" fill="#1A1A1A" />
        <rect x="700" y="366" width="200" height="3" fill="#2A2A2A" />

        {/* Base */}
        <rect x="300" y="486" width="600" height="4" fill="#2A2A2A" />
      </g>

      {/* ══════════════════════════════════════════════════════════
           LANDSCAPING — hedges + trees (shifted to match building x=300-900)
         ══════════════════════════════════════════════════════════ */}

      {/* Low hedges along building base */}
      {Array.from({length: 8}).map((_,i) => (
        <ellipse key={`hedge-l-${i}`} cx={320+i*18} cy="492" rx="12" ry="7" fill="#3D7A3D" opacity=".6" />
      ))}
      {Array.from({length: 10}).map((_,i) => (
        <ellipse key={`hedge-r-${i}`} cx={710+i*18} cy="492" rx="12" ry="7" fill="#3D7A3D" opacity=".6" />
      ))}
      {[560,570,580,695,705].map((hx,i) => (
        <ellipse key={`hedge-e-${i}`} cx={hx} cy="492" rx="9" ry="6" fill="#3D7A3D" opacity=".55" />
      ))}

      {/* Trees in front of building */}
      <g transform="translate(390,445)">
        <ellipse cx="0" cy="46" rx="10" ry="3" fill="#000" opacity=".04" />
        <rect x="-3" y="16" width="6" height="32" rx="2" fill="#6B5040" />
        <line x1="0" y1="24" x2="-12" y2="12" stroke="#6B5040" strokeWidth="2.5" />
        <line x1="0" y1="18" x2="10" y2="8" stroke="#6B5040" strokeWidth="2" />
        <ellipse cx="0" cy="-4" rx="20" ry="18" fill="#4A8A38" opacity=".75" />
        <ellipse cx="-10" cy="4" rx="12" ry="10" fill="#5A9A48" opacity=".6" />
        <ellipse cx="10" cy="-2" rx="10" ry="9" fill="#3D7A30" opacity=".5" />
      </g>

      <g transform="translate(540,448)">
        <ellipse cx="0" cy="44" rx="9" ry="3" fill="#000" opacity=".04" />
        <rect x="-2" y="16" width="5" height="30" rx="2" fill="#6B5040" />
        <line x1="0" y1="22" x2="-8" y2="12" stroke="#6B5040" strokeWidth="2" />
        <ellipse cx="0" cy="-2" rx="16" ry="14" fill="#4A8A38" opacity=".7" />
        <ellipse cx="-6" cy="4" rx="8" ry="7" fill="#5A9A48" opacity=".5" />
      </g>

      <g transform="translate(720,444)">
        <ellipse cx="0" cy="48" rx="11" ry="3" fill="#000" opacity=".04" />
        <rect x="-3" y="16" width="6" height="34" rx="2" fill="#6B5040" />
        <line x1="0" y1="24" x2="-12" y2="12" stroke="#6B5040" strokeWidth="2.5" />
        <line x1="0" y1="18" x2="12" y2="8" stroke="#6B5040" strokeWidth="2" />
        <ellipse cx="0" cy="-4" rx="22" ry="18" fill="#4A8A38" opacity=".75" />
        <ellipse cx="-12" cy="2" rx="12" ry="10" fill="#5A9A48" opacity=".6" />
        <ellipse cx="12" cy="-2" rx="10" ry="9" fill="#3D7A30" opacity=".5" />
      </g>

      <g transform="translate(870,448)">
        <ellipse cx="0" cy="44" rx="9" ry="3" fill="#000" opacity=".04" />
        <rect x="-2" y="18" width="5" height="28" rx="2" fill="#6B5040" />
        <ellipse cx="0" cy="-2" rx="16" ry="14" fill="#4A8A38" opacity=".65" />
        <ellipse cx="6" cy="2" rx="8" ry="7" fill="#5A9A48" opacity=".45" />
      </g>

      {/* Terrace floor */}
      <rect x="300" y="490" width="600" height="48" rx="2" fill="#C8C0B4" opacity=".12" />

      {/* Outdoor tables */}
      {[[400,528],[550,526],[700,530],[850,528]].map(([tx,ty],i) => (
        <g key={`ct-${i}`}>
          <ellipse cx={tx} cy={ty+12} rx="12" ry="4" fill="#000" opacity=".04" />
          <ellipse cx={tx} cy={ty} rx="14" ry="6" fill="#E8DDD0" />
          <rect x={tx-2} y={ty} width="4" height="12" rx="1" fill="#C8B898" />
          <ellipse cx={tx-16} cy={ty+1} rx="5" ry="5" fill="#1E3932" opacity=".5" />
          <ellipse cx={tx+16} cy={ty+1} rx="5" ry="5" fill="#1E3932" opacity=".5" />
          <rect x={tx-4} y={ty-5} width="5" height="6" rx="1.5" fill="white" opacity=".75" />
          <rect x={tx-1} y={ty-38} width="2" height="36" fill="#707070" />
          <ellipse cx={tx} cy={ty-38} rx="22" ry="8" fill="#00704A" opacity=".65" />
        </g>
      ))}

      {/* Street lamps */}
      {[[250,430],[950,425]].map(([lx,ly],i) => (
        <g key={`cl-${i}`} transform={`translate(${lx},${ly})`}>
          <rect x="2" y="5" width="4" height="50" rx="2" fill="#707070" />
          <rect x="0" y="52" width="8" height="4" rx="2" fill="#606060" />
          <rect x="-6" y="0" width="20" height="6" rx="3" fill="#909090" />
          <rect x="-4" y="4" width="16" height="2" rx="1" fill="#FFF8E0" opacity=".5" />
          <circle cx="4" cy="3" r="7" fill="url(#n-glow)" />
        </g>
      ))}

      {/* Benches */}
      {[[270,520],[920,518]].map(([bx,by],i) => (
        <g key={`cb-${i}`} transform={`translate(${bx},${by})`}>
          <rect x="0" y="5" width="42" height="3" rx="1" fill="#A0A0A0" />
          <rect x="2" y="-2" width="38" height="3" rx="1" fill="#B0B0B0" />
          <rect x="4" y="8" width="3" height="10" rx="1" fill="#808080" />
          <rect x="35" y="8" width="3" height="10" rx="1" fill="#808080" />
        </g>
      ))}

      </g>{/* end café shift wrapper */}

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
           AREA 4 — 仙台駅 Sendai Station style (3000-4000)
           Terracotta/beige, clock tower left, red rooftop text, gray window band
         ══════════════════════════════════════════════════════ */}
      <g transform="translate(3000,0)">
        {/* ── Road ── */}
        <rect x="0" y="480" width="1000" height="60" rx="2" fill="url(#n-asphalt)" opacity=".5" />
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={`scl-${i}`} x={50+i*75} y="508" width="40" height="3" rx="1" fill="#E8E0D0" opacity=".35" />
        ))}

        {/* ═══ SENDAI STATION BUILDING ═══ */}
        <g filter="url(#n-sh2)">
          {/* ── LEFT CLOCK TOWER (x=60-180, tall square) ── */}
          <rect x="60" y="175" width="120" height="310" fill="#C8A080" />
          <rect x="68" y="185" width="104" height="290" fill="#D0AD8A" opacity=".5" />
          {/* Window grid on tower */}
          {Array.from({length:6}).map((_,row) =>
            Array.from({length:4}).map((_,col) => (
              <rect key={`tw-${row}-${col}`} x={72+col*25} y={260+row*32} width="20" height="26" rx="1" fill="#6A8898" opacity=".55" />
            ))
          )}
          {/* Clock face */}
          <rect x="85" y="192" width="70" height="60" rx="3" fill="#3A3A3A" />
          <circle cx="120" cy="222" r="22" fill="white" />
          <circle cx="120" cy="222" r="1.5" fill="#333" />
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
            const a = (i*30-90)*Math.PI/180;
            return <line key={`cm-${i}`} x1={120+Math.cos(a)*16} y1={222+Math.sin(a)*16} x2={120+Math.cos(a)*19} y2={222+Math.sin(a)*19} stroke="#333" strokeWidth={i%3===0?"2":"1"} />;
          })}
          <line x1="120" y1="222" x2="120" y2="208" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="120" y1="222" x2="130" y2="228" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
          {/* Antenna */}
          <rect x="118" y="160" width="4" height="18" rx="1" fill="#B0B0B0" />

          {/* ── MAIN BODY (x=180-870) ── */}
          <rect x="180" y="210" width="690" height="275" fill="#C8A080" />
          <rect x="180" y="210" width="690" height="275" fill="#D4B090" opacity=".4" />

          {/* Rooftop trim */}
          <rect x="180" y="200" width="690" height="14" fill="#A08868" />
          {/* Red station name text on rooftop */}
          <text x="460" y="198" textAnchor="middle" fontSize="18" fill="#D04020" fontWeight="bold" letterSpacing="8">仙 台 駅</text>
          <text x="680" y="198" textAnchor="middle" fontSize="11" fill="#D04020" fontWeight="bold" letterSpacing="2">SENDAI STATION</text>

          {/* ── UPPER: Dark gray band with continuous glass windows ── */}
          <rect x="180" y="214" width="690" height="65" fill="#686868" />
          <rect x="180" y="214" width="690" height="4" fill="#585858" />
          <rect x="180" y="275" width="690" height="4" fill="#585858" />
          <rect x="190" y="222" width="670" height="48" fill="#5A7888" opacity=".7" />
          {Array.from({length:17}).map((_,i) => (
            <line key={`uw-${i}`} x1={190+i*39.4} y1="222" x2={190+i*39.4} y2="270" stroke="#808080" strokeWidth="1.5" />
          ))}
          <line x1="190" y1="246" x2="860" y2="246" stroke="#808080" strokeWidth="1" />
          <rect x="192" y="224" width="666" height="22" fill="#88B8D0" opacity=".2" />

          {/* ── LOWER: terracotta wall with windows and entrance ── */}
          <rect x="180" y="279" width="690" height="206" fill="#C8A080" />

          {/* Left windows */}
          {[0,1,2,3].map(i => (
            <g key={`lw-${i}`}>
              <rect x={195+i*58} y="290" width="48" height="68" rx="2" fill="#5A6878" opacity=".6" />
              <rect x={197+i*58} y="292" width="44" height="64" rx="1" fill="#88B0C8" opacity=".35" />
              <line x1={219+i*58} y1="290" x2={219+i*58} y2="358" stroke="#6A7A8A" strokeWidth="1.5" />
            </g>
          ))}

          {/* Main entrance (center) */}
          <rect x="440" y="290" width="200" height="195" rx="3" fill="#5A6878" />
          {[0,1,2,3].map(i => (
            <rect key={`me-${i}`} x={446+i*48} y="296" width="42" height="185" rx="1" fill="#88B8D0" opacity=".4" />
          ))}
          {[1,2,3].map(i => (
            <line key={`mf-${i}`} x1={446+i*48} y1="290" x2={446+i*48} y2="485" stroke="#4A5A68" strokeWidth="3" />
          ))}
          <rect x="440" y="380" width="200" height="4" fill="#4A5A68" />
          <rect x="475" y="296" width="130" height="18" rx="3" fill="rgba(0,0,0,0.5)" />
          <text x="540" y="309" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">中央改札 Central Gate</text>

          {/* Right windows */}
          {[0,1,2,3].map(i => (
            <g key={`rw-${i}`}>
              <rect x={660+i*50} y="290" width="40" height="68" rx="2" fill="#5A6878" opacity=".6" />
              <rect x={662+i*50} y="292" width="36" height="64" rx="1" fill="#88B0C8" opacity=".35" />
            </g>
          ))}

          {/* Accent lines */}
          <rect x="180" y="365" width="260" height="3" fill="#B89870" opacity=".5" />
          <rect x="640" y="365" width="230" height="3" fill="#B89870" opacity=".5" />

          {/* Side entrances */}
          <rect x="195" y="385" width="55" height="100" rx="2" fill="#5A6878" opacity=".6" />
          <rect x="198" y="388" width="49" height="94" rx="1" fill="#88B0C8" opacity=".3" />
          <rect x="800" y="385" width="55" height="100" rx="2" fill="#5A6878" opacity=".6" />
          <rect x="803" y="388" width="49" height="94" rx="1" fill="#88B0C8" opacity=".3" />

          {/* Base */}
          <rect x="60" y="483" width="810" height="4" fill="#8A7A68" />
        </g>

        {/* ── Trees in front of station ── */}
        {[[280,430],[340,426],[690,428],[760,430],[830,426]].map(([tx,ty],i) => (
          <g key={`st-${i}`}>
            <rect x={tx-2} y={ty} width="4" height="16" rx="1" fill="#5A7040" />
            <ellipse cx={tx} cy={ty-6} rx="12" ry="12" fill="#3A7A3A" opacity=".65" />
            <ellipse cx={tx+4} cy={ty-10} rx="8" ry="8" fill="#4A9A48" opacity=".45" />
          </g>
        ))}

        {/* ── Pedestrian deck (terracotta walkway) ── */}
        <rect x="0" y="460" width="1000" height="22" fill="#B09080" opacity=".25" />
        <rect x="0" y="458" width="1000" height="3" fill="#A08870" opacity=".4" />
        <line x1="0" y1="458" x2="1000" y2="458" stroke="#909090" strokeWidth="1.5" opacity=".4" />
        {Array.from({length:50}).map((_,i) => (
          <rect key={`rail-${i}`} x={i*20} y="458" width="1.5" height="10" fill="#909090" opacity=".3" />
        ))}
        <rect x="0" y="469" width="1000" height="3" rx="1" fill="#D4A830" opacity=".3" />

        {/* ── Railway tracks ── */}
        <rect x="-20" y="145" width="1040" height="8" fill="#8A8A8A" />
        <rect x="-20" y="143" width="1040" height="3" fill="#A0A0A0" />
        {Array.from({length:60}).map((_,i) => (
          <rect key={`tie-${i}`} x={-10+i*17} y="141" width="8" height="12" rx="1" fill="#6A5A4A" opacity=".5" />
        ))}
        <line x1="-20" y1="144" x2="1020" y2="144" stroke="#C0C0C0" strokeWidth="2" />
        <line x1="-20" y1="151" x2="1020" y2="151" stroke="#C0C0C0" strokeWidth="2" />

        {/* ── Running train (JR Tohoku green line) ── */}
        <g>
          <animateTransform attributeName="transform" type="translate" from="1100,0" to="-600,0" dur="12s" repeatCount="indefinite" />
          <rect x="0" y="123" width="120" height="26" rx="6" fill="#E8E8E8" />
          <rect x="0" y="125" width="120" height="20" rx="4" fill="#D0D4D8" />
          <rect x="0" y="135" width="120" height="8" fill="#2D8C4E" />
          <path d="M-12 125 Q-16 137 -12 145 L0 145 L0 125Z" fill="#C8CCD0" />
          <path d="M-12 135 L0 135 L0 143 L-12 143Z" fill="#2D8C4E" />
          <circle cx="-6" cy="131" r="3" fill="#FFE080" />
          {[8,28,48,68,88].map((wx,i) => (
            <rect key={`tw1-${i}`} x={wx} y="126" width="16" height="8" rx="1.5" fill="#88C8E8" opacity=".8" />
          ))}
          <rect x="106" y="126" width="8" height="17" rx="1" fill="#A0B0B8" />
          <rect x="124" y="123" width="120" height="26" rx="3" fill="#E8E8E8" />
          <rect x="124" y="125" width="120" height="20" rx="2" fill="#D0D4D8" />
          <rect x="124" y="135" width="120" height="8" fill="#2D8C4E" />
          {[132,152,172,192,212].map((wx,i) => (
            <rect key={`tw2-${i}`} x={wx} y="126" width="16" height="8" rx="1.5" fill="#88C8E8" opacity=".8" />
          ))}
          <rect x="248" y="123" width="120" height="26" rx="3" fill="#E8E8E8" />
          <rect x="248" y="125" width="120" height="20" rx="2" fill="#D0D4D8" />
          <rect x="248" y="135" width="120" height="8" fill="#2D8C4E" />
          {[256,276,296,316,336].map((wx,i) => (
            <rect key={`tw3-${i}`} x={wx} y="126" width="16" height="8" rx="1.5" fill="#88C8E8" opacity=".8" />
          ))}
          <rect x="372" y="123" width="120" height="26" rx="6" fill="#E8E8E8" />
          <rect x="372" y="125" width="120" height="20" rx="4" fill="#D0D4D8" />
          <rect x="372" y="135" width="120" height="8" fill="#2D8C4E" />
          <path d="M504 125 Q508 137 504 145 L492 145 L492 125Z" fill="#C8CCD0" />
          <circle cx="500" cy="131" r="2.5" fill="#FF4040" opacity=".7" />
          {[380,400,420,440,460].map((wx,i) => (
            <rect key={`tw4-${i}`} x={wx} y="126" width="16" height="8" rx="1.5" fill="#88C8E8" opacity=".8" />
          ))}
          {[10,50,90,134,174,214,258,298,338,382,422,462].map((wx,i) => (
            <circle key={`wh-${i}`} cx={wx} cy="149" r="3" fill="#555" />
          ))}
        </g>

        {/* Catenary wires */}
        <line x1="-20" y1="115" x2="1020" y2="115" stroke="#888" strokeWidth="1" opacity=".3" />
        {[100,300,500,700,900].map((px,i) => (
          <line key={`cat-${i}`} x1={px} y1="115" x2={px} y2="141" stroke="#888" strokeWidth="1" opacity=".25" />
        ))}

        {/* ── Ticket gates ── */}
        {[300,340,380,420,460,500,540,580].map((gx,i) => (
          <g key={`tg-${i}`}>
            <rect x={gx} y="430" width="32" height="6" rx="1" fill="#D0D4D8" />
            <rect x={gx+2} y="436" width="4" height="18" rx="1" fill="#B0B4B8" />
            <rect x={gx+26} y="436" width="4" height="18" rx="1" fill="#B0B4B8" />
            <rect x={gx+10} y="432" width="12" height="4" rx="1" fill="#40A0E0" opacity=".5" />
          </g>
        ))}

        {/* ── Vending machines ── */}
        {[[880,410,"#D04040"],[900,410,"#4070D0"],[920,410,"#40A060"]].map(([x,y,c],i) => (
          <g key={`vm-${i}`}>
            <rect x={x as number} y={y as number} width="16" height="30" rx="2" fill={c as string} />
            <rect x={(x as number)+2} y={(y as number)+3} width="12" height="10" rx="1" fill="#E8E0D8" opacity=".5" />
          </g>
        ))}

        {/* ── Bus / Taxi ── */}
        <g transform="translate(140,445)">
          <rect x="0" y="0" width="4" height="30" rx="1" fill="#707070" />
          <rect x="-8" y="-2" width="20" height="14" rx="2" fill="#3A6080" />
          <text x="2" y="9" textAnchor="middle" fontSize="4" fill="white" fontWeight="bold">BUS</text>
        </g>
        <g transform="translate(60,448)">
          <rect x="0" y="0" width="4" height="24" rx="1" fill="#707070" />
          <rect x="-12" y="-3" width="28" height="14" rx="2" fill="#E8C020" />
          <text x="2" y="8" textAnchor="middle" fontSize="5" fill="#2A2A2A" fontWeight="bold">TAXI</text>
        </g>

        {/* Crosswalk */}
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
          <rect key={`scw-${i}`} x={350+i*14} y="480" width="9" height="60" rx="1" fill="white" opacity=".25" />
        ))}

        {/* Street lamps */}
        {[[40,400],[250,405],[500,400],[750,405],[940,400]].map(([lx,ly],i) => (
          <g key={`slamp-${i}`} transform={`translate(${lx},${ly})`}>
            <rect x="2" y="5" width="4" height="50" rx="2" fill="#707070" />
            <rect x="0" y="52" width="8" height="4" rx="2" fill="#606060" />
            <rect x="-6" y="0" width="20" height="6" rx="3" fill="#909090" />
            <rect x="-4" y="4" width="16" height="2" rx="1" fill="#FFF8E0" opacity=".5" />
            <circle cx="4" cy="3" r="7" fill="url(#n-glow)" />
          </g>
        ))}

        {/* Benches */}
        {[[100,460],[550,455],[850,460]].map(([bx,by],i) => (
          <g key={`sb-${i}`} transform={`translate(${bx},${by})`}>
            <rect x="0" y="5" width="45" height="3" rx="1" fill="#A0A0A0" />
            <rect x="2" y="-2" width="41" height="3" rx="1" fill="#B0B0B0" />
            <rect x="5" y="8" width="4" height="10" rx="1" fill="#808080" />
            <rect x="36" y="8" width="4" height="10" rx="1" fill="#808080" />
          </g>
        ))}
      </g>

      {/* ═══ ATMOSPHERE ═══ */}
      <rect y="175" width="4000" height="725" fill="url(#n-atmo)" />
      {/* Subtle light rays from top-left */}
      <rect x="0" y="175" width="600" height="300" fill="rgba(255,250,230,0.03)" />
      <rect x="200" y="175" width="400" height="200" fill="rgba(255,248,220,0.02)" />
      {/* Ground-level atmospheric haze */}
      <rect y="780" width="4000" height="120" fill="rgba(200,210,190,0.04)" />
    </svg>
  );
}
