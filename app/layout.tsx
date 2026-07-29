import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://cjp-protest-analytics.vercel.app"),
  title: {
    default: "CJP Protest Analytics Dashboard",
    template: "%s · CJP Protest Analytics Dashboard",
  },
  description:
    "An analytical dashboard exploring the Citizens for Justice Platform (CJP) protest movement — timeline, demands, participation, government response, and outcomes, built on an illustrative sample dataset.",
  keywords: ["protest analytics", "civic dashboard", "data visualization", "CJP"],
  openGraph: {
    title: "CJP Protest Analytics Dashboard",
    description:
      "Explore the CJP protest movement through interactive analytics: timeline, demands, participants, government response, and outcomes.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/60 py-6">
              <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
                <p>
                  CJP Protest Analytics Dashboard — built on an illustrative sample dataset. Not a
                  record of real events.
                </p>
                <p>© 2026 Citizens for Justice Platform Analytics Project</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
