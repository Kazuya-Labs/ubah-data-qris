import { useState } from "react";

export const useTimeout = (ms) => {
  const [value, setValue] = useState(null);
  const showValue = (val) => {
    setValue(val);
    setTimeout(() => {
      setValue(null);
    }, ms);
  };
  return [value, showValue];
};
