// app/payment/[id]/page.jsx
import { MenuFooter, Navbar, Payment } from "@/components";
import Breadcrumb from "@/components/Payment/Breadcrumb";

export default function PaymentPage({ params }) {
  const { id } = params;

  return (
    <>
      <Navbar searchAndUserProfile={false} />
      <Breadcrumb />
      <Payment orderId={id} />
      <MenuFooter />
    </>
  );
}
