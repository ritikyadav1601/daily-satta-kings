import { NextResponse } from "next/server";
import { connectKhaiwalDB } from "@/lib/khaiwalDb";

const getSiteId = () => process.env.KHAIWAL_SITE_ID || process.env.NEXT_PUBLIC_SITE_ID;

export async function GET() {
  try {
    const siteId = getSiteId();
    if (!siteId) return NextResponse.json({ error: "Site ID is not configured" }, { status: 500 });
    const connection = await connectKhaiwalDB();
    const data = await connection.db.collection("site_settings").findOne(
      { siteId },
      { projection: { _id: 0, name: 1, whatsapp: 1 } }
    );
    return NextResponse.json(data || { name: "", whatsapp: "" });
  } catch (error) {
    console.error("Error fetching Khaiwal:", error);
    return NextResponse.json({ error: "Failed to fetch Khaiwal" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const siteId = getSiteId();
    if (!siteId) return NextResponse.json({ error: "Site ID is not configured" }, { status: 500 });
    const body = await request.json();
    const name = String(body.name || "").trim();
    const whatsapp = String(body.whatsapp || "").replace(/\D/g, "");
    if (!name || !whatsapp) {
      return NextResponse.json({ error: "Name and WhatsApp number are required" }, { status: 400 });
    }
    const connection = await connectKhaiwalDB();
    await connection.db.collection("site_settings").updateOne(
      { siteId },
      { $set: { name, whatsapp, updatedAt: new Date() }, $setOnInsert: { siteId } },
      { upsert: true }
    );
    return NextResponse.json({ name, whatsapp });
  } catch (error) {
    console.error("Error saving Khaiwal:", error);
    return NextResponse.json({ error: "Failed to save Khaiwal" }, { status: 500 });
  }
}
