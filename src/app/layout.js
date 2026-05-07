import "./globals.css";

export const metadata = {
  title: "Daily Satta Kings – Today Satta Result, Satta King Chart & A7 Satta Updates",
  description: "Check Daily Satta Kings for today satta result, latest satta king chart, and A7 satta updates. Get fast, clear, and updated satta king information in one place.",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: { width: "device-width", initialScale: 1 }
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
