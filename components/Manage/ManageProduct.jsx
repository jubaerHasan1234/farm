import { Pagination } from "../Products/UserProduct";
import ManageHeader from "./ManageHeader";
import ManageProductAll from "./ManageProductAll";
import ManageSearchAndFilter from "./ManageSearchAndFilter";

export default function ManageProduct() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ManageHeader />
      <ManageSearchAndFilter />
      <ManageProductAll />
      <Pagination />
    </div>
  );
}
