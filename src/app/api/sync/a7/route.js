import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { syncA7Results } from "@/services/a7Sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized(request) {
  const secret = process.env.A7_SYNC_SECRET || process.env.CRON_SECRET;

  if (!secret && process.env.NODE_ENV !== "production") {
    return true;
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const querySecret = new URL(request.url).searchParams.get("secret");

  return Boolean(secret && (token === secret || querySecret === secret));
}

function parseYears(value) {
  if (!value) return null;

  const years = value
    .split(",")
    .map((year) => Number(year.trim()))
    .filter(Boolean);

  return years.length ? years : null;
}

export async function GET(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days") || 7);
    const years = parseYears(searchParams.get("years"));

    await connectDB();

    const result = await syncA7Results({
      days: years ? null : days,
      years,
    });

    return NextResponse.json({
      ok: true,
      days: years ? null : days,
      years,
      ...result,
    });
  } catch (error) {
    console.error("A7Satta sync failed:", error);

    return NextResponse.json(
      { ok: false, error: "A7Satta sync failed", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}
