import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-8">Page Not Found</h2>
      <p className="text-lg text-center mb-8">
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition duration-300"
      >
        Go back to Home
      </Link>
    </div>
  );
}
