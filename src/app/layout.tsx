import React from "react";
import { ApolloProvider } from "@/components/ApolloProvider";
import ThemeProvider from "@/components/ThemeProvider";
import Menu from "@/components/Menu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
              <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Scoreboard
              </h1>
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
