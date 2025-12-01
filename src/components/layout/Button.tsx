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
  type?: "submit" | "button";
  disabled?: boolean;
};
const Button = ({
  children,
  variant = "transparent",
  className = "rounded-md",
  type,
  disabled = false,
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
      className={`${BaseClasses} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
