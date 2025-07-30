import { Cart, MenuFooter, Navbar } from "@/components";
export default function CartPage() {
  return (
    <>
      <Navbar search={false} />
      <Cart />
      <MenuFooter />
    </>
  );
}
