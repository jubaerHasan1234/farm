import { Breadcrumb, Navbar, ProductDetails } from "@/app/components";

export default function ProductDetail() {
  return (
    <>
      <Navbar menu={false} searchAndUserProfile={false} />
      <Breadcrumb />
      <ProductDetails />
    </>
  );
}
