import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        game: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Game",
        },
        resultDate: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/,
        },
        result: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Create compound index for faster queries
resultSchema.index({ game: 1, resultDate: 1 });
resultSchema.index({ resultDate: 1 });

export default mongoose.models.GameResult || mongoose.model("GameResult", resultSchema, "gameresults");
