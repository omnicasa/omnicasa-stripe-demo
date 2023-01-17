import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    /* @ts-ignore */
    import("preline");
  }, []);

  return (
    <SessionProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
}
