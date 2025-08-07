export default function Header({ activeTab, setActiveTab, reviewCount }) {
  const getButtonClasses = (tabName) => {
    const baseClasses =
      "py-4 px-1 text-sm font-medium transition-colors duration-200 ease-in-out";
    const activeClasses =
      "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400";
    const inactiveClasses =
      "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";

    return `${baseClasses} ${
      activeTab === tabName ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 -mb-px flex space-x-8">
      <button
        className={getButtonClasses("description")}
        onClick={() => setActiveTab("description")}
      >
        Description
      </button>
      <button
        className={getButtonClasses("reviews")}
        onClick={() => setActiveTab("reviews")}
      >
        Reviews ({reviewCount})
      </button>
      <button
        className={getButtonClasses("farmerInfo")}
        onClick={() => setActiveTab("farmerInfo")}
      >
        Farmer Info
      </button>
    </nav>
  );
}
