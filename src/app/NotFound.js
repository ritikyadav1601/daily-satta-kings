import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-main-gradient">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4 text-white">Page Not Found</h2>
      <p className="text-slate-400 mt-2">
        The page you are looking for is not available or has been removed.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600 transition"
      >
        Go Home Page
      </Link>
    </div>
  );
}
