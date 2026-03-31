export type ResourceId =
  | 'shelter' | 'food' | 'body'
  | 'paths' | 'foraging' | 'weather' | 'animalSigns' | 'practice'
  | 'encounter' | 'language' | 'trade' | 'lore' | 'theDeadNear'
  | 'trust' | 'craft' | 'symbols' | 'reputation' | 'seasons' | 'moonRes'
  | 'tellings' | 'sacred' | 'ritual' | 'pattern' | 'theDeadFar'
  | 'oldKnowledge' | 'passage';

export type BuildingId =
  | 'leanto' | 'snare' | 'quietGrove'
  | 'trailMarkers' | 'herbPatch' | 'windVane' | 'blind' | 'workbench'
  | 'meetingGround' | 'sharedFire' | 'marketStone' | 'storySeat' | 'cairn'
  | 'swornBond' | 'workshop' | 'carvedPost' | 'namedBlade' | 'sundial' | 'moondial'
  | 'elderSeat' | 'sacredGround' | 'ritualSpace' | 'wovenThread' | 'ancestorShrine'
  | 'memoryWell';

export type ActionId =
  | 'seekLee' | 'digRoots' | 'stillMind' | 'scanRidge' | 'watchTree'
  | 'walkTrack' | 'gatherHerbs' | 'readSky' | 'followTracks' | 'repeatMotion'
  | 'approach' | 'learnWords' | 'offerTrade' | 'askPlace' | 'visitGraves'
  | 'returnAgain' | 'shapeMaterial' | 'studyMarks' | 'letNameTravel' | 'countSunrises' | 'watchNight'
  | 'sitElders' | 'enterCircle' | 'joinRite' | 'seeConnections' | 'touchStones'
  | 'rememberForgotten' | 'enterBarrow';

export interface ResourceState {
  amount: number;
  max: number;
  unlocked: boolean;
  visible: boolean;
}

export interface GameState {
  resources: Record<ResourceId, ResourceState>;
  buildings: Record<BuildingId, number>;
  day: number;
  season: number; // 0=Spring, 1=Summer, 2=Autumn, 3=Winter
  moonPhase: number; // 0-7
  highestTier: number;
  log: string[];
  hasLoggedTier: number[];
  tickCount: number;
  theme: 'dark' | 'light';
}
