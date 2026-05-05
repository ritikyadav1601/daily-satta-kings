import React from "react";
import Image from "next/image";
import { GAMES, GAME_MAPPING } from "@/utils/gameConfig";

const SattaResultTable = ({ todayResults = [], yesterdayResults = [] }) => {
  // Create games array from centralized config
  const sattaGames = GAMES.map((game, index) => {
    const todayResult = todayResults.find(
      (r) => r.game === game.key
    )?.resultNumber;
    const yesterdayResult = yesterdayResults.find(
      (r) => r.game === game.key
    )?.resultNumber;

    return {
      id: index + 1,
      displayName: game.name,
      time: game.time,
      yesterdayResult: yesterdayResult || "--",
      todayResult: todayResult,
      isLoading: !todayResult,
    };
  });

  // Component to render result cell content
  const ResultCell = ({ result, isLoading }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center">
          <Image
            alt="wait"
            width={40}
            height={40}
            src="/loading.gif"
            className="rounded-full"
            priority={false}
          />
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <span className="text-lg lg:text-xl font-black tracking-widest text-teal-300">
          {result}
        </span>
      </div>
    );
  };

  return (
    <article className="px-2 md:px-4 mt-4">
      <div className="relative overflow-x-auto rounded-2xl shadow-sm border border-teal-400/20">
        <table className="w-full text-sm text-left border-collapse">
          {/* Table Header */}
          <thead className="text-sm sm:text-base bg-gradient-to-r from-teal-700 via-slate-900 to-sky-700">
            <tr>
              <th className="text-center text-white font-bold border border-teal-400/20 py-4 w-[37%]">
                🎮 सट्टा का नाम
              </th>
              <th className="py-4 text-center text-teal-50 font-bold border border-teal-400/20">
                ⏮️ कल आया था
              </th>
              <th className="py-4 text-center text-teal-50 font-bold border border-teal-400/20">
                🎯 आज का रिज़ल्ट
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {sattaGames.map((game, index) => (
              <tr key={game.id} className="border-b border-teal-400/20 hover:bg-teal-900/25 transition-colors duration-200 bg-slate-900/65">
                {/* Game Name Cell */}
                <td className="py-3 px-3 text-center font-bold border border-teal-400/20 bg-slate-950/80">
                  <p className="text-base text-amber-300 w-full lg:text-lg font-bold">
                    {game.displayName}
                  </p>
                  <span className="text-slate-300 text-sm font-medium">{game.time}</span>
                </td>
                {/* Yesterday Result Cell */}
                <td className="text-center bg-slate-900/50 border border-teal-400/20 p-3">
                  <div className="text-lg lg:text-xl font-bold tracking-widest text-slate-200">
                    {game.yesterdayResult}
                  </div>
                </td>
                {/* Today Result Cell */}
                <td className="text-center bg-slate-900/50 border border-teal-400/20 p-3">
                  <ResultCell
                    result={game.todayResult}
                    isLoading={game.isLoading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default SattaResultTable;
