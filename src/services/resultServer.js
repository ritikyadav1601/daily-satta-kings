// Server-side results service - uses direct database access
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import { GAMES, GAME_KEYS } from "@/utils/gameConfig";

function getNextGameKey(gameKey) {
    const currentIndex = GAMES.findIndex((game) => game.key === gameKey);
    if (currentIndex === -1) return GAMES[0].key;
    return GAMES[(currentIndex + 1) % GAMES.length].key;
}

function sanitizeResult(result) {
    if (!result) return result;

    const game = GAME_KEYS.includes(result.game) ? result.game : GAMES[0].key;
    const waitingGame = GAME_KEYS.includes(result.waitingGame)
        ? result.waitingGame
        : getNextGameKey(game);

    return {
        ...result,
        game,
        waitingGame,
    };
}

function sanitizeResults(results = []) {
    return results.map(sanitizeResult);
}

function getISTDate(daysOffset = 0) {
    const date = new Date();
    // Add IST offset (5.5 hours)
    date.setTime(date.getTime() + (5.5 * 60 * 60 * 1000));
    // Add/subtract days if needed
    if (daysOffset !== 0) {
        date.setDate(date.getDate() + daysOffset);
    }
    // Format as YYYY-MM-DD
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function fetchTodayResultFromDB() {
    try {
        await connectDB();
        const today = getISTDate();

        const results = await Result.find({ date: today, game: { $in: GAME_KEYS } })
            .sort({ updatedAt: -1 })
            .select("game date resultNumber waitingGame updatedAt")
            .lean();

        return JSON.parse(JSON.stringify(sanitizeResults(results)));
    } catch (error) {
        console.error("Error fetching today's results from DB:", error);
        return [];
    }
}

async function fetchYesterdayResultsFromDB() {
    try {
        await connectDB();
        const yesterday = getISTDate(-1);

        const results = await Result.find({ date: yesterday, game: { $in: GAME_KEYS } })
            .sort({ updatedAt: -1 })
            .select("game date resultNumber waitingGame updatedAt")
            .lean();

        return JSON.parse(JSON.stringify(sanitizeResults(results)));
    } catch (error) {
        console.error("Error fetching yesterday's results from DB:", error);
        return [];
    }
}

async function fetchLastResultFromDB() {
    try {
        await connectDB();
        const result = await Result.find({ game: { $in: GAME_KEYS } })
            .sort({ updatedAt: -1 })
            .limit(1)
            .select("game date resultNumber waitingGame updatedAt")
            .lean();

        if (!result || result.length === 0) return null;
        return JSON.parse(JSON.stringify(sanitizeResult(result[0])));
    } catch (error) {
        console.error("Error fetching last result from DB:", error);
        return null;
    }
}

async function fetchMonthlyResultsFromDB(month, year) {
    try {
        await connectDB();
        const monthStr = String(month).padStart(2, '0');
        const startDate = `${year}-${monthStr}-01`;
        const endDate = `${year}-${monthStr}-31`;

        const results = await Result.find({
            game: { $in: GAME_KEYS },
            date: { $gte: startDate, $lte: endDate }
        })
            .sort({ date: 1 })
            .select("game date resultNumber waitingGame")
            .lean();

        return JSON.parse(JSON.stringify(sanitizeResults(results)));
    } catch (error) {
        console.error("Error fetching monthly results from DB:", error);
        return [];
    }
}

async function fetchDisawarDataFromDB() {
    try {
        await connectDB();
        const today = getISTDate();
        const yesterday = getISTDate(-1);

        // Get today's DISAWAR result (use lowercase 'disawer' as stored in DB)
        const todayResult = await Result.findOne({
            date: today,
            game: 'disawer'
        }).select("resultNumber").lean();

        // Get yesterday's DISAWAR result
        const yesterdayResult = await Result.findOne({
            date: yesterday,
            game: 'disawer'
        }).select("resultNumber").lean();

        return {
            today: todayResult?.resultNumber || null,
            yesterday: yesterdayResult?.resultNumber || null
        };
    } catch (error) {
        console.error("Error fetching DISAWAR data from DB:", error);
        return { today: null, yesterday: null };
    }
}

export const getTodayResultFromDB = unstable_cache(fetchTodayResultFromDB, ["today-results"], {
    revalidate: 30,
});

export const getYesterdayResultsFromDB = unstable_cache(fetchYesterdayResultsFromDB, ["yesterday-results"], {
    revalidate: 60,
});

export const getLastResultFromDB = unstable_cache(fetchLastResultFromDB, ["last-result"], {
    revalidate: 30,
});

export const getMonthlyResultsFromDB = unstable_cache(fetchMonthlyResultsFromDB, ["monthly-results"], {
    revalidate: 60,
});

export const getDisawarDataFromDB = unstable_cache(fetchDisawarDataFromDB, ["disawar-data"], {
    revalidate: 30,
});

async function fetchYearlyResultsFromDB(gameKey, year) {
    try {
        await connectDB();
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const results = await Result.find({
            game: gameKey,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 }).select("game date resultNumber waitingGame").lean();

        return JSON.parse(JSON.stringify(sanitizeResults(results)));
    } catch (error) {
        console.error("Error fetching yearly results from DB:", error);
        return [];
    }
}

export const getYearlyResultsFromDB = unstable_cache(fetchYearlyResultsFromDB, ["yearly-results"], {
    revalidate: 300,
});

// ==================== CHART HELPERS ====================
const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

export const gameSlugMapping = {};
GAMES.forEach(game => {
    years.forEach(year => {
        gameSlugMapping[`${game.key.replace('_', '-')}-yearly-chart-${year}`] = game.key;
    });
});

export function parseSlugData(slug) {
    const gameDisplayNames = {};

    GAMES.forEach(game => {
        years.forEach(year => {
            gameDisplayNames[`${game.key.replace('_', '-')}-yearly-chart-${year}`] = {
                name: game.name,
                year: String(year)
            };
        });
    });

    return gameDisplayNames[slug] || null;
}

export function transformYearlyData(results) {
    const months = {
        JAN: {}, FEB: {}, MAR: {}, APR: {}, MAY: {}, JUN: {},
        JUL: {}, AUG: {}, SEP: {}, OCT: {}, NOV: {}, DEC: {}
    };

    const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    results.forEach(result => {
        const date = new Date(result.date);
        const month = monthNames[date.getMonth()];
        const day = date.getDate();

        if (months[month]) {
            months[month][day] = result.resultNumber;
        }
    });

    return months;
}
