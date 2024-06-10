"use client";
import { SessionProvider as Provider } from "next-auth/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function SessionProvider({ children }: Props) {
  return <Provider>{children}</Provider>;
}
