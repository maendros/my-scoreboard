import React from "react";
import { ApolloProvider } from "@/components/common/context/ApolloProvider";
import ThemeProvider from "@/components/common/context/ThemeProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Link from "next/link";
import NavBar from "@/components/common/layout/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body>
        <ApolloProvider>
          <ThemeProvider defaultTheme="system">
            <NavBar />
            <main className="pt-20">
              <section className="mt-8">{children}</section>
            </main>
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="colored"
            />
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
