import { Pagination } from "../Products/UserProduct";
import AllOrder from "./AllOrder";
import OrdersHeader from "./OrdersHeader";

export default function Orders() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <OrdersHeader />
      <AllOrder />
      <Pagination />
    </div>
  );
}
