import { MenuFooter, Navbar, Payment } from "@/components";
import Breadcrumb from "@/components/Payment/Breadcrumb";

export default function PaymentPage() {
  return (
    <>
      <Navbar searchAndUserProfile={false} />
      <Breadcrumb />
      <Payment />
      <MenuFooter />
    </>
  );
}
