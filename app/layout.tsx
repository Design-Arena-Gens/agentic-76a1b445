import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consulta RUC SUNAT - Perú",
  description: "Consulta información de empresas por RUC en Perú",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
