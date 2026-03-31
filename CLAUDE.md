# CLAUDE.md — Immram

## What This Is

Immram is a browser-based incremental game in the spirit of Kittens Game (https://kittensgame.com). The player guides a single character — Darach (male) or Saorla (female) — who emerges into an ancient, liminal landscape inspired by Celtic and Nordic myth. The player invests clicks across 26 resources organised into 6 tiers, builds structures for passive production, and contends with seasonal and lunar cycles that exert real mechanical pressure. The game progresses from basic survival (finding shelter, digging for roots) through social encounter, craft, and lore, toward deep mythic knowledge and, ultimately, passage through the barrow.

The name "Immram" comes from the Irish genre of Otherworld voyage tales (Voyage of Bran, Voyage of Máel Dúin) — stories where a soul passes through a liminal landscape and is transformed.

**Key distinction from Kittens Game:** Kittens Game is a civilisation builder. In Immram, the player levels up a *single individual*. You cannot spam one resource — cross-tier dependencies force the player to invest broadly before progressing. Every action is a choice about who Darach becomes.

---

## Project Setup

- **Framework:** React 18+ via Vite
- **Language:** TypeScript (strict)
- **Styling:** CSS Modules or a single CSS file. No Tailwind, no UI library. The aesthetic is deliberately austere — Georgia/serif font stack, dark earth tones, minimal chrome. Think Kittens Game, not a modern dashboard. Offer a light mode/dark mode switch.
- **State management:** React hooks only (useState, useEffect, useRef, useCallback, useMemo). No Redux, no Zustand. The game state is small enough that lifting state to the top component is fine.
- **Persistence:** localStorage (JSON serialise/deserialise). Auto-save every 30 seconds. Manual save button. Reset button with confirmation.
- **No backend.** This is a static site.
- **Responsive:** Must work well on mobile (single-column tabbed layout), tablet, and desktop (three-column layout: resources | actions/buildings | log).
- **Deployment:** GitHub Pages via a simple Vite build. The repo should include a GitHub Actions workflow for this.

### Repo Structure

```
immram/
├── CLAUDE.md              ← this file
├── README.md              ← player-facing readme
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .github/
│   └── workflows/
│       └── deploy.yml     ← GitHub Pages deployment
├── public/
│   └── favicon.svg        ← simple SVG icon (spiral or passage motif)
└── src/
    ├── main.tsx           ← React entry point
    ├── App.tsx            ← top-level component, game loop, state
    ├── App.css            ← all styles
    ├── data/
    │   ├── resources.ts   ← resource definitions
    │   ├── actions.ts     ← action definitions with flavour text
    │   ├── buildings.ts   ← building definitions
    │   ├── seasons.ts     ← season/moon modifiers, messages
    │   └── graph.ts       ← the original graph edges (reference/future use)
    ├── engine/
    │   ├── tick.ts         ← game loop tick logic
    │   ├── economy.ts      ← rate calculations, seasonal/lunar modifiers
    │   ├── save.ts         ← save/load/reset functions
    │   └── types.ts        ← shared TypeScript types
    └── components/
        ├── Header.tsx      ← title, day/season/moon display
        ├── ResourcePanel.tsx
        ├── ActionPanel.tsx
        ├── BuildingPanel.tsx
        ├── LogPanel.tsx
        └── TabBar.tsx      ← mobile tab navigation
```

---

## Design Principles

1. **Kittens Game fidelity.** The interface should feel like Kittens Game: text-heavy, minimal decoration, information-dense, serif fonts, muted palette. No icons, no illustrations, no animations beyond subtle bar fills. The beauty is in the text and the system.
2. **No engagement tricks.** No notifications, no streaks, no "come back" mechanics. The game respects the player's time and attention.
3. **Cross-tier dependency.** The player cannot progress by focusing on a single resource. Actions require resources from other tiers. This is the core design constraint.
4. **Seasonal pressure.** Winter drains food and shelter. Survival is never fully solved. This creates recurring tension that mirrors Kittens Game's winter mechanic.
5. **Flavour text as reward.** Actions have a 35% chance of logging a flavour message. These are the game's storytelling — short, evocative, never expository.
6. **Progressive disclosure.** Only show resources and actions the player can see or is close to unlocking. The "Not yet…" section shows requirements so the player always has visible aspiration.

---

## Game Constants

```
TICK_MS           = 200       // game tick interval in ms
TICKS_PER_DAY     = 5         // 1 in-game day = 1 second real time
DAYS_PER_SEASON   = 50        // ~10 seconds per season
DAYS_PER_MOON     = 28        // moon cycle ~5.6 seconds
SAVE_INTERVAL     = 150       // ticks between auto-saves (~30 seconds)
BUILDING_COST_MULT = 1.15     // each subsequent building of same type costs 1.15x
```

---

## Resources (26 total, 6 tiers)

### Tier 0 — Body
| id | name | max |
|---|---|---|
| shelter | Shelter | 150 |
| food | Food | 150 |
| body | Body Sense | 100 |

### Tier 1 — Land
| id | name | max |
|---|---|---|
| paths | Paths | 120 |
| foraging | Foraging | 120 |
| weather | Weather | 80 |
| animalSigns | Animal Signs | 80 |
| practice | Practice | 120 |

### Tier 2 — People
| id | name | max |
|---|---|---|
| encounter | Encounter | 80 |
| language | Language | 80 |
| trade | Trade | 80 |
| lore | Local Lore | 60 |
| theDeadNear | The Near Dead | 50 |

### Tier 3 — Roots
| id | name | max |
|---|---|---|
| trust | Trust | 60 |
| craft | Craft | 80 |
| symbols | Symbols | 60 |
| reputation | Reputation | 50 |
| seasons | Seasons | 50 |
| moonRes | Moon | 50 |

### Tier 4 — Deep
| id | name | max |
|---|---|---|
| tellings | Word-Tellings | 40 |
| sacred | Sacred Places | 40 |
| ritual | Ritual | 40 |
| pattern | Pattern | 40 |
| theDeadFar | The Far Dead | 30 |

### Tier 5 — Threshold
| id | name | max |
|---|---|---|
| oldKnowledge | The Old Knowledge | 30 |
| passage | Passage | 20 |

### Tier colours (for resource headings and progress bars)
```
Tier 0 (Body):      #b8a88a
Tier 1 (Land):      #a0b888
Tier 2 (People):    #c09a8a
Tier 3 (Roots):     #a898b8
Tier 4 (Deep):      #c0a870
Tier 5 (Threshold): #d09878
```

### Visibility rules
- Tier 0 resources are visible from the start.
- A resource becomes visible when any resource in the tier below reaches 3+.
- A resource becomes "unlocked" (can receive amounts) the first time an action or building produces it.

---

## Actions (28 total)

Each action has: id, name, tier, gives (resources produced per click), costs (resources consumed per click), reqs (minimum resource levels required to see/use the action), and flavors (array of strings, one displayed in the log with 35% probability on each click).

### Tier 0 — Body

**Seek the Lee** `seekLee`
- gives: shelter +1
- costs: none
- reqs: none
- flavors: "You find a hollow where the wind breaks." · "Dry ground beneath old roots." · "A place the rain cannot reach."

**Dig for Roots** `digRoots`
- gives: food +1
- costs: none
- reqs: none
- flavors: "Bitter, but it fills the belly." · "Something edible beneath the leaf-rot." · "You learn which stems to pull."

**Still the Mind** `stillMind`
- gives: body +1
- costs: none
- reqs: none
- flavors: "The backs of your knees know something." · "A hum beneath thought." · "The body remembers what the mind forgets."

**Scan the Ridge** `scanRidge`
- gives: shelter +0.5, paths +0.5
- costs: none
- reqs: none
- flavors: "High ground shows you where things connect." · "The ridge teaches terrain."

**Watch the Treeline** `watchTree`
- gives: food +0.5, animalSigns +0.5
- costs: none
- reqs: none
- flavors: "Movement at the edge of the wood." · "Something fled when you looked."

### Tier 1 — Land

**Walk the Trackways** `walkTrack`
- gives: paths +1, encounter +0.2
- costs: none
- reqs: shelter ≥ 5
- flavors: "Old feet wore this groove." · "The path leads somewhere people go." · "You follow where the deer walk."

**Gather Herbs** `gatherHerbs`
- gives: foraging +1
- costs: food −1
- reqs: food ≥ 8, paths ≥ 3
- flavors: "You learn which leaf, which root." · "The earth gives what you know to take."

**Read the Sky** `readSky`
- gives: weather +1, shelter +0.2
- costs: none
- reqs: shelter ≥ 10
- flavors: "Clouds stack in ways that mean something." · "The wind changed. You noticed."

**Follow Tracks** `followTracks`
- gives: animalSigns +1, foraging +0.2
- costs: none
- reqs: food ≥ 10
- flavors: "Deer move toward water." · "You read the pressed mud like text."

**Repeat the Motion** `repeatMotion`
- gives: practice +1, body +0.2
- costs: none
- reqs: body ≥ 5
- flavors: "The hand finds its own rhythm." · "Coarse becomes fine through repetition."

### Tier 2 — People

**Approach a Stranger** `approach`
- gives: encounter +1
- costs: food −2
- reqs: paths ≥ 10, food ≥ 15
- flavors: "Gestures first. Always gestures first." · "They do not run. That is something." · "You offer what you have."

**Learn Their Words** `learnWords`
- gives: language +1
- costs: encounter −1
- reqs: encounter ≥ 5
- flavors: "Point. Name. Repeat." · "The word for fire. The word for water." · "Your accent marks you as outside."

**Offer What You Have** `offerTrade`
- gives: trade +1
- costs: foraging −3
- reqs: encounter ≥ 5, foraging ≥ 15
- flavors: "What's common here is rare there." · "Trade is its own language."

**Ask About This Place** `askPlace`
- gives: lore +1
- costs: language −1
- reqs: language ≥ 10
- flavors: "They name the hill. The name is old." · "A warning. A story. Both at once."

**Visit the Graves** `visitGraves`
- gives: theDeadNear +1
- costs: encounter −1
- reqs: encounter ≥ 10
- flavors: "Fresh flowers on old earth." · "They speak to their dead as though they hear." · "Death is not abstract here."

### Tier 3 — Roots

**Return Again** `returnAgain`
- gives: trust +1
- costs: food −3
- reqs: language ≥ 15, encounter ≥ 20
- flavors: "Trust is built through showing up." · "They expected you this time." · "Presence over time. There is no shortcut."

**Shape at the Bench** `shapeMaterial`
- gives: craft +1
- costs: foraging −2
- reqs: practice ≥ 15, foraging ≥ 15
- flavors: "Flint finds its edge." · "What you make marks who you are." · "The arrowhead holds your name."

**Study the Marks** `studyMarks`
- gives: symbols +1
- costs: lore −1
- reqs: lore ≥ 10
- flavors: "The same spiral, on three different stones." · "You saw this mark before. Far from here."

**Let Your Name Travel** `letNameTravel`
- gives: reputation +0.5, encounter +0.3
- costs: trade −2
- reqs: trade ≥ 10, encounter ≥ 15
- flavors: "Your name arrives before you do." · "They heard about the blade you shaped."

**Count the Sunrises** `countSunrises`
- gives: seasons +1
- costs: none
- reqs: weather ≥ 20, food ≥ 30
- flavors: "The year turns. You feel it in the light." · "You begin to know when things change."

**Watch the Night Sky** `watchNight`
- gives: moonRes +1
- costs: none
- reqs: body ≥ 15, weather ≥ 10
- flavors: "The shorter cycle within the longer." · "The moon tells a different time."

### Tier 4 — Deep

**Sit with the Elders** `sitElders`
- gives: tellings +1
- costs: trust −2, food −3
- reqs: trust ≥ 20
- flavors: "Every teller shapes the tale." · "The differences between versions matter more than the words."

**Enter the Circle** `enterCircle`
- gives: sacred +1
- costs: body −2
- reqs: symbols ≥ 10, body ≥ 20
- flavors: "The backs of your knees know this ground." · "Something in the stones responds to your attention."

**Join the Rite** `joinRite`
- gives: ritual +1
- costs: trust −2, seasons −1
- reqs: trust ≥ 15, seasons ≥ 10, moonRes ≥ 5
- flavors: "Not worship. Maintenance." · "The rite keeps the world turning."

**See the Connections** `seeConnections`
- gives: pattern +1
- costs: symbols −2
- reqs: symbols ≥ 15, tellings ≥ 5
- flavors: "The spiral on the panel. The mark on the cairn. One thing." · "Truth triangulated across tellings."

**Touch the Old Stones** `touchStones`
- gives: theDeadFar +1
- costs: theDeadNear −1
- reqs: theDeadNear ≥ 10, sacred ≥ 5
- flavors: "Their bones are in the land." · "The barrow-builders chose these places."

### Tier 5 — Threshold

**Remember What Was Forgotten** `rememberForgotten`
- gives: oldKnowledge +1
- costs: pattern −2, tellings −2
- reqs: pattern ≥ 15, tellings ≥ 10, theDeadFar ≥ 10
- flavors: "It was always here. Beneath everything." · "The land remembers what the people forgot."

**Enter the Barrow** `enterBarrow`
- gives: passage +1
- costs: oldKnowledge −3, ritual −2, sacred −2
- reqs: oldKnowledge ≥ 20, ritual ≥ 10, sacred ≥ 10
- flavors: "The barrow is a grave. You crawl through the place of the dead." · "What comes out is not who went in."

---

## Buildings (26 total)

Buildings provide passive per-second production. Each subsequent building of the same type costs `baseCost × 1.15^count`. Buildings are displayed in a "Land" tab.

### Tier 0

| id | name | base cost | production/s | desc |
|---|---|---|---|---|
| leanto | Lean-to | shelter: 30 | shelter: 0.10 | Stacked boughs against the wind |
| snare | Snare | food: 25, animalSigns: 5 | food: 0.15 | Twisted fibre, patient waiting |
| quietGrove | Quiet Grove | body: 20 | body: 0.05 | A place the mind can settle |

### Tier 1

| id | name | base cost | production/s | desc |
|---|---|---|---|---|
| trailMarkers | Trail Markers | paths: 40 | paths: 0.10 | Stacked stones at the crossing |
| herbPatch | Herb Patch | foraging: 35, food: 10 | foraging: 0.10 | Transplanted near your shelter |
| windVane | Wind Vane | weather: 25, shelter: 10 | weather: 0.05 | Feathers on a stick, reading the air |
| blind | Watching Blind | animalSigns: 30 | animalSigns: 0.05 | Still among branches |
| workbench | Workbench | practice: 35, foraging: 10 | practice: 0.08 | A flat stone, well lit |

### Tier 2

| id | name | base cost | production/s | desc |
|---|---|---|---|---|
| meetingGround | Meeting Ground | encounter: 50, paths: 20 | encounter: 0.08 | Neutral ground between territories |
| sharedFire | Shared Fire | language: 40, shelter: 15 | language: 0.05 | Words come easier by firelight |
| marketStone | Market Stone | trade: 45, foraging: 20 | trade: 0.08 | A known place of exchange |
| storySeat | Story Seat | lore: 35, language: 15 | lore: 0.04 | Where the old ones sit and remember |
| cairn | Cairn | theDeadNear: 30, encounter: 10 | theDeadNear: 0.03 | Each stone placed with purpose |

### Tier 3

| id | name | base cost | production/s | desc |
|---|---|---|---|---|
| swornBond | Sworn Bond | trust: 60, language: 30 | trust: 0.04 | An oath witnessed by the land |
| workshop | Workshop | craft: 50, practice: 25 | craft: 0.06 | Tools for making tools |
| carvedPost | Carved Post | symbols: 40, craft: 20 | symbols: 0.04 | Your marks among the old marks |
| namedBlade | Named Blade | reputation: 50, craft: 30 | reputation: 0.03 | They remember who made this |
| sundial | Sundial | seasons: 50, craft: 20 | seasons: 0.04 | Shadow falls in measured time |
| moondial | Moon Dial | moonRes: 45, practice: 20 | moonRes: 0.04 | Carved bone, phase by phase |

### Tier 4

| id | name | base cost | production/s | desc |
|---|---|---|---|---|
| elderSeat | Elder's Seat | tellings: 80, trust: 40 | tellings: 0.03 | Reserved for those who carry the words |
| sacredGround | Sacred Ground | sacred: 70, symbols: 30 | sacred: 0.03 | Cleared, tended, remembered |
| ritualSpace | Ritual Space | ritual: 60, trust: 30 | ritual: 0.03 | Where the rites are performed |
| wovenThread | Woven Thread | pattern: 60, symbols: 30 | pattern: 0.03 | Each strand connects to others |
| ancestorShrine | Ancestor Shrine | theDeadFar: 60, theDeadNear: 30 | theDeadFar: 0.02 | The old bones honoured here |

### Tier 5

| id | name | base cost | production/s | desc |
|---|---|---|---|---|
| memoryWell | Memory Well | oldKnowledge: 100, pattern: 50 | oldKnowledge: 0.02 | Deep water, long memory |

---

## Seasonal System

Four seasons cycle every `DAYS_PER_SEASON` (50) days. Each season applies multipliers to building production rates.

```
Spring:  food +30%, foraging +20%
Summer:  all +10%, paths +20%
Autumn:  foraging +40%, shelter −10%
Winter:  food −40%, shelter −20%, body +30%
         Also applies a flat drain: food −0.05/s, shelter −0.03/s
```

Winter pressure is the key mechanic: it forces the player back to Tier 0 concerns even when they've progressed to higher tiers. Survival is never fully solved.

### Season change log messages
```
Spring: "Spring comes. The ground softens. Things grow."
Summer: "Summer. The long light. The land is generous."
Autumn: "Autumn. The harvest thickens. The light draws in."
Winter: "Winter arrives. The ground hardens. What you have must last."
```

### Season display
Show the current season with an icon: Spring ❧, Summer ☉, Autumn ⚘, Winter ✳
Colours: Spring #7a9a5a, Summer #c0a050, Autumn #b07040, Winter #6a7a8a

---

## Lunar System

Eight moon phases cycle every `DAYS_PER_MOON` (28) days. Each phase applies a subtle multiplier to building production.

```
Phase 0 (New Moon ●):         body +15%
Phase 1 (Waxing Crescent ◐):  foraging +10%
Phase 2 (First Quarter ○):    practice +15%
Phase 3 (Waxing Gibbous ◑):   paths +10%
Phase 4 (Full Moon ●):        sacred +25%, all +5%
Phase 5 (Waning Gibbous ◐):   lore +15%
Phase 6 (Last Quarter ○):     theDeadNear +10%
Phase 7 (Waning Crescent ◑):  ritual +15%
```

Display: Show moon character and phase name in the header.

---

## Tier Unlock Messages

When the player first gains any resource in a new tier, log:

```
Tier 1: "The land begins to speak. You learn to listen."
Tier 2: "You are not alone here. Others walk these paths."
Tier 3: "Roots form beneath your feet. This place begins to know you."
Tier 4: "The deep layer surfaces. What the stones know, you begin to hear."
Tier 5: "The threshold. What lies beyond is not what came before."
```

---

## The Original Graph (Reference)

The game's resource/action structure is derived from a graph originally designed for a separate project (The Barrow). The edges in that graph map to the game mechanics as follows:

- **learn/enables** edges → action prerequisites and cross-tier gives
- **threshold** edges → high-requirement actions that gate progression
- **presence** edges → resources that benefit from time/cycles (seasons, moon)
- **pressure/feedback** edges → seasonal drain mechanics and feedback loops
- **time** edges → actions that require repeated investment (language, trust)

The graph edges are preserved in `src/data/graph.ts` for reference and potential future features (e.g., a visual graph view showing the player's progression through the network).

### Graph Edges (for reference)

```
shelter → paths (learn): "Finding shelter teaches you to read terrain"
food → foraging (learn)
food → animalSigns (learn): "Hunger makes you watch animals"
shelter → weather (learn): "Exposure teaches you to read the sky"
body → practice (learn): "The body learns through repetition"
paths → foraging (enables)
body → sacred (presence): "The body feels sacred places before the mind understands them"
paths → encounter (leads)
foraging → encounter (leads): "Gathering puts you where others gather"
foraging → trade (enables): "You have things others want"
animalSigns → weather (learn)
weather → paths (enables): "Weather knowledge changes route choices"
animalSigns → foraging (learn)
encounter → theDeadNear (leads): "You witness grief, tended graves, the customs of death"
encounter → language (time): "Built through repeated visits"
language → trade (enables)
language → lore (enables): "Deep enough vocabulary to hear stories"
language → trust (time)
trade → trust (reciprocity)
trade → reputation (spreads)
trade → craft (learn): "Trade reveals what can be made"
foraging → craft (enables): "Materials for making"
practice → craft (enables): "Skill determines quality"
lore → symbols (learn): "Stories mention marks and signs"
encounter → reputation (spreads): "People talk about you"
encounter → trust (dynamic): "Positive encounters build. Negative encounters damage."
craft → reputation (identity): "What you make marks who you are"
craft → trust (reciprocity): "Gifts deepen bonds"
moonRes → seasons (rhythm): "The shorter cycle within the longer"
seasons → food (pressure, feedback): "Winter makes food scarce again"
seasons → shelter (pressure, feedback): "Winter makes shelter critical again"
trust → tellings (threshold): "Only deep trust unlocks oral histories"
symbols → sacred (leads): "Reading symbols leads to places of power"
symbols → pattern (accumulates)
lore → sacred (leads): "Stories name specific places"
seasons → sacred (presence): "Some places only reveal at certain times"
moonRes → sacred (presence): "Some places respond to lunar phases"
seasons → ritual (presence): "Solar rites bound to solstice and equinox"
moonRes → ritual (presence): "Lunar rites bound to the monthly cycle"
trust → ritual (threshold): "You must be invited to witness or participate"
theDeadNear → theDeadFar (deepens): "Understanding how the living treat their dead opens awareness of the ancient dead"
moonRes → foraging (enables, feedback): "Wise woman gathers herbs by lunar phase"
tellings → pattern (accumulates): "Multiple versions of the same story triangulate toward truth"
sacred → pattern (accumulates)
ritual → sacred (deepens): "Performing rites reveals what a place truly is"
theDeadFar → sacred (deepens): "The barrow-builders chose these places"
theDeadFar → tellings (deepens): "The oldest tellings are about the ancient dead"
pattern → oldKnowledge (threshold): "Enough connections and the deep layer becomes visible"
tellings → oldKnowledge (threshold)
theDeadFar → oldKnowledge (threshold): "The dead knew. Their knowledge persists in the land."
oldKnowledge → passage (threshold)
ritual → passage (presence): "Knowing what to do at the threshold"
sacred → passage (presence): "Knowing where the threshold is"
reputation → encounter (feedback): "Your name arrives before you do"
lore → paths (feedback): "Stories reveal routes you didn't know"
pattern → symbols (feedback): "Understanding makes new symbols visible"
```

---

## UI Specification

### Colour Palette
```
Background:        #1c1a17
Panel background:  #222019
Button background: #2a2722
Button hover:      #332f28
Button disabled:   #1e1c19
Text primary:      #c4b9a8
Text dim:          #6a6258
Text muted:        #4a453e
Border:            #333028
Accent:            #a89070
Positive rate:     #8a9a6a
Negative rate:     #9a6a6a
```

### Typography
Georgia, 'Times New Roman', serif for everything. No web fonts needed. This is deliberate — Kittens Game uses system serif.

### Desktop Layout (≥ 768px)
Three columns:
1. **Left (240px):** Resource panel with header "Darach's Knowledge". Resources grouped by tier with tier name headings. Each resource shows: name, current/max, rate (if non-zero, coloured green/red).
2. **Centre (flex):** Tab bar with "Actions" and "Land" tabs. Actions tab shows available actions as clickable buttons with gives/costs underneath. Below available actions, a "Not yet…" section shows locked actions with progress toward their requirements. Land tab shows buildings with build buttons and cost/production info.
3. **Right (260px):** Log panel. Scrolls to bottom. Most recent entry is brighter; older entries are dimmer.

### Mobile Layout (< 768px)
Single column with a 4-tab bar: Actions, Land, Resources, Log. Same content as desktop, reformatted for full width.

### Header
Full width. Left: "IMMRAM" in accent colour, small caps / letter-spacing. Character name beside it in dim text. Right: Year/Day counter, Season with icon and colour, Moon phase character and name.

### Action Buttons
- Available actions: bordered, clickable, show name (bold) and gives/costs on a second line.
- Gives shown in green (+1 Shelter), costs in amber or red (−2 Food, red if can't afford).
- Disabled state: muted colours, no border, no pointer cursor.

### Building Cards
- Show: name, count in parentheses, description, production rate, cost for next.
- "Build" button on the right. Cost items coloured amber if affordable, red if not.

### "Not yet…" Section
- Dimmer styling, left border.
- Show action name and each requirement with current/target and ✓ if met.

### Resource Bars
- 2px height progress bars beneath each resource.
- Fill colour matches tier colour at 40% opacity.
- Smooth width transition (0.3s ease).

### Log Entries
- Most recent entry: primary text colour.
- Older entries: dim text colour.
- Flavour text: italic.
- System messages ("Built: X", season changes, tier unlocks): normal weight.

---

## Game Loop Detail

Every `TICK_MS` (200ms):

1. **Apply building production.** For each building type with count > 0, add `production_rate × count × (TICK_MS / 1000)` to the corresponding resource. Clamp to [0, max].
2. **Apply seasonal modifiers** to production rates before adding. Seasonal modifiers are multipliers on the base rate: `rate *= (1 + seasonMod + allMod)`. Winter also applies a flat drain to food and shelter.
3. **Apply lunar modifiers** similarly: `rate *= (1 + moonMod + moonAllMod)`.
4. **Advance time.** Every `TICKS_PER_DAY` ticks, increment day. Check for season and moon phase transitions.
5. **Check visibility.** Make resources visible when any resource in the tier below reaches 3+.
6. **Check tier unlocks.** If the player first gains any resource in a new tier, log the tier message.
7. **Auto-save** every `SAVE_INTERVAL` ticks.

---

## Save Format

localStorage key: `immram-save`

```json
{
  "resources": {
    "shelter": { "amount": 42.5, "max": 150, "unlocked": true, "visible": true },
    ...
  },
  "buildings": {
    "leanto": 3,
    "snare": 1,
    ...
  },
  "day": 127,
  "season": 2,
  "moonPhase": 5,
  "highestTier": 3,
  "log": ["last 50 log entries..."],
  "hasLoggedTier": [0, 1, 2, 3]
}
```

---

## Opening State

On first load (no save):
- All Tier 0 resources visible, all others hidden.
- All resource amounts at 0.
- No buildings.
- Day 1, Spring, New Moon.
- Log: "You emerge. The land is before you." / "You remember nothing."

---

## Future Features (not in v1, but keep the architecture open)

- **Upgrades:** Research-style unlocks that modify action yields or building production.
- **Events:** Random events triggered by resource thresholds or seasonal conditions (e.g., "A traveller arrives at your fire" when encounter + trust are high in winter).
- **Graph visualisation:** An interactive view showing the player's progression through the original graph, with lit/unlit nodes and edges.
- **Passage endgame:** When passage reaches its max, trigger a transformation sequence. The game resets with a "New Game+" modifier — Darach/Saorla enters the land again, but something is different.
- **Character choice:** Let the player choose Darach or Saorla at the start, with subtle mechanical differences.
- **Achievements:** Named milestones tied to graph nodes ("First Winter Survived", "The Elders Speak", "The Barrow Opens").