import Image from "next/image";
const FarmersCard = ({ farmer }) => {
  // Use a placeholder image if the profile picture is not available or an error occurs
  const profilePictureUrl =
    farmer.profilePicture ||
    "https://placehold.co/400x300/e5e7eb/4b5563?text=Profile";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        {/* Use the actual profile picture from the farmer object */}
        <Image
          src={profilePictureUrl}
          alt={`${farmer.firstName} ${farmer.lastName}`}
          width={400}
          height={300}
          className="w-full h-64 object-cover"
          // Fallback to placeholder if image fails to load
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/400x300/e5e7eb/4b5563?text=Profile")
          }
        />
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <i className="fas fa-certificate mr-1"></i>Certified
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {farmer.firstName} {farmer.lastName}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {farmer.address}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {farmer.bio}
        </p>
        <div className="flex space-x-3">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition">
            View Products
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <i className="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default FarmersCard;
