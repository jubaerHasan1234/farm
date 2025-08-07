import {
  BreadcrumbManageList,
  ManageProduct,
  MenuFooter,
  Navbar,
} from "@/components";
import { Suspense } from "react";

export default function Manage() {
  return (
    <>
      <Navbar search={false} cartAndFavourite={false} />
      <BreadcrumbManageList />
      <Suspense>
        <ManageProduct />
      </Suspense>
      <MenuFooter />
    </>
  );
}
