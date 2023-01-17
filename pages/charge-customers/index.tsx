import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/button";
import { StripeWrapper } from "../../components/stripe/wrapper";
import { UiWrapper } from "../../components/uiWrapper";
import { Unauthenticated } from "../../components/unAuthenticated";
import Select from "react-select";
/* @ts-ignore */
import CurrencyInput from "react-currency-masked-input";
import { toast } from "react-toastify";

const ChargeCustomers = () => {
  const { status } = useSession();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customersLoading, setCustomersLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);

  const selectRef = useRef(null);

  async function getCustomers() {
    setCustomersLoading(true);
    const res = await fetch("api/list-customers", { method: "POST" });
    const data = await res.json();
    setCustomers(data.customers);
    setCustomersLoading(false);
  }

  async function getPaymentMethods() {
    const res = await fetch("api/list-payment-methods", {
      method: "POST",
      body: JSON.stringify({ customerId: selectedCustomerId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setPaymentMethods(data.paymentMethods);
  }

  useEffect(() => {
    if (status === "authenticated") {
      getCustomers();
    }
  }, [status]);

  useEffect(() => {
    if (selectedCustomerId) {
      getPaymentMethods();
    }
  }, [selectedCustomerId]);

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  async function onChargeCustomer() {
    const payload = {
      customerId: selectedCustomerId,
      paymentMethodId: selectedPaymentMethod,
      amount: amount.toString().replace("0.", ""),
    };
    try {
      await fetch("api/charge-customer", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setAmount(0);
      setSelectedCustomerId("");
      setSelectedPaymentMethod("");
      toast.success("Customer charged successfully");
      if (selectRef?.current) {
        (selectRef.current as any).clearValue();
      }
    }
  }

  return (
    <StripeWrapper>
      <UiWrapper>
        <div className="max-w-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-2 text-slate-900">
              Charge customers
            </h1>
          </div>
        </div>
        <section className="space-y-4 mt-3">
          <div>
            <label
              htmlFor="customers"
              className="font-medium text-slate-700 block mb-1"
            >
              Customer
            </label>
            <Select
              options={
                customers &&
                customers.map((c: any) => ({
                  value: c.id,
                  label: `${c.name} - ${c.email}`,
                }))
              }
              onChange={(e) => e && setSelectedCustomerId(e.value)}
              isLoading={customersLoading}
              id="customers"
              ref={selectRef}
            />
          </div>
          {selectedCustomerId && paymentMethods.length ? (
            <div>
              <label
                htmlFor="card"
                className="font-medium text-slate-700 block mb-1"
              >
                Bank account
              </label>
              <Select
                options={paymentMethods.map((p: any) => ({
                  label: `${p.sepa_debit.country} ${p.sepa_debit.bank_code} - **** ${p.sepa_debit.last4}`,
                  value: p.id,
                }))}
                id="card"
                onChange={(e) => e && setSelectedPaymentMethod(e.value)}
              />
            </div>
          ) : null}
          {selectedPaymentMethod && (
            <div>
              <label
                htmlFor="card"
                className="font-medium text-slate-700 block mb-1"
              >
                Amount
              </label>
              <CurrencyInput
                name="customerId"
                required
                onChange={(e: any) => {
                  setAmount(e.target.value);
                }}
                seperator=","
                className="flex items-center w-full text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400"
              />
            </div>
          )}
          {amount > 0 && (
            <Button onClick={onChargeCustomer}>Charge customer</Button>
          )}
        </section>
      </UiWrapper>
    </StripeWrapper>
  );
};

const _ChargeCustomers = () => {
  return (
    <StripeWrapper>
      <ChargeCustomers />
    </StripeWrapper>
  );
};

export default _ChargeCustomers;
