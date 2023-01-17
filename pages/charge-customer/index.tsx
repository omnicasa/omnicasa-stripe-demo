import { useStripe } from "@stripe/react-stripe-js";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../../components/button";
import { StripeWrapper } from "../../components/stripe/wrapper";
import { signIn, signOut, useSession } from "next-auth/react";
import { UiWrapper } from "../../components/uiWrapper";

type SSRProps = {
  customerId: string;
  paymentMethods: {}[];
};

const renderResponse = (res: any, refresh: () => void) => {
  const basicInfo = (
    <>
      <ul>
        <li>Payment ID: {res.id}</li>
        <li>Customer ID: {res.customer}</li>
        <li>Amount: {res.amount}</li>
        <li>Currency: {res.currency}</li>
      </ul>
      <Button onClick={refresh}>Refresh</Button>
    </>
  );

  if (res.status === "processing") {
    return (
      <>
        <div
          className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
          role="alert"
        >
          <span className="font-medium">Payment processing</span> The webbook
          will update the status
        </div>
        {basicInfo}
      </>
    );
  }

  if (res.status === "succeeded") {
    return (
      <>
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <span className="font-medium">Successful</span> Account was charged
        </div>
        {basicInfo}
      </>
    );
  }

  if (res.status === "requires_payment_method" && res.last_payment_error) {
    return (
      <div
        className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
        role="alert"
      >
        <span className="font-medium">{res.last_payment_error.code}</span>{" "}
        {res.last_payment_error.message}.
      </div>
    );
  }
};

const ChargeCustomer = ({ customerId, paymentMethods }: SSRProps) => {
  const [card, setCard] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [res, setRes] = useState<any>(null);

  const router = useRouter();
  const stripe = useStripe();
  const { status } = useSession();

  if (!customerId) return <h1>no customer id provided</h1>;

  if (customerId === "error") return <h1>Customer Id invalid</h1>;

  if (!paymentMethods.length)
    return (
      <div>
        <h1>No payment methods. Please add one first</h1>
        <Button onClick={() => router.push("/")}>Add one</Button>
      </div>
    );

  async function handleSubmission() {
    if (!card || !amount)
      return alert("Please select a card and enter an amount to charge");

    if (amount < 50) {
      return alert(
        `Please enter an amount greater than50 cents. Please note that a value of ${amount} = 0.${String(
          amount
        ).padStart(2, "0")}€`
      );
    }

    const res = await fetch("/api/charge-customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
        paymentMethodId: card,
        amount,
      }),
    });

    const json = await res.json();
    setRes(json.intent);

    if (res.status !== 200) {
      alert("Something went wrong");
      console.error(res);
    }
  }

  async function refreshPaymentStatus() {
    if (!stripe || !res) return;
    const { paymentIntent } = await stripe.retrievePaymentIntent(
      res.client_secret
    );
    setRes(paymentIntent);
  }

  if (status === "unauthenticated") {
    return (
      <UiWrapper title="Charge Customer">
        <h1 className="text-4xl font-bold mb-2 text-slate-900">
          You have to login to view this page
        </h1>
        <p className="text-slate-700 mb-6">
          You can log in using Google by clicking the button below
        </p>
        <Button
          onClick={() => {
            signIn("google");
          }}
        >
          Sign in with Google
        </Button>
      </UiWrapper>
    );
  }

  return (
    <StripeWrapper>
      <section className="min-w-screen min-h-screen bg-slate-50">
        <div className="container mx-auto py-12">
          <div className="max-w-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-slate-900">
                  Charge customer
                </h1>
                <p className="text-slate-700">CustomerID: {customerId}</p>
              </div>
              <a
                className="text-stone-700 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Logout
              </a>
            </div>
            <div className="space-y-6 mt-6">
              <div>
                <label
                  className="font-medium text-slate-700 block mb-2"
                  htmlFor="select_card"
                >
                  Select a card to charge
                </label>
                <select
                  id="select_card"
                  className="flex items-center w-full text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400"
                  onChange={(e) => setCard(e.target.value)}
                >
                  <option value="">Select a card</option>
                  {paymentMethods.map((paymentMethod: any) => (
                    <option key={paymentMethod.id} value={paymentMethod.id}>
                      {paymentMethod.sepa_debit.country} ****{" "}
                      {paymentMethod.sepa_debit.last4}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="font-medium text-slate-700 block mb-2"
                  htmlFor="amount"
                >
                  Amount to charge in Euro
                </label>
                <div className="flex ">
                  <input
                    id="amount"
                    onChange={(e) => setAmount(e.target.valueAsNumber)}
                    type="number"
                    className="flex items-center w-full text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400"
                  />
                </div>
              </div>
              <Button className="block w-full" onClick={handleSubmission}>
                Submit
              </Button>
              {res && renderResponse(res, refreshPaymentStatus)}
            </div>
          </div>
        </div>
      </section>
    </StripeWrapper>
  );
};

const _ChargeCustomer = (props: SSRProps) => {
  return (
    <StripeWrapper>
      <ChargeCustomer {...props} />
    </StripeWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const { query } = ctx;
  const customerId = query.customer_id as string;

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  let paymentMethods;

  try {
    paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "sepa_debit",
    });
  } catch (e) {
    console.error(e);
    return {
      props: {
        customerId: "error",
        paymentMethods: [],
      },
    };
  }

  return {
    props: {
      customerId: customerId || "",
      paymentMethods: paymentMethods.data,
    },
  };
};

export default _ChargeCustomer;
