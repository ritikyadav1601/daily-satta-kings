import mongoose from "mongoose";
import { DEFAULT_GAME_SCHEDULE } from "@/utils/gameConfig";

// Schema for individual game schedule item
const gameScheduleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: String, required: true }
}, { _id: false });

// Schema for khaiwal section
const khaiwalSectionSchema = new mongoose.Schema({
    enabled: { type: Boolean, default: true },
    contactName: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    telegramNumber: { type: String, default: "" },
    paymentNumber: { type: String, default: "" },
    rate: { type: String, default: "" },
    gameSchedule: { type: [gameScheduleSchema], default: [] }
}, { _id: false });

const adminFormControlsSchema = new mongoose.Schema({
    showWaitingGame: { type: Boolean, default: true }
}, { _id: false });

const settingsSchema = new mongoose.Schema(
    {
        // Legacy fields for backward compatibility
        site2_name: String,
        site2_contactName: String,
        site2_whatsappNumber: String,
        site2_paymentNumber: String,
        site2_rate: String,
        contactName: String,
        whatsappNumber: String,
        paymentNumber: { type: String, default: "" },
        siteName: {
            type: String,
            default: "Daily satta kings",
        },

        // Site 1 individual fields (backward compatibility)
        site1_contactName: String,
        site1_whatsappNumber: String,
        site1_paymentNumber: String,
        site1_rate: String,

        // New khaiwal sections configuration
        khaiwalSection1: {
            type: khaiwalSectionSchema,
            default: () => ({
                enabled: true,
                contactName: "",
                whatsappNumber: "",
                paymentNumber: "",
                rate: "",
                gameSchedule: DEFAULT_GAME_SCHEDULE
            })
        },
        khaiwalSection2: {
            type: khaiwalSectionSchema,
            default: () => ({
                enabled: false,
                contactName: "",
                whatsappNumber: "",
                paymentNumber: "",
                rate: "",
                gameSchedule: DEFAULT_GAME_SCHEDULE
            })
        },
        adminFormControls: {
            type: adminFormControlsSchema,
            default: () => ({
                showWaitingGame: true,
            })
        }
    },
    {
        timestamps: true,
    }
);

// Clear cached model in development to pick up schema changes
const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
