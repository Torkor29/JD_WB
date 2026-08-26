import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Syne } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  keywords: [
    "création de site web sur mesure",
    "développement web",
    "développement application mobile",
    "application métier",
    "développement logiciel sur mesure",
    "plateforme web",
    "développement informatique",
    "création application",
    "développeur freelance",
    "studio digital",
    "Julien DOLOU",
    "Brest",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#070908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 rue de la Fontaine Margot",
      addressLocality: "Brest",
      postalCode: "29200",
      addressCountry: "FR",
    },
    areaServed: "FR",
    serviceType: [
      "Développement web sur mesure",
      "Applications mobiles",
      "Logiciels métiers",
      "Plateformes web",
    ],
  };

  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
