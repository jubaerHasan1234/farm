import PaymentForm from "./PaymentForm";
import Summary from "./Summary";

export default function Payment() {
  return (
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Summary />
        <PaymentForm />
      </div>
    </div>
  );
}
