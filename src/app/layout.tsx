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
    "création site internet",
    "développeur web freelance",
    "développement application mobile",
    "application iOS Android",
    "application métier",
    "développement logiciel sur mesure",
    "plateforme web",
    "outil métier digital",
    "studio digital",
    "devis site internet",
    "Julien DOLOU",
    "développeur Brest",
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
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Julien DOLOU — Produits numériques sur mesure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og.png"],
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
  themeColor: "#1F5EFF",
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
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#business`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        email: siteConfig.contactEmail,
        image: `${siteConfig.url}/og.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "12 rue de la Fontaine Margot",
          addressLocality: "Brest",
          postalCode: "29200",
          addressCountry: "FR",
        },
        areaServed: "FR",
        priceRange: "€€",
        serviceType: [
          "Création de site web sur mesure",
          "Développement d'applications mobiles",
          "Développement d'applications web",
          "Logiciels et outils métiers",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#business` },
        inLanguage: "fr-FR",
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/#webpage`,
        url: siteConfig.url,
        name: siteConfig.title,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#business` },
        description: siteConfig.description,
        inLanguage: "fr-FR",
      },
    ],
  };

  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu
        </a>
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
