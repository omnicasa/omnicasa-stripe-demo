import { FormEvent, useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { StripeWrapper } from "../../components/stripe/wrapper";
import { Button } from "../../components/button";
import { UiWrapper } from "../../components/uiWrapper";
import { Locales, translations } from "../../translations";
import { LanguageSelect } from "../../components/languageSelect";

const SetupForm = ({ customerId }: { customerId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { locale } = useRouter();

  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/status?customer_id=${customerId}`,
      },
    });

    console.log({ error });

    if (error) {
      setErrorMessage((error as any).message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      console.log("Redirect");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button className="mt-4" disabled={!stripe}>
        {translations[locale as Locales].save}
      </Button>
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </form>
  );
};

const Payment = () => {
  const { query } = useRouter();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState("");
  const [hasError, setHasError] = useState(() => {
    return query.error ? true : false;
  });

  const customerId = query.customer_id as string;

  useEffect(() => {
    const abortCtrl = new AbortController();
    console.log("log");
    (async () => {
      const response = await fetch(
        `/api/future-payment?customer_id=${customerId}`,
        { method: "POST", signal: abortCtrl.signal }
      );
      const { client_secret: clientSecret } = await response.json();
      setClientSecret(clientSecret);
    })();

    return () => abortCtrl.abort();
  }, [customerId]);

  if (!customerId) {
    return (
      <div className="flex items-center flex-col gap-6 justify-center h-screen bg-slate-50">
        <p className="text-2xl font-bold">No customer ID provided</p>
        <Button onClick={() => router.push("/")}>Go back</Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <section className="bg-slate-50 min-h-screen w-full p-8 flex justify-center items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }

  return (
    <StripeWrapper clientSecret={clientSecret}>
      <UiWrapper containerClassName="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold text-gray-800">
            {translations[router.locale as Locales]["recurring.title"]}
          </h1>
          <LanguageSelect locale="en" />
        </div>
        {hasError && (
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <span className="font-medium">Error</span> Something went wrong
            while submitting your details. Please try again later.
          </div>
        )}
        {/* <h3 className="text-md text-gray-600">
          For customer ID: {clientSecret}
        </h3> */}
        <SetupForm customerId={customerId} />
      </UiWrapper>
    </StripeWrapper>
  );
};

export default Payment;
