// layout.tsx
import React from "react";
import { ApolloProvider } from "@/components/ApolloProvider";
import ThemeProvider from "@/components/ThemeProvider";
import Menu from "@/components/Menu"; // Import the Menu component
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
            <Menu /> {/* Add the Menu component here */}
            <h1 className="text-center text-3xl font-bold  text-gray-900 dark:text-gray-100 ">
                My Scoreboard
            </h1>
            <section className="mt-20"> {children}</section>        
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
