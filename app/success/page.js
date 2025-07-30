import {
  ActionButton,
  EmailNotification,
  MenuFooter,
  Navbar,
  OrderDetails,
  SuccessIconAndMessage,
} from "@/components";

export default function SuccessPage() {
  return (
    <>
      <Navbar searchAndUserProfile={false} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SuccessIconAndMessage />
        <EmailNotification />
        <OrderDetails />
        <ActionButton />
      </div>
      <MenuFooter />
    </>
  );
}
