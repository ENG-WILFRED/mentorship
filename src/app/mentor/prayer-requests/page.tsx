"use client";

import { Suspense, useEffect, useState } from "react";
import AppContent from "./components/layout/AppContent";
import LoadingSpinner from "./components/LoadingSpinner";
import { getAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";


export default function App() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      if (!token) {
        router.push("/auth/login");
      } else {
        setIsInitialized(true);
      }
    };
    checkAuth();
  }, [router]);

   if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppContent />
    </Suspense>
  );
}
