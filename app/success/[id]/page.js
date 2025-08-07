import { MenuFooter, Navbar, OrderDetails } from "@/components";

export default function SuccessPage({ params }) {
  const { id } = params;

  return (
    <>
      <Navbar searchAndUserProfile={false} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <OrderDetails orderId={id} />
      </div>
      <MenuFooter />
    </>
  );
}
