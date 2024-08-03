import React from "react";
import { ApolloProvider } from "@/components/ApolloProvider";
import ThemeProvider from "@/components/ThemeProvider";
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
          <ThemeProvider>{children}</ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
