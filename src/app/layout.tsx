import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "MPLADS Insight — AI Monitoring Platform",
  description:
    "Evidence-led monitoring, analytics and case-management for MPLADS works. " +
    "Identifies unusual expenditure, execution delays, possible duplicate works, " +
    "cost deviations and missing evidence. Synthetic data demo — not official data.",
  keywords: ["MPLADS", "monitoring", "analytics", "government", "compliance"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en" style={{ height: "100%" }}>
        <body style={{ height: "100%", display: "flex", flexDirection: "column", margin: 0 }}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
