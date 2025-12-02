import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../sass/main.scss";

import { getGlobalSettings } from "@/data/loaders";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gyertek Velünk",
  description: "Turák magyarországon és külföldön.",
};

async function loader() {
  const res = await getGlobalSettings();
  // fetchAPI now may return an object with status/statusText/body for non-OK responses
  if ((res as any).status) {
    const body = (res as any).body;
    throw new Error(
      `Failed to fetch global settings: ${ (res as any).status } ${ (res as any).statusText } ${
        typeof body === 'string' ? body : JSON.stringify(body)
      }`
    );
  }

  const { data } = res as any;
  if (!data) throw new Error("Failed to fetch global settings: empty response");
  return { header: data?.header, footer: data?.footer };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header, footer } = await loader();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header data={header} />
        {children}
        <Footer data={footer} />
      </body>
    </html>
  );
}
