import type { GameState, ResourceId, BuildingId } from './types';
import { RESOURCES } from '../data/resources';
import { BUILDINGS } from '../data/buildings';

const SAVE_KEY = 'immram-save';

export function createInitialState(): GameState {
  const resources = {} as GameState['resources'];
  for (const r of RESOURCES) {
    resources[r.id] = {
      amount: 0,
      max: r.max,
      unlocked: r.tier === 0,
      visible: r.tier === 0,
    };
  }

  const buildings = {} as GameState['buildings'];
  for (const b of BUILDINGS) {
    buildings[b.id] = 0;
  }

  return {
    resources,
    buildings,
    day: 1,
    season: 0,
    moonPhase: 0,
    highestTier: 0,
    log: [
      'You emerge. The land is before you.',
      'You remember nothing.',
    ],
    hasLoggedTier: [0],
    tickCount: 0,
    theme: 'dark',
  };
}

export function saveGame(state: GameState): void {
  try {
    const toSave = {
      resources: state.resources,
      buildings: state.buildings,
      day: state.day,
      season: state.season,
      moonPhase: state.moonPhase,
      highestTier: state.highestTier,
      log: state.log.slice(-50),
      hasLoggedTier: state.hasLoggedTier,
      theme: state.theme,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore storage errors
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<{
      resources: Record<ResourceId, GameState['resources'][ResourceId]>;
      buildings: Record<BuildingId, number>;
      day: number;
      season: number;
      moonPhase: number;
      highestTier: number;
      log: string[];
      hasLoggedTier: number[];
      theme: 'dark' | 'light';
    }>;
    const initial = createInitialState();
    // Merge saved data over initial state
    if (saved.resources) {
      for (const id of Object.keys(saved.resources) as ResourceId[]) {
        if (initial.resources[id]) {
          initial.resources[id] = { ...initial.resources[id], ...saved.resources[id] };
        }
      }
    }
    if (saved.buildings) {
      for (const id of Object.keys(saved.buildings) as BuildingId[]) {
        if (id in initial.buildings) {
          initial.buildings[id] = saved.buildings[id] ?? 0;
        }
      }
    }
    initial.day = saved.day ?? 1;
    initial.season = saved.season ?? 0;
    initial.moonPhase = saved.moonPhase ?? 0;
    initial.highestTier = saved.highestTier ?? 0;
    initial.log = saved.log ?? initial.log;
    initial.hasLoggedTier = saved.hasLoggedTier ?? [0];
    initial.theme = saved.theme ?? 'dark';
    initial.tickCount = 0;
    return initial;
  } catch {
    return null;
  }
}

export function resetGame(): GameState {
  localStorage.removeItem(SAVE_KEY);
  return createInitialState();
}
