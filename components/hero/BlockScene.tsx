"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import with no SSR to avoid Next.js hydration issues
const BlockSceneInner = dynamic(() => import("./BlockSceneInner"), {
  ssr: false,
  loading: () => <div className="hero-stage" />,
});

export default function BlockScene() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load the WebGL scene client-side
    setShouldLoad(true);
  }, []);

  if (!shouldLoad) {
    return <div className="hero-stage" />;
  }

  return <BlockSceneInner />;
}
