import Head from "next/head";

type Props = {
  children: React.ReactNode;
  containerClassName?: string;
  hasContainer?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  title?: string;
} & React.HTMLAttributes<HTMLOrSVGElement>;

const UiWrapper = ({
  tag: Wrapper = "section",
  children,
  hasContainer = true,
  containerClassName,
  title,
  ...rest
}: Props) => {
  const wrapperClass = `bg-slate-50 min-h-screen w-full p-8${
    rest.className ? ` ${rest.className}` : ""
  }`;
  const newRest = { ...rest, className: wrapperClass };

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
  return (
    <Wrapper {...newRest}>
      <Head>
        <title>{title ? `${title} | ` : ""}Omnicasa Recurring Payments</title>
      </Head>
      {renderContainer()}
    </Wrapper>
  );
};

export { UiWrapper };
