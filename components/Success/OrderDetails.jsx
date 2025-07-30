import Summary from "../Payment/Summary";
import PaymentDetails from "./PaymentDetails";

export default function OrderDetails() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
      <Summary />
      <PaymentDetails />
    </div>
  );
}
