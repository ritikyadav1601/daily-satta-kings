require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing. Add it to .env.local before running this script.");
}

const ResultSchema = new mongoose.Schema(
  {
    game: { type: String, required: true, lowercase: true, trim: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    resultNumber: { type: String, required: true },
    waitingGame: { type: String, default: "", lowercase: true, trim: true },
  },
  { timestamps: true }
);

ResultSchema.index({ game: 1, date: 1 });
ResultSchema.index({ date: 1 });

const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);

function getMongoUri() {
  const match = MONGODB_URI.match(/^(mongodb(?:\+srv)?:\/\/)([^@]+)(@.+)$/);

  if (!match) {
    return MONGODB_URI;
  }

  const [, protocol, userInfo, rest] = match;
  const parts = userInfo.split(":");

  if (parts.length < 2) {
    return MONGODB_URI;
  }

  const username = parts.shift();
  const password = parts.join(":");

  try {
    decodeURIComponent(password);
    return MONGODB_URI;
  } catch {
    return `${protocol}${username}:${password.replace(/%/g, "%25")}${rest}`;
  }
}

const games = [
  { key: "sadar-bazar", slug: "sadar-bazar" },
  { key: "gwalior", slug: "gwalior" },
  { key: "delhi-bazar", slug: "delhi-bazar" },
  { key: "delhi-matka", slug: "delhi-matka" },
  { key: "shri-ganesh", slug: "shri-ganesh" },
  { key: "agra", slug: "agra" },
  { key: "faridabad", slug: "faridabad" },
  { key: "alwar", slug: "alwar" },
  { key: "gaziabad", slug: "gaziabad" },
  { key: "dwarka", slug: "dwarka" },
  { key: "gali", slug: "gali" },
  { key: "disawer", slug: "disawer" },
].map((game, index, allGames) => ({
  ...game,
  waitingGame: allGames[(index + 1) % allGames.length].key,
}));

const currentYear = new Date().getFullYear();
const years = new Set(
  process.argv
    .filter((arg) => arg.startsWith("--years="))
    .flatMap((arg) => arg.replace("--years=", "").split(","))
    .map((year) => Number(year.trim()))
    .filter(Boolean)
);
const dryRun = process.argv.includes("--dry-run");

if (years.size === 0) {
  years.add(currentYear - 1);
  years.add(currentYear);
}

function extractNextData(html, url) {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  );

  if (!match) {
    throw new Error(`Could not find __NEXT_DATA__ payload for ${url}`);
  }

  return JSON.parse(match[1]);
}

function toIsoDate(resultDate) {
  const [day, month, year] = String(resultDate).split("-");

  if (!day || !month || !year) {
    return null;
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function normalizeResultNumber(result) {
  if (result === null || result === undefined || result === "" || result === "-") {
    return null;
  }

  const value = String(result).trim();

  if (!/^\d+$/.test(value)) {
    return null;
  }

  return value.length === 1 ? value.padStart(2, "0") : value;
}

async function fetchGameResults(game) {
  const url = `https://a7satta.com/${game.slug}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  const html = await response.text();
  const nextData = extractNextData(html, url);
  const pageResults = nextData?.props?.pageProps?.data;

  if (!Array.isArray(pageResults)) {
    throw new Error(`No data array found for ${game.key}`);
  }

  const byDate = new Map();

  for (const row of pageResults) {
    const date = toIsoDate(row.resultDate);
    const resultNumber = normalizeResultNumber(row.result);

    if (!date || !resultNumber) {
      continue;
    }

    const year = Number(date.slice(0, 4));

    if (!years.has(year)) {
      continue;
    }

    byDate.set(date, {
      game: game.key,
      date,
      resultNumber,
      waitingGame: game.waitingGame,
    });
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function sync() {
  if (!dryRun) {
    await mongoose.connect(getMongoUri());
  }

  const summary = [];
  let totalMatched = 0;
  let totalModified = 0;
  let totalUpserted = 0;

  for (const game of games) {
    const results = await fetchGameResults(game);

    if (results.length === 0) {
      summary.push({ game: game.key, fetched: 0, matched: 0, modified: 0, upserted: 0 });
      continue;
    }

    if (dryRun) {
      summary.push({
        game: game.key,
        fetched: results.length,
        matched: 0,
        modified: 0,
        upserted: 0,
        first: results[0].date,
        last: results[results.length - 1].date,
      });
      continue;
    }

    const operations = results.map((result) => ({
      updateOne: {
        filter: { game: result.game, date: result.date },
        update: { $set: result },
        upsert: true,
      },
    }));

    const writeResult = await Result.bulkWrite(operations, { ordered: false });

    totalMatched += writeResult.matchedCount;
    totalModified += writeResult.modifiedCount;
    totalUpserted += writeResult.upsertedCount;

    summary.push({
      game: game.key,
      fetched: results.length,
      matched: writeResult.matchedCount,
      modified: writeResult.modifiedCount,
      upserted: writeResult.upsertedCount,
      first: results[0].date,
      last: results[results.length - 1].date,
    });
  }

  console.table(summary);
  console.log(
    `${dryRun ? "Dry run found" : "Synced"} A7Satta results for years ${[...years]
      .sort()
      .join(", ")}. ` +
      `Matched: ${totalMatched}, modified: ${totalModified}, inserted: ${totalUpserted}.`
  );

  if (!dryRun) {
    await mongoose.disconnect();
  }
}

sync().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
