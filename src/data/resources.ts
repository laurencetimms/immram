import type { ResourceId } from '../engine/types';

export interface ResourceDef {
  id: ResourceId;
  name: string;
  tier: number;
  max: number;
}

export const RESOURCES: ResourceDef[] = [
  // Tier 0 — Body
  { id: 'shelter', name: 'Shelter', tier: 0, max: 150 },
  { id: 'food', name: 'Food', tier: 0, max: 150 },
  { id: 'body', name: 'Body Sense', tier: 0, max: 100 },
  // Tier 1 — Land
  { id: 'paths', name: 'Paths', tier: 1, max: 120 },
  { id: 'foraging', name: 'Foraging', tier: 1, max: 120 },
  { id: 'weather', name: 'Weather', tier: 1, max: 80 },
  { id: 'animalSigns', name: 'Animal Signs', tier: 1, max: 80 },
  { id: 'practice', name: 'Practice', tier: 1, max: 120 },
  // Tier 2 — People
  { id: 'encounter', name: 'Encounter', tier: 2, max: 80 },
  { id: 'language', name: 'Language', tier: 2, max: 80 },
  { id: 'trade', name: 'Trade', tier: 2, max: 80 },
  { id: 'lore', name: 'Local Lore', tier: 2, max: 60 },
  { id: 'theDeadNear', name: 'The Near Dead', tier: 2, max: 50 },
  // Tier 3 — Roots
  { id: 'trust', name: 'Trust', tier: 3, max: 60 },
  { id: 'craft', name: 'Craft', tier: 3, max: 80 },
  { id: 'symbols', name: 'Symbols', tier: 3, max: 60 },
  { id: 'reputation', name: 'Reputation', tier: 3, max: 50 },
  { id: 'seasons', name: 'Seasons', tier: 3, max: 50 },
  { id: 'moonRes', name: 'Moon', tier: 3, max: 50 },
  // Tier 4 — Deep
  { id: 'tellings', name: 'Word-Tellings', tier: 4, max: 40 },
  { id: 'sacred', name: 'Sacred Places', tier: 4, max: 40 },
  { id: 'ritual', name: 'Ritual', tier: 4, max: 40 },
  { id: 'pattern', name: 'Pattern', tier: 4, max: 40 },
  { id: 'theDeadFar', name: 'The Far Dead', tier: 4, max: 30 },
  // Tier 5 — Threshold
  { id: 'oldKnowledge', name: 'The Old Knowledge', tier: 5, max: 30 },
  { id: 'passage', name: 'Passage', tier: 5, max: 20 },
];

export const TIER_NAMES = ['Body', 'Land', 'People', 'Roots', 'Deep', 'Threshold'];

export const TIER_COLORS = [
  '#b8a88a', '#a0b888', '#c09a8a', '#a898b8', '#c0a870', '#d09878'
];

export const RESOURCE_MAP = Object.fromEntries(
  RESOURCES.map(r => [r.id, r])
) as Record<ResourceId, ResourceDef>;
