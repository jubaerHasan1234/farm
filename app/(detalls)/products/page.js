import { Navbar } from "@/app/components";
import {
  FiltersAndProduct,
  UserProductsPageHeader,
} from "@/app/components/Products/UserProduct";

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <UserProductsPageHeader />
      <FiltersAndProduct />
    </>
  );
}
