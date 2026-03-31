import type { GameState, ResourceId, BuildingId } from './types';
import { SEASONS, MOON_PHASES } from '../data/seasons';
import { BUILDINGS, BUILDING_MAP } from '../data/buildings';
import { BUILDING_COST_MULT } from './tick';

export function getSeasonMod(season: number, resourceId: ResourceId): number {
  const s = SEASONS[season];
  return (s.modifiers[resourceId] ?? 0) + s.allMod;
}

export function getMoonMod(moonPhase: number, resourceId: ResourceId): number {
  const m = MOON_PHASES[moonPhase];
  return (m.modifiers[resourceId] ?? 0) + m.allMod;
}

export function getBuildingCost(state: GameState, buildingId: BuildingId): Partial<Record<ResourceId, number>> {
  const def = BUILDING_MAP[buildingId];
  const count = state.buildings[buildingId];
  const mult = Math.pow(BUILDING_COST_MULT, count);
  const result: Partial<Record<ResourceId, number>> = {};
  for (const [id, base] of Object.entries(def.baseCost) as [ResourceId, number][]) {
    result[id] = Math.ceil(base * mult);
  }
  return result;
}

export function canAffordBuilding(state: GameState, buildingId: BuildingId): boolean {
  const cost = getBuildingCost(state, buildingId);
  for (const [id, amount] of Object.entries(cost) as [ResourceId, number][]) {
    if ((state.resources[id]?.amount ?? 0) < amount) return false;
  }
  return true;
}

export function computeRates(state: GameState): Partial<Record<ResourceId, number>> {
  const rates: Partial<Record<ResourceId, number>> = {};
  const season = SEASONS[state.season];
  const moon = MOON_PHASES[state.moonPhase];

  for (const b of BUILDINGS) {
    const count = state.buildings[b.id];
    if (count === 0) continue;
    for (const [resId, baseRate] of Object.entries(b.production) as [ResourceId, number][]) {
      const seasonMod = (season.modifiers[resId] ?? 0) + season.allMod;
      const moonMod = (moon.modifiers[resId] ?? 0) + moon.allMod;
      const rate = baseRate * count * (1 + seasonMod) * (1 + moonMod);
      rates[resId] = (rates[resId] ?? 0) + rate;
    }
  }

  // Winter flat drain
  for (const [resId, drain] of Object.entries(season.flatDrain) as [ResourceId, number][]) {
    rates[resId] = (rates[resId] ?? 0) - drain;
  }

  return rates;
}
