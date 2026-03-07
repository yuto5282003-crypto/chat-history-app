"use client";

/**
 * ParallaxPark — 2.8D parallax background for the SLOTY plaza.
 *
 * Three layers at different scroll speeds:
 *   FarLayer  (0.3×) — sky, clouds, distant city silhouettes
 *   MidLayer  (0.6×) — hills, distant tree lines
 *   NearLayer (1.0×) — ground, paths, structures, all walkable details
 *
 * World is 4× viewport wide with four areas:
 *   Left       (0-1000)  — Café front
 *   Center-L   (1000-2000) — Park / Fountain plaza
 *   Center-R   (2000-3000) — Shibuya-style City view
 *   Right      (3000-4000) — Station front
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

      {/* Distant city — sparse left, dense center-right (Shibuya), station right */}
      {/* Left — small café-area buildings */}
      <rect x="100" y="105" width="20" height="50" rx="2" fill="#C0C8D4" opacity=".12" />
      <rect x="130" y="115" width="15" height="40" rx="2" fill="#B8C0CC" opacity=".10" />
      {/* Center — scattered park buildings */}
      <rect x="1200" y="100" width="18" height="45" rx="2" fill="#C0C8D4" opacity=".12" />
      <rect x="1700" y="105" width="14" height="40" rx="1" fill="#CCD4DC" opacity=".10" />
      {/* City view — dense Shibuya-style Tokyo skyline */}
      {[
        [2100,55,30,105,.22],[2140,70,22,90,.20],[2170,45,18,115,.24],
        [2200,65,28,95,.19],[2240,40,22,120,.22],[2270,60,30,100,.20],
        [2310,50,18,110,.23],[2340,75,26,85,.18],[2380,55,22,105,.21],
        [2420,65,32,95,.19],[2460,45,24,115,.22],[2500,80,20,80,.17],
        [2530,60,28,100,.20],[2570,70,22,90,.18],[2600,85,36,75,.16],
        [2650,75,24,85,.17],[2700,90,20,70,.14],
      ].map(([x,y,w,h,o],i) => (
        <rect key={`sk-${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#B0B8C8" opacity={o} />
      ))}
      {/* Tokyo Tower hint */}
      <rect x="2350" y="20" width="10" height="140" rx="1" fill="#C0A0A0" opacity=".18" />
      <polygon points="2345,20 2365,20 2355,5" fill="#C0A0A0" opacity=".15" />

      {/* Station area — mid-rise buildings */}
      {[
        [3150,80,22,80,.16],[3200,70,28,90,.18],[3260,90,20,70,.14],
        [3320,75,24,85,.17],[3400,85,18,75,.15],[3500,80,20,80,.14],
        [3580,90,15,70,.12],[3650,95,18,65,.11],
      ].map(([x,y,w,h,o],i) => (
        <rect key={`sks-${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#B8C0CC" opacity={o} />
      ))}

      {/* Birds */}
      {[[420,100],[1500,85],[2300,75],[2500,90],[3300,80]].map(([x,y],i) => (
        <path key={`b-${i}`} d={`M${x} ${y} Q${x+4} ${y-6} ${x+8} ${y}`} stroke="#888" strokeWidth="1" fill="none" opacity={.25-.02*i} />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   MID LAYER — hills, distant tree lines
   ═══════════════════════════════════════════ */
export function MidLayer() {
  return (
    <svg viewBox="0 0 4000 900" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Rolling hills */}
      {[
        [300,170,200,40,.30],[700,165,180,38,.25],[1100,170,200,42,.28],
        [1500,165,220,40,.25],[1900,172,190,38,.27],[2300,168,200,40,.25],
        [2700,170,180,38,.28],[3100,168,200,40,.27],[3500,172,180,38,.25],
        [3900,170,160,36,.22],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`h-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#A8D090" opacity={o} />
      ))}
      {/* Distant tree line */}
      {[
        [200,168,50,22,.35],[400,165,40,18,.30],[700,168,45,20,.32],
        [1000,166,42,19,.28],[1300,168,48,21,.33],[1600,165,38,17,.28],
        [1900,170,44,19,.30],[2200,167,40,18,.27],[2500,168,42,19,.30],
        [2800,170,36,16,.25],[3100,168,40,18,.28],[3400,170,38,17,.25],
        [3700,168,34,16,.22],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`t-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#88B870" opacity={o} />
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
        <radialGradient id="n-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,240,200,0.6)" /><stop offset="100%" stopColor="rgba(255,240,200,0)" />
        </radialGradient>
        <filter id="n-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity=".08" />
        </filter>
        <linearGradient id="n-atmo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(200,220,240,0.10)" />
          <stop offset="40%" stopColor="rgba(200,220,240,0)" />
          <stop offset="100%" stopColor="rgba(80,100,60,0.06)" />
        </linearGradient>
      </defs>

      {/* ═══ GROUND ═══ */}
      <rect y="175" width="4000" height="725" fill="url(#n-grass)" />
      {[
        [300,500,120,30,.2],[800,600,100,25,.18],[1500,420,140,35,.2],
        [2000,550,110,28,.18],[2500,650,120,30,.16],[1200,700,130,32,.15],
        [500,350,80,22,.12],[1800,300,90,24,.12],[2600,400,100,26,.14],
        [3200,500,110,28,.16],[3600,600,100,25,.14],[3400,350,80,22,.12],
      ].map(([cx,cy,rx,ry,o],i) => (
        <ellipse key={`gt-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#n-gl)" opacity={o} />
      ))}
      <ellipse cx="2000" cy="700" rx="300" ry="80" fill="url(#n-gd)" opacity=".2" />

      {/* ═══ MAIN CONNECTING PATH — full width ═══ */}
      <path
        d="M0 500 Q250 488 500 494 Q750 500 1000 498 Q1250 502 1500 498 Q1750 494 2000 498 Q2250 502 2500 494 Q2750 488 3000 500 Q3250 508 3500 496 Q3750 490 4000 500
           L4000 530 Q3750 520 3500 526 Q3250 538 3000 530 Q2750 518 2500 524 Q2250 532 2000 528 Q1750 524 1500 528 Q1250 532 1000 528 Q750 530 500 524 Q250 518 0 530Z"
        fill="url(#n-path)" opacity=".85"
      />
      <path
        d="M0 530 Q250 518 500 524 Q750 530 1000 528 Q1250 532 1500 528 Q1750 524 2000 528 Q2250 532 2500 524 Q2750 518 3000 530 Q3250 538 3500 526 Q3750 520 4000 530
           L4000 537 Q3750 527 3500 533 Q3250 545 3000 537 Q2750 525 2500 531 Q2250 539 2000 535 Q1750 531 1500 535 Q1250 539 1000 535 Q750 537 500 531 Q250 525 0 537Z"
        fill="url(#n-pe)" opacity=".5"
      />

      {/* ══════════════════════════════════════
           AREA 1 — Café front (0-1000)
         ══════════════════════════════════════ */}

      {/* Café building */}
      <g filter="url(#n-sh)">
        <rect x="250" y="230" width="220" height="130" rx="4" fill="url(#n-wall)" />
        <path d="M240 232 L360 200 L480 232Z" fill="url(#n-roof)" />
        <path d="M240 232 L480 232 L478 240 L242 240Z" fill="#C07070" opacity=".5" />
        <rect x="275" y="260" width="35" height="30" rx="3" fill="#B8D8E8" opacity=".7" />
        <rect x="325" y="260" width="35" height="30" rx="3" fill="#B8D8E8" opacity=".7" />
        <rect x="380" y="260" width="35" height="30" rx="3" fill="#B8D8E8" opacity=".7" />
        <line x1="292" y1="260" x2="292" y2="290" stroke="#D8D0C4" strokeWidth="1" />
        <line x1="342" y1="260" x2="342" y2="290" stroke="#D8D0C4" strokeWidth="1" />
        <line x1="397" y1="260" x2="397" y2="290" stroke="#D8D0C4" strokeWidth="1" />
        <rect x="330" y="310" width="55" height="50" rx="3" fill="#A07050" />
        <rect x="333" y="313" width="23" height="44" rx="2" fill="#B88060" />
        <rect x="359" y="313" width="23" height="44" rx="2" fill="#B88060" />
        <circle cx="354" cy="340" r="2" fill="#D4A57A" />
        <rect x="285" y="215" width="80" height="18" rx="3" fill="#E8D0B8" />
        <text x="325" y="228" textAnchor="middle" fontSize="9" fill="#8B6040" fontWeight="bold">CAFÉ</text>
      </g>

      {/* Awning */}
      <path d="M248 358 L472 358 L466 372 L254 372Z" fill="#E8A0A0" opacity=".65" />
      <path d="M252 372 L468 372 L464 378 L256 378Z" fill="#C88080" opacity=".5" />

      {/* Outdoor tables */}
      {[[340,420],[440,410],[540,430]].map(([tx,ty],i) => (
        <g key={`ct-${i}`}>
          <ellipse cx={tx} cy={ty} rx="18" ry="9" fill="#F0E8DC" />
          <rect x={tx-2} y={ty-1} width="4" height="14" rx="1" fill="#C8B898" />
          <rect x={tx-18} y={ty-4} width="10" height="10" rx="2" fill="#D4A57A" />
          <rect x={tx+8} y={ty-4} width="10" height="10" rx="2" fill="#D4A57A" />
          <rect x={tx-1} y={ty-32} width="2" height="32" fill="#AAA" />
          <ellipse cx={tx} cy={ty-32} rx="20" ry="7" fill={i%2===0 ? "#E88888" : "#B8A0D8"} opacity=".6" />
        </g>
      ))}

      {/* Flower boxes */}
      {[270,320,370,420].map((fx,i) => (
        <g key={`fb-${i}`}>
          <rect x={fx} y="354" width="30" height="10" rx="2" fill="#8B7355" opacity=".6" />
          {[0,8,16,24].map((d,j) => (
            <circle key={j} cx={fx+3+d} cy={352-j%2*2} r="3" fill={j%2===0 ? "#F3A7C6" : "#B79DFF"} opacity=".7" />
          ))}
        </g>
      ))}

      {/* String lights */}
      <path d="M270 365 Q350 380 430 365 Q510 380 590 365" stroke="#D4A57A" strokeWidth="1" fill="none" opacity=".4" />
      {[290,320,350,380,410,440,470,500,530,560].map((lx,i) => (
        <circle key={`sl-${i}`} cx={lx} cy={370+Math.sin(i*.7)*4} r="2" fill="#FFF0C8" opacity=".6" />
      ))}

      <ellipse cx="400" cy="420" rx="120" ry="50" fill="#E8D8C0" opacity=".25" />

      {/* Trees — café */}
      {[[100,380,42,36,"n-ta"],[800,390,38,32,"n-tb"]].map(([x,y,rx,ry,g],i) => (
        <g key={`ctr-${i}`}>
          <rect x={(x as number)-5} y={y as number} width="10" height="42" rx="4" fill="#8B7355" />
          <ellipse cx={x as number} cy={(y as number)-15} rx={rx as number} ry={ry as number} fill={`url(#${g})`} />
          <ellipse cx={(x as number)-8} cy={(y as number)-22} rx="14" ry="11" fill="#88CC72" opacity=".4" />
        </g>
      ))}

      {/* Benches — café */}
      {[[650,470],[160,480]].map(([bx,by],i) => (
        <g key={`cb-${i}`} transform={`translate(${bx},${by})`}>
          <rect x="0" y="5" width="40" height="3" rx="1" fill="#D4A57A" />
          <rect x="2" y="-2" width="36" height="3" rx="1" fill="#D4A57A" />
          <rect x="4" y="8" width="3" height="11" rx="1" fill="#A67B52" />
          <rect x="33" y="8" width="3" height="11" rx="1" fill="#A67B52" />
        </g>
      ))}

      {/* Lamp posts — café */}
      {[[200,390],[600,380]].map(([lx,ly],i) => (
        <g key={`cl-${i}`} transform={`translate(${lx},${ly})`}>
          <rect x="3" y="10" width="3" height="40" rx="1" fill="#8A8A8A" />
          <rect x="1" y="46" width="7" height="4" rx="1.5" fill="#7A7A7A" />
          <path d="M0 10 Q4.5 4 9 10" fill="#E8E0D0" />
          <circle cx="4.5" cy="8" r="5" fill="url(#n-glow)" />
          <circle cx="4.5" cy="8" r="2.5" fill="#FFF8E8" opacity=".7" />
        </g>
      ))}

      <path d="M350 360 Q360 420 370 470 Q380 498 400 510 L416 505 Q396 493 386 465 Q376 415 366 358Z" fill="url(#n-path)" opacity=".6" />

      {/* ══════════════════════════════════════
           AREA 2 — Fountain park (1000-2000)
         ══════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════
           AREA 3 — Shibuya City view (2000-3000)
         ══════════════════════════════════════ */}
      <g transform="translate(2000,0)">
        {/* Paved area */}
        <ellipse cx="500" cy="440" rx="180" ry="70" fill="url(#n-pave)" opacity=".3" />
        <rect x="300" y="400" width="400" height="120" rx="8" fill="url(#n-pave)" opacity=".2" />

        {/* Large billboard / Screen */}
        <g transform="translate(350,220)">
          <rect x="0" y="0" width="140" height="70" rx="4" fill="#1A1A2E" />
          <rect x="3" y="3" width="134" height="64" rx="3" fill="#2A2A4E" />
          <rect x="6" y="6" width="62" height="58" rx="2" fill="#6644AA" opacity=".45" />
          <rect x="72" y="6" width="62" height="27" rx="2" fill="#AA4466" opacity=".45" />
          <rect x="72" y="36" width="62" height="28" rx="2" fill="#44AA66" opacity=".45" />
          <text x="37" y="40" textAnchor="middle" fontSize="10" fill="#E0D0FF" opacity=".7" fontWeight="bold">SLOTY</text>
          {/* Glow effect */}
          <rect x="-8" y="-8" width="156" height="86" rx="8" fill="none" stroke="#6644AA" strokeWidth="1" opacity=".15" />
        </g>

        {/* Neon signs */}
        <rect x="180" y="298" width="50" height="14" rx="4" fill="#FF6090" opacity=".35" />
        <text x="205" y="309" textAnchor="middle" fontSize="8" fill="#FF6090" opacity=".6" fontWeight="bold">OPEN</text>
        <rect x="720" y="305" width="55" height="14" rx="4" fill="#60AAFF" opacity=".35" />
        <text x="747" y="316" textAnchor="middle" fontSize="8" fill="#60AAFF" opacity=".6" fontWeight="bold">BAR</text>
        <rect x="550" y="295" width="45" height="12" rx="3" fill="#FFAA40" opacity=".3" />
        <text x="572" y="305" textAnchor="middle" fontSize="7" fill="#FFAA40" opacity=".5" fontWeight="bold">24H</text>

        {/* Crosswalk stripes */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={`cw-${i}`} x={430+i*14} y="494" width="9" height="28" rx="1" fill="white" opacity=".2" />
        ))}

        {/* Observation railing */}
        <g transform="translate(300,280)">
          <rect x="0" y="20" width="400" height="6" rx="2" fill="#B8B0A8" />
          <rect x="0" y="14" width="400" height="4" rx="1" fill="#D0C8C0" />
          {[0,50,100,150,200,250,300,350,400].map((px,i) => (
            <rect key={i} x={px-2} y="0" width="4" height="26" rx="1" fill="#C0B8B0" />
          ))}
          <line x1="0" y1="6" x2="400" y2="6" stroke="#D8D0C8" strokeWidth="2" />
        </g>

        {/* Urban trees */}
        {[[200,360],[750,370]].map(([tx,ty],i) => (
          <g key={`ut-${i}`}>
            <rect x={(tx as number)-18} y={(ty as number)+15} width="36" height="20" rx="2" fill="#B0A898" />
            <rect x={(tx as number)-16} y={(ty as number)+13} width="32" height="18" rx="2" fill="#C8C0B4" />
            <rect x={(tx as number)-4} y={(ty as number)-25} width="8" height="40" rx="3" fill="#8B7355" />
            <ellipse cx={tx as number} cy={(ty as number)-45} rx="30" ry="28" fill={`url(#n-t${i%2===0 ? "a" : "b"})`} />
          </g>
        ))}

        {/* Modern benches */}
        {[[350,390],[500,385],[650,395]].map(([bx,by],i) => (
          <g key={`mb-${i}`} transform={`translate(${bx},${by})`}>
            <rect x="0" y="0" width="50" height="4" rx="2" fill="#A09890" />
            <rect x="0" y="-6" width="50" height="4" rx="2" fill="#B0A8A0" />
            <rect x="5" y="4" width="4" height="10" rx="1" fill="#909090" />
            <rect x="41" y="4" width="4" height="10" rx="1" fill="#909090" />
          </g>
        ))}

        {/* Modern street lamps */}
        {[[150,340],[450,330],[800,340]].map(([lx,ly],i) => (
          <g key={`ml-${i}`} transform={`translate(${lx},${ly})`}>
            <rect x="2" y="5" width="4" height="50" rx="2" fill="#909090" />
            <rect x="0" y="52" width="8" height="4" rx="2" fill="#808080" />
            <rect x="-4" y="0" width="16" height="6" rx="3" fill="#C0C0C0" />
            <rect x="-2" y="4" width="12" height="2" rx="1" fill="#FFF8E0" opacity=".5" />
            <circle cx="4" cy="3" r="6" fill="url(#n-glow)" />
          </g>
        ))}

        {/* Flower bed */}
        <ellipse cx="500" cy="470" rx="60" ry="18" fill="#5DA34A" opacity=".2" />
        {[[470,466],[485,463],[500,465],[515,462],[530,466]].map(([fx,fy],i) => (
          <circle key={`cf-${i}`} cx={fx} cy={fy} r="3.5" fill={i%2===0 ? "#F3A7C6" : "#9B8AFB"} opacity=".7" />
        ))}

        <path d="M480 500 Q490 420 500 350 Q510 300 520 290 L536 295 Q526 305 516 355 Q506 425 496 505Z" fill="url(#n-path)" opacity=".6" />

        {/* Tree lower area */}
        <g>
          <rect x="865" y="560" width="10" height="40" rx="4" fill="#8B7355" />
          <ellipse cx="870" cy="540" rx="35" ry="30" fill="url(#n-ta)" />
        </g>
      </g>

      {/* ══════════════════════════════════════
           AREA 4 — Station front (3000-4000)
         ══════════════════════════════════════ */}
      <g transform="translate(3000,0)">
        {/* Station building */}
        <g filter="url(#n-sh)">
          <rect x="250" y="220" width="280" height="140" rx="4" fill="url(#n-wall)" />
          <rect x="240" y="214" width="300" height="12" rx="3" fill="#808890" />
          <rect x="235" y="210" width="310" height="8" rx="2" fill="#909AA0" />
          {/* Windows */}
          <rect x="270" y="245" width="55" height="45" rx="3" fill="#A0C8E0" opacity=".7" />
          <rect x="340" y="245" width="55" height="45" rx="3" fill="#A0C8E0" opacity=".7" />
          <rect x="410" y="245" width="55" height="45" rx="3" fill="#A0C8E0" opacity=".7" />
          <line x1="297" y1="245" x2="297" y2="290" stroke="#C8D4DC" strokeWidth="1" />
          <line x1="367" y1="245" x2="367" y2="290" stroke="#C8D4DC" strokeWidth="1" />
          <line x1="437" y1="245" x2="437" y2="290" stroke="#C8D4DC" strokeWidth="1" />
          {/* Entrance */}
          <rect x="330" y="310" width="120" height="50" rx="4" fill="#6A8898" />
          <rect x="335" y="313" width="55" height="44" rx="2" fill="#88B0C8" opacity=".5" />
          <rect x="395" y="313" width="55" height="44" rx="2" fill="#88B0C8" opacity=".5" />
          <line x1="390" y1="313" x2="390" y2="357" stroke="#608090" strokeWidth="2" />
          {/* Sign */}
          <rect x="305" y="192" width="170" height="24" rx="4" fill="#3A6080" />
          <text x="390" y="209" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">SLOTY駅</text>
        </g>

        {/* Clock */}
        <circle cx="390" cy="240" r="14" fill="white" stroke="#606870" strokeWidth="2" />
        <circle cx="390" cy="240" r="1.5" fill="#404040" />
        <line x1="390" y1="230" x2="390" y2="240" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="390" y1="240" x2="398" y2="246" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

        {/* Platform canopy */}
        <rect x="200" y="362" width="380" height="6" rx="2" fill="#C0C8D0" opacity=".8" />
        {[220,300,380,460,540].map((px,i) => (
          <rect key={`cp-${i}`} x={px} y="368" width="5" height="38" rx="1" fill="#A0A8B0" />
        ))}

        {/* Ticket gates */}
        {[310,345,380,415].map((gx,i) => (
          <g key={`tg-${i}`}>
            <rect x={gx} y="408" width="25" height="6" rx="1" fill="#D0D4D8" />
            <rect x={gx+2} y="414" width="4" height="15" rx="1" fill="#B0B4B8" />
            <rect x={gx+19} y="414" width="4" height="15" rx="1" fill="#B0B4B8" />
          </g>
        ))}

        {/* Vending machines */}
        <rect x="650" y="378" width="22" height="38" rx="3" fill="#D04040" />
        <rect x="653" y="382" width="16" height="14" rx="1" fill="#E8E0D8" opacity=".6" />
        <rect x="653" y="400" width="6" height="4" rx="1" fill="#FFE0A0" opacity=".5" />
        <rect x="680" y="378" width="22" height="38" rx="3" fill="#4070D0" />
        <rect x="683" y="382" width="16" height="14" rx="1" fill="#E8E0D8" opacity=".6" />
        <rect x="683" y="400" width="6" height="4" rx="1" fill="#FFE0A0" opacity=".5" />

        {/* Benches */}
        {[[150,465],[600,460]].map(([bx,by],i) => (
          <g key={`sb-${i}`} transform={`translate(${bx},${by})`}>
            <rect x="0" y="5" width="45" height="3" rx="1" fill="#B0A898" />
            <rect x="2" y="-2" width="41" height="3" rx="1" fill="#C0B8A8" />
            <rect x="5" y="8" width="4" height="10" rx="1" fill="#909090" />
            <rect x="36" y="8" width="4" height="10" rx="1" fill="#909090" />
          </g>
        ))}

        {/* Trees */}
        {[[100,380],[800,390]].map(([tx,ty],i) => (
          <g key={`st-${i}`}>
            <rect x={(tx as number)-4} y={ty as number} width="8" height="38" rx="3" fill="#8B7355" />
            <ellipse cx={tx as number} cy={(ty as number)-18} rx="28" ry="24" fill={`url(#n-t${i%2===0?"a":"b"})`} />
          </g>
        ))}

        {/* Modern lamp posts */}
        {[[200,340],[500,330],[750,340]].map(([lx,ly],i) => (
          <g key={`slamp-${i}`} transform={`translate(${lx},${ly})`}>
            <rect x="2" y="5" width="4" height="50" rx="2" fill="#909090" />
            <rect x="0" y="52" width="8" height="4" rx="2" fill="#808080" />
            <rect x="-4" y="0" width="16" height="6" rx="3" fill="#C0C0C0" />
            <rect x="-2" y="4" width="12" height="2" rx="1" fill="#FFF8E0" opacity=".5" />
            <circle cx="4" cy="3" r="6" fill="url(#n-glow)" />
          </g>
        ))}

        {/* Path to station */}
        <path d="M400 500 Q400 450 390 400 Q385 370 390 360 L406 362 Q401 372 406 405 Q416 455 416 505Z" fill="url(#n-path)" opacity=".6" />

        {/* Bike rack */}
        <g transform="translate(130,430)">
          <rect x="0" y="8" width="50" height="2" rx="1" fill="#909090" />
          {[0,12,24,36].map((bx,i) => (
            <rect key={`br-${i}`} x={bx+3} y="0" width="2" height="10" rx="1" fill="#A0A0A0" />
          ))}
        </g>
      </g>

      {/* ═══ ATMOSPHERE ═══ */}
      <rect y="175" width="4000" height="725" fill="url(#n-atmo)" />
    </svg>
  );
}
