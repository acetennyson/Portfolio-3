import React from "react";
import Header from "../../components/shell/Header";
import Footer from "../../components/shell/Footer";
import PageFrame from "../../components/shell/PageFrame";
import Loader from "../../components/shell/Loader";
import Cursor from "../../components/shell/Cursor";
import MotionProvider from "../../components/motion/MotionProvider";
import PageTransition from "../../components/shell/PageTransition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <a href="#main" className="skip-link">Skip to content</a>
      <Loader />
      <MotionProvider />
      <Cursor />
      <PageTransition />
      <Header />
      <PageFrame>{children}</PageFrame>
      <Footer />
    </div>
  );
}
