import { MenuFooter, Navbar } from "@/components";
import {
  FiltersAndProduct,
  UserProductsPageHeader,
} from "@/components/Products/UserProduct";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <UserProductsPageHeader />
      <Suspense>
        <FiltersAndProduct />
      </Suspense>
      <MenuFooter />
    </>
  );
}
