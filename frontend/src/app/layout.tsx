import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conectando Desaparecidos",
  description: "Plataforma para apoyar la búsqueda de personas desaparecidas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}