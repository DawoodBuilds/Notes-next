import type { Metadata } from "next";
import { Space_Grotesk, Urbanist, Poppins, Montserrat } from "next/font/google";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

const space_grtoesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "300"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://recap-ai.vercel.app"),
  title: "Recap.ai | Turn Notes into Quizzes",
  description:
    "The AI-powered study tool that converts PDFs and notes into interactive quizzes instantly. Stop reading, start testing.",

  openGraph: {
    title: "Recap.ai - AI Quiz Generator",
    description: "Turn your boring notes into active quizzes in seconds.",
    url: "https://recap-ai.vercel.app",
    siteName: "Recap.ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Recap.ai Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recap.ai | Turn Notes into Quizzes",
    description: "Turn your boring notes into active quizzes in seconds.",
    images: ["/og-image.png"],
    creator: "@DawoodBuilds",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="color-scheme" content="dark only" />
        </head>
        <body
          className={`${space_grtoesk.variable} ${urbanist.variable} ${poppins.variable} ${montserrat.variable} antialiased`}
          suppressHydrationWarning
        >
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
