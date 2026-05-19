import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { clutchFrFR } from "@/lib/clerk-localization";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Clutch MVP",
  description: "Trouvez un tuteur ou commencez à enseigner aujourd'hui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={clutchFrFR}>
      <html lang="fr" suppressHydrationWarning>
        <body className={`${plusJakarta.variable} font-sans app-surface`}>
          <ThemeScript />
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
