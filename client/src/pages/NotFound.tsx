import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Header, Footer } from "./Home";

export default function NotFound() {
  useEffect(() => {
    if (window.location.pathname.replace(/\/$/, "") !== "/404")
      window.location.replace("/404");
  }, []);

  return (
    <>
      <Header home={false} />
      <main id="main" className="page-width policy-page">
        <span className="eyebrow">404 / A LITTLE DETOUR</span>
        <h1>
          This page needs
          <br />
          <em>a new path.</em>
        </h1>
        <p>
          The page you're looking for doesn't exist. The Akibit portfolio is a
          good place to start.
        </p>
        <a href="/" className="button button-dark">
          Back to Akibit <ArrowUpRight size={18} />
        </a>
      </main>
      <Footer />
    </>
  );
}
