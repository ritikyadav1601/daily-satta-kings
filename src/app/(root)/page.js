import SattaDashboard from "@/components/SattaDashboard";
import {
  getTodayResultFromDB,
  getYesterdayResultsFromDB,
  getLastResultFromDB,
  getMonthlyResultsFromDB,
  getDisawarDataFromDB,
} from "@/services/resultServer";
import { getSettingsFromDB, buildSiteConfig } from "@/services/settingsServer";

export const metadata = {
  title: "Daily Satta Kings – Today Satta Result, Satta King Chart & A7 Satta Updates",
  description: "Check Daily Satta Kings for today satta result, latest satta king chart, and A7 satta updates. Get fast, clear, and updated satta king information in one place.",
};

export default async function Home() {
  const currentDate = new Date();

  // Fetch all public data in parallel to keep server response time low.
  const [
    todayResults,
    yesterdayResults,
    lastResult,
    disawarData,
    settings,
    monthlyResults,
  ] =
    await Promise.all([
      getTodayResultFromDB(),
      getYesterdayResultsFromDB(),
      getLastResultFromDB(),
      getDisawarDataFromDB(),
      getSettingsFromDB(),
      getMonthlyResultsFromDB(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      ),
    ]);

  const siteConfig = buildSiteConfig(settings);

  return (
    <SattaDashboard
      todayResults={todayResults}
      yesterdayResults={yesterdayResults}
      lastResult={lastResult}
      setting={siteConfig}
      monthlyResults={monthlyResults}
      disawarData={disawarData}
    />
  );
}

export const revalidate = 30;
