// Server-side settings service - uses direct database access
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { DEFAULT_GAME_SCHEDULE, resolveGameSchedule } from "@/utils/gameConfig";
import { KHAIWAL_NAME, WHATSAPP_NUMBER } from "@/utils/contactConfig";

// Default game schedule
const defaultGameSchedule = DEFAULT_GAME_SCHEDULE;

async function fetchSettingsFromDB() {
    try {
        await connectDB();
        const settings = await Settings.findOne({}).lean();

        if (!settings) {
            return null;
        }

        // Convert MongoDB _id to string for serialization
        return JSON.parse(JSON.stringify(settings));
    } catch (error) {
        console.error("Error fetching settings from DB:", error);
        return null;
    }
}

export const getSettingsFromDB = unstable_cache(fetchSettingsFromDB, ["site-settings"], {
    revalidate: 300,
});

export function buildSiteConfig(settings) {
    // Build khaiwal sections from settings
    const khaiwalSection1 = settings?.khaiwalSection1 || {
        enabled: true,
        contactName: KHAIWAL_NAME,
        whatsappNumber: WHATSAPP_NUMBER,
        paymentNumber: settings?.site1_paymentNumber || "",
        rate: settings?.site1_rate || "",
        gameSchedule: defaultGameSchedule
    };

    const khaiwalSection2 = settings?.khaiwalSection2 || {
        enabled: false,
        contactName: settings?.site2_contactName || "",
        whatsappNumber: settings?.site2_whatsappNumber || "",
        paymentNumber: settings?.site2_paymentNumber || "",
        rate: settings?.site2_rate || "",
        gameSchedule: defaultGameSchedule
    };

    // Site configuration with khaiwal sections
    return {
        siteName: "Daily satta kings",
        contactName: settings?.site2_contactName || settings?.contactName || "",
        whatsappNumber: WHATSAPP_NUMBER,
        paymentNumber: settings?.site2_paymentNumber || "",
        rate: settings?.site2_rate || "",
        // Khaiwal sections for bottom static section
        khaiwalSection1: {
            ...khaiwalSection1,
            contactName: KHAIWAL_NAME,
            whatsappNumber: WHATSAPP_NUMBER,
            gameSchedule: resolveGameSchedule(khaiwalSection1.gameSchedule || defaultGameSchedule)
        },
        khaiwalSection2: {
            ...khaiwalSection2,
            gameSchedule: resolveGameSchedule(khaiwalSection2.gameSchedule || defaultGameSchedule)
        }
    };
}
