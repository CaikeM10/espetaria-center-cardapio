"use client";

import { useEffect, useState } from "react";

import { SplashScreen } from "@/components/SplashScreen";
import { MenuScreen } from "@/components/MenuScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="min-h-screen">
      {showSplash ? <SplashScreen /> : <MenuScreen />}
    </main>
  );
}
