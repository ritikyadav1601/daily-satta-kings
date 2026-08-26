import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import { GAMES, GAME_KEYS, GAME_MONGO_IDS, getGameByMongoId } from "@/utils/gameConfig";

function getNextGameKey(gameKey) {
    const currentIndex = GAMES.findIndex((activeGame) => activeGame.key === gameKey);
    if (currentIndex === -1) return GAMES[0].key;
    return GAMES[(currentIndex + 1) % GAMES.length].key;
}

function sanitizeResult(result) {
    if (!result) return result;

    const plainResult = typeof result.toObject === "function" ? result.toObject() : result;
    const sourceGame = getGameByMongoId(plainResult.game);
    if (!sourceGame) return null;
    const game = sourceGame.key;

    return {
        ...plainResult,
        game,
        date: plainResult.resultDate,
        resultNumber: plainResult.result,
        waitingGame: getNextGameKey(game),
    };
}

function sanitizeResults(results = []) {
    return results.map(sanitizeResult).filter(Boolean);
}

function normalizeResultData(data) {
    const game = GAMES.find((item) => item.key === data.game.toLowerCase().trim());
    return {
        game: game.mongoId,
        resultDate: data.date,
        result: data.resultNumber,
    };
}

export async function GET(request) {
    try {
        await connectDB();

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const game = searchParams.get("game");
        const date = searchParams.get("date");
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const type = searchParams.get("type"); // 'today', 'yesterday', 'last', 'disawar'

        let query = {};

        if (type === "today") {
            // Get today's results
            const today = getISTDate();
            query = { resultDate: today, game: { $in: GAME_MONGO_IDS } };
        } else if (type === "yesterday") {
            // Get yesterday's results
            const yesterday = getISTDate(-1);
            query = { resultDate: yesterday, game: { $in: GAME_MONGO_IDS } };
        } else if (type === "last") {
            // Get last result
            const results = await Result.findOne({
                game: { $in: GAME_MONGO_IDS },
                result: { $nin: ["", null] },
            }).sort({ updatedAt: -1 });
            return NextResponse.json(sanitizeResult(results) || {});
        } else if (type === "disawar") {
            // Get disawar results
            const today = getISTDate();
            const yesterday = getISTDate(-1);

            const [todayResult, yesterdayResult] = await Promise.all([
                Result.findOne({ game: GAMES.find((item) => item.key === "disawer").mongoId, resultDate: today }),
                Result.findOne({ game: GAMES.find((item) => item.key === "disawer").mongoId, resultDate: yesterday }),
            ]);

            return NextResponse.json({
                today: todayResult?.result || null,
                yesterday: yesterdayResult?.result || null,
            });
        } else if (month && year) {
            // Get monthly results
            const start = `${year}-${String(month).padStart(2, "0")}-01`;
            const end = `${year}-${String(month).padStart(2, "0")}-31`;
            query = { resultDate: { $gte: start, $lte: end }, game: { $in: GAME_MONGO_IDS } };
        } else if (game && year) {
            // Get yearly results for a specific game
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;
            const selectedGame = GAMES.find((item) => item.key === game.toLowerCase().trim());
            query = {
                game: selectedGame?.mongoId || "",
                resultDate: { $gte: startDate, $lte: endDate },
            };
        } else if (game) {
            // Get results by game
            query = { game: GAMES.find((item) => item.key === game.toLowerCase().trim())?.mongoId || "" };
        } else if (date) {
            // Get results by date
            query = { resultDate: date, game: { $in: GAME_MONGO_IDS } };
        } else {
            query = { game: { $in: GAME_MONGO_IDS } };
        }

        const results = await Result.find(query).sort({ resultDate: -1 });
        return NextResponse.json(sanitizeResults(results));
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json(
            { error: "Failed to fetch results" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();

        // Validate data
        const validation = validateResultData(data);
        if (!validation.isValid) {
            return NextResponse.json(
                { errors: validation.errors },
                { status: 400 }
            );
        }

        // Normalize data
        const normalizedData = normalizeResultData(data);

        const result = await Result.create(normalizedData);
        return NextResponse.json(sanitizeResult(result), { status: 201 });
    } catch (error) {
        console.error("Error creating result:", error);
        return NextResponse.json(
            { error: "Failed to create result" },
            { status: 500 }
        );
    }
}

function getISTDate(daysOffset = 0) {
    const date = new Date();
    date.setTime(date.getTime() + 5.5 * 60 * 60 * 1000);
    if (daysOffset !== 0) {
        date.setDate(date.getDate() + daysOffset);
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function validateResultData(data) {
    const errors = [];

    if (!data.game) {
        errors.push("Game is required");
    } else if (!GAME_KEYS.includes(data.game.toLowerCase().trim())) {
        errors.push("Game must be one of the active Daily satta kings cities");
    }

    if (!data.resultNumber) {
        errors.push("Result number is required");
    }

    if (data.waitingGame && !GAME_KEYS.includes(data.waitingGame.toLowerCase().trim())) {
        errors.push("Waiting game must be one of the active Daily satta kings cities");
    }

    if (data.waitingGame && data.game === data.waitingGame) {
        errors.push("Waiting game must be different from the selected game");
    }

    if (!data.date) {
        errors.push("Date is required");
    }

    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        errors.push("Date must be in YYYY-MM-DD format");
    }

    // Validate that date is not older than 2 years
    if (data.date) {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        const cutoffDate = `${twoYearsAgo.getFullYear()}-${String(twoYearsAgo.getMonth() + 1).padStart(2, '0')}-${String(twoYearsAgo.getDate()).padStart(2, '0')}`;

        if (data.date < cutoffDate) {
            errors.push(`Date must be within the last 2 years (after ${cutoffDate})`);
        }
    }

    if (data.resultNumber && !/^\d+$/.test(data.resultNumber)) {
        errors.push("Result number should contain only numbers");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
