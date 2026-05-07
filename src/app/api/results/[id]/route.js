import { NextResponse } from "next/server";
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

    const plainResult = typeof result.toObject === "function" ? result.toObject() : result;
    const game = GAME_KEYS.includes(plainResult.game) ? plainResult.game : GAMES[0].key;
    const waitingGame = GAME_KEYS.includes(plainResult.waitingGame)
        ? plainResult.waitingGame
        : getNextGameKey(game);

    return {
        ...plainResult,
        game,
        waitingGame,
    };
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

    if (data.resultNumber && !/^\d+$/.test(data.resultNumber)) {
        errors.push("Result number should contain only numbers");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const data = await request.json();
        const validation = validateResultData(data);

        if (!validation.isValid) {
            return NextResponse.json(
                { errors: validation.errors },
                { status: 400 }
            );
        }

        const normalizedData = {
            ...data,
            game: data.game.toLowerCase().trim(),
            waitingGame: data.waitingGame ? data.waitingGame.toLowerCase().trim() : "",
        };

        const result = await Result.findByIdAndUpdate(id, normalizedData, { new: true });

        if (!result) {
            return NextResponse.json(
                { error: "Result not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(sanitizeResult(result));
    } catch (error) {
        console.error("Error updating result:", error);
        return NextResponse.json(
            { error: "Failed to update result" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const result = await Result.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json(
                { error: "Result not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Result deleted successfully" });
    } catch (error) {
        console.error("Error deleting result:", error);
        return NextResponse.json(
            { error: "Failed to delete result" },
            { status: 500 }
        );
    }
}
