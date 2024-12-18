import React from "react";
import { ApolloProvider } from "@/components/common/context/ApolloProvider";
import ThemeProvider from "@/components/common/context/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import NavBar from "@/components/common/layout/NavBar";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme');
                let theme = savedTheme || 'system';

                if (theme === 'system') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }

                document.documentElement.classList.add(theme);
                document.documentElement.style.colorScheme = theme;
              } catch (e) {
                console.log('Theme initialization error:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body className="bg-base">
        <ApolloProvider>
          <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-base">
              <NavBar />
              <main className="pt-20 bg-base">
                <div className="max-w-7xl mx-auto px-4">
                  <section className="mt-8">{children}</section>
                </div>
              </main>
              <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
              />
            </div>
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
