import type { ResourceId } from '../engine/types';

export interface SeasonDef {
  name: string;
  icon: string;
  color: string;
  modifiers: Partial<Record<ResourceId, number>>; // multiplier deltas
  allMod: number; // added to all resource multipliers
  flatDrain: Partial<Record<ResourceId, number>>; // per second drain
  logMessage: string;
}

export const SEASONS: SeasonDef[] = [
  {
    name: 'Spring',
    icon: '❧',
    color: '#7a9a5a',
    modifiers: { food: 0.30, foraging: 0.20 },
    allMod: 0,
    flatDrain: {},
    logMessage: 'Spring comes. The ground softens. Things grow.',
  },
  {
    name: 'Summer',
    icon: '☉',
    color: '#c0a050',
    modifiers: { paths: 0.20 },
    allMod: 0.10,
    flatDrain: {},
    logMessage: 'Summer. The long light. The land is generous.',
  },
  {
    name: 'Autumn',
    icon: '⚘',
    color: '#b07040',
    modifiers: { foraging: 0.40, shelter: -0.10 },
    allMod: 0,
    flatDrain: {},
    logMessage: 'Autumn. The harvest thickens. The light draws in.',
  },
  {
    name: 'Winter',
    icon: '✳',
    color: '#6a7a8a',
    modifiers: { food: -0.40, shelter: -0.20, body: 0.30 },
    allMod: 0,
    flatDrain: { food: 0.05, shelter: 0.03 },
    logMessage: 'Winter arrives. The ground hardens. What you have must last.',
  },
];

export interface MoonPhaseDef {
  name: string;
  icon: string;
  modifiers: Partial<Record<ResourceId, number>>;
  allMod: number;
}

export const MOON_PHASES: MoonPhaseDef[] = [
  { name: 'New Moon', icon: '●', modifiers: { body: 0.15 }, allMod: 0 },
  { name: 'Waxing Crescent', icon: '◐', modifiers: { foraging: 0.10 }, allMod: 0 },
  { name: 'First Quarter', icon: '○', modifiers: { practice: 0.15 }, allMod: 0 },
  { name: 'Waxing Gibbous', icon: '◑', modifiers: { paths: 0.10 }, allMod: 0 },
  { name: 'Full Moon', icon: '●', modifiers: { sacred: 0.25 }, allMod: 0.05 },
  { name: 'Waning Gibbous', icon: '◐', modifiers: { lore: 0.15 }, allMod: 0 },
  { name: 'Last Quarter', icon: '○', modifiers: { theDeadNear: 0.10 }, allMod: 0 },
  { name: 'Waning Crescent', icon: '◑', modifiers: { ritual: 0.15 }, allMod: 0 },
];
