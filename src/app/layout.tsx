import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../components/Toast";

export const metadata: Metadata = {
  title: "Wisdom Mentorship society",
  description: "Wisdom Mentorship is a faith-based program dedicated to nurturing leaders, fostering growth, and building a supportive community.",
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
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
