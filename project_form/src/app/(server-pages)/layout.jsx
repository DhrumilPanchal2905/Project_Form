"use client";

import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    AOS.init({
      offset: 0,
      duration: 1000,
    });
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {children}
    </>
  );
}

