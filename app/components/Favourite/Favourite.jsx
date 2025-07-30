import Image from "next/image";

const Favourite = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">My Favourite</h1>
      <p className="text-gray-600 mb-6 dark:text-gray-300">
        You have 2 product(s) in your favourite
      </p>

      <div className="space-y-6">
        {/* Product 1 */}
        <div className="flex items-center bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex-shrink-0 w-24 h-24 relative mr-4">
            <Image
              src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop" // Replace with actual image path
              alt="Product Image"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-semibold dark:text-white">
              আব্বাসি খিলাফতের ইতিহাস
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              শাইখ মাহমুদ শাকির
            </p>
            <div className="flex items-baseline mt-2">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Tk. 787
              </span>
              <span className="text-gray-500 line-through ml-2 dark:text-gray-400">
                Tk. 1,050
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
              4 Ratings | 2 Reviews
            </p>
            <button className="mt-3 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 dark:bg-primary-700 dark:hover:bg-primary-800">
              <i className="fas fa-shopping-cart text-xl mr-2"></i>
              Add to Cart
            </button>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition duration-300 ml-4">
            <i className="fas fa-trash"></i>
          </button>
        </div>

        {/* Product 2 */}
        <div className="flex items-center bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex-shrink-0 w-24 h-24 relative mr-4">
            <Image
              src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop" // Replace with actual image path
              alt="Product Image"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-semibold dark:text-white">
              চাণক্য নীতি
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              তীর্থংকর বন্দ্যোপাধ্যায়
            </p>
            <div className="flex items-baseline mt-2">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Tk. 160
              </span>
              <span className="text-gray-500 line-through ml-2 dark:text-gray-400">
                Tk. 200
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
              64 Ratings | 41 Reviews
            </p>
            <button className="mt-3 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 dark:bg-primary-700 dark:hover:bg-primary-800">
              <i className="fas fa-shopping-cart text-xl mr-2"></i>
              Add to Cart
            </button>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition duration-300 ml-4">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favourite;
