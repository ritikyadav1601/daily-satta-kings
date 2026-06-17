import { notFound } from "next/navigation";
import Heading from "@/components/common/Heading";
import YearlyTable from "@/components/YearlyTable";
import {
  getYearlyResultsFromDB,
  transformYearlyData,
  gameSlugMapping,
  parseSlugData,
} from "@/services/resultServer";

const DynamicTable = async ({ params }) => {
  const { slug } = await params;

  const gameKey = gameSlugMapping[slug];
  const slugData = parseSlugData(slug);

  if (!gameKey || !slugData) {
    notFound();
  }

  const { name: gameName, year } = slugData;

  const results = await getYearlyResultsFromDB(gameKey, year);
  const yearlyData = transformYearlyData(results);

  return (
    <div>
      <Heading title={`${gameName} YEARLY CHART ${year}`} />
      <div className="mx-auto px-4 py-6">
        <YearlyTable year={year} data={yearlyData} />
      </div>
    </div>
  );
};

export default DynamicTable;

export const revalidate = 300;
