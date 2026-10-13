import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="n-page" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <p className="n-page-top label"><span>( 404 )</span><span>Lost in space</span></p>
      <h1 className="n-page-title">Not <span className="font-serif italic font-normal">found</span></h1>
      <p className="n-page-lead">That page doesn&apos;t exist, or it has moved. Head back and keep exploring.</p>
      <Link href="/" className="btn-solid">Back home</Link>
    </section>
  );
}
