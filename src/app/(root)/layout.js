import Navbar from "@/components/common/Navbar";
import TopProgressBar from "@/components/TopProgressBar";
import { buildSiteConfig, getSettingsFromDB } from "@/services/settingsServer";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";

export const metadata = {
  title: "Daily Satta Kings – Today Satta Result, Satta King Chart & A7 Satta Updates",
  description: "Check Daily Satta Kings for today satta result, latest satta king chart, and A7 satta updates. Get fast, clear, and updated satta king information in one place.",
};

export default async function RootLayout({ children }) {
  const setting = buildSiteConfig(await getSettingsFromDB());
  const currentYear = new Date().getFullYear();
  const whatsappNumber = setting?.khaiwalSection1?.whatsappNumber || setting?.site2_whatsappNumber;

  return (
    <div className="min-h-screen bg-main-gradient pattern-grid">
      <TopProgressBar />
      <Navbar />
      <main>
        {children}
      </main>

      {/* WhatsApp Button with Glow */}
      {whatsappNumber && (
        <Link
          className="fixed bottom-6 right-6 hover:scale-110 transition-all duration-300 z-50 group"
          target="_blank"
          href={`https://wa.me/+91${whatsappNumber}`}
        >
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <Image
            className="max-sm:!size-14 relative z-10"
            width={70}
            height={70}
            src="https://i.ibb.co/x8fsyXVj/Whats-App-svg.webp"
            alt="whatsapp"
          />
        </Link>
      )}

      {/* Footer */}
      <footer className="mt-8 relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>

        <div className="bg-gradient-to-r from-teal-700 via-slate-900 to-amber-600 py-4">
          <p className="text-base sm:text-lg text-center font-bold text-white">
            @{currentYear} Daily satta kings :: All Rights Reserved
          </p>
        </div>

        <div className="bg-slate-950 py-6 relative">
          <div className="max-w-4xl mx-auto px-4">
            {/* Contact Section */}
            <div className="mb-6 pb-6 border-b border-teal-400/30">
              <p className="text-center text-amber-300 font-bold text-base mb-4">📞 Get In Touch</p>
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {setting?.khaiwalSection1?.whatsappNumber && (
                  <Link
                    href={`https://wa.me/+91${setting?.khaiwalSection1?.whatsappNumber}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors"
                  >
                    <Image
                      src="https://i.ibb.co/x8fsyXVj/Whats-App-svg.webp"
                      width={20}
                      height={20}
                      alt="whatsapp"
                    />
                    <span className="text-sm font-semibold">WhatsApp</span>
                  </Link>
                )}
                {setting?.khaiwalSection1?.telegramNumber && (
                  <Link
                    href={`https://t.me/${setting?.khaiwalSection1?.telegramNumber}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white transition-colors"
                  >
                    <Image
                      src="/telegram-icon.webp"
                      width={20}
                      height={20}
                      alt="telegram"
                    />
                    <span className="text-sm font-semibold">Telegram</span>
                  </Link>
                )}
              </div>
            </div>

            {/* English Disclaimer */}
            <p className="text-center text-amber-300 font-bold text-base mb-3">ⓘ Disclaimer:</p>
            <p className="text-center text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            This website is created for informational and news publishing purposes only. All numbers and data displayed
on this website are generated based on mathematical calculations, publicly available information, and artificial
intelligence models, including zodiac-based interpretations.
We do not promote, support, or have any association with gambling or betting activities. This website has no
connection with any gambling platforms, agents, or operators. Any reference to results or numbers is purely for
informational purposes.
We strictly do not encourage any illegal activities such as gambling, money laundering, or any other unlawful
practices. Users are advised to follow the laws and regulations applicable in their region.
All content published on this website is collected from various internet sources and is presented for general
informational use. We do not guarantee the accuracy or completeness of the information.
This website operates independently and is supported through advertising services such as Google Ads.
            </p>

            <div className="h-px w-full bg-teal-400/35 my-4"></div>

            {/* Hindi Disclaimer */}
            <p className="text-center text-amber-300 font-bold text-base mb-3 hindi-text">ⓘ अस्वीकरण:</p>
            <p className="text-center text-slate-300 text-xs sm:text-sm leading-relaxed hindi-text">
            यह वेबसाइट केवल सूचना और समाचार प्रकाशित करने के उद्देश्य से बनाई गई है। इस वेबसाइट पर प्रदर्शित सभी नंबर और डेटा गणितीय गणनाओं, सार्वजनिक रूप से उपलब्ध जानकारी, तथा कृत्रिम बुद्धिमत्ता (Artificial Intelligence) मॉडल और राशि आधारित व्याख्याओं के आधार पर तैयार किए गए हैं।
हम किसी भी प्रकार की सट्टेबाजी या जुए की गतिविधियों को बढ़ावा नहीं देते, न ही उनका समर्थन करते हैं। इस वेबसाइट का किसी भी जुआ, बेटिंग प्लेटफॉर्म, एजेंट या ऑपरेटर से कोई संबंध नहीं है। यहां प्रदर्शित किसी भी प्रकार के रिजल्ट या नंबर केवल सामान्य जानकारी प्रदान करने के उद्देश्य से साझा किए जाते हैं।
हम किसी भी अवैध गतिविधि जैसे जुआ, मनी लॉन्ड्रिंग या अन्य गैरकानूनी कार्यों को प्रोत्साहित नहीं करते हैं। उपयोगकर्ताओं को सलाह दी जाती है कि वे अपने क्षेत्र में लागू सभी कानूनों और नियमों का पालन करें।
इस वेबसाइट पर प्रकाशित सभी सामग्री विभिन्न इंटरनेट स्रोतों से एकत्रित की गई है और केवल सामान्य जानकारी के उद्देश्य से प्रस्तुत की गई है। हम यहां उपलब्ध जानकारी की पूर्ण सटीकता या संपूर्णता की कोई गारंटी नहीं देते हैं।
यह वेबसाइट स्वतंत्र रूप से संचालित की जाती है और Google Ads जैसी विज्ञापन सेवाओं के माध्यम से समर्थित है।
            </p>
          </div>

          {/* Bottom Decorative */}
          <div className="mt-6 flex justify-center">
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
