import { Breadcrumb, MenuFooter, Navbar, ProductDetails } from "@/components";

export default function ProductDetail() {
  return (
    <>
      <Navbar menu={false} searchAndUserProfile={false} />
      <Breadcrumb />
      <ProductDetails />
      <MenuFooter />
    </>
  );
}
