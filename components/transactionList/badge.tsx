import { PaymentIntent } from "@stripe/stripe-js";
const TransactionBadge = ({ status }: { status: PaymentIntent.Status }) => {
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Processing
      </span>
    );
  }

  if (status === "succeeded") {
    return (
      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Succeeded
      </span>
    );
  }

  if (status === "requires_payment_method") {
    return (
      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Required Payment Method
      </span>
    );
  }

  if (status === "requires_action") {
    return (
      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Requires action
      </span>
    );
  }

  if (status === "requires_capture") {
    return (
      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Requires capture
      </span>
    );
  }

  if (status === "canceled") {
    return (
      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Canceled
      </span>
    );
  }

  return null;
};

export { TransactionBadge };
