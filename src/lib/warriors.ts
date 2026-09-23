export interface WarriorProfile {
  id: string;
  name: string;
  title: string;
  archetype: string;
  gender: 'female' | 'male';
  weaponName: string;
  weaponType: 'rapier' | 'katana' | 'daggers' | 'spear' | 'broadsword' | 'scimitars' | 'axes' | 'claymore';
  description: string;
  stats: {
    speed: number;   // Affects movement speed & attack windup speed
    power: number;   // Affects base strike damage
    defense: number; // Reduces incoming damage
    range: number;   // Attack reach distance in arena
  };
  passiveDescription: string;
  palette: {
    skin: string;
    hair: string;
    eyes: string;
    lips?: string;
    primary: string;    // Main armor/clothing color
    secondary: string;  // Accent/trim
    highlight: string;  // Specular sheen / gold trim
    dark: string;       // Deep shading
    weaponBlade: string;
    weaponGlow: string;
    weaponHandle: string;
    cape?: string;
    belt: string;
    boots: string;
  };
}

export const WARRIOR_ROSTER: WarriorProfile[] = [
  {
    id: 'valeria',
    name: 'Valeria',
    title: 'The Crimson Valkyrie',
    archetype: 'Glamorous Blade Duelist',
    gender: 'female',
    weaponName: 'Runic Estoc Rapier',
    weaponType: 'rapier',
    description: 'A confident, athletic master swordsman clad in fitted gold-gilded obsidian armor with flowing crimson hair. Blends lethal fencing precision with stunning arena presence.',
    stats: {
      speed: 92,
      power: 80,
      defense: 75,
      range: 84
    },
    passiveDescription: '+15% Critical hit chance when typing velocity exceeds 70 WPM.',
    palette: {
      skin: '#ffdfd0',
      hair: '#dc2626', // Crimson red
      eyes: '#38bdf8', // Azure blue eyes
      lips: '#f43f5e',
      primary: '#1e1b4b', // Deep indigo-obsidian fitted armor
      secondary: '#b91c1c', // Crimson sash
      highlight: '#fbbf24', // Gold filigree
      dark: '#0f172a',
      weaponBlade: '#f8fafc',
      weaponGlow: '#f43f5e',
      weaponHandle: '#b45309',
      cape: '#b91c1c',
      belt: '#b45309',
      boots: '#0f172a'
    }
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    title: 'The Moonlit Spellblade',
    archetype: 'Celestial Katana Heroine',
    gender: 'female',
    weaponName: 'Crescent Moon Katana',
    weaponType: 'katana',
    description: 'An elegant, curvy warrior with silver hair in a dynamic ponytail, sporting a midnight-blue battle corset, silver pauldrons, and a glowing celestial blade.',
    stats: {
      speed: 88,
      power: 85,
      defense: 70,
      range: 86
    },
    passiveDescription: 'Special attack energy meter charges 20% faster per completed word.',
    palette: {
      skin: '#ffe4e6',
      hair: '#e2e8f0', // Radiant silver
      eyes: '#a855f7', // Violet eyes
      lips: '#fb7185',
      primary: '#1e293b', // Midnight blue bodysuit
      secondary: '#06b6d4', // Cyan runes
      highlight: '#38bdf8', // Moonlight glow
      dark: '#090d16',
      weaponBlade: '#e0f2fe',
      weaponGlow: '#06b6d4',
      weaponHandle: '#1e293b',
      cape: '#0284c7',
      belt: '#0ea5e9',
      boots: '#0f172a'
    }
  },
  {
    id: 'lyra',
    name: 'Lyra',
    title: 'The Shadow Dancer',
    archetype: 'Agile Dual-Blade Assassin',
    gender: 'female',
    weaponName: 'Twin Obsidian Kamas',
    weaponType: 'daggers',
    description: 'A swift, glamorous rogue with dark plum hair and fitted leather combat gear. Excels at blindingly fast dashes, rapid strikes, and dodging incoming blows.',
    stats: {
      speed: 97,
      power: 74,
      defense: 65,
      range: 68
    },
    passiveDescription: '25% faster arena movement speed and smoother dodge transitions.',
    palette: {
      skin: '#fed7aa',
      hair: '#581c87', // Deep violet-plum
      eyes: '#ec4899', // Magenta eyes
      lips: '#e11d48',
      primary: '#18181b', // Matte black leather
      secondary: '#7c3aed', // Purple ribbons
      highlight: '#c084fc', // Violet highlights
      dark: '#09090b',
      weaponBlade: '#cbd5e1',
      weaponGlow: '#a855f7',
      weaponHandle: '#3f3f46',
      cape: '#6b21a8',
      belt: '#a855f7',
      boots: '#18181b'
    }
  },
  {
    id: 'morrigan',
    name: 'Morrigan',
    title: 'The Raven Duelist',
    archetype: 'Long-Reach Aristocrat',
    gender: 'female',
    weaponName: 'Ravenwing Stiletto Spear',
    weaponType: 'spear',
    description: 'A poised noblewoman warrior in a split emerald duel coat with raven-feather shoulder mantles. Keeps opponents at distance with lightning-fast thrusts.',
    stats: {
      speed: 84,
      power: 82,
      defense: 78,
      range: 96
    },
    passiveDescription: 'Longest weapon reach in the arena and +10% parry damage reduction.',
    palette: {
      skin: '#fef3c7',
      hair: '#172554', // Midnight raven
      eyes: '#10b981', // Emerald eyes
      lips: '#f43f5e',
      primary: '#064e3b', // Deep emerald coat
      secondary: '#047857', // Forest green
      highlight: '#34d399', // Jade trim
      dark: '#022c22',
      weaponBlade: '#f1f5f9',
      weaponGlow: '#10b981',
      weaponHandle: '#064e3b',
      cape: '#065f46',
      belt: '#059669',
      boots: '#022c22'
    }
  },
  {
    id: 'galahad',
    name: 'Sir Galahad',
    title: 'The Iron Paladin',
    archetype: 'Heavy Armored Vanguard',
    gender: 'male',
    weaponName: 'Sunforged Greatsword',
    weaponType: 'broadsword',
    description: 'A towering paladin in polished steel plate armor with a lion crest tabard. High durability allows him to shrug off heavy hits and retaliate with crushing power.',
    stats: {
      speed: 68,
      power: 90,
      defense: 96,
      range: 82
    },
    passiveDescription: 'Inherent 25% passive reduction against all incoming damage.',
    palette: {
      skin: '#ffedd5',
      hair: '#78350f',
      eyes: '#0284c7',
      primary: '#334155', // Steel plate
      secondary: '#0284c7', // Sapphire tabard
      highlight: '#fbbf24', // Gold crest
      dark: '#1e293b',
      weaponBlade: '#e2e8f0',
      weaponGlow: '#38bdf8',
      weaponHandle: '#78350f',
      cape: '#0369a1',
      belt: '#b45309',
      boots: '#1e293b'
    }
  },
  {
    id: 'kaelen',
    name: 'Kaelen',
    title: 'The Wind Strider',
    archetype: 'Dual-Scimitar Skirmisher',
    gender: 'male',
    weaponName: 'Dual Dune Scimitars',
    weaponType: 'scimitars',
    description: 'An agile desert wanderer wielding twin scimitars. Builds relentless momentum through continuous typing flurries and sweeping multi-angle slashes.',
    stats: {
      speed: 92,
      power: 84,
      defense: 72,
      range: 78
    },
    passiveDescription: 'Combo multiplier builds 20% faster per consecutive hit.',
    palette: {
      skin: '#d97706',
      hair: '#451a03',
      eyes: '#f59e0b',
      primary: '#78350f', // Desert leather
      secondary: '#d97706', // Amber sash
      highlight: '#fef08a', // Sand gold
      dark: '#451a03',
      weaponBlade: '#fef3c7',
      weaponGlow: '#f59e0b',
      weaponHandle: '#78350f',
      cape: '#b45309',
      belt: '#d97706',
      boots: '#451a03'
    }
  },
  {
    id: 'thorin',
    name: 'Thorin',
    title: 'The Mountain Berserker',
    archetype: 'Heavy Dual-Axe Powerhouse',
    gender: 'male',
    weaponName: 'Twin Bearded Waraxes',
    weaponType: 'axes',
    description: 'A ferocious bearded mountain warrior wielding two heavy battleaxes. Deals devastating raw damage that ramps up when injured.',
    stats: {
      speed: 72,
      power: 96,
      defense: 84,
      range: 76
    },
    passiveDescription: '+30% bonus attack damage when HP drops below 40%.',
    palette: {
      skin: '#fed7aa',
      hair: '#b45309', // Fiery ginger beard & hair
      eyes: '#b91c1c',
      primary: '#57534e', // Iron scale & bear hide
      secondary: '#78350f',
      highlight: '#d97706',
      dark: '#292524',
      weaponBlade: '#cbd5e1',
      weaponGlow: '#ea580c',
      weaponHandle: '#78350f',
      cape: '#44403c',
      belt: '#78350f',
      boots: '#292524'
    }
  },
  {
    id: 'ignis',
    name: 'Ignis',
    title: 'The Pyroclast Overlord',
    archetype: 'Molten Claymore Titan',
    gender: 'male',
    weaponName: 'Magma Cleaver Claymore',
    weaponType: 'claymore',
    description: 'A terrifying boss-tier titan wreathed in obsidian armor and veins of active lava. Swings a massive blazing broadsword that ignites the arena floor.',
    stats: {
      speed: 75,
      power: 96,
      defense: 88,
      range: 90
    },
    passiveDescription: 'Strikes trigger magma impact waves with enhanced knockback.',
    palette: {
      skin: '#7f1d1d',
      hair: '#f97316', // Living fire hair
      eyes: '#fef08a', // Blazing yellow eyes
      primary: '#18181b', // Obsidian armor
      secondary: '#ef4444', // Magma veins
      highlight: '#fbbf24', // Lava glow
      dark: '#09090b',
      weaponBlade: '#fb923c',
      weaponGlow: '#ef4444',
      weaponHandle: '#27272a',
      cape: '#b91c1c',
      belt: '#ea580c',
      boots: '#09090b'
    }
  }
];

export const getWarriorById = (id: string): WarriorProfile => {
  return WARRIOR_ROSTER.find((w) => w.id === id) || WARRIOR_ROSTER[0];
};

export const getRandomBotOpponent = (excludeId: string): WarriorProfile => {
  const candidates = WARRIOR_ROSTER.filter((w) => w.id !== excludeId);
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex] || WARRIOR_ROSTER[1];
};
