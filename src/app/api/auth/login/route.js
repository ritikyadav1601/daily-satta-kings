// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "crypto";
import { connectKhaiwalDB } from "@/lib/khaiwalDb";
import {
  sendLoginNotification,
  getClientDetails,
} from "../../../../lib/email";

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const clientDetails = getClientDetails(request);

    const connection = await connectKhaiwalDB();
    const admin = await connection.db.collection("admin_users").findOne({
      loginId: String(username || "").trim(),
      active: true,
    });

    let passwordMatches = false;
    if (admin?.passwordHash && admin?.passwordSalt && password) {
      const storedHash = Buffer.from(admin.passwordHash, "hex");
      const enteredHash = scryptSync(String(password), admin.passwordSalt, storedHash.length);
      passwordMatches = storedHash.length === enteredHash.length &&
        timingSafeEqual(storedHash, enteredHash);
    }

    if (!admin || !passwordMatches) {
      // Send failed login notification
      sendLoginNotification({
        success: false,
        ...clientDetails,
      });

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = Buffer.from(`${admin.loginId}:${Date.now()}`).toString("base64");

    const user = {
      id: 1,
      username: admin.loginId,
      role: "admin",
      loginTime: new Date().toISOString(),
    };

    // Send success notification (don't await to avoid delays)
    sendLoginNotification({
      success: true,
      ...clientDetails,
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
