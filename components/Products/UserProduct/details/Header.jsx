export default function Header() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 -mb-px flex space-x-8">
      <button className="border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 py-4 px-1 text-sm font-medium">
        Description
      </button>
      <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-4 px-1 text-sm font-medium">
        Reviews (127)
      </button>
      <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-4 px-1 text-sm font-medium">
        Farmer Info
      </button>
    </nav>
  );
}
