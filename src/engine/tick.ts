import type { GameState, ResourceId } from './types';
import { RESOURCES } from '../data/resources';
import { SEASONS, MOON_PHASES } from '../data/seasons';
import { BUILDINGS } from '../data/buildings';
import { saveGame } from './save';

export const TICK_MS = 200;
export const TICKS_PER_DAY = 5;
export const DAYS_PER_SEASON = 50;
export const DAYS_PER_MOON = 28;
export const SAVE_INTERVAL = 150;
export const BUILDING_COST_MULT = 1.15;

const TIER_MESSAGES: Record<number, string> = {
  1: 'The land begins to speak. You learn to listen.',
  2: 'You are not alone here. Others walk these paths.',
  3: 'Roots form beneath your feet. This place begins to know you.',
  4: 'The deep layer surfaces. What the stones know, you begin to hear.',
  5: 'The threshold. What lies beyond is not what came before.',
};

export function gameTick(state: GameState): GameState {
  const newResources = { ...state.resources };
  const newLog = [...state.log];
  const newTickCount = state.tickCount + 1;
  let newDay = state.day;
  let newSeason = state.season;
  let newMoonPhase = state.moonPhase;
  let newHighestTier = state.highestTier;
  const newHasLoggedTier = [...state.hasLoggedTier];

  const dt = TICK_MS / 1000;
  const season = SEASONS[state.season];
  const moon = MOON_PHASES[state.moonPhase];

  // Apply building production with seasonal and lunar modifiers
  for (const b of BUILDINGS) {
    const count = state.buildings[b.id];
    if (count === 0) continue;
    for (const [resId, baseRate] of Object.entries(b.production) as [ResourceId, number][]) {
      const r = newResources[resId];
      if (!r) continue;
      const seasonMod = (season.modifiers[resId] ?? 0) + season.allMod;
      const moonMod = (moon.modifiers[resId] ?? 0) + moon.allMod;
      const delta = baseRate * count * (1 + seasonMod) * (1 + moonMod) * dt;
      const newAmount = Math.min(r.max, Math.max(0, r.amount + delta));
      newResources[resId] = { ...r, amount: newAmount, unlocked: newAmount > 0 ? true : r.unlocked };
    }
  }

  // Apply winter flat drain
  for (const [resId, drain] of Object.entries(season.flatDrain) as [ResourceId, number][]) {
    const r = newResources[resId];
    if (!r) continue;
    const newAmount = Math.max(0, r.amount - drain * dt);
    newResources[resId] = { ...r, amount: newAmount };
  }

  // Advance time
  if (newTickCount % TICKS_PER_DAY === 0) {
    newDay += 1;

    // Check season transition
    const currentSeason = Math.floor(((newDay - 1) / DAYS_PER_SEASON) % 4);
    if (currentSeason !== state.season) {
      newSeason = currentSeason;
      newLog.push(SEASONS[newSeason].logMessage);
    }

    // Check moon phase transition (8 phases per DAYS_PER_MOON days)
    const daysPerPhase = DAYS_PER_MOON / 8;
    const currentMoonPhase = Math.floor(((newDay - 1) / daysPerPhase) % 8);
    if (currentMoonPhase !== state.moonPhase) {
      newMoonPhase = currentMoonPhase;
    }
  }

  // Check resource visibility: tier N resources become visible when any tier N-1 resource >= 3
  for (const res of RESOURCES) {
    if (res.tier === 0) continue;
    const r = newResources[res.id];
    if (r.visible) continue;
    // Check if any resource in tier below >= 3
    const lowerTierResources = RESOURCES.filter(x => x.tier === res.tier - 1);
    const anyLower = lowerTierResources.some(x => (newResources[x.id]?.amount ?? 0) >= 3);
    if (anyLower) {
      newResources[res.id] = { ...r, visible: true };
    }
  }

  // Check tier unlocks
  for (const res of RESOURCES) {
    const r = newResources[res.id];
    if (r.amount > 0 && res.tier > 0 && !newHasLoggedTier.includes(res.tier)) {
      newHasLoggedTier.push(res.tier);
      if (TIER_MESSAGES[res.tier]) {
        newLog.push(TIER_MESSAGES[res.tier]);
      }
      if (res.tier > newHighestTier) newHighestTier = res.tier;
    }
  }

  const newState: GameState = {
    ...state,
    resources: newResources,
    log: newLog.slice(-100),
    day: newDay,
    season: newSeason,
    moonPhase: newMoonPhase,
    highestTier: newHighestTier,
    hasLoggedTier: newHasLoggedTier,
    tickCount: newTickCount,
  };

  // Auto-save
  if (newTickCount % SAVE_INTERVAL === 0) {
    saveGame(newState);
  }

  return newState;
}
