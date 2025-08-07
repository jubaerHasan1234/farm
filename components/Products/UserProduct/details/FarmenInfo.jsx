import Image from "next/image";

export default function FarmerInfo({ user }) {
  // It's important to check if the user object exists before trying to access its properties
  const farmer = user || {};
  return (
    <div className="py-8">
      <div className="prose prose-lg max-w-none dark:prose-invert text-white">
        <div className="flex items-center space-x-4 mb-6">
          <Image
            src={
              farmer.profilePicture ||
              "https://placehold.co/100x100/e0e0e0/000000?text=Farmer"
            }
            alt={`${farmer.firstName} ${farmer.lastName}`}
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold">
              {farmer.firstName} {farmer.lastName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {farmer.userType || "Farmer"}
            </p>
          </div>
        </div>
        <p>{farmer.bio || "No bio provided."}</p>
        <h4>Contact Information:</h4>
        <ul>
          <li>
            <strong>Email:</strong> {farmer.email}
          </li>
          <li>
            <strong>Phone:</strong> {farmer.phone}
          </li>
          <li>
            <strong>Location:</strong> {farmer.address}
          </li>
        </ul>
      </div>
    </div>
  );
}
