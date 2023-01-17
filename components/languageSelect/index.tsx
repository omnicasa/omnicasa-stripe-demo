import { useRouter } from "next/router";
import { Locales, locales } from "../../translations";

type Props = {
  locale: Locales;
};

const LanguageSelect = ({ locale }: Props) => {
  const router = useRouter();

  function onButtonClick(locale: Locales) {
    router.push(router.asPath, router.asPath, { locale });
  }

  return (
    <div>
      <div className="flex">
        <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 ">
          <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                className={`hs-tab-active:bg-white hs-tab-active:text-gray-700 py-2 px-4 inline-flex items-center gap-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 font-medium rounded-md hover:hover:text-blue-600${
                  l === locale ? "active" : ""
                } uppercase`}
                id="segment-item-1"
                data-hs-tab="#segment-1"
                aria-controls="segment-1"
                role="tab"
                onClick={() => onButtonClick(l)}
              >
                {l}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-3 hidden">
        <div id="segment-1" role="tabpanel" aria-labelledby="segment-item-1">
          <p className="text-gray-500">
            <em className="font-semibold text-gray-800"></em>{" "}
          </p>
        </div>
        <div
          id="segment-2"
          className="hidden"
          role="tabpanel"
          aria-labelledby="segment-item-2"
        >
          <p className="text-gray-500">
            <em className="font-semibold text-gray-800"></em>{" "}
          </p>
        </div>
        <div
          id="segment-3"
          className="hidden"
          role="tabpanel"
          aria-labelledby="segment-item-3"
        >
          <p className="text-gray-500">
            <em className="font-semibold text-gray-800 ">third</em>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export { LanguageSelect };
