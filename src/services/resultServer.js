// Server-side results service - uses direct database access
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import { GAMES, GAME_MONGO_IDS, getGameByMongoId } from "@/utils/gameConfig";

function getNextGameKey(gameKey) {
    const currentIndex = GAMES.findIndex((game) => game.key === gameKey);
    if (currentIndex === -1) return GAMES[0].key;
    return GAMES[(currentIndex + 1) % GAMES.length].key;
}

function sanitizeResult(result) {
    if (!result) return result;

    const sourceGame = getGameByMongoId(result.game);
    if (!sourceGame) return null;
    const game = sourceGame.key;

    return {
        ...result,
        game,
        date: result.resultDate,
        resultNumber: result.result,
        waitingGame: getNextGameKey(game),
    };
}

function sanitizeResults(results = []) {
    return results.map(sanitizeResult).filter(Boolean);
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

        const results = await Result.find({ resultDate: today, game: { $in: GAME_MONGO_IDS } })
            .sort({ updatedAt: -1 })
            .select("game resultDate result updatedAt")
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

        const results = await Result.find({ resultDate: yesterday, game: { $in: GAME_MONGO_IDS } })
            .sort({ updatedAt: -1 })
            .select("game resultDate result updatedAt")
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
        const result = await Result.find({
            game: { $in: GAME_MONGO_IDS },
            result: { $nin: ["", null] },
        })
            .sort({ updatedAt: -1 })
            .limit(1)
            .select("game resultDate result updatedAt")
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
            game: { $in: GAME_MONGO_IDS },
            resultDate: { $gte: startDate, $lte: endDate }
        })
            .sort({ resultDate: 1 })
            .select("game resultDate result")
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
            resultDate: today,
            game: GAMES.find((game) => game.key === "disawer").mongoId
        }).select("result").lean();

        // Get yesterday's DISAWAR result
        const yesterdayResult = await Result.findOne({
            resultDate: yesterday,
            game: GAMES.find((game) => game.key === "disawer").mongoId
        }).select("result").lean();

        return {
            today: todayResult?.result || null,
            yesterday: yesterdayResult?.result || null
        };
    } catch (error) {
        console.error("Error fetching DISAWAR data from DB:", error);
        return { today: null, yesterday: null };
    }
}

export const getTodayResultFromDB = fetchTodayResultFromDB;
export const getYesterdayResultsFromDB = fetchYesterdayResultsFromDB;
export const getLastResultFromDB = fetchLastResultFromDB;
export const getMonthlyResultsFromDB = fetchMonthlyResultsFromDB;
export const getDisawarDataFromDB = fetchDisawarDataFromDB;

async function fetchYearlyResultsFromDB(gameKey, year) {
    try {
        await connectDB();
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const game = GAMES.find((item) => item.key === gameKey);
        if (!game) return [];

        const results = await Result.find({
            game: game.mongoId,
            resultDate: { $gte: startDate, $lte: endDate }
        }).sort({ resultDate: 1 }).select("game resultDate result").lean();

        return JSON.parse(JSON.stringify(sanitizeResults(results)));
    } catch (error) {
        console.error("Error fetching yearly results from DB:", error);
        return [];
    }
}

export const getYearlyResultsFromDB = fetchYearlyResultsFromDB;

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
