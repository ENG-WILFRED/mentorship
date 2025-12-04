"use client";

import React from "react";


export default function Home() {
  // Redirect to login page on mount
  React.useEffect(() => {
    window.location.replace("/auth/login");
  }, []);
  return null;
}
