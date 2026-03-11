import type { Metadata } from "next";
import { Luckiest_Guy, Source_Sans_3 } from "next/font/google";
import "../sass/main.scss";
import "./globals.css";

import { getGlobalSettings } from "@/data/loaders";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MuiThemeProvider } from "@/components/providers/theme-provider/theme-provider";

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
  try {
    const res = await getGlobalSettings();
    const { data } = (res as any) ?? {};
    return { header: data?.header ?? null, footer: data?.footer ?? null };
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
    return { header: null, footer: null };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header, footer } = await loader();
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body suppressHydrationWarning className={`${luckiestGuy.variable} ${sourceSans3.variable} min-h-screen flex flex-col`}>
        <MuiThemeProvider>
          <Header data={header} />
          {children}
          <Footer data={footer} />
        </MuiThemeProvider>
      </body>
    </html>
  );
}
