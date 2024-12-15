import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import React from "react";
import Header from "../components/header";
import "./globals.css";

// import { SESSION_COOKIE_NAME } from "../constants";

// import { cookies } from "next/headers";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art Archive",
  description: "Art archive is..."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const session = cookies().get(SESSION_COOKIE_NAME)?.value || null;

  return (
    <html lang="en">
      <body className={`flex flex-col w-screen h-screen ${montserrat.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
