const YearlyTable = ({ year, data }) => {
  // Months
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Days (1–31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-gradient-to-r from-teal-700 via-slate-900 to-sky-700">
            {/* Sticky year column */}
            <th className="border border-teal-400/25 bg-teal-800 text-white px-3 py-2.5 sticky left-0 z-10 font-bold">
              {year}
            </th>
            {months.map((month, idx) => (
              <th key={idx} className="border border-teal-400/25 px-3 py-2.5 text-white font-medium">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {days.map((day, rowIndex) => (
            <tr key={day} className={rowIndex % 2 === 0 ? "bg-slate-900/60" : "bg-slate-950/80"}>
              {/* Sticky day column */}
              <td className="border border-teal-400/20 bg-slate-900 text-amber-300 font-semibold px-3 py-2 sticky left-0 z-10">
                {day}
              </td>
              {months.map((month, idx) => (
                <td key={idx} className="border border-teal-400/20 px-3 py-2 text-slate-200 hover:bg-teal-900/30 transition-colors">
                  {data[month]?.[day] || "xx"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YearlyTable;
