import type { ResourceId, BuildingId } from '../engine/types';

export interface BuildingDef {
  id: BuildingId;
  name: string;
  tier: number;
  desc: string;
  baseCost: Partial<Record<ResourceId, number>>;
  production: Partial<Record<ResourceId, number>>; // per second
}

export const BUILDINGS: BuildingDef[] = [
  // Tier 0
  { id: 'leanto', name: 'Lean-to', tier: 0, desc: 'Stacked boughs against the wind', baseCost: { shelter: 30 }, production: { shelter: 0.10 } },
  { id: 'snare', name: 'Snare', tier: 0, desc: 'Twisted fibre, patient waiting', baseCost: { food: 25, animalSigns: 5 }, production: { food: 0.15 } },
  { id: 'quietGrove', name: 'Quiet Grove', tier: 0, desc: 'A place the mind can settle', baseCost: { body: 20 }, production: { body: 0.05 } },
  // Tier 1
  { id: 'trailMarkers', name: 'Trail Markers', tier: 1, desc: 'Stacked stones at the crossing', baseCost: { paths: 40 }, production: { paths: 0.10 } },
  { id: 'herbPatch', name: 'Herb Patch', tier: 1, desc: 'Transplanted near your shelter', baseCost: { foraging: 35, food: 10 }, production: { foraging: 0.10 } },
  { id: 'windVane', name: 'Wind Vane', tier: 1, desc: 'Feathers on a stick, reading the air', baseCost: { weather: 25, shelter: 10 }, production: { weather: 0.05 } },
  { id: 'blind', name: 'Watching Blind', tier: 1, desc: 'Still among branches', baseCost: { animalSigns: 30 }, production: { animalSigns: 0.05 } },
  { id: 'workbench', name: 'Workbench', tier: 1, desc: 'A flat stone, well lit', baseCost: { practice: 35, foraging: 10 }, production: { practice: 0.08 } },
  // Tier 2
  { id: 'meetingGround', name: 'Meeting Ground', tier: 2, desc: 'Neutral ground between territories', baseCost: { encounter: 50, paths: 20 }, production: { encounter: 0.08 } },
  { id: 'sharedFire', name: 'Shared Fire', tier: 2, desc: 'Words come easier by firelight', baseCost: { language: 40, shelter: 15 }, production: { language: 0.05 } },
  { id: 'marketStone', name: 'Market Stone', tier: 2, desc: 'A known place of exchange', baseCost: { trade: 45, foraging: 20 }, production: { trade: 0.08 } },
  { id: 'storySeat', name: 'Story Seat', tier: 2, desc: 'Where the old ones sit and remember', baseCost: { lore: 35, language: 15 }, production: { lore: 0.04 } },
  { id: 'cairn', name: 'Cairn', tier: 2, desc: 'Each stone placed with purpose', baseCost: { theDeadNear: 30, encounter: 10 }, production: { theDeadNear: 0.03 } },
  // Tier 3
  { id: 'swornBond', name: 'Sworn Bond', tier: 3, desc: 'An oath witnessed by the land', baseCost: { trust: 60, language: 30 }, production: { trust: 0.04 } },
  { id: 'workshop', name: 'Workshop', tier: 3, desc: 'Tools for making tools', baseCost: { craft: 50, practice: 25 }, production: { craft: 0.06 } },
  { id: 'carvedPost', name: 'Carved Post', tier: 3, desc: 'Your marks among the old marks', baseCost: { symbols: 40, craft: 20 }, production: { symbols: 0.04 } },
  { id: 'namedBlade', name: 'Named Blade', tier: 3, desc: 'They remember who made this', baseCost: { reputation: 50, craft: 30 }, production: { reputation: 0.03 } },
  { id: 'sundial', name: 'Sundial', tier: 3, desc: 'Shadow falls in measured time', baseCost: { seasons: 50, craft: 20 }, production: { seasons: 0.04 } },
  { id: 'moondial', name: 'Moon Dial', tier: 3, desc: 'Carved bone, phase by phase', baseCost: { moonRes: 45, practice: 20 }, production: { moonRes: 0.04 } },
  // Tier 4
  { id: 'elderSeat', name: "Elder's Seat", tier: 4, desc: 'Reserved for those who carry the words', baseCost: { tellings: 80, trust: 40 }, production: { tellings: 0.03 } },
  { id: 'sacredGround', name: 'Sacred Ground', tier: 4, desc: 'Cleared, tended, remembered', baseCost: { sacred: 70, symbols: 30 }, production: { sacred: 0.03 } },
  { id: 'ritualSpace', name: 'Ritual Space', tier: 4, desc: 'Where the rites are performed', baseCost: { ritual: 60, trust: 30 }, production: { ritual: 0.03 } },
  { id: 'wovenThread', name: 'Woven Thread', tier: 4, desc: 'Each strand connects to others', baseCost: { pattern: 60, symbols: 30 }, production: { pattern: 0.03 } },
  { id: 'ancestorShrine', name: 'Ancestor Shrine', tier: 4, desc: 'The old bones honoured here', baseCost: { theDeadFar: 60, theDeadNear: 30 }, production: { theDeadFar: 0.02 } },
  // Tier 5
  { id: 'memoryWell', name: 'Memory Well', tier: 5, desc: 'Deep water, long memory', baseCost: { oldKnowledge: 100, pattern: 50 }, production: { oldKnowledge: 0.02 } },
];

export const BUILDING_MAP = Object.fromEntries(
  BUILDINGS.map(b => [b.id, b])
) as Record<BuildingId, BuildingDef>;
