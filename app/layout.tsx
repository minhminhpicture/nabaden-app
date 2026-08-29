import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://app.nabaden.vn/#organization",
  name: "NABADEN",
  url: "https://app.nabaden.vn/",
  logo: "https://app.nabaden.vn/logo.png",
  telephone: "+84 907 215 521",
  sameAs: ["https://zalo.me/0907215521"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+84 907 215 521",
    contactType: "customer service",
    areaServed: "VN",
    availableLanguage: "Vietnamese",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "NABADEN · Mãng cầu Bà Đen",
    description: "Ứng dụng sản phẩm, trải nghiệm và tin tức từ vùng mãng cầu Bà Đen chính gốc Tây Ninh.",
    applicationName: "NABADEN",
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "NABADEN" },
    formatDetection: { telephone: true },
    icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
    openGraph: {
      title: "NABADEN · Mãng cầu Bà Đen chính gốc",
      description: "Sản phẩm, trải nghiệm và OCOP 3 sao từ vùng trồng Tây Ninh.",
      type: "website",
      locale: "vi_VN",
      images: [{
        url: new URL("/nabaden-partner-social-20260723.png", base).toString(),
        width: 1672,
        height: 941,
        alt: "NABADEN - Tìm đối tác phân phối mãng cầu Bà Đen",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "NABADEN · Mãng cầu Bà Đen",
      images: [new URL("/nabaden-partner-social-20260723.png", base).toString()],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#075f39",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
