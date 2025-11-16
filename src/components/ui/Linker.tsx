import React from "react";
import css from "@/styles/Button.module.css";
import Link from "next/link";

type LinkerProp = {
  children: React.ReactNode;
  variant?:
    | "transparent"
    | "white"
    | "black"
    | "auth-social-dark"
    | "fullwhite";
  className?: string;
  href: string;
};
const Linker = ({
  children,
  variant = "transparent",
  className = "rounded-md",
  href,
  ...props
}: LinkerProp) => {
  const BaseClasses = css.button;
  const variants: Record<string, string> = {
    transparent: css.transparent,
    white: css.white,
    black: css.black,
    "auth-social-dark": css["auth-social-dark"],
    fullwhite: css["fullwhite"],
  };
  return (
    <Link
      href={href}
      className={`inline-block ${BaseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default Linker;
