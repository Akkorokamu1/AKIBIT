import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Check,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import { heroImages } from "@/lib/heroImages";

export function GoldVeins({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`gold-veins ${className}`}
      viewBox="0 0 900 560"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M800 -8 769 70 787 105 739 141 750 175 697 230 674 277 636 293 618 358 577 405 585 454 534 501 517 570"
          strokeWidth="2.2"
        />
        <path
          d="m739 141-60-19-39 11-52-43-46 5-59-43M674 277l43 33 38-2 36 53 73 19 42 54M585 454l-62-21-38 10-40-37-44 10-58-35M787 105l48 7 64-39"
          strokeWidth="1.2"
        />
        <path
          className="vein-left"
          d="M-5 376 47 359 75 369 125 331 170 337 210 310M125 331l8-48 40-36 10-54"
          strokeWidth="1.4"
        />
      </g>
    </svg>
  );
}

export default function AkibitHero() {
  // Warm the cache for the hidden mode's artwork once the page is idle,
  // so switching modes never shows an empty frame.
  useEffect(() => {
    const warm = () =>
      [heroImages.studio, heroImages.arcade].forEach(src => {
        if (!src) return;
        const img = new Image();
        img.decoding = "async";
        img.src = src;
      });
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    if (w.requestIdleCallback) w.requestIdleCallback(warm);
    else window.setTimeout(warm, 1200);
  }, []);

  return (
    <section className="akibit-hero" aria-labelledby="hero-title">
      <GoldVeins className="hero-gold-veins" />
      <div className="page-width akibit-hero-inner">
        <div className="akibit-hero-copy">
          <div className="hero-kicker">
            <span className="kicker-rule" />
            <span className="studio-only">INDEPENDENT DIGITAL DESIGN</span>
            <span className="arcade-only">
              INDEPENDENT DESIGN / ARCADE MODE
            </span>
          </div>
          <h1 id="hero-title">
            <span className="studio-only">
              Your next chapter.
              <br />
              <em>Crafted with intent.</em>
            </span>
            <span className="arcade-only">
              Your next chapter.
              <br />
              <em>Next level.</em>
            </span>
          </h1>
          <p className="akibit-hero-description">
            Thoughtful websites, landing pages and app experiences.
            <br className="desktop-break" /> Made to bring out what makes your
            business worth choosing.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#contact">
              Let's build your next chapter <ArrowUpRight size={20} />
            </a>
            <a className="text-link" href="#work">
              Explore the concepts <ArrowRight size={18} />
            </a>
          </div>
          <div className="hero-assurance">
            <span>
              <Check size={14} /> Clear purpose
            </span>
            <span>
              <Check size={14} /> Real people first
            </span>
            <span>
              <Check size={14} /> Made for your business
            </span>
          </div>
          <div className="hero-mode-note">
            <Sparkles size={16} className="studio-only" />
            <Gamepad2 size={16} className="arcade-only" />
            <span className="studio-only">
              Quiet craft. A little digital edge.
            </span>
            <span className="arcade-only">
              Different energy. The same considered design.
            </span>
          </div>
        </div>
        <div className="akibit-hero-visual">
          <div className="art-caption-top">
            <span className="studio-only">CRAFT × CODE</span>
            <span className="arcade-only">AKIBIT / CREATIVE SYSTEM</span>
            <span lang="ja">アキビット</span>
          </div>
          <div className="hero-art">
            {heroImages.studio ? (
              <img
                className="studio-only hero-art-image"
                src={heroImages.studio}
                width="1200"
                height="1500"
                alt="Ivory ceramic ring joined by fine gold kintsugi-inspired seams"
                fetchPriority="high"
              />
            ) : (
              <div className="studio-only monogram-art" aria-hidden="true">
                <span>a</span>
                <GoldVeins />
              </div>
            )}
            {heroImages.arcade ? (
              <img
                className="arcade-only hero-art-image"
                src={heroImages.arcade}
                width="1200"
                height="1500"
                alt="Obsidian polygonal ring with golden seams and cyan-violet gaming light"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="arcade-only monogram-art arcade-monogram"
                aria-hidden="true"
              >
                <span>A</span>
                <GoldVeins />
              </div>
            )}
            <div className="art-side-label studio-only">
              <span lang="ja">金継ぎ</span>
              <small>KINTSUGI-INSPIRED</small>
            </div>
            <div className="art-side-label arcade-only">
              <span>PLAYER / CREATOR</span>
              <small>CRAFT MEETS THE NEXT LEVEL</small>
            </div>
            <div className="art-seal studio-only">
              <span lang="ja">金</span>
              <small>
                CRAFTED
                <br />
                WITH CARE
              </small>
            </div>
            <div className="arcade-art-corner arcade-only" aria-hidden="true">
              +
            </div>
          </div>
          <div className="art-caption-bottom">
            <span className="studio-only">
              A MORE CONSIDERED DIGITAL EXPERIENCE.
            </span>
            <span className="arcade-only">
              DESIGN WITH PURPOSE. BUILD WITH PRECISION.
            </span>
            <span className="art-edition studio-only">STUDIO EDITION</span>
            <span className="art-edition arcade-only">ARCADE EDITION</span>
          </div>
        </div>
        <div className="hero-bottom-line">
          <a href="#work">
            DISCOVER THE POSSIBILITIES <ArrowDown size={14} />
          </a>
          <span>
            WEB DESIGN <i /> APP DESIGN <i /> DEVELOPMENT
          </span>
        </div>
      </div>
    </section>
  );
}
