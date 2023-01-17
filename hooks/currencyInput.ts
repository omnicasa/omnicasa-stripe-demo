import { useState } from "react";

export function useCurrencyInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: any) => {
    let input = e.target.value;
    input = input.replace(/[^\d.]/g, ""); // remove non-numeric characters

    // split input into whole and decimal parts
    const parts = input.split(".");
    const whole = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    const decimal = parts[1] ? "." + parts[1].slice(0, 2) : "";

    setValue(whole + decimal);
  };

  return {
    value,
    onChange: handleChange,
  };
}
