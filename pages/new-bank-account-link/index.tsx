import { useSession } from "next-auth/react";
import { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { UiWrapper } from "../../components/uiWrapper";
import { Unauthenticated } from "../../components/unAuthenticated";

const NewBankAccountLink = () => {
  const { status } = useSession();

  const [customerId, setCustomerID] = useState("");
  const [customers, setCustomers] = useState<any>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customersLoading, setCustomersLoading] = useState(false);
  async function getCustomers() {
    setCustomersLoading(true);
    const res = await fetch("api/list-customers", { method: "POST" });
    const data = await res.json();
    setCustomers(data.customers);
    setCustomersLoading(false);
  }
  useEffect(() => {
    if (status === "authenticated") {
      getCustomers();
    }
  }, [status]);

  const origin = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    return "";
  }, []);

  function onOpenClick() {
    window.open(`/recurring-payment?customer_id=${selectedCustomerId}`);
  }

  function onCopyClick() {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Copied to clipboard!");
    });
  }

  const link = useMemo(() => {
    if (!selectedCustomerId) {
      return "";
    }

    return `${origin}/recurring-payment?customer_id=${selectedCustomerId}`;
  }, [selectedCustomerId, origin]);

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }
  return (
    <UiWrapper>
      <h1 className="text-4xl font-bold mb-2 text-slate-900">
        Copy link for customers
      </h1>

      <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
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
          onChange={(e: any) => e && setSelectedCustomerId(e.value)}
          isLoading={customersLoading}
          id="customers"
        />
        {link && (
          <>
            <label
              className="font-medium text-slate-700 block mb-2 mt-6"
              htmlFor="linkToCopy"
            >
              Link to copy
            </label>
            <div className="flex items-stretch">
              <input
                id="linkToCopy"
                onChange={(e) => setCustomerID(e.target.value)}
                readOnly
                value={link}
                className="flex items-center w-full text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-l-lg text-slate-400"
              />
              <button
                className="min-w-[40px] bg-slate-100 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 ring-1 flex justify-center items-center cursor-pointer"
                onClick={onOpenClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 stroke-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </button>
              <button
                className="min-w-[40px] bg-slate-100 rounded-r-lg ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 ring-1 flex justify-center items-center cursor-pointer"
                onClick={onCopyClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="w-6 h-6 stroke-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </form>
    </UiWrapper>
  );
};

export default NewBankAccountLink;
