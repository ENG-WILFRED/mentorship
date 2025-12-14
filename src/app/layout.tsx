import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../components/Toast";
import { ReactQueryProvider } from "@/lib/QueryProvider";

/** 👇 ADD THESE TWO LINES */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Wisdom Mentorship society",
  description:
    "Wisdom Mentorship is a faith-based program dedicated to nurturing leaders, fostering growth, and building a supportive community.",
  icons: {
    icon: "/mentor.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReactQueryProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
