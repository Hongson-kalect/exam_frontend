import * as React from "react";

export interface IButtonProps {
  size?: "small" | "normal" | "large";
  title: string;
  color?: string;
  fontWeight?:
    | "font-thin"
    | "font-extralight"
    | "font-light"
    | "font-normal"
    | "font-semibold"
    | "font-bold"
    | "font-extrabold";
  background?: string;
  outline?: boolean;
  outlineColor?: string;
  fullWidth?: boolean;
  onClick: () => void;
}

const BUTTON_CLASS =
  "flex items-center justify-center cursor-pointer rounded hover:opacity-80";
const qq =
  "font-bold flex items-center justify-center cursor-pointer rounded bg-green-500 px-3 py-2 hover:opacity-80";

export function Button({
  size,
  color,
  title,
  fontWeight,
  background,
  fullWidth,
  outline,
  outlineColor,
  onClick,
}: IButtonProps) {
  return (
    <div>
      <div
        className={`${BUTTON_CLASS}
        ${
          size === "small"
            ? "text-xs px-2 py-1"
            : size === "large"
            ? "text-xl px-4 py-3"
            : "text-base px-3 py-2"
        }
        ${fullWidth ? "w-full" : ""}
         ${color ? color : "text-black"} ${
          fontWeight ? fontWeight : "font-normal"
        } ${background ? background : "bg-green-500"} ${
          outline ? "border" : ""
        } ${outlineColor ? outlineColor : "border-black"}`}
        onClick={onClick}
        style={{ minWidth: "100px" }}
      >
        {title}
      </div>
    </div>
  );
}
