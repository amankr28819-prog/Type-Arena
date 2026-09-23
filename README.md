# TypeArena — Learn. Practice. Master.

> A modern, distraction-free typing learning, practice, testing, gaming, and analytics platform. Built around the core philosophy: **LEARN → PRACTICE → TEST → ANALYZE → IMPROVE**.

---

## ⚡ Highlights

- **100% Local-First & Zero Accounts**: No login, no password, no email, no cloud tracking. All test history, personal records, and settings live securely in your browser's IndexedDB and localStorage.
- **Ultra-Responsive Typing Engine**: Sub-millisecond input latency, real-time Net WPM, Raw WPM, accuracy, consistency, and burst speed metrics.
- **Every Single Option Actually Works**:
  - **Time Modes**: 15s, 30s, 60s, 120s, and **Custom Time** (e.g. 45s with automatic end timer).
  - **Word Modes**: 10, 25, 50, 100, and **Custom Words** (e.g. 37 words with exact count verification).
  - **Quotes**: Short (<100 chars), Medium (100–250 chars), Long (>250 chars) from authentic literature.
  - **Code Mode**: Realistic programming syntax (JavaScript, TypeScript, Python, C++, HTML).
  - **Zen Mode**: Distraction-free untimed free-flow writing.
  - **Custom Text**: Paste or write any text directly into the engine.
  - **Punctuation & Numbers**: Toggles strictly inject or remove punctuation and digits.
  - **Difficulties**: Normal, Advanced (word-locked backspace), Expert (stop on error), Master (instant fail on mistake).
  - **Thresholds**: Minimum WPM & Accuracy benchmarks evaluated on test completion.
- **Interactive Visual Keyboard**: Touch-typing finger color mapping, active key highlight, next key preview, and error heatmap overlay.
- **Web Audio Sound Synthesizer**: 5 authentic mechanical switch sound profiles (Cherry MX Blue Clicky, Brown Tactile, Red Linear, Typewriter, Retro Beep) + error alert + volume & mute controls — zero external audio dependencies.
- **Practice My Mistakes & Adaptive Training**: Automatically identifies your mistyped keys, difficult words, and slowest bigrams from test history and dynamically generates targeted practice drills.
- **Structured Learning Curriculum**: 3 tiers (Beginner, Intermediate, Advanced) teaching finger placements from home row to advanced programming syntax.
- **Arcade Typing Games**: 4 playable games (Word Race, Falling Words, Bubble Pop, and 15s Speed Sprint).
- **24+ Original Themes & Custom Theme Builder**: Curated dark, light, retro, colorful, and minimal themes, plus a full color editor to create and save custom themes locally.
- **Full Data Ownership**: One-click JSON backup export, schema-validated import, and granular reset.
- **PWA & Offline Ready**: Service Worker caching allows typing anywhere without an internet connection.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS v4 + Dynamic CSS Variables
- **Icons**: Lucide React
- **Sound**: Web Audio API AudioContext Synthesizer
- **Storage**: IndexedDB + localStorage
- **Testing**: Node / TSX Engine Verification Test Suite

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/amankr28819-prog/Type-Arena.git
cd Type-Arena

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

---

## 🎨 Built-in Themes

TypeArena includes 24+ crafted themes:
- **Dark**: Midnight, Dracula Dark, Nord Frost, Monokai Cyber, Tokyo Twilight, Ocean Depth, Forest Pine, Rose Quartz, Solarized Amber, Coffee Roast, Lavender Mist, Deep Space, Emerald Vault
- **Light**: Paper Clean, Snow Blizzard
- **Colorful**: Cyberpunk Neon, Sunset Ember, Pastel Dream, Sakura Blossom, Neon Synth
- **Retro**: Matrix Digital, Retro Terminal 80s
- **Minimal**: AMOLED Black, Minimal Slate

---

## 🔒 Privacy Pledge

Your typing data stays on this device. TypeArena does not transmit your keystrokes, personal bests, or test results to any remote server or external tracking analytics.

---

## 📄 License

MIT © 2026 TypeArena
