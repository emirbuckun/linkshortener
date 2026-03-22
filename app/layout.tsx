import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Create and manage shortened links easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <ClerkProvider>
        <header className="flex items-center justify-between gap-3 p-4 mx-auto w-full max-w-7xl px-4">
        <h1 className="text-xl font-bold">LinkShortener</h1>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
          </Show>
          <Show when="signed-in">
          <UserButton />
          </Show>
        </div>
        </header>
        {children}
      </ClerkProvider>
      </body>
    </html>
  );
}
