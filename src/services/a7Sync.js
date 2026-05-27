import Result from "@/models/Result";
import { GAMES } from "@/utils/gameConfig";

function getNextGameKey(gameKey) {
  const currentIndex = GAMES.findIndex((game) => game.key === gameKey);
  if (currentIndex === -1) return GAMES[0].key;
  return GAMES[(currentIndex + 1) % GAMES.length].key;
}

function extractNextData(html, url) {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  );

  if (!match) {
    throw new Error(`Could not find A7Satta page data for ${url}`);
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

function getDateCutoff(days) {
  if (!days) return null;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(days) + 1);

  return `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(
    cutoff.getDate()
  ).padStart(2, "0")}`;
}

async function fetchGameResults(game, options = {}) {
  const url = `https://a7satta.com/${game.key}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "user-agent": "DailySattaKings result sync",
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  const html = await response.text();
  const nextData = extractNextData(html, url);
  const pageResults = nextData?.props?.pageProps?.data;

  if (!Array.isArray(pageResults)) {
    throw new Error(`No A7Satta data array found for ${game.key}`);
  }

  const years = options.years?.length ? new Set(options.years.map(Number)) : null;
  const cutoffDate = getDateCutoff(options.days);
  const byDate = new Map();

  for (const row of pageResults) {
    const date = toIsoDate(row.resultDate);
    const resultNumber = normalizeResultNumber(row.result);

    if (!date || !resultNumber) {
      continue;
    }

    if (years && !years.has(Number(date.slice(0, 4)))) {
      continue;
    }

    if (cutoffDate && date < cutoffDate) {
      continue;
    }

    byDate.set(date, {
      game: game.key,
      date,
      resultNumber,
      waitingGame: getNextGameKey(game.key),
    });
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export async function syncA7Results(options = {}) {
  const summary = [];
  let totalFetched = 0;
  let totalMatched = 0;
  let totalModified = 0;
  let totalUpserted = 0;

  for (const game of GAMES) {
    const results = await fetchGameResults(game, options);
    totalFetched += results.length;

    if (results.length === 0) {
      summary.push({
        game: game.key,
        fetched: 0,
        matched: 0,
        modified: 0,
        upserted: 0,
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

  return {
    source: "https://a7satta.com/",
    games: GAMES.map((game) => game.key),
    fetched: totalFetched,
    matched: totalMatched,
    modified: totalModified,
    upserted: totalUpserted,
    summary,
  };
}
