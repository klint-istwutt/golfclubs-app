import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Willkommen zur Golfclubs-App
      </h1>
      <Link
        href="/clubs"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Zu den Golfclubs →
      </Link>
    </main>
  );
}
