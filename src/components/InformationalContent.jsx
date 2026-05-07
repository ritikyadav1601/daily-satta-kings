"use client";

const contentSections = [
  {
    title: "Daily Satta Kings - Today Satta Result, Satta King Chart and A 7 Satta Updates",
    paragraphs: [
      "Daily Satta Kings is a platform where users can check today satta result, latest satta king chart, and A 7 satta updates in a simple and clear format. The main purpose of this website is to provide daily satta kings information so users can easily find updated satta king data without delay. Many users search for satta king daily, and this platform helps them get all important information in one place.",
      "Users who visit Dailysattakings.com can check today satta result and satta king chart easily. The information is arranged in a simple format so users do not face any confusion while checking results or charts. Daily Satta Kings focuses on providing clear data which is easy to read and understand.",
    ],
  },
  {
    title: "Today Satta Result - Daily Satta Kings Latest Update",
    paragraphs: [
      "Today satta result is one of the most searched keywords by users. Daily Satta Kings provides updated today satta result so users can check daily satta kings data quickly. Many users search for satta king result every day, and this platform provides simple and clear information.",
      "The today satta result section is designed to show results in an easy format. Users can quickly find satta king result without searching too much. Daily Satta Kings updates today satta result regularly so users always get fresh information.",
    ],
  },
  {
    title: "Daily Satta Kings Result Information",
    paragraphs: [
      "Daily Satta Kings provides today satta result along with previous data so users can compare results easily. The information is shown clearly so users can understand satta king result without confusion.",
      "Users who search for daily satta kings updates prefer platforms where they can get fast and accurate information. This platform focuses on providing simple data for users.",
    ],
  },
  {
    title: "Satta King Chart - Complete Chart Data and Old Records",
    paragraphs: [
      "Satta king chart is an important part of satta king information. Daily Satta Kings provides complete satta king chart with old records so users can check previous results. Many users search for satta king chart to understand past data.",
      "The satta king chart section includes daily, weekly, and monthly data. Users can easily check old records and compare them with today satta result. The chart data is displayed in a simple format so users can read it without difficulty.",
    ],
  },
  {
    title: "Daily Satta Kings Chart Details",
    paragraphs: [
      "Daily Satta Kings provides updated satta king chart where users can check old results easily. The chart section helps users understand previous data and compare it with current results.",
      "Users who search for satta king chart want simple and clear information, and this platform provides exactly that. The data is arranged properly so users can quickly find what they need.",
    ],
  },
  {
    title: "A 7 Satta - Today Result and Chart Updates",
    paragraphs: [
      "A 7 satta is a popular keyword searched by many users. Daily Satta Kings provides A 7 satta result along with chart data so users can check both current and previous information.",
      "Users who search for A 7 satta want updated results and old records in one place. This platform provides A 7 satta information in a simple format so users can easily understand the data.",
    ],
  },
  {
    title: "A 7 Satta Chart and Result Information",
    paragraphs: [
      "Daily Satta Kings updates A 7 satta result regularly so users can check latest information. The chart section includes old records which help users understand previous results.",
      "Users can compare A 7 satta result with chart data and get a better idea of past and current information. This makes the platform useful for users who search for A 7 satta daily.",
    ],
  },
  {
    title: "Daily Satta Kings - Satta King Information Platform",
    paragraphs: [
      "Daily Satta Kings provides satta king information in a simple and clear way. Users can check today satta result, satta king chart, and A 7 satta updates without confusion. Many users search for daily satta kings to get fast updates, and this platform provides all important data in one place.",
      "Users who visit this platform regularly can check satta king result and chart data easily. The information is updated regularly so users always get fresh data.",
    ],
  },
  {
    title: "Satta King Daily Updates",
    paragraphs: [
      "Daily Satta Kings focuses on providing updated satta king information. Users can check today satta result and compare it with satta king chart to understand the data better.",
      "The platform is designed to provide simple information so users can easily find what they are looking for. This makes Daily Satta Kings useful for daily users.",
    ],
  },
  {
    title: "Today Satta Result and Satta King Chart Combined Information",
    paragraphs: [
      "Users often search for today satta result along with satta king chart. Daily Satta Kings provides both in one place so users can check all information easily. This helps users save time and get complete data.",
      "The combination of today satta result and satta king chart helps users understand both current and past data. Users do not need to visit multiple websites to check information.",
    ],
  },
  {
    title: "Daily Satta Kings Result and Chart Data",
    paragraphs: [
      "Daily Satta Kings provides updated today satta result along with satta king chart so users can check both at the same time. This makes it easier for users to get all information in one place.",
      "Users who search for satta king daily result and chart prefer platforms that provide simple and clear data. This platform focuses on providing useful information.",
    ],
  },
  {
    title: "Why Users Search for Daily Satta Kings",
    paragraphs: [
      "Daily Satta Kings is a common keyword searched by users who want satta king information. This platform provides today satta result, satta king chart, and A 7 satta updates in a simple format.",
      "Users prefer this platform because it provides clear and updated information. The simple language helps users understand the data easily without confusion.",
    ],
  },
  {
    title: "Daily Satta Kings Search Keywords",
    paragraphs: [
      "Users search for daily satta kings, satta king chart, today satta result, and A 7 satta regularly. This platform includes all these keywords in the content so users can easily find relevant information.",
      "This makes the platform helpful for users who want quick satta king updates.",
    ],
  },
  {
    title: "Conclusion - Daily Satta Kings Today Satta Result and Chart",
    paragraphs: [
      "Daily Satta Kings is a simple platform where users can check today satta result, satta king chart, and A 7 satta updates easily. The information is provided in a clear format so users can quickly find what they need.",
      "Users who search for daily satta kings, satta king chart, and today satta result can find all information in one place. This makes the platform useful for users who want fast and simple satta king information.",
    ],
  },
];

const InformationalContent = () => {
  return (
    <section className="px-2 md:px-4 pb-8">
      <div className="max-w-6xl mx-auto bg-slate-950/85 border border-teal-400/20 rounded-2xl overflow-hidden shadow-xl">

        <div className="border-t border-teal-400/15 px-4 sm:px-6 py-6 space-y-7">
          {contentSections.map((section) => (
            <article key={section.title} className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-teal-200">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm sm:text-base leading-relaxed text-slate-300">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InformationalContent;
