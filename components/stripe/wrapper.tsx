import { Elements } from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeElementLocale,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useRouter } from "next/router";

type Props = {
  clientSecret?: string;
  children: React.ReactNode;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const StripeWrapper = ({ clientSecret, children }: Props) => {
  const { locale } = useRouter();
  const options: StripeElementsOptions = {
    clientSecret: clientSecret,
    locale: locale as StripeElementLocale,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export { StripeWrapper };
