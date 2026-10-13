"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="n-page">
      <p className="n-page-top label"><span>( Error )</span><span>Something broke</span></p>
      <h1 className="n-page-title">Oops<span className="font-serif italic font-normal">.</span></h1>
      <p className="n-page-lead">Something went wrong loading this page. You can try again, or head back home.</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button type="button" className="btn-solid" onClick={reset}>Try again</button>
        <Link href="/" className="btn-line">Back home</Link>
      </div>
    </section>
  );
}
