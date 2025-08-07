"use client";
import { useSession } from "next-auth/react";

import AllOrder from "./AllOrder";
import FarmerOrders from "./FarmerOrders";

export default function Orders() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-6">
      <AllOrder />
      {session?.user?.userType === "farmer" && <FarmerOrders />}
    </div>
  );
}
