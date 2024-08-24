import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Piggy investestments",
  description: "Piggy investestments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
            {children}
      </body>
    </html>
  );
}
