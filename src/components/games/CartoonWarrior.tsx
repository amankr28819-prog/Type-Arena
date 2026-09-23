import React from 'react';
import type { WarriorProfile } from '../../lib/warriors';

export type WarriorAnimation =
  | 'idle'
  | 'walk'
  | 'run'
  | 'turn'
  | 'attackAnticipation'
  | 'attack'
  | 'specialAttack'
  | 'attackRecovery'
  | 'block'
  | 'hit'
  | 'stagger'
  | 'victory'
  | 'defeat';

export type FacingDirection = 'left' | 'right' | 'back';

interface CartoonWarriorProps {
  warrior: WarriorProfile;
  animation: WarriorAnimation;
  facing?: FacingDirection;
  scale?: number;
  className?: string;
  isBot?: boolean;
}

export const CartoonWarrior: React.FC<CartoonWarriorProps> = ({
  warrior,
  animation,
  facing = 'right',
  scale = 1,
  className = '',
  isBot = false
}) => {
  const p = warrior.palette;
  const isFemale = warrior.gender === 'female';

  // CSS animation classes based on state
  const getAnimationClass = () => {
    switch (animation) {
      case 'idle':
        return 'animate-warrior-idle';
      case 'walk':
        return 'animate-warrior-walk';
      case 'run':
        return 'animate-warrior-run';
      case 'turn':
        return 'animate-warrior-turn';
      case 'attackAnticipation':
        return 'animate-warrior-anticipation';
      case 'attack':
        return 'animate-warrior-attack';
      case 'specialAttack':
        return 'animate-warrior-special';
      case 'attackRecovery':
        return 'animate-warrior-recovery';
      case 'block':
        return 'animate-warrior-block';
      case 'hit':
        return 'animate-warrior-hit';
      case 'stagger':
        return 'animate-warrior-stagger';
      case 'victory':
        return 'animate-warrior-victory';
      case 'defeat':
        return 'animate-warrior-defeat';
      default:
        return 'animate-warrior-idle';
    }
  };

  // Flip based on facing
  const isFlipped = facing === 'left';
  const isFacingBack = facing === 'back';

  // Unique SVG gradient IDs to avoid collisions
  const gradPrefix = `${warrior.id}-${isBot ? 'bot' : 'ply'}`;

  return (
    <div
      className={`relative inline-block select-none pointer-events-none transition-transform duration-150 ${className}`}
      style={{
        transform: `scale(${scale}) ${isFlipped ? 'scaleX(-1)' : 'scaleX(1)'}`,
        transformOrigin: 'bottom center',
        filter: isBot
          ? 'drop-shadow(0 8px 16px rgba(239, 68, 68, 0.35)) drop-shadow(0 0 6px rgba(251, 146, 60, 0.4))'
          : 'drop-shadow(0 8px 16px rgba(56, 189, 248, 0.35)) drop-shadow(0 0 6px rgba(14, 165, 233, 0.4))'
      }}
    >
      <svg
        viewBox="0 0 240 280"
        className={`w-48 sm:w-56 h-56 sm:h-64 overflow-visible ${getAnimationClass()}`}
      >
        <defs>
          {/* Key Light & Rim Light Gradients */}
          <linearGradient id={`${gradPrefix}-skin`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="30%" stopColor={p.skin} />
            <stop offset="100%" stopColor={p.skin} />
          </linearGradient>

          <linearGradient id={`${gradPrefix}-armor`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.highlight} stopOpacity="0.8" />
            <stop offset="25%" stopColor={p.primary} />
            <stop offset="85%" stopColor={p.dark} />
          </linearGradient>

          <linearGradient id={`${gradPrefix}-blade`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor={p.weaponBlade} />
            <stop offset="100%" stopColor={p.weaponGlow} />
          </linearGradient>

          <linearGradient id={`${gradPrefix}-cape`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.cape || p.secondary} />
            <stop offset="100%" stopColor={p.dark} />
          </linearGradient>

          {/* Glow Filters */}
          <filter id={`${gradPrefix}-weaponGlow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Ground Contact Shadow with Perspective Depth */}
        <ellipse
          cx="120"
          cy="268"
          rx="52"
          ry="12"
          fill="rgba(0,0,0,0.55)"
          className="warrior-ground-shadow"
        />

        {/* 2. Flowing Cape / Robe Back Layer (with secondary inertia physics) */}
        {p.cape && !isFacingBack && (
          <path
            d="M92 120 Q65 170 60 252 Q95 242 125 248 Q115 180 110 125 Z"
            fill={`url(#${gradPrefix}-cape)`}
            opacity="0.92"
            className="warrior-cape-physics"
          />
        )}

        {/* 3. Back-facing mode rendering */}
        {isFacingBack ? (
          <g id="warrior-back-rig">
            {/* Back Legs & Boots */}
            <path d="M96 175 L88 250 L108 252 L112 178 Z" fill={p.boots} />
            <path d="M128 175 L132 250 L152 252 L144 178 Z" fill={p.boots} />

            {/* Back Cloak / Armor Plate */}
            <path
              d="M84 105 Q120 95 156 105 L158 190 Q120 205 82 190 Z"
              fill={`url(#${gradPrefix}-armor)`}
              stroke={p.highlight}
              strokeWidth="2"
            />
            {/* Back Hair Cascading Down */}
            <path
              d="M92 50 Q120 40 148 50 Q160 90 145 140 Q120 160 95 140 Q80 90 92 50 Z"
              fill={p.hair}
              className="warrior-hair-secondary"
            />
          </g>
        ) : (
          <g id="warrior-front-rig">
            {/* 4. Legs & Footwear (Full-body visible head-to-toe) */}
            <g id="legs" className="warrior-legs">
              {/* Back Leg */}
              <path
                d="M94 170 L86 225 L84 258 L104 258 L108 220 L112 170 Z"
                fill={p.dark}
                stroke={p.highlight}
                strokeWidth="1.2"
              />
              {/* Back Boot Cuff & Heel */}
              <path d="M84 235 L106 232 L106 258 L82 258 Z" fill={p.boots} />

              {/* Front Leg (Dynamic warrior stance) */}
              <path
                d="M126 170 L134 220 L138 258 L160 258 L152 215 L144 170 Z"
                fill={p.primary}
                stroke={p.highlight}
                strokeWidth="1.5"
              />
              {/* Front Boot / Thigh-High Plated Boot with Gold Knee Guard */}
              <path d="M130 215 L154 212 L160 258 L136 258 Z" fill={p.boots} />
              <ellipse cx="142" cy="216" rx="8" ry="4" fill={p.highlight} />
            </g>

            {/* 5. Pelvis, Belt, and Hip Sash */}
            <g id="pelvis">
              <path
                d="M96 162 Q120 168 144 162 L142 182 Q120 192 98 182 Z"
                fill={p.dark}
              />
              {/* Ornate Belt with Buckle */}
              <rect x="94" y="158" width="52" height="9" rx="2" fill={p.belt} />
              <rect x="114" y="156" width="12" height="13" rx="2" fill={p.highlight} />
              {/* Side Sash Fabric with Secondary Sway */}
              <path
                d="M138 165 Q155 190 152 225 Q144 220 140 180 Z"
                fill={p.secondary}
                className="warrior-sash-secondary"
              />
            </g>

            {/* 6. Torso, Armor, and Cleavage / Neckline Rig */}
            <g id="torso" className="warrior-torso-rig">
              {isFemale ? (
                /* Adult Female Action Heroine Body (Curvy athletic silhouette, fitted corset, tasteful neckline) */
                <g id="female-torso">
                  {/* Fitted Combat Corset / Cuirass Body */}
                  <path
                    d="M100 114 Q120 110 140 114 L144 164 Q120 170 96 164 Z"
                    fill={`url(#${gradPrefix}-armor)`}
                    stroke={p.highlight}
                    strokeWidth="1.5"
                  />
                  {/* Curved Bust Volume & Secondary Physics Layer */}
                  <g className="warrior-bust-secondary">
                    {/* Left & Right bust contours */}
                    <path
                      d="M98 122 Q108 144 120 144 Q132 144 142 122 Q120 128 98 122 Z"
                      fill={`url(#${gradPrefix}-armor)`}
                      stroke={p.highlight}
                      strokeWidth="1.2"
                    />
                    {/* Tasteful V-neckline / Cleavage Shadow */}
                    <path
                      d="M112 114 Q120 132 128 114 Z"
                      fill={`url(#${gradPrefix}-skin)`}
                    />
                    <path
                      d="M118 120 L120 130 L122 120"
                      stroke={p.dark}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </g>
                  {/* Gold Filigree / Accent Ribs on Waist */}
                  <path d="M102 142 Q120 150 138 142" stroke={p.highlight} strokeWidth="1.5" fill="none" />
                  <path d="M104 152 Q120 160 136 152" stroke={p.highlight} strokeWidth="1.5" fill="none" />
                </g>
              ) : (
                /* Male Warrior Torso (Heavy Plate / Muscular V-Taper) */
                <g id="male-torso">
                  <path
                    d="M92 108 Q120 102 148 108 L142 165 Q120 172 98 165 Z"
                    fill={`url(#${gradPrefix}-armor)`}
                    stroke={p.highlight}
                    strokeWidth="1.8"
                  />
                  {/* Pectoral & Ab Armor Plates */}
                  <path d="M96 112 Q120 118 144 112 L140 138 Q120 144 100 138 Z" fill={p.primary} />
                  <line x1="120" y1="112" x2="120" y2="162" stroke={p.dark} strokeWidth="2" />
                  <line x1="102" y1="138" x2="138" y2="138" stroke={p.dark} strokeWidth="1.5" />
                </g>
              )}
            </g>

            {/* 7. Shoulders & Arms */}
            <g id="shoulders-arms">
              {/* Left/Back Arm & Pauldron */}
              <circle cx="94" cy="116" r="11" fill={p.highlight} />
              <path d="M88 122 L78 152 L92 154 L98 124 Z" fill={p.dark} />
              {/* Left Gauntlet */}
              <rect x="74" y="148" width="16" height="14" rx="3" fill={p.primary} stroke={p.highlight} strokeWidth="1" />

              {/* Right/Sword Arm & Pauldron */}
              <circle cx="146" cy="116" r="12" fill={p.highlight} />
              <path d="M142 122 L164 150 L178 142 L154 118 Z" fill={p.primary} />
              {/* Right Gauntlet */}
              <rect x="160" y="136" width="18" height="15" rx="3" fill={p.primary} stroke={p.highlight} strokeWidth="1.2" />
            </g>

            {/* 8. Head, Face & Hair (Expressive, Glamorous, High-Detail) */}
            <g id="head" className="warrior-head-rig">
              {/* Neck with Choker / Gorget */}
              <rect x="113" y="94" width="14" height="18" fill={`url(#${gradPrefix}-skin)`} />
              <rect x="112" y="104" width="16" height="5" fill={p.highlight} />

              {/* Head Base */}
              <path
                d="M104 60 Q120 48 136 60 Q142 82 134 98 Q120 110 106 98 Q98 82 104 60 Z"
                fill={`url(#${gradPrefix}-skin)`}
                stroke={p.dark}
                strokeWidth="0.8"
              />

              {/* Distinctive Facial Features */}
              <g id="face-features">
                {/* Eyes (Stylized with Eyeliner, Iris, and Highlights) */}
                <ellipse cx="127" cy="74" rx="4.5" ry="3" fill="#ffffff" />
                <circle cx="128" cy="74" r="2.2" fill={p.eyes} />
                <circle cx="129" cy="73" r="0.8" fill="#ffffff" />
                <path d="M122 71 Q128 68 133 71" stroke={p.dark} strokeWidth="1.4" fill="none" />

                {isFemale ? (
                  /* Glamorous Eyelashes & Polished Lips */
                  <>
                    <path d="M132 70 L135 68" stroke={p.dark} strokeWidth="1.2" />
                    {/* Eyebrow */}
                    <path d="M122 66 Q128 63 133 66" stroke={p.hair} strokeWidth="1.4" fill="none" />
                    {/* Nose */}
                    <path d="M125 76 L127 82 L124 83" stroke={p.dark} strokeWidth="0.8" fill="none" />
                    {/* Polished Lips */}
                    <path d="M122 89 Q126 92 130 89" stroke={p.lips || '#f43f5e'} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    {/* Chic Earring */}
                    <circle cx="107" cy="82" r="2" fill={p.highlight} />
                    <line x1="107" y1="84" x2="107" y2="90" stroke={p.highlight} strokeWidth="1" />
                  </>
                ) : (
                  /* Male Warrior Facial Scars / Strong Jaw / Beard if Thorin */
                  <>
                    <path d="M121 65 Q128 62 135 65" stroke={p.hair} strokeWidth="2" fill="none" />
                    <path d="M124 75 L128 82 L123 83" stroke={p.dark} strokeWidth="1.2" fill="none" />
                    <line x1="122" y1="90" x2="130" y2="90" stroke={p.dark} strokeWidth="2" />
                    {warrior.id === 'thorin' && (
                      <path d="M110 84 Q120 108 138 84 Q128 120 110 84 Z" fill={p.hair} />
                    )}
                  </>
                )}
              </g>

              {/* Dynamic Hair Rig with Multi-Segment Secondary Physics */}
              <g id="hair-rig" className="warrior-hair-secondary">
                {warrior.id === 'valeria' && (
                  /* Long Voluminous Crimson Locks flowing back with secondary bounce */
                  <path
                    d="M102 55 Q120 38 138 52 Q156 68 152 110 Q146 148 135 172 Q130 148 138 108 Q136 68 124 58 Q110 58 102 55 Z"
                    fill={p.hair}
                    stroke={p.highlight}
                    strokeWidth="0.8"
                  />
                )}

                {warrior.id === 'seraphina' && (
                  /* High Silver Ponytail bound by Gold Ribbon swaying dynamically */
                  <>
                    <path d="M102 55 Q120 40 138 52 Q144 65 138 74 Q120 62 102 55 Z" fill={p.hair} />
                    <circle cx="112" cy="46" r="4" fill={p.highlight} />
                    <path
                      d="M110 44 Q85 30 70 70 Q60 110 52 140 Q62 112 78 82 Q95 54 114 48 Z"
                      fill={p.hair}
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                  </>
                )}

                {warrior.id === 'lyra' && (
                  /* Stylized Plum Bob & Hood Cowl */
                  <path
                    d="M100 52 Q120 36 140 50 Q146 75 142 98 Q136 78 132 68 Q115 62 104 74 Q100 88 96 98 Q95 72 100 52 Z"
                    fill={p.hair}
                  />
                )}

                {warrior.id === 'morrigan' && (
                  /* Sophisticated Aristocratic Raven Chignon & Diadem */
                  <>
                    <path
                      d="M102 54 Q120 38 138 50 Q146 80 134 112 Q126 80 128 62 Q112 60 102 54 Z"
                      fill={p.hair}
                    />
                    <polygon points="116,46 120,40 124,46 128,40 132,46" fill={p.highlight} />
                  </>
                )}

                {/* Default Hair / Helmet for Male Heroes */}
                {!isFemale && (
                  <path
                    d="M100 54 Q120 40 140 52 Q144 75 138 90 Q120 62 100 54 Z"
                    fill={p.hair}
                    stroke={p.dark}
                    strokeWidth="1"
                  />
                )}
              </g>
            </g>

            {/* 9. Specialized Physical Weapons with Dynamic Glow */}
            <g id="weapon-rig" className="warrior-sword-rig" filter={`url(#${gradPrefix}-weaponGlow)`}>
              {warrior.weaponType === 'rapier' && (
                /* Slender Runic Estoc Rapier with Cup Hilt & Long Blade */
                <g transform="translate(170, 140) rotate(-35)">
                  <line x1="0" y1="0" x2="115" y2="0" stroke={`url(#${gradPrefix}-blade)`} strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="6" cy="0" rx="8" ry="12" fill={p.highlight} />
                  <rect x="-14" y="-3" width="14" height="6" rx="2" fill={p.weaponHandle} />
                  <circle cx="-16" cy="0" r="3.5" fill={p.highlight} />
                </g>
              )}

              {warrior.weaponType === 'katana' && (
                /* Curved Celestial Katana with Cyan Runes */
                <g transform="translate(170, 140) rotate(-40)">
                  <path d="M0 0 Q60 -8 118 4" stroke={`url(#${gradPrefix}-blade)`} strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <rect x="-4" y="-7" width="8" height="14" rx="2" fill={p.highlight} />
                  <rect x="-24" y="-3.5" width="20" height="7" rx="2" fill={p.weaponHandle} />
                </g>
              )}

              {warrior.weaponType === 'daggers' && (
                /* Twin Serrated Kamas / Daggers */
                <g transform="translate(170, 140) rotate(-30)">
                  <path d="M0 0 L45 -10 L55 -32 L40 -18 L0 0 Z" fill={`url(#${gradPrefix}-blade)`} stroke={p.highlight} strokeWidth="1" />
                  <rect x="-18" y="-3" width="18" height="6" rx="2" fill={p.weaponHandle} />
                </g>
              )}

              {warrior.weaponType === 'spear' && (
                /* Long Ravenwing Stiletto Spear */
                <g transform="translate(170, 140) rotate(-35)">
                  <line x1="-30" y1="0" x2="140" y2="0" stroke={p.weaponHandle} strokeWidth="4" />
                  <polygon points="140,-6 175,0 140,6 144,0" fill={`url(#${gradPrefix}-blade)`} stroke={p.highlight} strokeWidth="1" />
                  <path d="M136 4 Q132 16 124 24" stroke={p.highlight} strokeWidth="2" fill="none" />
                </g>
              )}

              {warrior.weaponType === 'broadsword' && (
                /* Great broadsword & Crossguard */
                <g transform="translate(170, 140) rotate(-35)">
                  <polygon points="0,-4 105,-4 116,0 105,4 0,4" fill={`url(#${gradPrefix}-blade)`} stroke={p.highlight} strokeWidth="1" />
                  <rect x="-4" y="-14" width="8" height="28" rx="2" fill={p.highlight} />
                  <rect x="-22" y="-3" width="18" height="6" rx="2" fill={p.weaponHandle} />
                  <circle cx="-25" cy="0" r="4" fill={p.highlight} />
                </g>
              )}

              {warrior.weaponType === 'scimitars' && (
                /* Dual Dune Scimitars */
                <g transform="translate(170, 140) rotate(-40)">
                  <path d="M0 0 Q50 -18 90 -4 Q50 6 0 0 Z" fill={`url(#${gradPrefix}-blade)`} stroke={p.highlight} strokeWidth="1" />
                  <rect x="-16" y="-3" width="16" height="6" rx="2" fill={p.weaponHandle} />
                </g>
              )}

              {warrior.weaponType === 'axes' && (
                /* Heavy Bearded Waraxe */
                <g transform="translate(170, 140) rotate(-35)">
                  <line x1="-15" y1="0" x2="90" y2="0" stroke={p.weaponHandle} strokeWidth="5" />
                  <path d="M65 -5 Q95 -32 98 -2 Q90 28 65 6 Z" fill={`url(#${gradPrefix}-blade)`} stroke={p.highlight} strokeWidth="1.2" />
                </g>
              )}

              {warrior.weaponType === 'claymore' && (
                /* Heavy Magma Claymore with Fire Aura */
                <g transform="translate(170, 140) rotate(-35)">
                  <polygon points="0,-7 120,-7 134,0 120,7 0,7" fill={`url(#${gradPrefix}-blade)`} stroke={p.highlight} strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="115" y2="0" stroke="#fef08a" strokeWidth="2" />
                  <rect x="-5" y="-18" width="10" height="36" rx="3" fill={p.highlight} />
                  <rect x="-28" y="-4" width="24" height="8" rx="2" fill={p.weaponHandle} />
                </g>
              )}
            </g>

            {/* 10. Slash Arc Visual Trail (Active during attack swing) */}
            {(animation === 'attack' || animation === 'specialAttack') && (
              <path
                d="M140 60 A85 85 0 0 1 245 160"
                fill="none"
                stroke={p.weaponGlow}
                strokeWidth={animation === 'specialAttack' ? '12' : '6'}
                strokeLinecap="round"
                opacity="0.88"
                className="animate-slash-arc"
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
