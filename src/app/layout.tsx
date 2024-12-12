import React from "react";
import { ApolloProvider } from "@/components/ApolloProvider";
import ThemeProvider from "@/components/ThemeProvider";
import Menu from "@/components/Menu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>
          <ThemeProvider>
            <Menu />
            <main className="pt-20">
              <Link
                href="/"
                className="block text-center hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <h1 className="text-3xl font-bold">My Scoreboard</h1>
              </Link>
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
