import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "FitTrack Pro | AI-Powered Fitness",
  description: "Personalized workout recommendations and progress tracking.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
