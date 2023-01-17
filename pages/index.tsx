import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/button";
import { TransactionList } from "../components/transactionList";
import { UiWrapper } from "../components/uiWrapper";
import { Unauthenticated } from "../components/unAuthenticated";

function HomePage() {
  const { status } = useSession();

  const [customerId, setCustomerID] = useState("");

  const router = useRouter();

  const isValidCustomerId = useMemo(() => {
    return customerId.length > 0 && customerId.startsWith("cus_");
  }, [customerId]);

  function onBankAccountClick() {
    router.push(`/recurring-payment?customer_id=${customerId}`);
  }

  function onChargeCardClick() {
    router.push(`/charge-customer?customer_id=${customerId}`);
  }

  function onCopyClick() {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Copied to clipboard!");
    });
  }

  const link = useMemo(() => {
    if (!isValidCustomerId) {
      return "";
    }

    if (!customerId.length) {
      return "";
    }

    return `https://omnicasa-stripe.vercel.app/recurring-payment?customer_id=${customerId}`;
  }, [customerId]);

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  return (
    <UiWrapper title="Homepage">
      <TransactionList />
    </UiWrapper>
  );
}

export default HomePage;
