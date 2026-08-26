import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.dailysattakings.com"),
  title: "Daily Satta Kings – Today Satta Result, Satta King Chart & A7 Satta Updates",
  description: "Check Daily Satta Kings for today satta result, latest satta king chart, and A7 satta updates. Get fast, clear, and updated satta king information in one place.",
  keywords: [
    "Daily Satta Kings",
    "today satta result",
    "satta king chart",
    "A7 satta updates",
    "satta result",
    "yearly satta chart",
  ],
  authors: [{ name: "Daily Satta Kings", url: "https://www.dailysattakings.com" }],
  creator: "Daily Satta Kings",
  publisher: "Daily Satta Kings",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: [
      "KnZ5dAatM5JmORm6WdxE6UxLACPKMaofiZMq8RB_MS4",
      "Qqljong5nFGOzMwuOxfRFPrgoTQ_M5rZ3wRFPy-Cr0Y",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
