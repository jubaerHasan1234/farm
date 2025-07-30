import { BreadcrumbOrders, Navbar, Orders } from "@/app/components";

export default function OrdersPage() {
  return (
    <>
      <Navbar order={false} />
      <BreadcrumbOrders />
      <Orders />
    </>
  );
}
