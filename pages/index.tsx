import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { TransactionList } from "../components/transactionList";
import { UiWrapper } from "../components/uiWrapper";
import { Unauthenticated } from "../components/unAuthenticated";

function HomePage() {
  const { status } = useSession();

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
