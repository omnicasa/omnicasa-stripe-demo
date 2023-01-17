import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider, useSession } from "next-auth/react";

export default function App(pageProps: AppProps) {
  useEffect(() => {
    /* @ts-ignore */
    import("preline");
  }, []);

  return (
    <SessionProvider>
      <Content {...pageProps} />
    </SessionProvider>
  );
}

function Content({ Component, pageProps }: AppProps) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="bg-slate-50 min-h-screen w-full p-8 flex justify-center items-center">
        <div
          className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
