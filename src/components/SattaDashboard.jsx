import { DEFAULT_GAME_SCHEDULE, GAMES } from "@/utils/gameConfig";
import GameSection from "./GameSection";
import KhaiwalCard from "./KhaiwalCard";
import InformationalContent from "./InformationalContent";
import SattaResultTable from "./SattaResultTable";
import SimpleFAQ from "./SimpleFAQ";
import { KHAIWAL_NAME, WHATSAPP_NUMBER } from "@/utils/contactConfig";

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

  const displaySiteName = setting?.siteName || siteName;
  const currentDay = currentDate.getDate();
  const telegramNumber = "123456789";

  const monthlyChartGames = GAMES.map((game) => {
    const shortNames = {
      "sadar-bazar":  "SADAR BAZAR",
      gwalior:        "GWALIOR",
      "delhi-bazar":  "DB",
      "delhi-matka":  "DELHI MATKA",
      "shri-ganesh":  "SG",
      agra:           "AGRA",
      faridabad:      "FBD",
      alwar:          "ALWAR",
      gaziabad:       "GZB",
      dwarka:         "DWARKA",
      gali:           "GALI",
      disawer:        "DS",
    };
    return {
      ...game,
      shortName: shortNames[game.key] || game.name,
    };
  });

  // ── Game groups for mobile ────────────────────────────────────
  const mainMonthlyGameKeys = [
    "disawer",
    "delhi-bazar",
    "shri-ganesh",
    "faridabad",
    "gaziabad",
    "gali",
  ];
  const originalRemainingGameKeys = [
    "sadar-bazar",
    "gwalior",
    "delhi-matka",
    "agra",
    "alwar",
    "dwarka",
  ];
  const mainMonthlyGames = mainMonthlyGameKeys
    .map((key) => monthlyChartGames.find((game) => game.key === key))
    .filter(Boolean);

  const remainingMonthlyGames = originalRemainingGameKeys
    .map((key) => monthlyChartGames.find((game) => game.key === key))
    .filter(Boolean);

  // Build monthly chart rows up to current day
  const createMonthlyChart = () => {
    const rows = [];
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");

    for (let day = 1; day <= currentDay; day++) {
      const row = { day };
      const dayStr = `${currentYear}-${monthStr}-${String(day).padStart(2, "0")}`;

      monthlyChartGames.forEach((game) => {
        const result = monthlyResults.find(
          (r) => r.date === dayStr && r.game === game.key
        );
        row[game.key] = result ? result.resultNumber : "--";
      });

      rows.push(row);
    }
    return rows;
  };

  const monthlyChartData = createMonthlyChart();

  // ── Mobile table renderer ─────────────────────────────────────
  const renderMonthlyTable = (games, label = null) => (
    <div>
      {label && (
        <p className="text-center text-amber-300 text-[10px] font-semibold tracking-widest uppercase mb-1 px-1">
          — {label} —
        </p>
      )}
      <div className="bg-slate-950 shadow-sm border border-teal-400/20 rounded-xl overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-teal-900 via-slate-800 to-teal-900">
              {/* Day header */}
              <th className="w-8 sm:w-12 border border-teal-400/30 px-1 py-2.5 text-amber-300 text-[10px] sm:text-xs font-bold">
                Day
              </th>
              {/* Game name headers */}
              {games.map((game) => (
                <th
                  key={game.key}
                  className="border border-teal-400/30 px-0.5 sm:px-2 py-2.5 text-teal-300 text-[9px] sm:text-[11px] font-bold leading-tight"
                >
                  {game.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyChartData.map((row, rowIndex) => (
              <tr
                key={`mobile-chart-${row.day}`}
                className={rowIndex % 2 === 0 ? "bg-slate-900" : "bg-slate-800/60"}
              >
                {/* Row number */}
                <td className="border border-teal-500/20 px-1 py-2 text-center text-amber-400 text-xs sm:text-sm font-bold">
                  {rowIndex + 1}
                </td>
                {/* Result numbers */}
                {games.map((game) => (
                  <td
                    key={game.key}
                    className="border border-teal-500/20 px-0.5 sm:px-1 py-2 text-center text-white text-xs sm:text-sm font-bold tracking-wide"
                  >
                    {row[game.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Desktop table renderer (UNCHANGED) ───────────────────────
  const renderDesktopMonthlyTable = () => (
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
              key={`desktop-chart-${row.day}`}
              className="hover:bg-teal-900/30 transition-colors duration-200 bg-slate-900/60"
            >
              <td className="border border-teal-400/20 px-3 py-2.5 text-center text-amber-300 text-sm font-bold sticky left-0 bg-slate-900 z-10">
                {rowIndex + 1}
              </td>
              {GAMES.map((game) => (
                <td
                  key={game.key}
                  className="border border-teal-400/20 px-3 py-2.5 hover:bg-teal-900/35 transition-colors text-center text-teal-200 text-sm font-medium"
                >
                  {row[game.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const khaiwalSection1 = setting?.khaiwalSection1 || {
    enabled: true,
    contactName: KHAIWAL_NAME,
    whatsappNumber: WHATSAPP_NUMBER,
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

  const showSecondKhaiwalSection =
    khaiwalSection2?.enabled && khaiwalSection2?.contactName;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto">
        {/* Site header */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-300 py-5 shadow-lg shadow-teal-500/20">
            <h2 className="text-3xl px-3 lg:text-4xl text-slate-950 font-black tracking-tight">
              {displaySiteName}
            </h2>
          </div>
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

        {/* ══════════════ MONTHLY CHART ══════════════ */}
        <div className="mt-8 px-2 md:px-4">
          <div className="bg-gradient-to-r from-teal-700 via-slate-900 to-sky-700 rounded-t-2xl py-5 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold flex items-center justify-center gap-3">
              <span>📅</span>
              <span>{currentMonth} MONTH CHART {currentYear}</span>
              <span>📅</span>
            </h2>
          </div>

          {/* Mobile – 3 stacked tables with spacing */}
          <div className="md:hidden bg-slate-950 rounded-b-2xl px-2 py-3 space-y-4">
            {renderMonthlyTable(mainMonthlyGames)}
            {renderMonthlyTable(remainingMonthlyGames)}
          </div>

          {/* Desktop – unchanged */}
          <div className="hidden md:block">
            {renderDesktopMonthlyTable()}
          </div>
        </div>

        {/* Khaiwal Card */}
        <section className="py-8 px-2 md:px-4">
          <div
            className={`max-w-6xl mx-auto ${
              showSecondKhaiwalSection
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                : "max-w-md"
            }`}
          >
            <KhaiwalCard section={khaiwalSection1} />
           
          </div>
        </section>

        <InformationalContent />

        <SimpleFAQ />

        <div className="py-3 md:py-8 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SattaDashboard;
