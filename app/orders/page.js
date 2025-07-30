import { BreadcrumbOrders, MenuFooter, Navbar, Orders } from "@/components";

export default function OrdersPage() {
  return (
    <>
      <Navbar order={false} />
      <BreadcrumbOrders />
      <Orders />
      <MenuFooter />
    </>
  );
}
