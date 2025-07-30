import { MenuFooter, Navbar } from "@/components";
import {
  FiltersAndProduct,
  UserProductsPageHeader,
} from "@/components/Products/UserProduct";

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <UserProductsPageHeader />
      <FiltersAndProduct />
      <MenuFooter />
    </>
  );
}
