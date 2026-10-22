import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClearWallet — Dashboard Financiero",
  description:
    "Gestiona tu dinero con claridad. Visualiza balances, tarjetas, flujo de efectivo y próximos pagos en un solo lugar.",
  keywords: ["wallet", "finanzas", "dashboard", "tarjetas", "pagos"],
  authors: [{ name: "ClearWallet" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
