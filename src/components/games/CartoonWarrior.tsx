import React from 'react';

export type WarriorType = 'player' | 'bot-1' | 'bot-2' | 'bot-3';
export type WarriorAnimation = 'idle' | 'attack' | 'specialAttack' | 'hit' | 'block' | 'victory' | 'defeat';

interface CartoonWarriorProps {
  type: WarriorType;
  animation: WarriorAnimation;
  isFlipped?: boolean;
  scale?: number;
  className?: string;
}

export const CartoonWarrior: React.FC<CartoonWarriorProps> = ({
  type,
  animation,
  isFlipped = false,
  scale = 1,
  className = ''
}) => {
  // Theme color palettes based on character type
  const getColors = () => {
    switch (type) {
      case 'player':
        return {
          primary: '#38bdf8', // Cyan
          secondary: '#0284c7',
          armor: '#334155', // Slate armor
          highlight: '#f8fafc',
          trim: '#fbbf24', // Gold trim
          skin: '#ffedd5',
          blade: '#e0f2fe',
          bladeGlow: '#38bdf8',
          cape: '#0ea5e9'
        };
      case 'bot-1': // Iron Vanguard
        return {
          primary: '#d97706', // Bronze
          secondary: '#78350f',
          armor: '#57534e', // Iron stone
          highlight: '#f59e0b',
          trim: '#b45309',
          skin: '#fed7aa',
          blade: '#d6d3d1',
          bladeGlow: '#f59e0b',
          cape: '#92400e'
        };
      case 'bot-2': // Shadow Blademaster
        return {
          primary: '#a855f7', // Purple
          secondary: '#6b21a8',
          armor: '#1e1b4b', // Obsidian
          highlight: '#c084fc',
          trim: '#e11d48', // Crimson accent
          skin: '#e2e8f0',
          blade: '#f43f5e', // Crimson sabers
          bladeGlow: '#fb7185',
          cape: '#4c1d95'
        };
      case 'bot-3': // Ignis the Arena Overlord
        return {
          primary: '#ef4444', // Magma Red
          secondary: '#991b1b',
          armor: '#18181b', // Obsidian Titan
          highlight: '#f97316', // Lava orange
          trim: '#ea580c',
          skin: '#7f1d1d',
          blade: '#fbbf24', // Flaming edge
          bladeGlow: '#ef4444',
          cape: '#b91c1c'
        };
    }
  };

  const c = getColors();

  // CSS Animation classes for SVG groups
  const getAnimationClass = () => {
    switch (animation) {
      case 'idle':
        return 'animate-warrior-idle';
      case 'attack':
        return 'animate-warrior-attack';
      case 'specialAttack':
        return 'animate-warrior-special';
      case 'hit':
        return 'animate-warrior-hit';
      case 'block':
        return 'animate-warrior-block';
      case 'victory':
        return 'animate-warrior-victory';
      case 'defeat':
        return 'animate-warrior-defeat';
    }
  };

  return (
    <div
      className={`relative inline-block select-none pointer-events-none transition-transform duration-200 ${className}`}
      style={{
        transform: `scaleX(${isFlipped ? -scale : scale}) scaleY(${scale})`,
        transformOrigin: 'bottom center'
      }}
    >
      <svg
        viewBox="0 0 200 240"
        className={`w-48 h-60 overflow-visible ${getAnimationClass()}`}
      >
        <defs>
          {/* Blade glow filter */}
          <filter id={`glow-${type}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Slash trail gradient */}
          <linearGradient id={`slashGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.bladeGlow} stopOpacity="0" />
            <stop offset="60%" stopColor={c.bladeGlow} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Armor shine gradient */}
          <linearGradient id={`armorShine-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.armor} />
            <stop offset="50%" stopColor={c.highlight} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c.armor} />
          </linearGradient>
        </defs>

        {/* Dynamic Sword Slash Arc Trail (visible during attack) */}
        {(animation === 'attack' || animation === 'specialAttack') && (
          <path
            d="M 110,30 A 75,75 0 0,1 190,140"
            fill="none"
            stroke={`url(#slashGrad-${type})`}
            strokeWidth={animation === 'specialAttack' ? '18' : '10'}
            strokeLinecap="round"
            className="animate-slash-arc"
          />
        )}

        {/* Ground Shadow */}
        <ellipse cx="100" cy="225" rx="55" ry="12" fill="rgba(0,0,0,0.35)" />

        {/* Character Root Group */}
        <g id="warrior-body">
          {/* Cape */}
          <path
            d="M 85,115 Q 60,160 55,210 Q 80,215 105,210 Q 110,160 115,115 Z"
            fill={c.cape}
            opacity="0.9"
            className="origin-top transition-transform"
          />

          {/* Back Leg (Standing) */}
          <g id="leg-back">
            <rect x="75" y="175" width="16" height="40" rx="8" fill={c.secondary} />
            <path d="M 72,210 L 95,210 L 92,224 L 68,224 Z" fill="#1e293b" />
          </g>

          {/* Front Leg (Forward Stance) */}
          <g id="leg-front">
            <rect x="110" y="175" width="17" height="40" rx="8" fill={c.armor} />
            {/* Greave Armor */}
            <rect x="109" y="185" width="19" height="25" rx="6" fill={c.primary} />
            <path d="M 107,210 L 132,210 L 128,224 L 103,224 Z" fill="#0f172a" />
          </g>

          {/* Torso & Breastplate */}
          <g id="torso">
            <path
              d="M 80,105 L 120,105 L 125,175 L 75,175 Z"
              fill={`url(#armorShine-${type})`}
              stroke={c.trim}
              strokeWidth="2.5"
            />
            {/* Chest Emblem */}
            <circle cx="100" cy="135" r="9" fill={c.primary} />
            <polygon points="100,128 103,137 97,137" fill="#ffffff" />
            {/* Belt */}
            <rect x="74" y="165" width="52" height="10" rx="3" fill="#1e293b" />
            <rect x="94" y="163" width="12" height="14" rx="2" fill={c.trim} />
          </g>

          {/* Off-hand Shield or Guard Arm */}
          <g id="shield-arm">
            {type === 'player' ? (
              // Shield for player
              <g transform="translate(60, 115)">
                <path
                  d="M 0,0 L 25,-5 L 25,35 Q 12,50 0,40 Z"
                  fill={c.primary}
                  stroke={c.trim}
                  strokeWidth="2.5"
                />
                <circle cx="12" cy="20" r="5" fill="#ffffff" opacity="0.8" />
              </g>
            ) : (
              // Dual dagger or pauldron for bots
              <rect x="65" y="125" width="14" height="30" rx="6" fill={c.armor} />
            )}
          </g>

          {/* Head & Helmet */}
          <g id="head">
            {/* Neck */}
            <rect x="94" y="92" width="12" height="15" fill={c.skin} />

            {/* Helmet base */}
            <circle cx="100" cy="72" r="25" fill={c.armor} stroke={c.trim} strokeWidth="2.5" />

            {/* Visor Slit */}
            <path
              d="M 85,74 Q 100,78 115,74 Q 100,82 85,74 Z"
              fill="#0f172a"
              stroke={c.highlight}
              strokeWidth="1.5"
            />

            {/* Glowing Eye inside Visor */}
            <circle
              cx="103"
              cy="76"
              r="3.5"
              fill={c.bladeGlow}
              filter={`url(#glow-${type})`}
            />

            {/* Helmet Plume / Horns based on character */}
            {type === 'player' && (
              <path
                d="M 98,48 Q 115,30 135,35 Q 115,48 102,52 Z"
                fill={c.primary}
                filter={`url(#glow-${type})`}
              />
            )}
            {type === 'bot-1' && (
              // Horns
              <path
                d="M 80,60 Q 65,40 68,30 Q 82,45 88,58 Z M 120,60 Q 135,40 132,30 Q 118,45 112,58 Z"
                fill={c.trim}
              />
            )}
            {type === 'bot-2' && (
              // Ninja headband tails
              <path
                d="M 80,75 Q 55,70 45,85 Q 60,78 80,78 Z"
                fill={c.trim}
              />
            )}
            {type === 'bot-3' && (
              // Demonic crown / flames
              <path
                d="M 82,50 L 90,30 L 98,45 L 105,25 L 112,45 L 120,30 L 118,52 Z"
                fill="#f97316"
                filter={`url(#glow-${type})`}
              />
            )}
          </g>

          {/* Main Sword Arm & Animated Weapon */}
          <g id="weapon-arm" className="origin-[125px_115px]">
            {/* Shoulder Pauldron */}
            <ellipse cx="125" cy="115" rx="14" ry="11" fill={c.trim} stroke="#ffffff" strokeWidth="1" />

            {/* Forearm */}
            <rect x="120" y="122" width="14" height="28" rx="6" fill={c.armor} />

            {/* Hand Glove */}
            <circle cx="127" cy="154" r="8" fill="#1e293b" />

            {/* SWORD ASSET */}
            <g id="sword" transform="translate(127, 154) rotate(-35)">
              {/* Pommel */}
              <circle cx="0" cy="22" r="4.5" fill={c.trim} />

              {/* Hilt / Handle */}
              <rect x="-3" y="4" width="6" height="18" rx="2" fill="#78350f" />

              {/* Crossguard */}
              <rect x="-18" y="0" width="36" height="6" rx="2" fill={c.trim} stroke="#ffffff" strokeWidth="0.8" />

              {/* Glowing Blade */}
              <path
                d="M -7,0 L -5,-85 L 0,-102 L 5,-85 L 7,0 Z"
                fill={c.blade}
                stroke={c.bladeGlow}
                strokeWidth="2"
                filter={`url(#glow-${type})`}
              />

              {/* Full-length Blade Fuller (Center Groove) */}
              <line x1="0" y1="-2" x2="0" y2="-85" stroke={c.bladeGlow} strokeWidth="1.5" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
