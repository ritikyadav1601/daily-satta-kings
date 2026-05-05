"use client";
import Image from "next/image";
import Link from "next/link";
import DateTime from "./DateTime";
import { GAMES } from "@/utils/gameConfig";

const GamePage = ({ data, setting, disawarData, todayResults = [] }) => {
  const currentYear = new Date().getFullYear();

  // Function to get current IST time in minutes since midnight
  const getCurrentISTMinutes = () => {
    const now = new Date();
    // Add IST offset (5.5 hours)
    now.setTime(now.getTime() + (5.5 * 60 * 60 * 1000));
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    return hours * 60 + minutes;
  };

  // Function to parse game time string to minutes since midnight
  const parseTimeToMinutes = (timeStr) => {
    const [time, ampm] = timeStr.split(' ');
    let [hours, mins] = time.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  // Get current time in IST minutes
  const currentMinutes = getCurrentISTMinutes();

  // Find the next game based on current time (fallback only)
  const nextGame = GAMES.find(game => parseTimeToMinutes(game.time) > currentMinutes) || GAMES[0];

  const activeGameKeys = new Set(GAMES.map((game) => game.key));
  const activeGameData = data && activeGameKeys.has(data.game) ? data : null;
  const waitingGame = activeGameKeys.has(activeGameData?.waitingGame)
    ? activeGameData.waitingGame
    : nextGame.key;

  const getGameName = (key) => {
    return GAMES.find((game) => game.key === key)?.name || nextGame.name;
  };

  return (
    <div className="bg-transparent">
      {/* === TOP DYNAMIC SECTION === */}
      <div className="glass-card mx-2 md:mx-4 mt-4 rounded-2xl pt-5 pb-6 shadow-sm">
        <div className="text-center">
          <DateTime />
        </div>
        <hr className="border-teal-400/20 w-11/12 mx-auto my-5" />

        <div className="flex uppercase mx-auto text-center w-full font-semibold flex-col gap-4 items-center justify-center">
          {activeGameData ? (
            <>
              <p className="text-amber-300 text-2xl sm:text-3xl font-bold">
                {getGameName(activeGameData.game)}
              </p>
              <p className="text-teal-300 text-3xl md:text-4xl font-black">
                {activeGameData.resultNumber}
              </p>

              <div className="h-px w-32 bg-gradient-to-r from-transparent via-teal-300 to-transparent my-2"></div>

              <p className="text-amber-300 text-2xl sm:text-[28px] font-bold">
                {getGameName(waitingGame)}
              </p>
              <Image
                className="mx-auto rounded-full"
                alt="wait icon"
                width={45}
                height={45}
                src="/loading.gif"
              />
            </>
          ) : (
            <>
              <p className="text-amber-300 text-2xl sm:text-[28px] font-bold">
                {nextGame.name}
              </p>
              <Image
                className="mx-auto rounded-full"
                alt="wait icon"
                width={45}
                height={45}
                src="/loading.gif"
              />
            </>
          )}
        </div>
      </div>

      {/* DISAWAR Section */}
      <div className="mx-2 md:mx-4 mt-4 rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-sky-950 py-3 px-4 border-b border-teal-400/25">
          <Link
            href={`/disawer-yearly-chart-${currentYear}`}
            className="flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-teal-300 via-amber-300 to-sky-300 bg-clip-text text-transparent transition-all">
              DISAWAR
            </span>
            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
          </Link>
        </div>

        {/* Results Row */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 py-4 px-4">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {/* Yesterday Result */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-white uppercase tracking-wider mb-1">Yesterday</span>
              <span className="text-xl sm:text-2xl font-black text-white bg-teal-500/20 border border-teal-300/40 px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/20">
                {disawarData?.yesterday || "--"}
              </span>
            </div>

            {/* Arrow */}
            <span className="text-3xl text-amber-300">➜</span>

            {/* Today Result */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-white uppercase tracking-wider mb-1">Today</span>
              <span className="text-xl sm:text-2xl font-black text-white bg-amber-500/25 border border-amber-300/45 px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                {disawarData?.today || (
                  <Image
                    className="inline rounded-full"
                    alt="wait icon"
                    width={28}
                    height={28}
                    src="/loading.gif"
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/75 py-4 px-4 mt-5 border-y border-teal-400/15">
        <p className="text-sm md:text-base text-center text-slate-300 leading-relaxed">
          Welcome to dailysattakings.com, your trusted source for the latest Daily satta kings results, charts, and daily updates. We provide fast and accurate results for SADAR BAZAR, GWALIOR, DELHI BAZAR, DELHI MATKA, SHRI GANESH, AGRA, FARIDABAD, ALWAR, GAZIABAD, DWARKA, GALI, and DISAWAR. Stay updated with real-time numbers, along with easy access to historical charts and records. <br />Our platform is designed to offer a smooth and user-friendly experience, helping you quickly find the information you need. We also share daily guessing numbers based on trends and analysis. <br />
          Visit dailysattakings.com regularly for quick updates, reliable data, and all Satta-related information in one place.
        </p>
        <p className="text-lg md:text-xl font-bold italic text-amber-300 text-center mt-3">
          The current Daily satta kings Results.
        </p>
      </div>


      {/* Payment Option Section */}
      <div className="mx-2 md:mx-4 mt-4 bg-slate-950/80 rounded-lg py-3 px-4 border border-teal-300/30 drop">
        <p className="text-center text-amber-300 font-bold text-xl">💸 Payment Option 💸</p>
        <p className="text-center text-white sm:text-lg">PAYTM//BANK TRANSFER//PHONE PAY//GOOGLE PAY =&lt; ⏺️{setting?.paymentNumber || '7894561230'}⏺️</p>
        <p className="text-center text-white">==========================</p>
        <p className="text-center text-white">==========================</p>
      </div>

      {/* Marquee Banner */}
      <div className="mx-2 md:mx-4 mt-4 bg-slate-950/80 rounded-lg py-3 px-4 overflow-hidden border border-teal-400/15">
        <p className="text-xs md:text-sm text-center text-teal-200 font-semibold leading-relaxed uppercase">
          SADAR BAZAR GWALIOR DELHI BAZAR DELHI MATKA SHRI GANESH AGRA FARIDABAD ALWAR GAZIABAD DWARKA GALI DISAWAR SATTA FAST RESULT TIPS DISAWAR CHART JODI CHART PANEL CHART FIX GAME SATTA RESULT FULL RATE ONLINE GAME PLAY BY APP
        </p>
      </div>
    </div>
  );
};

export default GamePage;
