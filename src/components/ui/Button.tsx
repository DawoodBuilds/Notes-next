import React from "react";
import css from "@/styles/Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  variant?:
    | "transparent"
    | "white"
    | "black"
    | "auth-social-dark"
    | "fullwhite";
  className?: string;
  onClick?: () => void;
};
const Button = ({
  children,
  variant = "transparent",
  className = "rounded-md",
  ...props
}: ButtonProps) => {
  const BaseClasses = css.button;
  const variants: Record<string, string> = {
    transparent: css.transparent,
    white: css.white,
    black: css.black,
    "auth-social-dark": css["auth-social-dark"],
    fullwhite: css["fullwhite"],
  };
  return (
    <button
      className={`${BaseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
