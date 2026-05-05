
export const GAMES = [
  {
    key: "sadar-bazar",
    name: "SADAR BAZAR",
    time: "01:30 PM",
    order: 1,
  },
  {
    key: "gwalior",
    name: "GWALIOR",
    time: "02:30 PM",
    order: 2,
  },
  {
    key: "delhi-bazar",
    name: "DELHI BAZAR",
    time: "02:50 PM",
    order: 3,
  },
  {
    key: "delhi-matka",
    name: "DELHI MATKA",
    time: "03:20 PM",
    order: 4,
  },
  {
    key: "shri-ganesh",
    name: "SHRI GANESH",
    time: "04:20 PM",
    order: 5,
  },
  {
    key: "agra",
    name: "AGRA",
    time: "05:20 PM",
    order: 6,
  },
  {
    key: "faridabad",
    name: "FARIDABAD",
    time: "05:50 PM",
    order: 7,
  },
  {
    key: "alwar",
    name: "ALWAR",
    time: "07:20 PM",
    order: 8,
  },
  {
    key: "gaziabad",
    name: "GAZIABAD",
    time: "08:50 PM",
    order: 9,
  },
  {
    key: "dwarka",
    name: "DWARKA",
    time: "10:10 PM",
    order: 10,
  },
  {
    key: "gali",
    name: "GALI",
    time: "11:20 PM",
    order: 11,
  },
  {
    key: "disawer",
    name: "DISAWAR",
    time: "01:30 AM",
    order: 12,
  },
];

export const DEFAULT_GAME_SCHEDULE = [
  { name: "SADAR BAZAR", time: "01:30 PM" },
  { name: "GWALIOR", time: "02:30 PM" },
  { name: "DELHI BAZAR", time: "02:50 PM" },
  { name: "DELHI MATKA", time: "03:20 PM" },
  { name: "SHRI GANESH", time: "04:20 PM" },
  { name: "AGRA", time: "05:20 PM" },
  { name: "FARIDABAD", time: "05:50 PM" },
  { name: "ALWAR", time: "07:20 PM" },
  { name: "GAZIABAD", time: "08:50 PM" },
  { name: "DWARKA", time: "10:10 PM" },
  { name: "GALI", time: "11:20 PM" },
  { name: "DISAWAR", time: "01:30 AM" },
];

const ACTIVE_GAME_SCHEDULE = new Map(
  DEFAULT_GAME_SCHEDULE.map((game) => [game.name, game.time])
);

export const isLegacyGameSchedule = (schedule = []) => {
  if (schedule.length !== DEFAULT_GAME_SCHEDULE.length) {
    return true;
  }

  return schedule.some((game) => {
    const name = game?.name?.toUpperCase?.();
    return !ACTIVE_GAME_SCHEDULE.has(name) || ACTIVE_GAME_SCHEDULE.get(name) !== game?.time;
  });
};

export const resolveGameSchedule = (schedule = []) => {
  if (!Array.isArray(schedule) || schedule.length === 0 || isLegacyGameSchedule(schedule)) {
    return DEFAULT_GAME_SCHEDULE;
  }

  return schedule;
};

// Get game by key
export const getGameByKey = (key) => {
  return GAMES.find(game => game.key === key);
};

// Get game by name
export const getGameByName = (name) => {
  return GAMES.find(game => game.name === name);
};

// Get all game keys for queries
export const GAME_KEYS = GAMES.map(game => game.key);

// Get all game names for display
export const GAME_NAMES = GAMES.map(game => game.name);

// Create options for Sanity schema
export const GAME_OPTIONS = GAMES.map(game => ({
  title: game.name,
  value: game.key
}));

// Game mapping for backward compatibility
export const GAME_MAPPING = GAMES.reduce((acc, game) => {
  acc[game.key] = {
    displayName: game.name,
    time: game.time
  };
  return acc;
}, {});
