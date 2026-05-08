import React from "react";
import merge from "../lib/merge";

function Button({ className, ...props }) {
  return (
    <button
      className={merge(
        "w-full text-white bg-slate-800 hover:bg-slate-900",
        className,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
