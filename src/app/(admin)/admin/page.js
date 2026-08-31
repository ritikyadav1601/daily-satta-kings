"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.replace("/login");
      return;
    }

    async function loadKhaiwal() {
      try {
        const response = await fetch("/api/khaiwal", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load Khaiwal data");
        const data = await response.json();
        setName(data.name || "");
        setWhatsapp(data.whatsapp || "");
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadKhaiwal();
  }, [router]);

  async function saveKhaiwal(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/khaiwal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save Khaiwal data");
      setName(data.name);
      setWhatsapp(data.whatsapp);
      setMessage("Khaiwal details saved successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/20 border-t-black" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-black/10">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <h1 className="text-xl font-bold text-black">Khaiwal Admin</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-black/70 hover:bg-black/5 hover:text-black"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-xl px-4 py-12">
        <form onSubmit={saveKhaiwal} className="rounded-2xl border border-black/10 bg-black/[0.03] p-6 shadow-sm">
          <div className="mb-5">
            <label htmlFor="khaiwal-name" className="mb-2 block text-sm font-semibold text-black">
              Khaiwal Name
            </label>
            <input
              id="khaiwal-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-black outline-none focus:border-black"
              placeholder="Enter Khaiwal name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="khaiwal-whatsapp" className="mb-2 block text-sm font-semibold text-black">
              WhatsApp Number
            </label>
            <input
              id="khaiwal-whatsapp"
              type="tel"
              inputMode="numeric"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              required
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-black outline-none focus:border-black"
              placeholder="Enter WhatsApp number"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {message && <p className="mt-4 text-center text-sm text-black/70">{message}</p>}
        </form>
      </section>
    </main>
  );
}
