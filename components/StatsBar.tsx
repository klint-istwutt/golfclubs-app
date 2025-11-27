export default function StatsBar({ clubCount, countryCount }: { clubCount: number; countryCount: number }) {
  return (
    <div className="w-full bg-gray-50 py-4 border-b">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-xl font-semibold">
          {clubCount.toLocaleString("de-DE")} Clubs &nbsp;|&nbsp; {countryCount} Countries
        </h2>
      </div>
    </div>
  );
}
