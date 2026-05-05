"use client";
import { DEFAULT_GAME_SCHEDULE, GAMES } from "@/utils/gameConfig";
import { Typewriter } from "react-simple-typewriter";
import GameSection from "./GameSection";
import KhaiwalCard from "./KhaiwalCard";
import SattaResultTable from "./SattaResultTable";
import SimpleFAQ from "./SimpleFAQ";
import Link from "next/link";
import Image from "next/image";

const SattaDashboard = ({
  todayResults = [],
  yesterdayResults = [],
  lastResult,
  setting,
  monthlyResults = [],
  disawarData,
  currentSite = "site 3",
  siteName = "Daily satta kings",
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Use site name from settings or props
  const displaySiteName = setting?.siteName || siteName;

  // Get current day of the month
  const currentDay = currentDate.getDate();
  const telegramNumber = "123456789";

  // Create monthly chart data using centralized config
  const createMonthlyChart = () => {
    const rows = [];
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");

    // Only show rows up to current day
    for (let day = 1; day <= currentDay; day++) {
      const row = { day };
      const dayStr = `${currentYear}-${monthStr}-${String(day).padStart(2, "0")}`;

      GAMES.forEach((game, index) => {
        // Find result for this specific date and game
        const result = monthlyResults.find(
          (r) => r.date === dayStr && r.game === game.key
        );
        row[`game${index}`] = result ? result.resultNumber : "--";
      });

      rows.push(row);
    }
    return rows;
  };

  const monthlyChartData = createMonthlyChart();

  const khaiwalSection1 = setting?.khaiwalSection1 || {
    enabled: true,
    contactName: setting?.contactName || "TEJU BHAI KHAIWAL",
    whatsappNumber: setting?.whatsappNumber || "",
    rate: setting?.rate || "",
    gameSchedule: DEFAULT_GAME_SCHEDULE,
  };

  const khaiwalSection2 = setting?.khaiwalSection2 || {
    enabled: false,
    contactName: "",
    whatsappNumber: "",
    rate: "",
    gameSchedule: DEFAULT_GAME_SCHEDULE,
  };

  const showSecondKhaiwalSection = khaiwalSection2?.enabled && khaiwalSection2?.contactName;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <div className="mx-auto">
        {/* Current Featured Game */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-700 py-4">
            <p className="text-xl md:text-2xl font-bold text-white hindi-text">
              <Typewriter
                words={["ईमानदारी ही हमारी पहचान है।"]}
                cursor
                cursorBlinking={false}
                cursorStyle=""
                typeSpeed={80}
              />
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-300 py-5 shadow-lg shadow-teal-500/20">
            <h2 className="text-3xl px-3 lg:text-4xl text-slate-950 font-black tracking-tight">
              {displaySiteName}
            </h2>
          </div>
          {/* Live Results Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 py-2 border-y border-teal-400/20">
            <p className="text-lg md:text-xl font-bold italic text-amber-300 text-center">
              Live Daily satta kings Result.
            </p>
          </div>
        </div>

        <GameSection
          data={lastResult}
          setting={setting}
          disawarData={disawarData}
          todayResults={todayResults}
        />
        <SattaResultTable
          todayResults={todayResults}
          yesterdayResults={yesterdayResults}
        />

        <section className="py-8 px-2 md:px-4">
          <div className={`max-w-6xl mx-auto ${showSecondKhaiwalSection ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "max-w-md"}`}>
            <KhaiwalCard section={khaiwalSection1} />
            {showSecondKhaiwalSection && (
              <KhaiwalCard section={khaiwalSection2} />
            )}
          </div>
        </section>


        {/* Chart Grid */}
        <div className="mt-8 px-2 md:px-4">
          <div className="bg-gradient-to-r from-teal-700 via-slate-900 to-sky-700 rounded-t-2xl py-5 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold flex items-center justify-center gap-3">
              <span>📅</span>
              <span>{currentMonth} MONTH CHART {currentYear}</span>
              <span>📅</span>
            </h2>
          </div>

          <div className="overflow-x-auto bg-slate-950 rounded-b-2xl shadow-sm border border-teal-400/20">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="border border-teal-400/20 px-3 py-3 text-amber-300 text-sm font-bold sticky left-0 bg-slate-900 z-10">
                    S.No
                  </th>
                  {GAMES.map((game, index) => (
                    <th
                      key={index}
                      className="border border-teal-400/20 px-3 py-3 text-slate-200 text-xs font-semibold whitespace-nowrap"
                    >
                      {game.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyChartData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-teal-900/30 transition-colors duration-200 bg-slate-900/60"
                  >
                    <td className="border border-teal-400/20 px-3 py-2.5 text-center text-amber-300 text-sm font-bold sticky left-0 bg-slate-900 z-10">
                      {rowIndex + 1}
                    </td>
                    {GAMES.map((_, gameIndex) => (
                      <td
                        key={gameIndex}
                        className="border border-teal-400/20 px-3 py-2.5 hover:bg-teal-900/35 transition-colors text-center text-teal-200 text-sm font-medium"
                      >
                        {row[`game${gameIndex}`]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Decorative */}
        <div className="py-8 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full"></div>
        </div>

        {/* FAQ Section */}
        <SimpleFAQ />
        <div className="flex flex-col justify-center items-center mt-5 gap-2">
          <p className="text-center text-teal-50 text-base mb-1 mt-2 hindi-text">
            Join our Telegram channel to get results quickly and receive superfast results:
          </p>
          {telegramNumber && (
            <Link
              target="_blank"
              href={`https://t.me/${telegramNumber}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 btn-glow"
            >
              <span><Image src='/telegram-icon.webp' height={24} width={24} /></span>
              <span className="hindi-text">Telegram पर संपर्क करें</span>
            </Link>
          )}
        </div>

        {/* Footer Spacing */}
        <div className="py-8 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SattaDashboard;
