import type { ResourceId, ActionId } from '../engine/types';

export interface ActionDef {
  id: ActionId;
  name: string;
  tier: number;
  gives: Partial<Record<ResourceId, number>>;
  costs: Partial<Record<ResourceId, number>>;
  reqs: Partial<Record<ResourceId, number>>;
  flavors: string[];
}

export const ACTIONS: ActionDef[] = [
  // Tier 0
  {
    id: 'seekLee',
    name: 'Seek the Lee',
    tier: 0,
    gives: { shelter: 1 },
    costs: {},
    reqs: {},
    flavors: [
      'You find a hollow where the wind breaks.',
      'Dry ground beneath old roots.',
      'A place the rain cannot reach.',
    ],
  },
  {
    id: 'digRoots',
    name: 'Dig for Roots',
    tier: 0,
    gives: { food: 1 },
    costs: {},
    reqs: {},
    flavors: [
      'Bitter, but it fills the belly.',
      'Something edible beneath the leaf-rot.',
      'You learn which stems to pull.',
    ],
  },
  {
    id: 'stillMind',
    name: 'Still the Mind',
    tier: 0,
    gives: { body: 1 },
    costs: {},
    reqs: {},
    flavors: [
      'The backs of your knees know something.',
      'A hum beneath thought.',
      'The body remembers what the mind forgets.',
    ],
  },
  {
    id: 'scanRidge',
    name: 'Scan the Ridge',
    tier: 0,
    gives: { shelter: 0.5, paths: 0.5 },
    costs: {},
    reqs: {},
    flavors: [
      'High ground shows you where things connect.',
      'The ridge teaches terrain.',
    ],
  },
  {
    id: 'watchTree',
    name: 'Watch the Treeline',
    tier: 0,
    gives: { food: 0.5, animalSigns: 0.5 },
    costs: {},
    reqs: {},
    flavors: [
      'Movement at the edge of the wood.',
      'Something fled when you looked.',
    ],
  },
  // Tier 1
  {
    id: 'walkTrack',
    name: 'Walk the Trackways',
    tier: 1,
    gives: { paths: 1, encounter: 0.2 },
    costs: {},
    reqs: { shelter: 5 },
    flavors: [
      'Old feet wore this groove.',
      'The path leads somewhere people go.',
      'You follow where the deer walk.',
    ],
  },
  {
    id: 'gatherHerbs',
    name: 'Gather Herbs',
    tier: 1,
    gives: { foraging: 1 },
    costs: { food: 1 },
    reqs: { food: 8, paths: 3 },
    flavors: [
      'You learn which leaf, which root.',
      'The earth gives what you know to take.',
    ],
  },
  {
    id: 'readSky',
    name: 'Read the Sky',
    tier: 1,
    gives: { weather: 1, shelter: 0.2 },
    costs: {},
    reqs: { shelter: 10 },
    flavors: [
      'Clouds stack in ways that mean something.',
      'The wind changed. You noticed.',
    ],
  },
  {
    id: 'followTracks',
    name: 'Follow Tracks',
    tier: 1,
    gives: { animalSigns: 1, foraging: 0.2 },
    costs: {},
    reqs: { food: 10 },
    flavors: [
      'Deer move toward water.',
      'You read the pressed mud like text.',
    ],
  },
  {
    id: 'repeatMotion',
    name: 'Repeat the Motion',
    tier: 1,
    gives: { practice: 1, body: 0.2 },
    costs: {},
    reqs: { body: 5 },
    flavors: [
      'The hand finds its own rhythm.',
      'Coarse becomes fine through repetition.',
    ],
  },
  // Tier 2
  {
    id: 'approach',
    name: 'Approach a Stranger',
    tier: 2,
    gives: { encounter: 1 },
    costs: { food: 2 },
    reqs: { paths: 10, food: 15 },
    flavors: [
      'Gestures first. Always gestures first.',
      'They do not run. That is something.',
      'You offer what you have.',
    ],
  },
  {
    id: 'learnWords',
    name: 'Learn Their Words',
    tier: 2,
    gives: { language: 1 },
    costs: { encounter: 1 },
    reqs: { encounter: 5 },
    flavors: [
      'Point. Name. Repeat.',
      'The word for fire. The word for water.',
      'Your accent marks you as outside.',
    ],
  },
  {
    id: 'offerTrade',
    name: 'Offer What You Have',
    tier: 2,
    gives: { trade: 1 },
    costs: { foraging: 3 },
    reqs: { encounter: 5, foraging: 15 },
    flavors: [
      "What's common here is rare there.",
      'Trade is its own language.',
    ],
  },
  {
    id: 'askPlace',
    name: 'Ask About This Place',
    tier: 2,
    gives: { lore: 1 },
    costs: { language: 1 },
    reqs: { language: 10 },
    flavors: [
      'They name the hill. The name is old.',
      'A warning. A story. Both at once.',
    ],
  },
  {
    id: 'visitGraves',
    name: 'Visit the Graves',
    tier: 2,
    gives: { theDeadNear: 1 },
    costs: { encounter: 1 },
    reqs: { encounter: 10 },
    flavors: [
      'Fresh flowers on old earth.',
      'They speak to their dead as though they hear.',
      'Death is not abstract here.',
    ],
  },
  // Tier 3
  {
    id: 'returnAgain',
    name: 'Return Again',
    tier: 3,
    gives: { trust: 1 },
    costs: { food: 3 },
    reqs: { language: 15, encounter: 20 },
    flavors: [
      'Trust is built through showing up.',
      'They expected you this time.',
      'Presence over time. There is no shortcut.',
    ],
  },
  {
    id: 'shapeMaterial',
    name: 'Shape at the Bench',
    tier: 3,
    gives: { craft: 1 },
    costs: { foraging: 2 },
    reqs: { practice: 15, foraging: 15 },
    flavors: [
      'Flint finds its edge.',
      'What you make marks who you are.',
      'The arrowhead holds your name.',
    ],
  },
  {
    id: 'studyMarks',
    name: 'Study the Marks',
    tier: 3,
    gives: { symbols: 1 },
    costs: { lore: 1 },
    reqs: { lore: 10 },
    flavors: [
      'The same spiral, on three different stones.',
      'You saw this mark before. Far from here.',
    ],
  },
  {
    id: 'letNameTravel',
    name: 'Let Your Name Travel',
    tier: 3,
    gives: { reputation: 0.5, encounter: 0.3 },
    costs: { trade: 2 },
    reqs: { trade: 10, encounter: 15 },
    flavors: [
      'Your name arrives before you do.',
      'They heard about the blade you shaped.',
    ],
  },
  {
    id: 'countSunrises',
    name: 'Count the Sunrises',
    tier: 3,
    gives: { seasons: 1 },
    costs: {},
    reqs: { weather: 20, food: 30 },
    flavors: [
      'The year turns. You feel it in the light.',
      'You begin to know when things change.',
    ],
  },
  {
    id: 'watchNight',
    name: 'Watch the Night Sky',
    tier: 3,
    gives: { moonRes: 1 },
    costs: {},
    reqs: { body: 15, weather: 10 },
    flavors: [
      'The shorter cycle within the longer.',
      'The moon tells a different time.',
    ],
  },
  // Tier 4
  {
    id: 'sitElders',
    name: 'Sit with the Elders',
    tier: 4,
    gives: { tellings: 1 },
    costs: { trust: 2, food: 3 },
    reqs: { trust: 20 },
    flavors: [
      'Every teller shapes the tale.',
      'The differences between versions matter more than the words.',
    ],
  },
  {
    id: 'enterCircle',
    name: 'Enter the Circle',
    tier: 4,
    gives: { sacred: 1 },
    costs: { body: 2 },
    reqs: { symbols: 10, body: 20 },
    flavors: [
      'The backs of your knees know this ground.',
      'Something in the stones responds to your attention.',
    ],
  },
  {
    id: 'joinRite',
    name: 'Join the Rite',
    tier: 4,
    gives: { ritual: 1 },
    costs: { trust: 2, seasons: 1 },
    reqs: { trust: 15, seasons: 10, moonRes: 5 },
    flavors: [
      'Not worship. Maintenance.',
      'The rite keeps the world turning.',
    ],
  },
  {
    id: 'seeConnections',
    name: 'See the Connections',
    tier: 4,
    gives: { pattern: 1 },
    costs: { symbols: 2 },
    reqs: { symbols: 15, tellings: 5 },
    flavors: [
      'The spiral on the panel. The mark on the cairn. One thing.',
      'Truth triangulated across tellings.',
    ],
  },
  {
    id: 'touchStones',
    name: 'Touch the Old Stones',
    tier: 4,
    gives: { theDeadFar: 1 },
    costs: { theDeadNear: 1 },
    reqs: { theDeadNear: 10, sacred: 5 },
    flavors: [
      'Their bones are in the land.',
      'The barrow-builders chose these places.',
    ],
  },
  // Tier 5
  {
    id: 'rememberForgotten',
    name: 'Remember What Was Forgotten',
    tier: 5,
    gives: { oldKnowledge: 1 },
    costs: { pattern: 2, tellings: 2 },
    reqs: { pattern: 15, tellings: 10, theDeadFar: 10 },
    flavors: [
      'It was always here. Beneath everything.',
      'The land remembers what the people forgot.',
    ],
  },
  {
    id: 'enterBarrow',
    name: 'Enter the Barrow',
    tier: 5,
    gives: { passage: 1 },
    costs: { oldKnowledge: 3, ritual: 2, sacred: 2 },
    reqs: { oldKnowledge: 20, ritual: 10, sacred: 10 },
    flavors: [
      'The barrow is a grave. You crawl through the place of the dead.',
      'What comes out is not who went in.',
    ],
  },
];
