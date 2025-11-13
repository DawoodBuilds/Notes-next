"use client";
import React from "react";
import { Helmet } from "react-helmet-async";

export default function Title({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Helmet>
      <title>{children}</title>
    </Helmet>
  );
}
