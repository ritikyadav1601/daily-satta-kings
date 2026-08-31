import Link from "next/link";
import { DEFAULT_GAME_SCHEDULE, resolveGameSchedule } from "@/utils/gameConfig";

const HINDI_GAME_NAMES = {
  "SADAR BAZAR": "सदर बाजार",
  GWALIOR: "ग्वालियर",
  "DELHI BAZAR": "दिल्ली बाजार",
  "DELHI MATKA": "दिल्ली मटका",
  "SHRI GANESH": "श्री गणेश",
  AGRA: "आगरा",
  FARIDABAD: "फरीदाबाद",
  ALWAR: "अलवर",
  GAZIABAD: "गाजियाबाद",
  GHAZIABAD: "गाजियाबाद",
  DWARKA: "द्वारका",
  GALI: "गली",
  DISAWAR: "दिसावर",
  DISAWER: "दिसावर",
};

const getHindiGameName = (name = "") => {
  const normalizedName = name.trim().toUpperCase();
  return HINDI_GAME_NAMES[normalizedName] || name;
};

const KhaiwalCard = ({ section }) => {
  const schedule = resolveGameSchedule(section?.gameSchedule || DEFAULT_GAME_SCHEDULE);
  const name = section?.contactName || "";
  const whatsapp = section?.whatsappNumber || "";
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <div className="glass-dark rounded-2xl p-6 border-animate shadow-2xl h-full">
      <p className="text-lg lg:text-xl text-center text-amber-100 mb-3 font-bold hindi-text">
        -- सीधे सट्टा कंपनी का No. 1 खाईवाल --
      </p>
      <p className="uppercase text-center mb-5 text-xl lg:text-2xl text-white font-black">
        ♕♕ {name} ♕♕
      </p>

      <div className="space-y-1 mb-6 bg-white/10 rounded-xl p-4">
        {schedule.map((game, index) => (
          <div
            key={`${game.name}-${index}`}
            className="flex justify-between text-sm items-center py-2 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 rounded transition-colors"
          >
            <span className="text-teal-50 font-semibold hindi-text">
              {getHindiGameName(game.name)}
            </span>
            <span className="text-amber-200 font-bold">{game.time}</span>
          </div>
        ))}
      </div>

      <div className="text-center my-5 py-4 bg-white/10 rounded-xl">
        <p className="text-amber-300 font-bold mb-2 text-lg hindi-text">जोड़ी रेट</p>
        <p className="text-teal-50 text-sm md:text-lg font-bold hindi-text">
          जोड़ी रेट 10 ------- 960
        </p>
        <p className="text-teal-50 text-sm md:text-lg font-bold hindi-text">
          हरूफ रेट 100 ----- 960
        </p>
      </div>

      <p className="text-center text-teal-50 text-lg lg:text-xl mb-5 hindi-text">
        Game play करने के लिये नीचे लिंक पर क्लिक करे
      </p>

      {whatsapp && (
        <div className="flex flex-col gap-3 text-center">
          <Link
            target="_blank"
            href={whatsappUrl}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 btn-glow"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-black text-green-600">
              WA
            </span>
            <span className="hindi-text">WhatsApp पर संपर्क करें</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default KhaiwalCard;
