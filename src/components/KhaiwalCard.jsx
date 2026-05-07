"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_GAME_SCHEDULE, resolveGameSchedule } from "@/utils/gameConfig";

const KhaiwalCard = ({ section }) => {
  const schedule = resolveGameSchedule(section?.gameSchedule || DEFAULT_GAME_SCHEDULE);
  const contactName = section?.contactName ? `${section.contactName} BHAI KHAIWAL` : "KHAIWAL";
  const whatsappNumber = section?.whatsappNumber || "";
  const telegramNumber = section?.telegramNumber || "123456789";
  const rate = section?.rate || "";

  return (
    <div className="glass-dark rounded-2xl p-6 border-animate shadow-2xl h-full">
      <p className="text-lg lg:text-xl text-center text-amber-100 mb-3 font-bold hindi-text">
        -- सीधे सट्टा कंपनी का No. 1 खाईवाल --
      </p>
      <p className="uppercase text-center mb-5 text-xl lg:text-2xl text-white font-black">
        ♕♕ {contactName} ♕♕
      </p>

      <div className="space-y-1 mb-6 bg-white/10 rounded-xl p-4">
        {schedule.map((game, index) => (
          <div
            key={index}
            className="flex justify-between text-sm items-center py-2 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 rounded transition-colors"
          >
            <span className="text-teal-50 font-semibold">{game.name}</span>
            <span className="text-amber-200 font-bold">{game.time}</span>
          </div>
        ))}
      </div>

      <div className="text-center my-5 py-4 bg-white/10 rounded-xl">
        <p className="text-amber-300 font-bold mb-2 text-lg hindi-text">जोड़ी रेट</p>
        <p className="text-teal-50 text-sm md:text-lg font-bold hindi-text">
          जोड़ी रेट 10 ------- {rate}
        </p>
        <p className="text-teal-50 text-sm md:text-lg font-bold hindi-text">
          हरूफ रेट 100 ----- {rate}
        </p>
      </div>

      <p className="text-center text-teal-50 text-lg lg:text-xl mb-5 hindi-text">
        Game play करने के लिये नीचे लिंक पर क्लिक करे
      </p>

      <div className="flex flex-col gap-3 text-center">
        {whatsappNumber && (
          <Link
            target="_blank"
            href={`https://wa.me/+91${whatsappNumber}`}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 btn-glow"
          >
            <Image
              width={24}
              height={24}
              src="https://i.ibb.co/x8fsyXVj/Whats-App-svg.webp"
              alt="whatsapp"
            />
            <span className="hindi-text">WhatsApp पर संपर्क करें</span>
          </Link>
        )}

      
      </div>
    </div>
  );
};

export default KhaiwalCard;
