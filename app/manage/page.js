import {
  BreadcrumbManageList,
  ManageProduct,
  MenuFooter,
  Navbar,
} from "@/components";

export default function Manage() {
  return (
    <>
      <Navbar search={false} cartAndFavourite={false} />
      <BreadcrumbManageList />
      <ManageProduct />
      <MenuFooter />
    </>
  );
}
