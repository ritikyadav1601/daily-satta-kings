export const GAMES = [
  {
    key: "sadar-bazar",
    mongoId: "6a072f5bb69d5189f84fedca",
    name: "SADAR BAZAR",
    hindiName: "सदर बाजार",
    time: "01:30 PM",
    order: 1,
  },
  {
    key: "gwalior",
    mongoId: "6a072f5bb69d5189f84fedcb",
    name: "GWALIOR",
    hindiName: "ग्वालियर",
    time: "02:30 PM",
    order: 2,
  },
  {
    key: "delhi-bazar",
    mongoId: "6a072f5bb69d5189f84fedd1",
    name: "DELHI BAZAR",
    hindiName: "दिल्ली बाजार",
    time: "02:50 PM",
    order: 3,
  },
  {
    key: "delhi-matka",
    mongoId: "6a080f7f36e45249629ca4fc",
    name: "DELHI MATKA",
    hindiName: "दिल्ली मटका",
    time: "03:20 PM",
    order: 4,
  },
  {
    key: "shri-ganesh",
    mongoId: "6a072f5bb69d5189f84fedcd",
    name: "SHRI GANESH",
    hindiName: "श्री गणेश",
    time: "04:20 PM",
    order: 5,
  },
  {
    key: "agra",
    mongoId: "6a072f5bb69d5189f84fedd2",
    name: "AGRA",
    hindiName: "आगरा",
    time: "05:20 PM",
    order: 6,
  },
  {
    key: "faridabad",
    mongoId: "6a072f5bb69d5189f84fedce",
    name: "FARIDABAD",
    hindiName: "फरीदाबाद",
    time: "05:50 PM",
    order: 7,
  },
  {
    key: "alwar",
    mongoId: "6a072f5bb69d5189f84fedd3",
    name: "ALWAR",
    hindiName: "अलवर",
    time: "07:20 PM",
    order: 8,
  },
  {
    key: "gaziabad",
    mongoId: "6a072f5bb69d5189f84fedcf",
    name: "GAZIABAD",
    hindiName: "गाजियाबाद",
    time: "08:50 PM",
    order: 9,
  },
  {
    key: "dwarka",
    mongoId: "6a072f5bb69d5189f84fedd4",
    name: "DWARKA",
    hindiName: "द्वारका",
    time: "10:10 PM",
    order: 10,
  },
  {
    key: "gali",
    mongoId: "6a072f5bb69d5189f84fedd0",
    name: "GALI",
    hindiName: "गली",
    time: "11:20 PM",
    order: 11,
  },
  {
    key: "disawer",
    mongoId: "6a072f5bb69d5189f84fedcc",
    name: "DISAWAR",
    hindiName: "दिसावर",
    time: "01:30 AM",
    order: 12,
  },
  // ── New games ──────────────────────────────────────────
];

export const DEFAULT_GAME_SCHEDULE = [
  { name: "SADAR BAZAR",   time: "01:30 PM" },
  { name: "GWALIOR",       time: "02:30 PM" },
  { name: "DELHI BAZAR",   time: "02:50 PM" },
  { name: "DELHI MATKA",   time: "03:20 PM" },
  { name: "SHRI GANESH",   time: "04:20 PM" },
  { name: "AGRA",          time: "05:20 PM" },
  { name: "FARIDABAD",     time: "05:50 PM" },
  { name: "ALWAR",         time: "07:20 PM" },
  { name: "GAZIABAD",      time: "08:50 PM" },
  { name: "DWARKA",        time: "10:10 PM" },
  { name: "GALI",          time: "11:20 PM" },
  { name: "DISAWAR",       time: "01:30 AM" },
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

export const GAME_MONGO_IDS = GAMES.map(game => game.mongoId);

export const getGameByMongoId = (mongoId) => {
  return GAMES.find(game => game.mongoId === String(mongoId));
};

// Get all game names for display
export const GAME_NAMES = GAMES.map(game => game.name);

// Create options for Sanity schema / admin dropdowns
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
