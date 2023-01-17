import { signIn } from "next-auth/react";
import { Button } from "../button";
import { UiWrapper } from "../uiWrapper";

const Unauthenticated = () => {
  return (
    <UiWrapper title="Charge Customer" hideNav>
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
};

export { Unauthenticated };
