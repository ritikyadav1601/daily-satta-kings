import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET(request) {
    try {
        await connectDB();

        const settings = await Settings.findOne({}).lean();

        if (!settings) {
            return NextResponse.json({});
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        await connectDB();

        const data = await request.json();

        console.log("Received khaiwalSection1:", data.khaiwalSection1 ? "present" : "missing");
        console.log("Received khaiwalSection2:", data.khaiwalSection2 ? "present" : "missing");

        // Remove _id from update data to avoid immutable field error
        const { _id, ...updateData } = data;
        updateData.updatedAt = new Date();

        // Use MongoDB collection directly to bypass mongoose schema restrictions
        const collection = Settings.collection;

        await collection.updateOne(
            {},
            { $set: updateData },
            { upsert: true }
        );

        // Fetch the updated document
        const settings = await collection.findOne({});

        console.log("Settings saved - khaiwalSection1:", settings?.khaiwalSection1 ? "saved" : "missing");
        console.log("Settings saved - khaiwalSection2:", settings?.khaiwalSection2 ? "saved" : "missing");

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
