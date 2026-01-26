import type { Metadata } from "next";
import { Luckiest_Guy, Source_Sans_3 } from "next/font/google";
import "../sass/main.scss";
import "./globals.css";

import { getGlobalSettings } from "@/data/loaders";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: '400',
  variable: "--font-luckiest-guy",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
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
      <body className={`${luckiestGuy.variable} ${sourceSans3.variable}`}>
        <Header data={header} />
        {children}
        <Footer data={footer} />
      </body>
    </html>
  );
}
