import { cva } from "class-variance-authority";
import { Ref, forwardRef } from "react";

// variant classes
const variant = {
  default: [
    // default classes
  ],
  text: [
    // text classes
  ],
  outlined: ["border-2"],
};

// color classes
const color = {
  primary: [
    "bg-stone-900",
    "hover:bg-stone-700",
    "active:bg-stone-500",
    "disabled:bg-stone-500",
  ],
  danger: [
    "bg-red-700",
    "hover:bg-red-600",
    "active:bg-red-500",
    "disabled:bg-red-500",
  ],
  success: [
    "bg-green-700",
    "hover:bg-green-600",
    "active:bg-green-500",
    "disabled:bg-green-500",
  ],
};

// classes
const button = cva(
  [
    "flex",
    "items-center",
    "justify-center",
    "py-3",
    "px-3",
    "text-white",
    "rounded-md",
    "font-semibold",
    "tracking-wide",
    "transition",
    "duration-300",
  ],
  {
    variants: {
      variant,

      color,
    },

    compoundVariants: [
      {
        variant: "text",
        color: "primary",
        class: [
          "bg-transparent",
          "text-stone-800",
          "hover:!bg-stone-100",
          "active:!bg-stone-200",
        ],
      },
      {
        variant: "text",
        color: "success",
        class: [
          "bg-transparent",
          "text-green-800",
          "hover:!bg-green-100",
          "active:!bg-green-200",
        ],
      },
      {
        variant: "text",
        color: "danger",
        class: [
          "bg-transparent",
          "text-red-800",
          "hover:!bg-red-100",
          "active:!bg-red-200",
        ],
      },
      {
        variant: "outlined",
        color: "primary",
        class: [
          "bg-transparent",
          "text-stone-800",
          "border-stone-800",
          "hover:!bg-stone-100",
          "active:!bg-stone-200",
        ],
      },
      {
        variant: "outlined",
        color: "danger",
        class: [
          "bg-transparent",
          "text-red-800",
          "border-red-800",
          "hover:!bg-red-100",
          "active:!bg-red-200",
        ],
      },
      {
        variant: "outlined",
        color: "success",
        class: [
          "bg-transparent",
          "text-green-800",
          "border-green-800",
          "hover:!bg-green-100",
          "active:!bg-green-200",
        ],
      },
    ],

    defaultVariants: {
      variant: "default",
      color: "primary",
    },
  }
);

// props interface
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: keyof typeof variant;
  color?: keyof typeof color;
}

export const Button = forwardRef(({ variant, color, className, ...rest }: ButtonProps, ref: Ref<HTMLButtonElement>) => {
  return <button ref={ref} className={button({ variant, color, className })} {...rest} />;
})
