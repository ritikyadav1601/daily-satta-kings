// Create or reset an admin login for the /login page.
// Usage: node scripts/create-admin.js <loginId> <password>
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const { randomBytes, scryptSync } = require("crypto");

async function main() {
  const [loginId, password] = process.argv.slice(2);
  if (!loginId || !password) {
    console.error("Usage: node scripts/create-admin.js <loginId> <password>");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }
  const uri = process.env.KHAIWAL_MONGODB_URI;
  if (!uri) throw new Error("KHAIWAL_MONGODB_URI is missing in .env.local");

  const conn = await mongoose
    .createConnection(uri, {
      dbName: process.env.KHAIWAL_MONGODB_DATABASE || "khaiwal_management",
      serverSelectionTimeoutMS: 15000,
    })
    .asPromise();

  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, passwordSalt, 64).toString("hex");
  const now = new Date();

  const res = await conn.db.collection("admin_users").updateOne(
    { loginId: loginId.trim() },
    {
      $set: { loginId: loginId.trim(), passwordHash, passwordSalt, active: true, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  console.log(res.upsertedCount ? `Created admin "${loginId}"` : `Password reset for admin "${loginId}"`);
  await conn.close();
}

main().catch((e) => {
  console.error("Failed:", e.message);
  process.exit(1);
});
