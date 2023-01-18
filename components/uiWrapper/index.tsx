import Head from "next/head";
import { useEffect, useState } from "react";
import { Header } from "../header";

type Props = {
  children: React.ReactNode;
  containerClassName?: string;
  hasContainer?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  title?: string;
  hideNav?: boolean;
} & React.HTMLAttributes<HTMLOrSVGElement>;

const UiWrapper = ({
  tag: Wrapper = "section",
  children,
  hasContainer = true,
  containerClassName,
  title,
  hideNav = false,
  ...rest
}: Props) => {
  const [navHeight, setNavHeight] = useState(0);
  const wrapperClass = `bg-slate-50 w-full p-8${
    rest.className ? ` ${rest.className}` : ""
  }`;
  const newRest = { ...rest, className: wrapperClass };

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setNavHeight(header.clientHeight);
    }
  }, []);

  const renderContainer = () => {
    if (hasContainer) {
      return (
        <div
          className={`container mx-auto${
            containerClassName ? ` ${containerClassName}` : ""
          }`}
        >
          {children}
        </div>
      );
    }

    return children;
  };

  console.log(navHeight);

  return (
    <>
      {!hideNav && <Header />}
      <Wrapper
        {...newRest}
        style={{
          minHeight: `calc(100vh - ${navHeight}px)`,
        }}
      >
        <Head>
          <title>{title ? `${title} | ` : ""}Omnicasa Recurring Payments</title>
        </Head>
        {renderContainer()}
      </Wrapper>
    </>
  );
};

export { UiWrapper };
