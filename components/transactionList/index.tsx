import { PaymentIntent } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { TransactionBadge } from "./badge";

const TransactionList = () => {
  const [transactions, setTransactions] = useState<PaymentIntent[]>([]);
  const [refreshLoading, setRefreshLoading] = useState(false);

  async function fetchTransactions() {
    const res = await fetch("/api/list-transactions", { method: "POST" });
    const json = await res.json();
    setTransactions(json.transactions);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col">
      <button
        className="self-end px-4 py-2 bg-white rounded-lg ring-1 ring-slate-200 hover:ring-slate-400 transition-all duration-200 ease-out mr-2"
        onClick={() => {
          setRefreshLoading(true);
          fetchTransactions().then(() => {
            setRefreshLoading(false);
          });
        }}
      >
        {refreshLoading ? (
          <div
            className="animate-spin inline-block w-3 h-3 border-[1px] border-current border-t-transparent text-blue-600 rounded-full"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        )}
      </button>
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Customer ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Amount
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => {
                  const formatter = new Intl.NumberFormat("be-BE", {
                    style: "currency",
                    currency: "EUR",
                  });
                  const formattedNumber = formatter.format(
                    transaction.amount / 100
                  );

                  const names = (transaction as any).charges.data.map(
                    (d: any) => d.billing_details.name
                  );

                  const email = (transaction as any).charges.data.map(
                    (d: any) => d.billing_details.email
                  );
                  const separatedEmails = email.join(", ");
                  const seperatedNames = names.join(", ");
                  return (
                    <tr
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      key={(transaction as any).customer}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        {seperatedNames}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {(transaction as any).customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {separatedEmails}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {formattedNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <TransactionBadge status={transaction.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TransactionList };
